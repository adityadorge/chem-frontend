<script lang="ts">
  import { API_URL } from "$lib/store/api";
  import { onMount } from "svelte";
  import { Toaster, toast } from "svelte-sonner";
  import { ShieldCheck, ClipboardList, Award, Check, Download, Share2, MapPin, FileCheck2, BadgeIndianRupee, RotateCcw, Gift} from "lucide-svelte";
  import { user } from "$lib/store";
  import { page } from "$app/stores";

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

    // Pickup details
    pickup: {
      location: "",           // site/campus/facility name
      buildingRoom: "",       // building and room/lab
      streetAddress: "",
      city: "",
      stateProvince: "",
      region: "",             // district/region
      postalCode: "",
      preferredDate: new Date().toISOString().slice(0, 10),
      preferredTimeSlot: "",
      contactPerson: "",
      contactPhone: "",
      alternatePhone: "",
      isBusinessAddress: false,
      pickupInstructions: "", // packaging, labeling, handover, etc.
      accessNotes: ""         // gate code, security desk, elevator info
    },
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
  const defaultPickupTimeSlots = ["09:00–12:00", "12:00–15:00", "15:00–18:00", "18:00–21:00", "Anytime (Business hours)"];
  let pickupTimeSlots: string[] = [...defaultPickupTimeSlots];

  // Save/submit state
  let saving = {pickup: false };
  let saved  = {pickup: false };
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
  function validatePickup() {
    const p = sampleForm.pickup;
    const required = [p.streetAddress, p.city, p.stateProvince, p.postalCode, p.preferredDate, p.preferredTimeSlot, p.contactPerson, p.contactPhone];
    if (!required.every(v => String(v).trim())) return "Please complete the pickup address and preferred date/time slot.";
    return null;
  }  
  let pickupAddressId: number | null = null;

  async function confirmPickup() {
    const err = validatePickup(); if (err) return toast.error(err);
    saving.pickup = true;
    try {
      const res = await fetch(`${API_URL}/auth/save-address/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${$user?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: sampleForm.pickup.location,
          building_or_room: sampleForm.pickup.buildingRoom,
          department: "",
          street_address: sampleForm.pickup.streetAddress,
          city: sampleForm.pickup.city,
          state_province: sampleForm.pickup.stateProvince,
          region: sampleForm.pickup.region,
          postal_code: sampleForm.pickup.postalCode,
          preferred_time_slot: sampleForm.pickup.preferredTimeSlot,
          preferred_date: sampleForm.pickup.preferredDate,
          contact_person: sampleForm.pickup.contactPerson,
          contact_phone: sampleForm.pickup.contactPhone,
          alternate_phone: sampleForm.pickup.alternatePhone,
          is_business_address: sampleForm.pickup.isBusinessAddress,
          pickup_instructions: sampleForm.pickup.pickupInstructions,
          access_notes: sampleForm.pickup.accessNotes,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save pickup address.");

      // Serializer now returns id
      pickupAddressId = data?.id ?? null;
      toast.success("Pickup address saved.");
      saved.pickup = true;
    } catch (e: any) {
      toast.error(e?.message || "Failed to save pickup address.");
    } finally {
      saving.pickup = false;
    }
  }

  // Normalize API date (YYYY-MM-DD) for date input
  const toYMD = (d: string | null | undefined) => {
    if (!d) return "";
    try { return new Date(d).toISOString().slice(0, 10); } catch { return String(d).slice(0, 10); }
  };

  let pickupLoaded = false;
  async function loadPickupAddress() {
    if (pickupLoaded) return;
    if (!$user?.access_token) return;

    try {
      const res = await fetch(`${API_URL}/auth/get-address/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${$user.access_token}` },
        credentials: "include",
      });
      if (!res.ok) { pickupLoaded = true; return; }
      const data = await res.json();

      if (Array.isArray(data?.time_slots) && data.time_slots.length > 0) {
        pickupTimeSlots = data.time_slots.map((s: { value: string }) => s.value);
      }

      const addr = data?.address || {};
      if (addr && Object.keys(addr).length > 0) {
        sampleForm.pickup.location           = addr.location ?? "";
        sampleForm.pickup.buildingRoom       = addr.building_or_room ?? "";
        sampleForm.pickup.streetAddress      = addr.street_address ?? "";
        sampleForm.pickup.city               = addr.city ?? "";
        sampleForm.pickup.stateProvince      = addr.state_province ?? "";
        sampleForm.pickup.region             = addr.region ?? "";
        sampleForm.pickup.postalCode         = addr.postal_code ?? "";
        sampleForm.pickup.preferredTimeSlot  = addr.preferred_time_slot ?? "";
        sampleForm.pickup.preferredDate      = toYMD(addr.preferred_date) || sampleForm.pickup.preferredDate;
        sampleForm.pickup.contactPerson      = addr.contact_person ?? "";
        sampleForm.pickup.contactPhone       = addr.contact_phone ?? "";
        sampleForm.pickup.alternatePhone     = addr.alternate_phone ?? "";
        sampleForm.pickup.isBusinessAddress  = Boolean(addr.is_business_address);
        sampleForm.pickup.pickupInstructions = addr.pickup_instructions ?? "";
        sampleForm.pickup.accessNotes        = addr.access_notes ?? "";

        // capture id here
        pickupAddressId = addr.id ?? null;

        saved.pickup = true;
      }
    } catch (e) {
      console.error("Failed to load pickup address:", e);
    } finally {
      pickupLoaded = true;
    }
  }

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

    if (data.pickup_address) {
      const addr = data.pickup_address;
      sampleForm.pickup.location           = addr.location ?? "";
      sampleForm.pickup.buildingRoom       = addr.building_or_room ?? "";
      sampleForm.pickup.streetAddress      = addr.street_address ?? "";
      sampleForm.pickup.city               = addr.city ?? "";
      sampleForm.pickup.stateProvince      = addr.state_province ?? "";
      sampleForm.pickup.region             = addr.region ?? "";
      sampleForm.pickup.postalCode         = addr.postal_code ?? "";
      sampleForm.pickup.preferredTimeSlot  = addr.preferred_time_slot ?? "";
      sampleForm.pickup.preferredDate      = toYMD(addr.preferred_date) || sampleForm.pickup.preferredDate;
      sampleForm.pickup.contactPerson      = addr.contact_person ?? "";
      sampleForm.pickup.contactPhone       = addr.contact_phone ?? "";
      sampleForm.pickup.alternatePhone     = addr.alternate_phone ?? "";
      sampleForm.pickup.isBusinessAddress  = Boolean(addr.is_business_address);
      sampleForm.pickup.pickupInstructions = addr.pickup_instructions ?? "";
      sampleForm.pickup.accessNotes        = addr.access_notes ?? "";
      pickupAddressId = addr.id ?? null;
    }
    toast.success("Previous requisition loaded.");
    showPreviousPrompt = false;
  }

  function skipPreviousRequisition() {
    showPreviousPrompt = false;
    previousRequisitionData = null;
  }

  onMount(() => {
    loadPickupAddress();
    loadLatestRequisition();
  });

  // If token becomes available after mount (e.g., hydration), try once
  $: if ($user?.access_token && !pickupLoaded) {
    loadPickupAddress();
  }

  let currentStep = 1; // 1: Form, 2: Address, 3: Payment

  function validateSampleForm() {
    // Full-form validation before final submit
    const e1 = validateSection1(); if (e1) return e1;
    const e2 = validateSection2(); if (e2) return e2;
    const e3 = validateSection3(); if (e3) return e3;
    const e4 = validateSection4(); if (e4) return e4;
    const ep = validatePickup();  if (ep) return ep;
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
      if (testIdParam) fd.append("test_id", String(testIdParam));
      if (testNameParam) fd.append("test_name", testNameParam);
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

      // Pickup link
      if (pickupAddressId) {
        fd.append("pickup_address", String(pickupAddressId));
      }

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
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to submit requisition.");
    } finally {
      submitting = false;
    }
  }

  // Progress indicators for header
  $: pickupConfirmed = saved.pickup;

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
      doc.text(`• Pickup: ${pickupConfirmed ? "Confirmed" : "Not set"}`, 40, y);
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

      addSection("Pickup Address and Slot", [
        ["Location", sampleForm.pickup.location || "-"],
        ["Building/Room", sampleForm.pickup.buildingRoom || "-"],
        ["Street Address", sampleForm.pickup.streetAddress || "-"],
        ["City", sampleForm.pickup.city || "-"],
        ["State/Province", sampleForm.pickup.stateProvince || "-"],
        ["Region", sampleForm.pickup.region || "-"],
        ["Postal Code", sampleForm.pickup.postalCode || "-"],
        ["Preferred Date", sampleForm.pickup.preferredDate || "-"],
        ["Preferred Time Slot", sampleForm.pickup.preferredTimeSlot || "-"],
        ["Contact Person", sampleForm.pickup.contactPerson || "-"],
        ["Contact Phone", sampleForm.pickup.contactPhone || "-"],
        ["Alternate Phone", sampleForm.pickup.alternatePhone || "-"],
        ["Business Address", sampleForm.pickup.isBusinessAddress ? "Yes" : "No"],
        ["Pickup Instructions", sampleForm.pickup.pickupInstructions || "-"],
        ["Access Notes", sampleForm.pickup.accessNotes || "-"],
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
  let testQtyParam: number | null = null;
  $: {
    const sp = $page.url.searchParams;
    testIdParam = sp.get("test_id") || "";
    testNameParam = sp.get("test_name") || "";
    const q = sp.get("quantity");
    testQtyParam = q ? Number(q) : null;
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
  <div class="flex flex-col items-center w-32" aria-current={currentStep === 1 ? "step" : undefined}>
    <div class="flex items-center justify-center">
      <span class={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow transition
        ${currentStep >= 1 ? 'bg-white border-4 border-[#0c017b]' : 'bg-gray-200 border-4 border-gray-300'}`}>
        <FileCheck2 class={`h-6 w-6 ${currentStep >= 1 ? 'text-[#0c017b]' : 'text-gray-400'}`} aria-hidden="true" />
      </span>
    </div>
    <span class={`mt-2 text-sm font-semibold tracking-wide ${currentStep >= 1 ? 'text-[#0c017b]' : 'text-gray-400'}`}>Form</span>
  </div>
  <svg class="flex-1 mx-2" height="2" width="60" aria-hidden="true">
    <line x1="0" y1="1" x2="60" y2="1" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>
  <!-- Step 2: Address -->
  <div class="flex flex-col items-center w-32" aria-current={currentStep === 2 ? "step" : undefined}>
    <div class="flex items-center justify-center">
      <span class={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow transition
        ${currentStep >= 2 ? 'bg-[#a78bfa]' : 'bg-gray-200'}`}>
        <MapPin class={`h-6 w-6 ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" />
      </span>
    </div>
    <span class={`mt-2 text-sm font-semibold tracking-wide ${currentStep >= 2 ? 'text-[#0c017b]' : 'text-gray-400'}`}>Address</span>
  </div>
  <svg class="flex-1 mx-2" height="2" width="60" aria-hidden="true">
    <line x1="0" y1="1" x2="60" y2="1" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>
  <!-- Step 3: Payment -->
  <div class="flex flex-col items-center w-32" aria-current={currentStep === 3 ? "step" : undefined}>
    <div class="flex items-center justify-center">
      <span class={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow transition
        ${currentStep === 3 ? 'bg-gray-300' : 'bg-gray-200'}`}>
        <BadgeIndianRupee class={`h-6 w-6 ${currentStep === 3 ? 'text-[#6b7280]' : 'text-gray-400'}`} aria-hidden="true" />
      </span>
    </div>
    <span class={`mt-2 text-sm font-semibold tracking-wide ${currentStep === 3 ? 'text-gray-500' : 'text-gray-400'}`}>Payment</span>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Solubility</label>
              <input
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.solubility} placeholder="e.g., soluble in methanol"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Special Handling Instructions</label>
              <input
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.specialHandling} placeholder="e.g., protect from light"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Product / Sample is used for</label>
              <input
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" bind:value={sampleForm.usage} placeholder="e.g., stability testing"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Storage Conditions</label>
              <div class="flex flex-wrap items-center gap-4 py-2">
                {#each storageOptions as opt}
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" value={opt} bind:group={sampleForm.storageConditions} /> {opt}
                  </label>
                {/each}
              </div>
              {#if sampleForm.storageConditions.includes("Other")}
                <div class="mt-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Specify other storage condition</label>
                  <input
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="text" bind:value={sampleForm.storageOther} placeholder="Describe required storage"
                  />
                </div>
              {/if}
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Hazard Information</label>
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
                <label class="block text-sm font-medium text-gray-700 mb-1">MSDS (Material Safety Data Sheet)</label>
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
                    <label class="block text-sm font-medium text-gray-700 mb-1">Upload MSDS file</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Requested Technique <span class="text-rose-500">*</span>
              </label>
              <input
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" placeholder="e.g., HPLC, GC-MS, NMR" bind:value={sampleForm.requestedTechnique} required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount Provided</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Requested Turnaround</label>
              <select
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bind:value={sampleForm.requestedTAT}
              >
                {#each tatOptions as t}<option value={t}>{t}</option>{/each}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Analysis Purpose</label>
              <div class="flex flex-wrap items-center gap-4 py-2">
                {#each purposeOptions as p}
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" value={p} bind:group={sampleForm.analysisPurpose} /> {p}
                  </label>
                {/each}
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Client Sample Code (optional)</label>
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
  class="rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
  on:click={() => {
    // Progress to Address section if not already there
    if (currentStep === 1) {
      const err = validateSection1();
      if (!err) {
        currentStep = 2;
        return;
      } else {
        toast.error(err);
        return;
      }
    }
    // Progress to Payment section if not already there
    if (currentStep === 2) {
      const err = validatePickup();
      if (!err) {
        currentStep = 3;
        return;
      } else {
        toast.error(err);
        return;
      }
    }
    // Only submit when on Payment step
    submitRequisition();
  }}
  disabled={submitting}
>
  {submitting ? "Submitting..." : "Submit Requisition"}
</button>
          </div>
        </section>

      <!-- Pickup address and date slot -->
      <section class="mt-6 rounded-xl bg-white p-6 shadow-md">
        <header class="flex items-start justify-between">
          <h3 class="text-2xl font-bold text-[#0c017b]">Pickup address and date slot</h3>
          {#if saved.pickup}
            <span class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              <Check class="h-3 w-3" /> Confirmed
            </span>
          {/if}
        </header>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location (Site/Campus)</label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="text" bind:value={sampleForm.pickup.location} placeholder="e.g., Corporate R&D Center" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Building & Room/Lab</label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="text" bind:value={sampleForm.pickup.buildingRoom} placeholder="e.g., B-Block, Lab 203" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Street Address <span class="text-rose-500">*</span></label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="text" bind:value={sampleForm.pickup.streetAddress} placeholder="Street, number, unit" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City <span class="text-rose-500">*</span></label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="text" bind:value={sampleForm.pickup.city} />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State/Province <span class="text-rose-500">*</span></label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="text" bind:value={sampleForm.pickup.stateProvince} />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Region/District</label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="text" bind:value={sampleForm.pickup.region} />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code <span class="text-rose-500">*</span></label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="text" bind:value={sampleForm.pickup.postalCode} />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Date <span class="text-rose-500">*</span></label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="date" bind:value={sampleForm.pickup.preferredDate} />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Time Slot <span class="text-rose-500">*</span></label>
            <select class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    bind:value={sampleForm.pickup.preferredTimeSlot}>
              <option value="" disabled>Select a slot</option>
              {#each pickupTimeSlots as t}<option value={t}>{t}</option>{/each}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person <span class="text-rose-500">*</span></label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="text" bind:value={sampleForm.pickup.contactPerson} placeholder="Name at pickup location" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contact Phone <span class="text-rose-500">*</span></label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="tel" bind:value={sampleForm.pickup.contactPhone} placeholder="+91 98765 43210" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alternate Phone (optional)</label>
            <input class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   type="tel" bind:value={sampleForm.pickup.alternatePhone} />
          </div>

          <div class="md:col-span-2">
            <label class="inline-flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" bind:checked={sampleForm.pickup.isBusinessAddress} />
              <span>This is a business address with receiving/security desk</span>
            </label>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Pickup Instructions</label>
            <textarea class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3" bind:value={sampleForm.pickup.pickupInstructions}
                      placeholder="Packaging provided? Labeling? Handover name, ID, or any special handling."></textarea>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Access Notes</label>
            <textarea class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="2" bind:value={sampleForm.pickup.accessNotes}
                      placeholder="Gate code, parking, security checkpoints, elevator access, etc."></textarea>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-end">
          <button
            type="button"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
            on:click={confirmPickup}
            disabled={saving.pickup}
          >
            {saving.pickup ? "Confirming..." : "Confirm location/address"}
          </button>
        </div>
      </section>

      {#if showPreviousPrompt}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div class="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h2 class="text-lg font-semibold mb-2">Use Previous Form?</h2>
            <p class="mb-4 text-gray-700">You have already submitted a requisition for this test. Do you want to use your previous form details?</p>
            <div class="flex gap-4 justify-end">
              <button class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium" on:click={usePreviousRequisition}>Yes, use previous</button>
              <button class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium" on:click={skipPreviousRequisition}>No, start fresh</button>
            </div>
          </div>
        </div>
      {/if}

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