<script lang="ts">
  import { API_URL } from "$lib/store/api";
  import { onMount } from "svelte";
  import { Toaster, toast } from "svelte-sonner";
  import { ShieldCheck, ClipboardList, Award, Check, Download, Share2, MapPin, FileCheck2, BadgeIndianRupee, RotateCcw, Gift} from "lucide-svelte";
  import { user } from "$lib/store";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let canProceed = false;
  let lastOrderId: string; // or string if you use order.order_id

  // Sample Analysis Request Form state
  let sampleForm = {
    // Section 1: Customer Information
    customerName: "",
    customerType: "Manufacturing Company", // Manufacturing Company / Individual
    email: "",
    phone: "",
    submissionDate: new Date().toISOString().slice(0, 10),

    // Section 2: Sample Information
    sampleNameOrBatch: "",
    numberOfSamples: 1,
    physicalState: "Solid", // Solid / Liquid / Gas
    appearance: "",
    solubility: "",
    specialHandling: "",
    usage: "",
    storageConditions: [] as string[], // Room Temp / 2–8°C / –20°C / –70°C / Other
    storageOther: "", // shown when "Other" selected
    hazardInfo: [] as string[], // Toxic / Flammable / Corrosive / Biohazard / Radioactive / None
    msds: "No", // Yes / No
    msdsFile: null as File | null, // optional upload when MSDS = Yes

    // Section 3: Analytical Requirements
    requestedTechnique: "",
    labName: "", // display/snapshot
    analysisPurpose: [] as string[], // Qualitative / Quantitative / Purity / Identification / Other
    amountProvided: "",
    amountUnit: "mg", // mg / g / mL
    requestedTAT: "Standard (5–7 days)",
    clientSampleCode: "",

    // Section 4: Additional Instructions
    notes: "",
    sampleDisposal: "Discard", // Discard / Return / Return unused portion only
    returnShippingAddress: "",

    // Section 5: Authorization and Acknowledgement
    declarationAccepted: false,
    signature: "",
    authorizationDate: new Date().toISOString().slice(0, 10),    
  };

  const storageOptions = ["Room Temp", "2–8°C", "–20°C", "–70°C", "Other"];
  const hazardOptions = [
    "Toxic",
    "Flammable",
    "Corrosive",
    "Biohazard",
    "Radioactive",
    "None"
  ];
  const purposeOptions = [
    "Qualitative",
    "Quantitative",
    "Purity",
    "Identification",
    "Other"
  ];
  const amountUnits = ["mg", "g", "mL"];
  const tatOptions = ["Priority (48–72h)", "Standard (5–7 days)", "Extended (8–14 days)"];
  // Replace the static const with a default + mutable list populated from API when available

  // Save/submit state
  let submitting = false;

  // Section validations
  function validateSection1() {
    if (![sampleForm.customerName, sampleForm.email, sampleForm.phone].every(v => String(v).trim())) {
      return "Please complete Name, Email, and Phone.";
    }
    return null;
  }
  function validateSection2() {
    if (!String(sampleForm.sampleNameOrBatch).trim()) return "Please enter Sample Name/Batch No.";
    if (sampleForm.storageConditions.includes("Other") && !sampleForm.storageOther.trim())
      return 'Please specify "Other" storage condition.';
    return null;
  }
  function validateSection3() {
    if (!String(sampleForm.requestedTechnique).trim()) return "Please enter Requested Technique.";
    return null;
  }
  function validateSection4() {
    if (
      (sampleForm.sampleDisposal === "Return" || sampleForm.sampleDisposal === "Return unused portion only") &&
      !sampleForm.returnShippingAddress.trim()
    ) return "Please enter a return shipping address.";
    return null;
  }
  let pickupAddressId: number | null = null;

  // Normalize API date (YYYY-MM-DD) for date input
  const toYMD = (d: string | null | undefined) => {
    if (!d) return "";
    try { return new Date(d).toISOString().slice(0, 10); } catch { return String(d).slice(0, 10); }
  };


  let showPreviousPrompt = false;
  let previousRequisitionData: any = null;

  // Modify loadLatestRequisition to only store data, not load into form
  async function loadLatestRequisition() {
    if (!$user?.access_token) return;
    try {
      let url = `${API_URL}/get-latest-requisition/`;
      if (testIdParam) url += `?test_id=${encodeURIComponent(testIdParam)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${$user.access_token}` },
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Object.keys(data).length === 0) return; // No requisition found

      previousRequisitionData = data;
      showPreviousPrompt = true; // Show modal/dialog
    } catch (e) {
      console.error("Failed to load requisition:", e);
    }
  }

  // Helper to map previous data to form
  function usePreviousRequisition() {
    if (!previousRequisitionData) return;
    const data = previousRequisitionData;
    // ...copy all mapping code from your previous loadLatestRequisition here...
    sampleForm.customerName = data.customer_name ?? "";
    sampleForm.customerType = data.customer_type ?? "Manufacturing Company";
    sampleForm.email = data.email ?? "";
    sampleForm.phone = data.phone ?? "";
    sampleForm.submissionDate = toYMD(data.submission_date) || new Date().toISOString().slice(0, 10);
    sampleForm.sampleNameOrBatch = data.sample_name_or_batch ?? "";
    sampleForm.numberOfSamples = data.number_of_samples ?? 1;
    sampleForm.physicalState = data.physical_state ?? "Solid";
    sampleForm.appearance = data.appearance ?? "";
    sampleForm.solubility = data.solubility ?? "";
    sampleForm.specialHandling = data.special_handling ?? "";
    sampleForm.usage = data.usage ?? "";
    sampleForm.storageConditions = data.storage_conditions ?? [];
    sampleForm.storageOther = data.storage_other ?? "";
    sampleForm.hazardInfo = data.hazard_info ?? [];
    sampleForm.msds = data.msds ?? "No";
    sampleForm.msdsFile = null;
    sampleForm.requestedTechnique = data.requested_technique ?? "";
    sampleForm.labName = data.lab_name ?? "";
    sampleForm.analysisPurpose = data.analysis_purpose ?? [];
    sampleForm.amountProvided = data.amount_provided ?? "";
    sampleForm.amountUnit = data.amount_unit ?? "mg";
    sampleForm.requestedTAT = data.requested_tat ?? "Standard (5–7 days)";
    sampleForm.clientSampleCode = data.client_sample_code ?? "";
    sampleForm.notes = data.notes ?? "";
    sampleForm.sampleDisposal = data.sample_disposal ?? "Discard";
    sampleForm.returnShippingAddress = data.return_shipping_address ?? "";
    sampleForm.declarationAccepted = !!data.declaration_accepted;
    sampleForm.signature = data.signature ?? "";
    sampleForm.authorizationDate = toYMD(data.authorization_date) || new Date().toISOString().slice(0, 10);
    toast.success("Previous requisition loaded.");
    showPreviousPrompt = false;
  }

  function skipPreviousRequisition() {
    showPreviousPrompt = false;
    previousRequisitionData = null;
  }

  onMount(() => {
    loadLatestRequisition();
  });

  function validateSampleForm() {
    // Full-form validation before final submit
    const e1 = validateSection1(); if (e1) return e1;
    const e2 = validateSection2(); if (e2) return e2;
    const e3 = validateSection3(); if (e3) return e3;
    const e4 = validateSection4(); if (e4) return e4;
    if (!sampleForm.declarationAccepted) return "Please accept the declaration.";
    return null;
  }

