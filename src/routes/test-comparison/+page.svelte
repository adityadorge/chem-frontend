<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/store/api";
  import { user, isAuthenticated } from "$lib/store";
  import { get } from "svelte/store";
  import { Toaster, toast } from "svelte-sonner";
  import { goto } from "$app/navigation";

  const PRIMARY = "#0c017b";
  const WAVE = "#ffede9";

  interface Comparison {
    id: number;
    test: number;
    lab_test: number;
    lab_name: string;
    test_name: string;
    turnaround_time: string | null;
    test_price: string;
    created_at: string;
  }

  let items: Comparison[] = [];
  let loading = false;
  let error: string | null = null;
  let testFilter = ""; // optional test_id filter

  // Track deleted and deleting states per row so we can keep the layout and show placeholders
  let deletedIds = new Set<number>();
  let deletingIds = new Set<number>();

  async function loadComparisons() {
    if (!get(isAuthenticated)) {
      error = "Login required.";
      return;
    }
    loading = true;
    error = null;
    try {
      const url = new URL(`${API_URL}/test-comparisons/`);
      if (testFilter) url.searchParams.set("test_id", testFilter);
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${get(user)?.access_token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");
      // Keep all; we will sort and show latest two below
      items = Array.isArray(data.items) ? data.items : [];
    } catch (e: any) {
      error = e.message || "Failed to load comparisons.";
    } finally {
      loading = false;
    }
  }

  async function removeRow(id: number) {
    try {
      // mark as deleting to disable the button
      deletingIds.add(id);
      deletingIds = new Set(deletingIds); // trigger reactivity
      const res = await fetch(`${API_URL}/remove-comparison/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${get(user)?.access_token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Remove failed");
      toast.success("Removed.");
      // keep the grid intact; show placeholder for this slot
      deletedIds.add(id);
      deletedIds = new Set(deletedIds); // trigger reactivity
    } catch (e: any) {
      toast.error(e.message || "Error removing");
    } finally {
      deletingIds.delete(id);
      deletingIds = new Set(deletingIds);
    }
  }

  const currency = (v: string) => {
    const n = parseFloat(v);
    if (Number.isNaN(n)) return v;
    return n.toLocaleString("en-US",{style:"currency",currency:"USD"});
  };

  // Show limit reached if there are at least two records available
  $: itemsSorted = [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Exactly two display slots:
  // - if 2+ items -> take latest 2
  // - if 1 item   -> [item, null] to show a blank column with "Compare" button
  // - if 0 items  -> []
  $: displayItems = itemsSorted.length >= 2
    ? itemsSorted.slice(0, 2)
    : itemsSorted.length === 1
      ? [itemsSorted[0], null]
      : [];

  $: limitReached = itemsSorted.length >= 2;

  // Returns details for a given comparison row
  function detailsFor(c: Comparison) {
    return [
      { label: "Test Name", value: c.test_name },
      { label: "Lab Name", value: c.lab_name },
      { label: "Turnaround Time", value: c.turnaround_time || "—" },
      { label: "Test Price", value: currency(c.test_price) },
      { label: "Added", value: new Date(c.created_at).toLocaleString() }
    ];
  }

  // For blank column skeleton
  function detailsSkeleton() {
    return [
      { label: "Test Name", value: "—" },
      { label: "Lab Name", value: "—" },
      { label: "Turnaround Time", value: "—" },
      { label: "Test Price", value: "—" },
      { label: "Added", value: "—" }
    ];
  }

  // Types for clarity
  type FeatureRow = {
    label: string;
    a: boolean; // availability for colA
    b: boolean; // availability for colB
  };

  onMount(loadComparisons);

  type Section = {
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    imageFirst?: boolean; // true => image on the left
    features: FeatureRow[];
    footer?: string;
  };
</script>

<Toaster richColors />

<main class="mx-auto max-w-7xl px-6 py-6">

  {#if loading}
    <p>Loading…</p>
  {:else if error}
    <p class="text-red-600 text-sm">{error}</p>
  {:else if items.length === 0}
    <p class="text-gray-600 text-sm">No comparisons yet. Use the Compare button on a test detail page.</p>
  {:else}
    <!-- Headline section remains -->
    {#if displayItems.length === 2}
      <section class="w-full">
        <div
          class="grid max-w-screen-xl px-4 pt-4 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-4 lg:grid-cols-12 lg:pt-4"
        >
          <div
            class="flex flex-col items-center justify-center text-center lg:col-start-4 lg:col-span-6 mx-auto"
          >
            <p
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-lg mb-4"
              style="background:{WAVE}; color:{PRIMARY}"
            >
              Disciplines We Serve
            </p>
            <h1
              class="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-black"
            >
              Bridging Every <br />
              <span class="whitespace-nowrap">Scientific Frontier.</span>
            </h1>
            <p
              class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"
            >
              Our multidisciplinary approach brings together expertise across
              diagnostics, pharmaceuticals, biotechnology, and advanced materials
              — creating a seamless ecosystem where ideas evolve into impact.
            </p>
          </div>
        </div>
      </section>

      <div
        class="relative grid sm:grid-cols-2 gap-18
        sm:after:content-[''] sm:after:absolute sm:after:top-0 sm:after:bottom-0 sm:after:left-1/2 sm:after:-translate-x-1/2 sm:after:w-px sm:after:bg-gray-800
        sm:before:content-['OR'] sm:before:absolute sm:before:top-1/2 sm:before:left-1/2 sm:before:-translate-x-1/2 sm:before:-translate-y-1/2
        sm:before:px-2 sm:before:py-0.5 sm:before:text-xs sm:before:font-semibold sm:before:uppercase sm:before:tracking-wider
        sm:before:text-gray-600 sm:before:bg-white sm:before:rounded-full sm:before:shadow-sm sm:before:z-10"
      >
        {#each displayItems as c, i}
          <div class="space-y-4">
            <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 text-center flex items-center justify-center gap-3">
              {#if c === null}
                <button
                  class="px-5 py-2.5 rounded-md bg-[#0c017b] text-white text-base md:text-lg font-semibold hover:bg-indigo-700"
                  on:click={() => goto('/testing')}
                >
                  Compare
                </button>
              {:else if deletedIds.has(c.id)}
                <button
                  class="px-5 py-2.5 rounded-md bg-[#0c017b] text-white text-base md:text-lg font-semibold hover:bg-indigo-700"
                  on:click={() => goto('/testing')}
                >
                  Compare
                </button>
              {:else}
                <span>{c.lab_name}</span>
                <button
                  class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                  title="Delete"
                  aria-label="Delete comparison"
                  on:click={() => removeRow(c.id)}
                  disabled={deletingIds.has(c.id)}
                >
                  <!-- Trash icon (Heroicons solid) -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2.25A2.25 2.25 0 0 0 6.75 4.5v.75H4.5a.75.75 0 0 0 0 1.5h.59l.84 12.095A2.25 2.25 0 0 0 8.174 21h7.652a2.25 2.25 0 0 0 2.244-2.155L18.91 6.75h.59a.75.75 0 0 0 0-1.5h-2.25V4.5A2.25 2.25 0 0 0 15 2.25H9Zm1.5 3h3a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-.75-.75h-3A.75.75 0 0 0 9.75 4.5v.75a.75.75 0 0 0 .75.75ZM9.75 9a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5A.75.75 0 0 1 9.75 9Zm4.5 0a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd"/>
                  </svg>
                </button>
              {/if}
            </h2>
            <div class="border-t border-gray-200 overflow-x-auto rounded-lg">
              <table class="w-full text-left">
                <thead class="text-xs uppercase text-gray-700">
                  <tr>
                    <th scope="col" class="py-3 pr-6">FEATURES</th>
                    <th scope="col" class="py-3 px-6 text-center">DETAILS</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-gray-900">
                  {#each (c ? detailsFor(c) : detailsSkeleton()) as f}
                    <tr>
                      <th scope="row" class="py-4 pr-6 font-medium">{f.label}</th>
                      <td class="px-6 text-center">
                        {#if c === null || (c && deletedIds.has(c.id))}
                          <span class="text-gray-400">—</span>
                        {:else}
                          {f.value}
                        {/if}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</main>