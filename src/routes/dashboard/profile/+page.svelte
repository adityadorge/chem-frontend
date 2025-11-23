<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/store/api";
  import { user } from "$lib/store";
  import {
    User as UserIcon,
    BadgeCheck,
    Flag,
    Calendar,
    Phone,
    Smartphone,
    Mail,
  } from "lucide-svelte";

  type Verification = {
    id: number;
    full_name: string;
    email: string | null;
    phone_number: string | null;
    alternate_phone_number: string | null;
    date_of_birth: string | null;
    gender: string | null;
    residential_address_line1: string;
    residential_address_line2?: string | null;
    residential_city: string;
    residential_state: string;
    residential_postal_code: string;
    residential_country: string;
    status: "pending" | "approved" | "rejected";
  };

  let loadingProfile = false;
  let profileError = "";
  let verification: Verification | null = null;
  let noVerification = false;

  function fmtDOB(d?: string | null) {
    if (!d) return "";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
  }

  function title(s?: string | null) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function statusKey(s?: Verification["status"] | string | null) {
    const v = (s || "").toString().toLowerCase();
    if (v === "approved") return "approved";
    if (v === "rejected") return "rejected";
    return "pending";
  }

  function chipClasses(s?: Verification["status"]) {
    const base =
      "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full font-bold tracking-wide border transition duration-150 ease-out hover:-translate-y-[1px]";
    const key = statusKey(s);
    if (key === "approved")
      return base +
        " bg-emerald-50 border-emerald-300 text-emerald-800 shadow-[0_0_0_0_rgba(16,185,129,0.25)] hover:shadow-[0_0_0_6px_rgba(16,185,129,0.12)]";
    if (key === "rejected")
      return base +
        " bg-red-50 border-red-300 text-red-800 shadow-[0_0_0_0_rgba(239,68,68,0.25)] hover:shadow-[0_0_0_6px_rgba(239,68,68,0.12)]";
    return base +
      " bg-orange-50 border-orange-300 text-orange-900 shadow-[0_0_0_0_rgba(245,158,11,0.25)] hover:shadow-[0_0_0_6px_rgba(245,158,11,0.12)]";
  }

  function dotClasses(s?: Verification["status"]) {
    const base =
      "w-2 h-2 rounded-full shadow-[0_0_0_3px_rgba(0,0,0,0.02)_inset]";
    const key = statusKey(s);
    if (key === "approved") return base + " bg-emerald-500";
    if (key === "rejected") return base + " bg-red-500";
    return base + " bg-orange-500";
  }

  function presenceColorClass(s?: Verification["status"]) {
    const key = statusKey(s);
    if (key === "approved") return "bg-emerald-500";
    if (key === "rejected") return "bg-red-500";
    return "bg-orange-500";
  }

  let fullName = "";
  let country = "";
  let contact = "";
  let email = "";

  type Address = {
    id: number;
    country: string;
    label: string;
    mobile: string;
    pincode: string;
    flat: string;
    area: string;
    city: string;
    state: string;
  };

  function buildAddressFromVerification(v: Verification): Address | null {
    const hasAny =
      v.residential_address_line1 ||
      v.residential_city ||
      v.residential_state ||
      v.residential_postal_code ||
      v.residential_country;
    if (!hasAny) return null;
    return {
      id: v.id ?? 1,
      country: v.residential_country || "",
      label: v.full_name || "",
      mobile: v.phone_number || "",
      pincode: v.residential_postal_code || "",
      flat: v.residential_address_line1 || "",
      area: v.residential_address_line2 || "",
      city: v.residential_city || "",
      state: v.residential_state || "",
    };
  }

  let address: Address | null = null;

  let activeCard: string | null = "personal";
  function toggleCard(card: string) {
    activeCard = activeCard === card ? null : card;
  }

  onMount(async () => {
    if (!$user?.access_token) return;
    loadingProfile = true;
    try {
      const res = await fetch(`${API_URL}/verification/`, {
        headers: { Authorization: `Bearer ${$user.access_token}` },
      });
      if (res.status === 204) {
        noVerification = true;
        verification = null;
        address = null;
        return;
      }
      if (!res.ok) throw new Error();
      const v: Verification = await res.json();
      verification = v;
      fullName = v.full_name || "";
      email = v.email || "";
      contact = v.phone_number || "";
      country = v.residential_country || v.residential_state || "";
      address = buildAddressFromVerification(v);
    } catch {
      profileError = "Failed to load profile. please log in again.";
    } finally {
      loadingProfile = false;
    }
  });
</script>

