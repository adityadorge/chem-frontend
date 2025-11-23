<script lang="ts">
  import { onMount } from "svelte";
  import { Toaster, toast } from "svelte-sonner";
  import { ShieldCheck, Check, Upload, FileText, Info } from "lucide-svelte";
  import { API_URL } from "$lib/store/api";
  import { user } from "$lib/store";

  type Status = "pending" | "approved" | "rejected" | "";

  type VerificationForm = {
    // basic
    full_name: string;
    email: string;
    phone_number: string;
    alternate_phone_number: string;
    date_of_birth: string; // yyyy-mm-dd
    gender: "Male" | "Female" | "Other" | "Prefer not to say" | "";
    // residential address
    residential_address_line1: string;
    residential_address_line2: string;
    residential_city: string;
    residential_state: string;
    residential_postal_code: string;
    residential_country: string;
    // work
    work_address: string;
    // profession
    institution: string;
    designation: string;
    field_of_research: string;
    // id
    id_document_type:
      | "employee_id"
      | "student_id"
      | "passport"
      | "aadhaar"
      | "pan"
      | "driving_license"
      | "voter_id"
      | "";
    id_document: File | null;
    // consent
    consent_given: boolean;
  };

  const endpoint = `${API_URL}/verification/`;

  let loading = false;
  let saving = false;
  let hasExisting = false;

  // Server state
  let statusVal: Status = "";
  let rejectionReason = "";
  let currentDocUrl = ""; // URL of already uploaded document (if any)

  // UI helpers
  let sameAsResidential = false;

  const genders = ["Male", "Female", "Other", "Prefer not to say"] as const;
  const idTypes = [
    { value: "employee_id", label: "Employee ID" },
    { value: "student_id", label: "Student ID" },
    { value: "passport", label: "Passport" },
    { value: "aadhaar", label: "Aadhaar" },
    { value: "pan", label: "PAN" },
    { value: "driving_license", label: "Driving License" },
    { value: "voter_id", label: "Voter ID" }
  ];

  // Form state
  let form: VerificationForm = {
    full_name: "",
    email: "",
    phone_number: "",
    alternate_phone_number: "",
    date_of_birth: "",
    gender: "",
    residential_address_line1: "",
    residential_address_line2: "",
    residential_city: "",
    residential_state: "",
    residential_postal_code: "",
    residential_country: "India",
    work_address: "",
    institution: "",
    designation: "",
    field_of_research: "",
    id_document_type: "",
    id_document: null,
    consent_given: false
  };

  // Helpers for DOB limits
  function toISODate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  const today = new Date();
  const maxDobDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // must be <= this
  const maxDob = toISODate(maxDobDate);

  function validate() {
    if (!String(form.full_name).trim()) return "Full name is required.";
    // NEW: required fields
    if (!String(form.email).trim()) return "Email is required.";
    if (!String(form.phone_number).trim()) return "Phone number is required.";
    if (!String(form.date_of_birth).trim()) return "Date of birth is required.";

    if (!String(form.residential_address_line1).trim()) return "Residential address line 1 is required.";
    if (!String(form.residential_city).trim()) return "Residential city is required.";
    if (!String(form.residential_state).trim()) return "Residential state is required.";
    if (!String(form.residential_postal_code).trim()) return "Residential postal code is required.";
    if (!String(form.id_document_type).trim()) return "Please select an ID document type.";

    // DOB checks (must be valid and >= 18)
    const dob = new Date(`${form.date_of_birth}T00:00:00`);
    if (Number.isNaN(dob.getTime())) return "Enter a valid date of birth.";
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const minAdultDob = new Date(todayLocal.getFullYear() - 18, todayLocal.getMonth(), todayLocal.getDate());
    if (dob > todayLocal) return "Date of birth must be in the past.";
    if (dob > minAdultDob) return "You must be at least 18 years old.";

    // NEW: require an ID document (either existing uploaded or new file)
    if (!currentDocUrl && !(form.id_document instanceof File)) {
      return "Please upload your ID document.";
    }

    if (!form.consent_given) return "Please accept privacy policy and accuracy declaration.";
    return null;
  }

  function formatResidential(): string {
    const parts = [
      form.residential_address_line1,
      form.residential_address_line2,
      [form.residential_city, form.residential_state, form.residential_postal_code].filter(Boolean).join(", "),
      form.residential_country
    ].filter(Boolean);
    return parts.join("\n");
  }

  // Keep work address synced when the checkbox is on
  $: if (sameAsResidential) {
    form.work_address = formatResidential();
  }

  async function loadExisting() {
    loading = true;
    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${$user?.access_token}` },
        credentials: "include"
      });

      if (res.status === 204) {
        hasExisting = false;
        statusVal = "";
        return;
      }

      const data = await res.json();
      hasExisting = true;

      // basic
      form.full_name = data.full_name ?? "";
      form.email = data.email ?? "";
      form.phone_number = data.phone_number ?? "";
      form.alternate_phone_number = data.alternate_phone_number ?? "";
      form.date_of_birth = data.date_of_birth ?? "";
      form.gender = (data.gender ?? "") as VerificationForm["gender"];

      // residential
      form.residential_address_line1 = data.residential_address_line1 ?? "";
      form.residential_address_line2 = data.residential_address_line2 ?? "";
      form.residential_city = data.residential_city ?? "";
      form.residential_state = data.residential_state ?? "";
      form.residential_postal_code = data.residential_postal_code ?? "";
      form.residential_country = data.residential_country ?? "India";

      // work
      form.work_address = data.work_address ?? "";

      // profession
      form.institution = data.institution ?? "";
      form.designation = data.designation ?? "";
      form.field_of_research = data.field_of_research ?? "";

      // id
      form.id_document_type = (data.id_document_type ?? "") as VerificationForm["id_document_type"];
      form.id_document = null;
      currentDocUrl = data.id_document || "";

      // consent + status
      form.consent_given = Boolean(data.consent_given);
      statusVal = data.status ?? "";
      rejectionReason = data.rejection_reason ?? "";
    } catch (e) {
      console.error(e);
      toast.error("Failed to load verification.");
    } finally {
      loading = false;
    }
  }

  function filenameFromUrl(url: string) {
    try {
      const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
      return decodeURIComponent(u.pathname.split("/").pop() || "");
    } catch {
      return url.split("/").pop() || "";
    }
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  function handleFileChange(e: Event) {
    const el = e.target as HTMLInputElement;
    const file = el.files?.[0] || null;
    if (!file) {
      form.id_document = null;
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Max 10 MB.");
      el.value = "";
      form.id_document = null;
      return;
    }
    form.id_document = file;
  }

  async function submit() {
    const err = validate();
    if (err) return toast.error(err);

    saving = true;
    try {
      const fd = new FormData();
      // basic
      fd.append("full_name", form.full_name.trim());
      if (form.email) fd.append("email", form.email.trim());
      if (form.phone_number) fd.append("phone_number", form.phone_number.trim());
      if (form.alternate_phone_number) fd.append("alternate_phone_number", form.alternate_phone_number.trim());
      if (form.date_of_birth) fd.append("date_of_birth", form.date_of_birth);
      if (form.gender) fd.append("gender", form.gender);
      // residential
      fd.append("residential_address_line1", form.residential_address_line1.trim());
      if (form.residential_address_line2) fd.append("residential_address_line2", form.residential_address_line2.trim());
      fd.append("residential_city", form.residential_city.trim());
      fd.append("residential_state", form.residential_state.trim());
      fd.append("residential_postal_code", form.residential_postal_code.trim());
      fd.append("residential_country", (form.residential_country || "India").trim());
      // work
      if (form.work_address) fd.append("work_address", form.work_address.trim());
      // profession
      if (form.institution) fd.append("institution", form.institution.trim());
      if (form.designation) fd.append("designation", form.designation.trim());
      if (form.field_of_research) fd.append("field_of_research", form.field_of_research.trim());
      // id
      fd.append("id_document_type", form.id_document_type);
      if (form.id_document instanceof File) {
        fd.append("id_document", form.id_document);
      }
      // consent
      fd.append("consent_given", String(!!form.consent_given));

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${$user?.access_token}` },
        body: fd,
        credentials: "include"
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to save verification.");

      toast.success("Verification saved.");
      hasExisting = true;
      statusVal = data.status ?? "pending";
      rejectionReason = data.rejection_reason ?? "";
      currentDocUrl = data.id_document || currentDocUrl;
      form.id_document = null;
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to save verification.");
    } finally {
      saving = false;
    }
  }

  onMount(() => {
    if ($user?.access_token) loadExisting();
  });

  $: if ($user?.access_token && !loading && !hasExisting && statusVal === "") {
    // reserved
  }

  // Unified input styles
  const inputCls =
    "w-full h-11 sm:h-11 md:h-11 rounded-lg border border-gray-300 bg-white px-3 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition";
  const selectCls =
    "w-full h-11 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition";
  const textareaCls =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition";
