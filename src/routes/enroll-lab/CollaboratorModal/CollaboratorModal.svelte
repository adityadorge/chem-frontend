<script lang="ts">
  export let open = false;
  export let onClose: () => void = () => {};
  const PURPLE = "#2d2470";
  const ACCENT = "#ff7043";
  const panelImage = "/assets/enroll-lab/figure1.png";

  const countries = ["India","United States","United Kingdom","Germany","France","Canada"];
  const businessTypes = ["Academic / University","Startup / Biotech","Mid-sized Company","Enterprise","Independent Researcher"];
  const employeeCounts = ["1-10","11-50","51-200","201-500","500+"];

  import { onMount } from "svelte";
  import { API_URL } from "$lib/store/api"; // Make sure this is imported
  let firstName = "";
  let lastName = "";
  let email = "";
  let phone = "";
  let companyName = "";
  let jobTitle = "";
  let country = "";
  let businessType = "";
  let employeeCount = "";
  let consent = false;
  let submitting = false;
  let successMsg = "";
  let errorMsg = "";

  function stop(e: Event){ e.stopPropagation(); }

  async function handleSubmit() {
    submitting = true;
    errorMsg = "";
    successMsg = "";
    try {
      const res = await fetch(`${API_URL}/collaborator-lead/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          company_name: companyName,
          job_title: jobTitle,
          country,
          business_type: businessType,
          employee_count: employeeCount,
          consent,
        }),
      });
      if (res.ok) {
        successMsg = "Thank you! We'll be in touch soon.";
        // Optionally close modal or reset form
      } else {
        const data = await res.json();
        errorMsg = data?.detail || "Submission failed.";
      }
    } catch (e) {
      errorMsg = "Network error.";
    }
    submitting = false;
  }
</script>

{#if open}
<!-- Make overlay itself scrollable; container gets max height -->
<div
  class="fixed inset-0 z-[2001] bg-black/50"
  on:click={onClose}
>
  <div
    class="w-full h-full flex items-start justify-center overflow-y-auto px-2 sm:px-4 py-4 md:py-8 "
  >
    <div
      class="relative w-full max-w-6xl bg-white md:rounded-xl md:shadow-2xl flex flex-col md:grid md:grid-cols-2 md:h-auto max-h-[100dvh]"
      on:click|stopPropagation={stop}
    >
      <button
        class="md:hidden absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none"
        on:click={onClose}
        aria-label="Close"
      >✕</button>

      <div
        class="relative flex flex-col text-white px-5 sm:px-8 py-6 sm:py-8 md:p-10"
        style="background:{PURPLE};"
      >
        <span class="absolute top-8 left-0 h-14 w-[3px]" style="background:{ACCENT};"></span>

        <h2 class="text-2xl sm:text-3xl font-extrabold leading-snug">
          Ready to simplify scheduling?<br class="hidden sm:block" />We can help!
        </h2>
        <p class="mt-4 text-xs sm:text-sm leading-relaxed text-white/85">
          Speak with a platform expert and discover how we can help your team. Just complete the form to book a time.
        </p>

        <ul class="mt-6 space-y-3 text-xs sm:text-sm">
          <li class="flex items-start gap-2">
            <svg class="mt-0.5 h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            Find the right plan for your needs and budget
          </li>
          <li class="flex items-start gap-2">
            <svg class="mt-0.5 h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            Learn how we help save time and control costs
          </li>
          <li class="flex items-start gap-2">
            <svg class="mt-0.5 h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            Get answers to your burning questions
          </li>
        </ul>

        <div class="mt-8 relative">
          <div class="rounded-xl">
            <img src={panelImage} alt="Platform preview" class="w-full object-cover" />
          </div>
        </div>

        <figure class="mt-10 text-xs sm:text-sm">
          <blockquote class="italic text-white/90">
            “Getting set up is actually very simple. I love how easy it is.”
          </blockquote>
          <figcaption class="mt-3 text-white/60">
            Jared Black, CEO, NewVine Employment Group
          </figcaption>
        </figure>
      </div>

      <div class="relative bg-white flex flex-col h-full overflow-visible px-5 sm:px-8 py-6 sm:py-8 md:p-10">
        <button
          class="hidden md:inline-flex absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          on:click={onClose}
          aria-label="Close"
        >✕</button>

        <form class="space-y-6 pb-8" on:submit|preventDefault={handleSubmit}>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>First Name</label>
              <input type="text" bind:value={firstName} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" bind:value={lastName} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label>Work Email</label>
              <input type="email" bind:value={email} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label>Phone Number</label>
              <input type="tel" bind:value={phone} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div class="sm:col-span-2">
              <label>Company Name</label>
              <input type="text" bind:value={companyName} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label>Job Title</label>
              <input type="text" bind:value={jobTitle} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label>Country</label>
              <select bind:value={country} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option value="">Select</option>
                {#each countries as c}<option>{c}</option>{/each}
              </select>
            </div>
            <div>
              <label>Business Type</label>
              <select bind:value={businessType} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option value="">Select</option>
                {#each businessTypes as b}<option>{b}</option>{/each}
              </select>
            </div>
            <div>
              <label>Employees Using Platform</label>
              <select bind:value={employeeCount} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option value="">Select</option>
                {#each employeeCounts as e}<option>{e}</option>{/each}
              </select>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <input type="checkbox" bind:checked={consent} class="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <p class="text-[11px] leading-snug text-gray-600">
              I agree to the Terms of Use and Privacy Policy. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
            </p>
          </div>

          {#if errorMsg}
            <div class="text-red-600">{errorMsg}</div>
          {/if}
          {#if successMsg}
            <div class="text-green-600">{successMsg}</div>
          {/if}

          <button
            type="submit"
            class="w-full rounded-md bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold py-3 shadow-sm transition-colors"
            disabled={submitting}
          >{submitting ? "Submitting..." : "Submit"}</button>
        </form>
      </div>
    </div>
  </div>
</div>
{/if}