<div>
  <div class="rounded-xl overflow-hidden flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#eef0f4] mb-4 bg-white">
    <div class="relative h-[12.5rem] overflow-hidden">
      <img
        class="w-full h-full object-cover scale-[1.02] saturate-[1.05] contrast-[1.02]"
        src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/pages/profile-banner.png"
        alt="Profile Banner"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.25)] pointer-events-none"></div>
    </div>
    <div class="bg-white px-4 py-[18px] flex items-center gap-6 max-[36rem]:flex-col max-[36rem]:text-center">
      <div class="flex -mt-[3.25rem]">
        <div class="relative inline-grid place-items-center p-[3px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,_#6366f1,_#22c55e,_#f59e0b,_#6366f1)]">
          <img
            class="w-[6.875rem] h-[6.875rem] object-cover rounded-full border-[6px] border-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] bg-white"
            src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/avatars/1.png"
            alt="Profile Avatar"
          />
          <span
            class={"absolute bottom-2 right-2 w-[14px] h-[14px] rounded-full border-[3px] border-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] " +
              presenceColorClass(verification?.status)}
            aria-hidden="true"
          ></span>
        </div>
      </div>
      <div class="flex flex-col">
        <h2 class="m-0 mb-1 text-xl tracking-[0.01em]">{fullName || "—"}</h2>
        <p class="m-0 text-gray-600">{email || "—"}</p>
        {#if loadingProfile}<small>Loading…</small>{/if}
        {#if profileError}<small class="text-red-700">{profileError}</small>{/if}
        {#if noVerification}
          <small class="text-gray-600">Profile not completed yet. Please submit verification details.</small>
        {/if}
      </div>

      <div class="ml-auto self-start flex flex-col items-end gap-1 max-[36rem]:ml-0 max-[36rem]:self-center max-[36rem]:items-center">
        <div class={chipClasses(verification?.status)}>
          <span class={dotClasses(verification?.status)} aria-hidden="true"></span>
          <span>{title(verification?.status) || "Pending"}</span>
        </div>
        {#if verification && (verification.status === "pending" || verification.status === "rejected")}
          <small class="text-rose-500 text-sm text-right max-[36rem]:text-center">Please complete the verification process by visiting the verification page.</small>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex items-center gap-2 mb-4 max-[36rem]:flex-col max-[36rem]:items-stretch max-[36rem]:w-full">
    <div class="flex gap-2 flex-row max-[36rem]:flex-col max-[36rem]:w-full">
      <button
        class={"border-none px-5 py-2.5 rounded-md cursor-pointer font-semibold w-fit hover:bg-indigo-100 hover:text-indigo-500 max-[36rem]:w-full " +
          (activeCard === "personal" ? "text-white bg-[#0c017b]" : "bg-transparent text-gray-700")}
        on:click={() => toggleCard("personal")}>Profile</button>
      <button
        class={"border-none px-5 py-2.5 rounded-md cursor-pointer font-semibold w-fit hover:bg-indigo-100 hover:text-indigo-500 max-[36rem]:w-full " +
          (activeCard === "address" ? "text-white bg-[#0c017b]" : "bg-transparent text-gray-700")}
        on:click={() => toggleCard("address")}>Address</button>
        
    </div>
  </div>
</div>

{#if activeCard === "personal"}
  <div class="bg-white p-6 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] mt-4">
    <section class="mb-6">
      <h3 class="text-lg font-semibold mb-2">About</h3>
      <ul class="list-none p-2.5 m-0">
        <li class="flex items-center gap-2 mb-2">
          <UserIcon class="text-gray-600" size={18} />
          <span class="font-medium">Full Name:</span>
          <span>{fullName || "—"}</span>
        </li>
        <li class="flex items-center gap-2 mb-2">
          <Flag class="text-gray-600" size={18} />
            <span class="font-medium">Country:</span>
            <span>{country || "—"}</span>
        </li>
        {#if verification?.gender}
          <li class="flex items-center gap-2 mb-2">
            <UserIcon class="text-gray-600" size={18} />
            <span class="font-medium">Gender:</span>
            <span>{verification.gender}</span>
          </li>
        {/if}
        {#if verification?.date_of_birth}
          <li class="flex items-center gap-2 mb-2">
            <Calendar class="text-gray-600" size={18} />
            <span class="font-medium">DOB:</span>
            <span>{fmtDOB(verification.date_of_birth)}</span>
          </li>
        {/if}
      </ul>
    </section>

    <section>
      <h3 class="text-lg font-semibold mb-2">Contacts</h3>
      <ul class="list-none p-2.5 m-0">
        <li class="flex items-center gap-2 mb-2">
          <Phone class="text-gray-600" size={18} />
          <span class="font-medium">Contact:</span>
          <span>{contact || "—"}</span>
        </li>
        {#if verification?.alternate_phone_number}
          <li class="flex items-center gap-2 mb-2">
            <Smartphone class="text-gray-600" size={18} />
            <span class="font-medium">Alternate:</span>
            <span>{verification.alternate_phone_number}</span>
          </li>
        {/if}
        <li class="flex items-center gap-2 mb-2">
          <Mail class="text-gray-600" size={18} />
          <span class="font-medium">Email:</span>
          <span>{email || "—"}</span>
        </li>
      </ul>
    </section>
  </div>
{/if}

{#if activeCard === "address"}
  <div class="bg-white rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mt-4">
    <header>
      <h3 class="text-lg font-semibold mb-4">Your Address</h3>
    </header>

    {#if address}
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-gray-50 border border-gray-200 rounded-md p-4 flex flex-col">
          <div class="text-sm text-gray-500 mb-2">Primary Address</div>
          <div class="text-sm">
            <strong class="block mb-1">{address.label}</strong>
            <p class="m-0 mb-1">{address.flat}</p>
            {#if address.area}<p class="m-0 mb-1">{address.area}</p>{/if}
            <p class="m-0 mb-1">{address.city}, {address.state} {address.pincode}</p>
            <p class="m-0 mb-1">{address.country}</p>
            {#if address.mobile}<p class="m-0">Phone number: {address.mobile}</p>{/if}
          </div>
        </div>
      </div>
    {:else}
      <p class="text-gray-500 text-sm">No address on file.</p>
    {/if}
  </div>
{/if}