</script>

<Toaster richColors />

<main class="w-full sm:pt-8">
  <!-- Added Order Details style header -->
    <div class="mb-6 rounded-[14px] bg-[#0c017b] p-4 sm:p-5 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>
        <h1 class="m-0 text-[1.5rem] font-bold text-white inline-flex items-center gap-2">
          User Verification
          <button
            class="info inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb] hover:border-[#d1d5db] hover:text-[#374151] transition"
            type="button"
            aria-label="About this page"
            title="About this page"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 10v6" />
              <circle cx="12" cy="7" r="1.2" />
            </svg>
          </button>
        </h1>
        <p class="mt-1 text-white/80 leading-[1.5] text-[0.98rem]">
          In the order details section, you can review and manage all orders with their details. You can view and edit many information such as IDs of all orders, ordered product, order date, price and order status. Access to this area is limited. Only administrators and team leaders can reach. The changes you make will be approved after they are checked.
        </p>
      </div>

      <div class="flex flex-col items-start gap-2 self-start">
        {#if statusVal}
          <span
            class="inline-flex items-center justify-center gap-2 self-start rounded-lg px-4 py-2
                  text-sm sm:text-base font-semibold shadow-sm ring-1 min-w-[180px]
                  {statusVal === 'approved' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : ''}
                  {statusVal === 'pending' ? 'bg-amber-50 text-amber-700 ring-amber-200' : ''}
                  {statusVal === 'rejected' ? 'bg-rose-50 text-rose-700 ring-rose-200' : ''}"
          >
            {#if statusVal === 'rejected'}
              <Info class="h-5 w-5" />
            {:else}
              <Check class="h-5 w-5" />
            {/if}
            {statusVal.charAt(0).toUpperCase() + statusVal.slice(1)}
          </span>
        {/if}
        {#if statusVal === 'rejected' && rejectionReason}
          <div class="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs sm:text-sm text-rose-800">
            Rejection reason: {rejectionReason}
          </div>
        {/if}
      </div>
    </div>

    <!-- ...rest of existing form section... -->
    <section class="rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-x-hidden">
      {#if loading}
        <p class="text-sm text-gray-600">Loading...</p>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 min-w-0">
          <!-- Basic Information -->
          <div class="sm:col-span-2 lg:col-span-3">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div>
            <label for="full_name" class="block text-[13px] font-medium text-gray-800 mb-1.5">Full Name <span class="text-rose-500">*</span></label>
            <input
              id="full_name"
              class={inputCls}
              type="text"
              bind:value={form.full_name}
              placeholder="Your full legal name"
              required
              autocomplete="name"
              aria-required="true"
            />
          </div>

          <div>
            <label for="email" class="block text-[13px] font-medium text-gray-800 mb-1.5">Email <span class="text-rose-500">*</span></label>
            <input
              id="email"
              class={inputCls}
              type="email"
              bind:value={form.email}
              placeholder="name@company.com"
              autocomplete="email"
              required
              aria-required="true"
            />
            <p class="mt-1 text-xs sm:text-[11px] text-gray-500">Enter your contact email.</p>
          </div>

          <div>
            <label for="phone" class="block text-[13px] font-medium text-gray-800 mb-1.5">Phone Number <span class="text-rose-500">*</span></label>
            <input
              id="phone"
              class={inputCls}
              type="tel"
              bind:value={form.phone_number}
              placeholder="+91 98765 43210"
              autocomplete="tel"
              inputmode="tel"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label for="alt_phone" class="block text-[13px] font-medium text-gray-800 mb-1.5">Alternate Phone</label>
            <input
              id="alt_phone"
              class={inputCls}
              type="tel"
              bind:value={form.alternate_phone_number}
              placeholder="+91 9xxxx xxxxx"
              autocomplete="tel"
              inputmode="tel"
            />
          </div>

          <div>
            <label for="dob" class="block text-[13px] font-medium text-gray-800 mb-1.5">Date of Birth <span class="text-rose-500">*</span></label>
            <input
              id="dob"
              class={inputCls}
              type="date"
              bind:value={form.date_of_birth}
              max={maxDob}
              autocomplete="bday"
              required
              aria-required="true"
            />
            <p class="mt-1 text-xs sm:text-[11px] text-gray-500">Must be at least 18 years old.</p>
          </div>

          <div>
            <label for="gender" class="block text-[13px] font-medium text-gray-800 mb-1.5">Gender</label>
            <select
              id="gender"
              class={selectCls}
              bind:value={form.gender}
            >
              <option value="">Select</option>
              {#each genders as g}<option value={g}>{g}</option>{/each}
            </select>
          </div>

          <!-- Residential Address -->
          <div class="sm:col-span-2 lg:col-span-3 mt-2">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900">Residential Address</h3>
          </div>

          <div>
            <label for="addr1" class="block text-[13px] font-medium text-gray-800 mb-1.5">Address Line 1 <span class="text-rose-500">*</span></label>
            <input
              id="addr1"
              class={inputCls}
              type="text"
              bind:value={form.residential_address_line1}
              placeholder="House/Flat, Street"
              required
              autocomplete="address-line1"
              aria-required="true"
            />
          </div>

          <div>
            <label for="addr2" class="block text-[13px] font-medium text-gray-800 mb-1.5">Address Line 2</label>
            <input
              id="addr2"
              class={inputCls}
              type="text"
              bind:value={form.residential_address_line2}
              placeholder="Area, Landmark (optional)"
              autocomplete="address-line2"
            />
          </div>

          <div>
            <label for="city" class="block text-[13px] font-medium text-gray-800 mb-1.5">City <span class="text-rose-500">*</span></label>
            <input
              id="city"
              class={inputCls}
              type="text"
              bind:value={form.residential_city}
              autocomplete="address-level2"
              aria-required="true"
            />
          </div>

          <div>
            <label for="state" class="block text-[13px] font-medium text-gray-800 mb-1.5">State <span class="text-rose-500">*</span></label>
            <input
              id="state"
              class={inputCls}
              type="text"
              bind:value={form.residential_state}
              autocomplete="address-level1"
              aria-required="true"
            />
          </div>

          <div>
            <label for="postal" class="block text-[13px] font-medium text-gray-800 mb-1.5">Postal Code <span class="text-rose-500">*</span></label>
            <input
              id="postal"
              class={inputCls}
              type="text"
              bind:value={form.residential_postal_code}
              autocomplete="postal-code"
              inputmode="numeric"
              aria-required="true"
            />
          </div>

          <div>
            <label for="country" class="block text-[13px] font-medium text-gray-800 mb-1.5">Country</label>
            <input
              id="country"
              class={inputCls}
              type="text"
              bind:value={form.residential_country}
              autocomplete="country-name"
            />
          </div>

          <!-- Work Address -->
          <div class="sm:col-span-2 lg:col-span-3 mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900">Work Address</h3>
            <label class="inline-flex items-center gap-2 text-sm text-gray-700">
              <input id="sameAsRes" type="checkbox" bind:checked={sameAsResidential} />
              <span>Same as residential</span>
            </label>
          </div>

          <div class="sm:col-span-2 lg:col-span-3">
            <label for="work_address" class="sr-only">Work Address</label>
            <textarea
              id="work_address"
              class={textareaCls}
              rows="3"
              bind:value={form.work_address}
              placeholder="Full work address"
              disabled={sameAsResidential}
            ></textarea>
          </div>

          <!-- Profession -->
          <div class="sm:col-span-2 lg:col-span-3 mt-2">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900">Professional Details</h3>
          </div>

          <div>
            <label for="institution" class="block text-[13px] font-medium text-gray-800 mb-1.5">Institution</label>
            <input
              id="institution"
              class={inputCls}
              type="text"
              bind:value={form.institution}
              placeholder="Organization / Institute"
              autocomplete="organization"
            />
          </div>

          <div>
            <label for="designation" class="block text-[13px] font-medium text-gray-800 mb-1.5">Designation</label>
            <input
              id="designation"
              class={inputCls}
              type="text"
              bind:value={form.designation}
              placeholder="e.g., Research Associate"
            />
          </div>

          <div>
            <label for="field" class="block text-[13px] font-medium text-gray-800 mb-1.5">Field of Research</label>
            <input
              id="field"
              class={inputCls}
              type="text"
              bind:value={form.field_of_research}
              placeholder="e.g., Analytical Chemistry"
            />
          </div>

          <!-- ID Proof -->
          <div class="sm:col-span-2 lg:col-span-3 mt-2">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900">ID Proof</h3>
          </div>

          <div>
            <label for="id_type" class="block text-[13px] font-medium text-gray-800 mb-1.5">ID Document Type <span class="text-rose-500">*</span></label>
            <select
              id="id_type"
              class={selectCls}
              bind:value={form.id_document_type}
              required
              aria-required="true"
            >
              <option value="" disabled>Select</option>
              {#each idTypes as t}<option value={t.value}>{t.label}</option>{/each}
            </select>
          </div>

          <div class="sm:col-span-2 lg:col-span-2">
            <label class="block text-[13px] font-medium text-gray-800 mb-2">Upload ID document <span class="text-rose-500">*</span></label>

            {#if currentDocUrl && !form.id_document}
              <div class="mb-3 inline-flex flex-wrap items-center gap-2 rounded-md bg-gray-50 px-3 py-2 ring-1 ring-gray-200 text-sm text-gray-700">
                <FileText class="h-4 w-4 text-gray-500" />
                <a class="underline hover:text-indigo-600 break-all" href={currentDocUrl} target="_blank" rel="noopener noreferrer">
                  {filenameFromUrl(currentDocUrl)}
                </a>
                <span class="text-gray-400">•</span>
                <button
                  type="button"
                  class="text-indigo-600 hover:text-indigo-700"
                  on:click={() => (currentDocUrl = "")}
                  title="Replace file"
                >
                  Replace
                </button>
              </div>
            {/if}

            {#if !currentDocUrl || form.id_document}
              <div>
                <label
                  for="id_doc"
                  class="flex w-full cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition overflow-hidden"
                  aria-required="true"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <Upload class="h-5 w-5 text-gray-500" />
                    <span class="text-sm text-gray-700 truncate">
                      {form.id_document ? form.id_document.name : "Choose a file (PDF/images). Max 10 MB"}
                    </span>
                  </div>
                </label>
                <input
                  id="id_doc"
                  type="file"
                  class="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.heic,image/*,application/pdf"
                  on:change={handleFileChange}
                />
                <p class="mt-1 text-[11px] text-gray-500">PDF or image, max 10 MB. Required.</p>
              </div>
            {/if}
          </div>

          <!-- Consent -->
          <div class="sm:col-span-2 lg:col-span-3 mt-2 rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-gray-200">
            <label for="consent" class="inline-flex items-start gap-2 text-sm text-gray-700">
              <input id="consent" type="checkbox" bind:checked={form.consent_given} />
              <span>I have read and agree to the company privacy policy and confirm that the details provided are true and accurate.</span>
            </label>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end">
          <button
            type="button"
            class="w-full sm:w-auto rounded-lg bg-[#0c017b] px-5 py-3 sm:py-2.5 text-white font-semibold shadow-sm hover:bg-[#0c017b] active:bg-[#0c017b] transition disabled:opacity-60"
            on:click={submit}
            disabled={saving || loading || !form.consent_given}
          >
            {saving ? "Saving..." : hasExisting ? "Update Verification" : "Submit Verification"}
          </button>
        </div>
      {/if}
    </section>
</main>

<style>
  :global(input[type="file"]) { display: none; }
  textarea[disabled] { background-color: #f9fafb; color: #6b7280; }
</style>