async function submitRequisition() {
    const err = validateSampleForm();
    if (err) { toast.error(err); return; }

    // Enforce MSDS file if selected
    if (sampleForm.msds === "Yes" && !sampleForm.msdsFile) {
      toast.error("Please upload the MSDS file.");
      return;
    }

    submitting = true;
    try {
      const fd = new FormData();
      // Link test details (from query params if present)
      if (testIdParam) fd.append("test", String(testIdParam));
      if (testNameParam) fd.append("test_name", testNameParam);
      if (labProvidedTestIdParam) fd.append("provided_test", labProvidedTestIdParam); // FK to LabProvidedTest
      if (sampleForm.labName) fd.append("lab_name", sampleForm.labName); // snapshot
      fd.append("quantity", String(testQtyParam ?? 1));

      // Section 1
      fd.append("customer_name", sampleForm.customerName);
      fd.append("customer_type", sampleForm.customerType);
      fd.append("email", sampleForm.email);
      fd.append("phone", sampleForm.phone);
      fd.append("submission_date", sampleForm.submissionDate);

      // Section 2
      fd.append("sample_name_or_batch", sampleForm.sampleNameOrBatch);
      fd.append("number_of_samples", String(sampleForm.numberOfSamples));
      fd.append("physical_state", sampleForm.physicalState);
      fd.append("appearance", sampleForm.appearance || "");
      fd.append("solubility", sampleForm.solubility || "");
      fd.append("special_handling", sampleForm.specialHandling || "");
      fd.append("usage", sampleForm.usage || "");
      fd.append("storage_conditions", JSON.stringify(sampleForm.storageConditions || []));
      fd.append("storage_other", sampleForm.storageOther || "");
      fd.append("hazard_info", JSON.stringify(sampleForm.hazardInfo || []));
      fd.append("msds", sampleForm.msds);
      if (sampleForm.msds === "Yes" && sampleForm.msdsFile) {
        fd.append("msds_file", sampleForm.msdsFile);
      }

      // Section 3
      fd.append("requested_technique", sampleForm.requestedTechnique);
      fd.append("analysis_purpose", JSON.stringify(sampleForm.analysisPurpose || []));
      if (sampleForm.amountProvided !== "" && sampleForm.amountProvided !== null && sampleForm.amountProvided !== undefined) {
        fd.append("amount_provided", String(sampleForm.amountProvided));
      }
      fd.append("amount_unit", sampleForm.amountUnit);
      fd.append("requested_tat", sampleForm.requestedTAT);
      fd.append("client_sample_code", sampleForm.clientSampleCode || "");

      // Section 4
      fd.append("notes", sampleForm.notes || "");
      fd.append("sample_disposal", sampleForm.sampleDisposal);
      fd.append("return_shipping_address", sampleForm.returnShippingAddress || "");

      // Section 5
      fd.append("declaration_accepted", String(!!sampleForm.declarationAccepted));
      fd.append("signature", sampleForm.signature || "");
      fd.append("authorization_date", sampleForm.authorizationDate);

      const res = await fetch(`${API_URL}/sample-requisitions/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${$user?.access_token}`,
          // DO NOT set Content-Type; let the browser set the multipart boundary
        },
        body: fd,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to submit requisition.");

      toast.success("Requisition submitted.");
      canProceed = true;
      lastOrderId = data.order_id; // <-- Store order ID if returned
      localStorage.setItem("current_order_id", lastOrderId); 
    } catch (e: any) {
      toast.error(e?.message || "Failed to submit requisition.");
    } finally {
      submitting = false;
    }
  }

  async function addToCartAfterForm() {
  if (!canProceed) {
    toast.error("Please fill and submit the form first.");
    return;
  }
  try {
    const res = await fetch(`${API_URL}/add-to-cart/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${$user?.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: lastOrderId, // <-- Pass order
      }),
    });
    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      throw new Error(data.message || "Failed to add to cart");
    }
    toast.success("Test added to cart!");
    canProceed = false;
    // Optionally, redirect to cart or pickup page
    // goto("/checkout/pickup");
  } catch (e: any) {
    toast.error(e?.message || "Failed to add to cart");
  }
}

  // Helper to make a safe filename
  const sanitizeFileName = (s: string) =>
    (s || "customer")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-_.]+/gi, "");

  function buildExportFilenamePDF() {
    const d = new Date().toISOString().slice(0, 10);
    return `sample-request-${d}-${sanitizeFileName(sampleForm.customerName)}.pdf`;
  }

  // Replace the existing JSON downloader with a PDF generator
  async function handleDownload() {
    if (typeof window === "undefined") return; // SSR guard

    try {
      const jspdfMod = await import("jspdf");
      const jsPDFCtor = (jspdfMod as any).jsPDF || jspdfMod.default; // support both exports
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDFCtor({ unit: "pt", format: "a4" });
      let y = 40;

      doc.setFontSize(16);
      doc.text("Sample Analysis Request", 40, y);
      y += 20;

      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 40, y);
      y += 10;

      const addSection = (title: string, rows: [string, string][]) => {
        doc.setFontSize(12);
        doc.text(title, 40, y + 15);
        autoTable(doc, {
          startY: y + 25,
          head: [["Field", "Value"]],
          body: rows,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 6, overflow: "linebreak" },
          headStyles: { fillColor: [99, 102, 241] },
          margin: { left: 40, right: 40 },
        });
        y = ((doc as any).lastAutoTable?.finalY || y) + 10;
      };

      addSection("Section 1: Customer Information", [
        ["Name", sampleForm.customerName || "-"],
        ["Customer Type", sampleForm.customerType || "-"],
        ["Email", sampleForm.email || "-"],
        ["Phone", sampleForm.phone || "-"],
        ["Submission Date", sampleForm.submissionDate || "-"],
      ]);

      addSection("Section 2: Sample Information", [
        ["Sample Name/Batch", sampleForm.sampleNameOrBatch || "-"],
        ["Number of Samples", String(sampleForm.numberOfSamples ?? "-")],
        ["Physical State", sampleForm.physicalState || "-"],
        ["Appearance", sampleForm.appearance || "-"],
        ["Solubility", sampleForm.solubility || "-"],
        ["Special Handling", sampleForm.specialHandling || "-"],
        ["Usage", sampleForm.usage || "-"],
        ["Storage Conditions", (sampleForm.storageConditions || []).join(", ") || "-"],
        ["Other Storage", sampleForm.storageOther || "-"],
        ["Hazards", (sampleForm.hazardInfo || []).join(", ") || "-"],
        ["MSDS Provided", sampleForm.msds || "-"],
      ]);

      addSection("Section 3: Analytical Requirements", [
        ["Requested Technique", sampleForm.requestedTechnique || "-"],
        ["Analysis Purpose", (sampleForm.analysisPurpose || []).join(", ") || "-"],
        ["Amount Provided", sampleForm.amountProvided ? `${sampleForm.amountProvided} ${sampleForm.amountUnit}` : "-"],
        ["Requested TAT", sampleForm.requestedTAT || "-"],
        ["Client Sample Code", sampleForm.clientSampleCode || "-"],
      ]);

      addSection("Section 4: Additional Instructions", [
        ["Notes", sampleForm.notes || "-"],
        ["Sample Disposal", sampleForm.sampleDisposal || "-"],
        ["Return Shipping Address", sampleForm.returnShippingAddress || "-"],
      ]);

      addSection("Section 5: Authorization and Acknowledgement", [
        ["Declaration Accepted", sampleForm.declarationAccepted ? "Yes" : "No"],
        ["Signature", sampleForm.signature || "-"],
        ["Authorization Date", sampleForm.authorizationDate || "-"],
      ]);
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const w = doc.internal.pageSize.getWidth();
        const h = doc.internal.pageSize.getHeight();
        doc.setFontSize(9);
        doc.text(`Page ${i} of ${pageCount}`, w - 100, h - 30);
      }

      doc.save(buildExportFilenamePDF());
      toast.success("PDF downloaded.");
    } catch (e: any) {
      console.error("PDF error:", e);
      toast.error(e?.message || "Failed to generate PDF.");
    }
  }

  async function handleShare() {
    const url = window.location.href;
    const title = "Sample Analysis Request";
    const text = "Please review my sample analysis request.";
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") toast.error("Share canceled or failed.");
    }
  }

  // Test info passed from tests page
  let testIdParam = "";
  let testNameParam = "";
  let labNameParam = "";
  let labProvidedTestIdParam = ""; // new
  let testQtyParam: number | null = null;
  $: {
    const sp = $page.url.searchParams;
    testIdParam = sp.get("test_id") || "";
    testNameParam = sp.get("test_name") || "";
    labNameParam = sp.get("lab_name") || "";
    labProvidedTestIdParam = sp.get("lab_provided_test_id") || "";
    // const q = sp.get("quantity");
    // testQtyParam = q ? Number(q) : null;
  }

  // Prefills (only when empty)
  $: if (testNameParam && !sampleForm.requestedTechnique) {
    sampleForm.requestedTechnique = testNameParam;
  }
  $: if (labNameParam && !sampleForm.labName) {
    sampleForm.labName = labNameParam;
  }
</script>

<Toaster richColors />

<main class="w-full px-5 md:px-8 lg:px-10 py-6" style="background-color: #f9fafb;">
  <!-- Custom Checkout Header -->
  <div class="w-full bg-[#0c017b] rounded-b-3xl pb-8 pt-6 px-6 flex flex-col items-center shadow mb-8">
    <span class="text-white text-3xl font-bold tracking-wide mb-4" aria-label="Checkout">Checkout</span>
  </div>
  <nav class="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-4" aria-label="Checkout Progress">
  <!-- Step 1: Form -->
  <div class="flex flex-col items-center w-32">
    <div class="flex items-center justify-center">
      <span class={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow transition bg-white border-4 border-[#0c017b]`}>
        <FileCheck2 class={`h-6 w-6 text-[#0c017b]`} aria-hidden="true" />
      </span>
    </div>
    <span class={`mt-2 text-sm font-semibold tracking-wide text-[#0c017b]`}>Form</span>
  </div>
  <svg class="flex-1 mx-2" height="2" width="60" aria-hidden="true">
    <line x1="0" y1="1" x2="60" y2="1" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>
  <!-- Step 2: Address -->
  <div class="flex flex-col items-center w-32" >
    <div class="flex items-center justify-center">
      <span class={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow transition bg-gray-200`}>
        <MapPin class={`h-6 w-6 text-gray-400`} aria-hidden="true" />
      </span>
    </div>
    <span class={`mt-2 text-sm font-semibold tracking-wide text-gray-400`}>Address</span>
  </div>
  <svg class="flex-1 mx-2" height="2" width="60" aria-hidden="true">
    <line x1="0" y1="1" x2="60" y2="1" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>
  <!-- Step 3: Payment -->
  <div class="flex flex-col items-center w-32" >
    <div class="flex items-center justify-center">
      <span class={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow transition bg-gray-200`}>
        <BadgeIndianRupee class={`h-6 w-6 text-gray-400`} aria-hidden="true" />
      </span>
    </div>
    <span class={`mt-2 text-sm font-semibold tracking-wide text-gray-400`}>Payment</span>
  </div>
</nav>
  <div class="mx-auto w-[min(1200px,100vw-32px)]">
    <div>
      <!-- Sections start -->
      <!-- Section 1 -->
      <section class="mt-6 rounded-xl bg-white p-6 shadow-md">
        <header class="flex items-start justify-between">
          <div class="flex items-center gap-2">
            <ShieldCheck class="h-7 w-7" aria-hidden="true" />
            <h3 class="text-2xl font-bold text-[#0c017b]">Customer Information</h3>
          </div>
        </header>

        <div class="mt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="customerName" class="block text-sm font-medium text-gray-700 mb-1">
                Name <span class="text-rose-500">*</span>
              </label>
              <input
                id="customerName"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.customerName} placeholder="Your full name" required
              />
            </div>

            <div>
              <fieldset>
                <legend class="block text-sm font-medium text-gray-700 mb-1">Customer Type</legend>
                <div class="flex flex-wrap items-center gap-4 py-2">
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" name="custType" bind:group={sampleForm.customerType} value="Manufacturing Company" />
                    Manufacturing Company
                  </label>
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" name="custType" bind:group={sampleForm.customerType} value="Individual" />
                    Individual
                  </label>
                </div>
              </fieldset>
            </div>

            <div>
              <label for="customerEmail" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span class="text-rose-500">*</span>
              </label>
              <input
                id="customerEmail"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="email" bind:value={sampleForm.email} placeholder="name@company.com" required
              />
              <p class="mt-1 text-xs text-gray-500">We’ll send confirmations and results to this address.</p>
            </div>

            <div>
              <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span class="text-rose-500">*</span>
              </label>
              <input
                id="customerPhone"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="tel" bind:value={sampleForm.phone} placeholder="+91 98765 43210" required
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2 -->
    <section class="mt-6 rounded-xl bg-white p-6 shadow-md">
      <header class="flex items-start justify-between">
        <div class="flex items-center gap-2">
          <ClipboardList class="h-7 w-7" aria-hidden="true" />
          <h3 class="text-2xl font-bold text-[#0c017b]">Sample Information</h3>
        </div>
      </header>

        <div class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="sampleNameOrBatch" class="block text-sm font-medium text-gray-700 mb-1">
                Sample Name / Batch No. <span class="text-rose-500">*</span>
              </label>
              <input
                id="sampleNameOrBatch"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.sampleNameOrBatch} placeholder="e.g., API-0425 / BATCH-77A" required
              />
            </div>

            <div>
              <label for="numberOfSamples" class="block text-sm font-medium text-gray-700 mb-1">Number of Samples</label>
              <input
                id="numberOfSamples"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number" min="1" bind:value={sampleForm.numberOfSamples}
              />
            </div>

            <div class="md:col-span-2">
              <fieldset>
                <legend class="block text-sm font-medium text-gray-700 mb-1">Physical State</legend>
                <div class="flex flex-wrap items-center gap-4 py-2">
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" name="physState" bind:group={sampleForm.physicalState} value="Solid" /> Solid
                  </label>
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" name="physState" bind:group={sampleForm.physicalState} value="Liquid" /> Liquid
                  </label>
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" name="physState" bind:group={sampleForm.physicalState} value="Gas" /> Gas
                  </label>
                </div>
              </fieldset>
            </div>

            <div>
              <label for="appearance" class="block text-sm font-medium text-gray-700 mb-1">Appearance (Colour, Texture)</label>
              <input
                id="appearance"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.appearance} placeholder="e.g., white crystalline powder"
              />
            </div>

            <div>
              <label for="solubility" class="block text-sm font-medium text-gray-700 mb-1">Solubility</label>
              <input
                id="solubility"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.solubility} placeholder="e.g., soluble in methanol"
              />
            </div>

            <div class="md:col-span-2">
              <label for="specialHandling" class="block text-sm font-medium text-gray-700 mb-1">Special Handling Instructions</label>
              <input
                id="specialHandling"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.specialHandling} placeholder="e.g., protect from light"
              />
            </div>

            <div class="md:col-span-2">
              <label for="usage" class="block text-sm font-medium text-gray-700 mb-1">Product / Sample is used for</label>
              <input
                id="usage"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.usage} placeholder="e.g., stability testing"
              />
            </div>

            <div class="md:col-span-2">
              <label for="StorageConditions" class="block text-sm font-medium text-gray-700 mb-1">Storage Conditions</label>
              <div class="flex flex-wrap items-center gap-4 py-2">
                {#each storageOptions as opt}
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" value={opt} bind:group={sampleForm.storageConditions} /> {opt}
                  </label>
                {/each}
              </div>
              {#if sampleForm.storageConditions.includes("Other")}
                <div class="mt-2">
                  <label for="OtherStorageConditions" class="block text-sm font-medium text-gray-700 mb-1">Specify other storage condition</label>
                  <input
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="text" bind:value={sampleForm.storageOther} placeholder="Describe required storage"
                  />
                </div>
              {/if}
            </div>

            <div class="md:col-span-2">
              <label for="HazardInformation" class="block text-sm font-medium text-gray-700 mb-1">Hazard Information</label>
              <div class="flex flex-wrap items-center gap-4 py-2">
                {#each hazardOptions as hazard}
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" value={hazard} bind:group={sampleForm.hazardInfo} /> {hazard}
                  </label>
                {/each}
              </div>

              {#if sampleForm.hazardInfo.length && !sampleForm.hazardInfo.includes("None")}
                <div class="mt-2 rounded-md bg-amber-50 text-amber-800 text-sm px-3 py-2 ring-1 ring-amber-200">
                  Please ensure proper labelling and packaging. MSDS is required for hazardous samples.
                </div>
              {/if}

              <div class="mt-2">
                <label for="MSDS" class="block text-sm font-medium text-gray-700 mb-1">MSDS (Material Safety Data Sheet)</label>
                <p class="text-sm text-gray-600 mb-3">
                Note: Required for hazardous samples.
              </p>
                <div class="flex items-center gap-4 py-1">
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" name="msds" bind:group={sampleForm.msds} value="Yes" /> Yes
                  </label>
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" name="msds" bind:group={sampleForm.msds} value="No" /> No 
                  </label>
                </div>

                {#if sampleForm.msds === "Yes"}
                  <div class="mt-2">
                    <label for="MSDSUpload" class="block text-sm font-medium text-gray-700 mb-1">Upload MSDS file</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      on:change={(e) => {
                        const el = e.target as HTMLInputElement;
                        sampleForm.msdsFile = el.files?.[0] || null;
                      }}
                    />
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3 -->
      <section class="mt-6 rounded-xl bg-white p-6 shadow-md">
        <header class="flex items-start justify-between">
          <div class="flex items-center gap-2">
            <Award class="h-7 w-7"/>
            <h3 class="text-2xl font-bold text-[#0c017b]">Analytical Requirements</h3>
          </div>
        </header>

        <div class="mt-4">
          <p class="text-sm text-gray-600 mb-3">
            Note: Send 1–2 mg/g sample extra in addition to the mentioned amount required for analysis.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label for="RequestedTechnique" class="block text-sm font-medium text-gray-700 mb-1">
                Requested Technique <span class="text-rose-500">*</span>
              </label>
              <input
                id="RequestedTechnique"
                class="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 focus:outline-none"
                type="text"
                placeholder="e.g., HPLC, GC-MS, NMR"
                bind:value={sampleForm.requestedTechnique}
                readonly
                required
              />
            </div>

            <!-- Lab Name (auto-filled) -->
            <div class="md:col-span-2">
              <label for="LabName" class="block text-sm font-medium text-gray-700 mb-1">
                Lab Name
              </label>
              <input
                id="LabName"
                class="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 focus:outline-none"
                type="text"
                bind:value={sampleForm.labName}
                placeholder="Selected lab"
                readonly
              />
            </div>

            <div>
              <label for="AmountProvided" class="block text-sm font-medium text-gray-700 mb-1">Amount Provided</label>
              <div class="flex gap-2">
                <input
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="number" min="0" step="0.01" placeholder="e.g., 50" bind:value={sampleForm.amountProvided}
                />
                <select
                  class="w-28 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  bind:value={sampleForm.amountUnit}
                >
                  {#each amountUnits as u}<option value={u}>{u}</option>{/each}
                </select>
              </div>
            </div>

            <div>
              <label for="RequestedTurnaround" class="block text-sm font-medium text-gray-700 mb-1">Requested Turnaround</label>
              <select
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bind:value={sampleForm.requestedTAT}
              >
                {#each tatOptions as t}<option value={t}>{t}</option>{/each}
              </select>
            </div>

            <div class="md:col-span-2">
              <label for="AnalysisPurpose" class="block text-sm font-medium text-gray-700 mb-1">Analysis Purpose</label>
              <div class="flex flex-wrap items-center gap-4 py-2">
                {#each purposeOptions as p}
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" value={p} bind:group={sampleForm.analysisPurpose} /> {p}
                  </label>
                {/each}
              </div>
            </div>

            <div class="md:col-span-2">
              <label for="ClientSampleCode" class="block text-sm font-medium text-gray-700 mb-1">Client Sample Code (optional)</label>
              <input
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.clientSampleCode} placeholder="Your internal reference code"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4 -->
      <section class="mt-6 rounded-xl bg-white p-6 shadow-md">
        <header class="flex items-start justify-between">
          <h3 class="text-2xl font-bold text-[#0c017b]">Additional Instructions</h3>
        </header>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="md:col-span-2">
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="notes"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3" bind:value={sampleForm.notes} placeholder="Any additional instructions or context"
            ></textarea>
          </div>

          <div class="md:col-span-2">
            <fieldset>
              <legend class="block text-sm font-medium text-gray-700 mb-1">Sample Disposal</legend>
              <p class="text-sm text-gray-600 mb-3">
                  Note: Extra charge may apply for returning samples.
              </p>
              <div class="flex flex-wrap items-center gap-4 py-2">
                {#each ["Discard", "Return", "Return unused portion only"] as disp}
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" name="sampleDisposal" bind:group={sampleForm.sampleDisposal} value={disp} /> {disp}
                  </label>
                {/each}
              </div>
            </fieldset>
          </div>

          {#if sampleForm.sampleDisposal === "Return" || sampleForm.sampleDisposal === "Return unused portion only"}
            <div class="md:col-span-2">
              <label for="returnShippingAddress" class="block text-sm font-medium text-gray-700 mb-1">
                Return Shipping Address <span class="text-rose-500">*</span>
              </label>
              <textarea
                id="returnShippingAddress"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3" bind:value={sampleForm.returnShippingAddress}
                placeholder="Recipient name, address, phone, and any courier instructions"
              ></textarea>
            </div>
          {/if}
        </div>

      </section>

      <!-- Section 5 -->
      <section class="mt-6 rounded-xl bg-white p-6 shadow-md">
        <h3 class="text-2xl font-bold text-[#0c017b]">Authorization and Acknowledgement</h3>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="md:col-span-2">
            <label class="inline-flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" bind:checked={sampleForm.declarationAccepted} />
              <span>
                Declaration: I certify that the information provided is accurate and the sample is properly
                labelled and packaged.
              </span>
            </label>
          </div>

          <div class="md:col-span-2">
            <div class="mt-4 flex items-right justify-end">
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-white font-medium transition disabled:opacity-60"
          style="background-color: #0c017b;"
          on:click={() => {
            submitRequisition();
          }}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Requisition"}
        </button>
          </div>
        </section>

        {#if showPreviousPrompt}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div class="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h2 class="text-lg font-semibold mb-2">Use Previous Form?</h2>
            <p class="mb-4 text-gray-700">You have already submitted a requisition for this test. Do you want to use your previous form details?</p>
            <div class="flex gap-4 justify-end">
              <button class="px-4 py-2 rounded-lg bg-[#0c017b] text-white font-medium" on:click={usePreviousRequisition}>Yes, use previous</button>
              <button class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium" on:click={skipPreviousRequisition}>No, start fresh</button>
            </div>
          </div>
        </div>
      {/if}

      <div class="mt-6 flex flex-col sm:flex-row justify-end gap-4 w-full">
        <button
          class="w-full sm:w-auto rounded-lg px-4 py-2 text-base sm:text-sm text-white font-medium transition"
          style="background-color: #0c017b;"
          on:click={addToCartAfterForm}
        >
          Add Test to Cart
        </button>
        {#if lastOrderId}
          <button
            class="w-full sm:w-auto rounded-lg bg-green-600 px-4 py-2 text-base sm:text-sm text-white font-medium hover:bg-green-700 transition"
            on:click={() => goto(`/checkout/pickup`)}
          >
            Proceed to Checkout
          </button>
        {/if}
      </div>
    </div>
  </div>
</main>

<style>
  /* Subtle UX polish */
  :global(input[type="number"]::-webkit-outer-spin-button),
  :global(input[type="number"]::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }
  :global(input[type="number"]) {
    -moz-appearance: textfield;
    appearance: textfield;
  }
</style>