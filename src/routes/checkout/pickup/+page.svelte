<script lang="ts">
  import { API_URL } from "$lib/store/api";
  import { onMount } from "svelte";
  import { Toaster, toast } from "svelte-sonner";
  import { Check, MapPin, FileCheck2, BadgeIndianRupee } from "lucide-svelte";
  import { user } from "$lib/store";
  import { page } from "$app/stores";

  // Sample Analysis Request Form state
  let sampleForm = {
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
  // Replace the static const with a default + mutable list populated from API when available
  const defaultPickupTimeSlots = ["09:00–12:00", "12:00–15:00", "15:00–18:00", "18:00–21:00", "Anytime (Business hours)"];
  let pickupTimeSlots: string[] = [...defaultPickupTimeSlots];

  // Save/submit state
  let saving = {pickup: false };
  let saved  = {pickup: false };

  
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

  onMount(() => {
    loadPickupAddress();
  });

  // If token becomes available after mount (e.g., hydration), try once
  $: if ($user?.access_token && !pickupLoaded) {
    loadPickupAddress();
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
  <!-- Progress Bar: Hardcode Address step as active -->
  <nav class="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-4" aria-label="Checkout Progress">
  <!-- Step 1: Form -->
  <div class="flex flex-col items-center w-32">
    <div class="flex items-center justify-center">
      <span class="rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow bg-gray-200 border-4 border-gray-300">
        <FileCheck2 class="h-6 w-6 text-gray-400" aria-hidden="true" />
      </span>
    </div>
    <span class="mt-2 text-sm font-semibold tracking-wide text-gray-400">Form</span>
  </div>
  <svg class="flex-1 mx-2" height="2" width="60" aria-hidden="true">
    <line x1="0" y1="1" x2="60" y2="1" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>
  <!-- Step 2: Address (active) -->
  <div class="flex flex-col items-center w-32">
    <div class="flex items-center justify-center">
      <span class="rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow bg-[#a78bfa]">
        <MapPin class="h-6 w-6 text-white" aria-hidden="true" />
      </span>
    </div>
    <span class="mt-2 text-sm font-semibold tracking-wide text-[#0c017b]">Address</span>
  </div>
  <svg class="flex-1 mx-2" height="2" width="60" aria-hidden="true">
    <line x1="0" y1="1" x2="60" y2="1" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>
  <!-- Step 3: Payment -->
  <div class="flex flex-col items-center w-32">
    <div class="flex items-center justify-center">
      <span class="rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow bg-gray-200">
        <BadgeIndianRupee class="h-6 w-6 text-gray-400" aria-hidden="true" />
      </span>
    </div>
    <span class="mt-2 text-sm font-semibold tracking-wide text-gray-400">Payment</span>
  </div>
</nav>
  <div class="mx-auto w-[min(1200px,100vw-32px)]">
    <div>
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