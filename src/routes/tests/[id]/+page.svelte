<script lang="ts">
  import { API_URL } from "$lib/store/api";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Toaster, toast } from "svelte-sonner";
  import { user, isAuthenticated } from "$lib/store";
  import { get } from "svelte/store";
  import { goto } from "$app/navigation";
  import {
    History,
    ShieldCheck,
    ClipboardList,
    Award,
    Share2,
    Download,
    MessageCircleQuestionMark,
  } from "lucide-svelte";

  interface Test {
    id: number;
    test_name: string;
    image_url: string;
    test_description: string;
    test_price: number;
    supplier_name?: string;
  }

  let test: Test | null = null;
  let loading = true;
  let error: string | null = null;

  let quantity = 1;
  let isAdding = false;
  let isAccepting = false;
  let hasSeenAddMoreNotice = false;

  // route param
  $: id = $page.params.id;

  async function loadTest() {
    loading = true;
    error = null;
    try {
      const res = await fetch(`${API_URL}/app1/tests/${id}/`);
      if (!res.ok) throw new Error("Failed to fetch test");
      test = await res.json();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "Failed to load";
    } finally {
      loading = false;
    }
  }

  onMount(loadTest);

  function increaseQuantity() {
    quantity = Math.min(quantity + 1, 999);
  }
  function decreaseQuantity() {
    if (quantity > 1) quantity = quantity - 1;
  }
  function handleQtyInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = parseInt(target.value, 10);
    quantity = Number.isNaN(val) ? 1 : Math.max(1, Math.min(val, 999));
  }

  // async function handleAddToCart() {
  //   if (!get(isAuthenticated)) {
  //     toast.error("Please login to add items to your cart.");
  //     return;
  //   }
  //   isAdding = true;
  //   try {
  //     const { access_token } = get(user) ?? {};
  //     const res = await fetch(`${API_URL}/add-to-cart/`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ test_id: test?.id, quantity }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok || data.status !== "success") {
  //       throw new Error(data.message || "Failed to add to cart");
  //     }
  //     toast.success(`Added ${quantity} ${test?.test_name} to cart!`);
  //   } catch (e: unknown) {
  //     toast.error(e instanceof Error ? e.message : "Failed to add to cart");
  //   } finally {
  //     isAdding = false;
  //   }
  // }

  async function goToCheckoutForm() {
    if (!get(isAuthenticated)) {
      toast.error("Please login before buying.");
      return;
    }
    goto(`/checkout/form?test_id=${test?.id}&test_name=${encodeURIComponent(test?.test_name || "")}`);
  }

  // change later to select lab specific test
  function handleAddMoreTest() {
    if (!hasSeenAddMoreNotice) {
      hasSeenAddMoreNotice = true;
      toast.info("Please save your preferences before moving.");
      return;
    }
    goto("/testing");
  }

  // UI helpers and demo line items to match the design
  const currency = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  type LineItem = {
    name: string;
    sub?: string;
    unit: number;
    qty: number;
    discount?: number;
  };
  let lineItems: LineItem[] = [];
  // Recompute the quote row whenever test or quantity changes
  $: if (test) {
    lineItems = [
      { name: test.test_name, unit: test.test_price, qty: quantity },
    ];
  }

  $: subtotal = lineItems.reduce((s, i) => s + i.unit * i.qty, 0);
  $: totalDiscount = lineItems.reduce(
    (s, i) => s + i.unit * i.qty * (i.discount ?? 0),
    0,
  );
  $: orderTotal = subtotal - totalDiscount;

  let activeTab: "Collaborate" | "Attachments" = "Collaborate";

  // KPI deltas (dummy data)
  const deltaTurnaround = 12.5;
  const deltaQuote = 3.2;
  const deltaSupplier1 = 1.1;
  const deltaSupplier2 = -0.4;

  const formatDelta = (n: number) => `${n >= 0 ? "" : ""}${n}%`;
</script>

<Toaster richColors />

<main class="mx-auto max-w-7xl px-4 py-6">
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else if test}
    <!-- Header -->
    <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-4 md:gap-8">
      <div class="min-w-0">
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">
          {test.test_name} – {test?.supplier_name ?? "the Labs"}
        </h1>
        <p class="mt-2 text-gray-600">
          {test?.test_description ??
            "Atomic spectroscopy is a set of analytical techniques that study the interaction of electromagnetic radiation with atoms to determine the elemental composition of a sample"}
        </p>

        <div class="mt-3 flex flex-wrap items-center gap-3">
          <span
            class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span> Fulfilled
          </span>
          <button
            type="button"
            class="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
            title="Fulfilled means the service provided by the lab is guaranteed: scope agreed, timelines committed, and quality assured."
          >
            <MessageCircleQuestionMark class="h-4 w-4" aria-hidden="true" />
            Info
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2 justify-self-start md:justify-self-end">
        <button
          class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
        >
          <Share2 class="h-4 w-4 text-gray-400" aria-hidden="true" />
          Share
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
        >
          <Download class="h-4 w-4 text-gray-400" aria-hidden="true" />
          Download
        </button>
        <button
          class="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          Compare Related Requests
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="mt-6 grid grid-cols-12 gap-6 lg:grid-rows-[auto,1fr]">
      <!-- Row 1: KPI cards -->
      <section class="col-span-12">
        <div
          class="rounded-2xl border border-gray-200 bg-white overflow-hidden"
        >
          <!-- KPI Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
          >
            <div class="flex items-center gap-2">
              <History class="h-5 w-5 text-gray-400" aria-hidden="true" />
              <h2 class="text-sm font-semibold text-gray-900">Quote KPIs</h2>
            </div>
            <div class="text-xs text-gray-500">
              Showing data for last 30 days
            </div>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200"
          >
            <!-- Turnaround Time -->
            <div class="p-6">
              <div class="text-sm text-gray-500">Turnaround Time</div>
              <div class="mt-1 text-2xl font-semibold text-gray-900">—</div>
              <div class="mt-2 flex items-center gap-2">
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style="color:{deltaTurnaround >= 0
                    ? '#059669'
                    : '#DC2626'}; transform: rotate({deltaTurnaround >= 0
                    ? 0
                    : 180}deg)"
                >
                  <path d="M10 4l5 6H5l5-6z"></path>
                </svg>
                <span
                  class="text-sm font-medium"
                  class:text-emerald-600={deltaTurnaround >= 0}
                  class:text-rose-600={deltaTurnaround < 0}
                >
                  {formatDelta(deltaTurnaround)}
                </span>
                <span class="text-xs text-gray-500">Since last month</span>
              </div>
            </div>
            <!-- Quote Valid Until -->
            <div class="p-6">
              <div class="text-sm text-gray-500">Quote Valid Until</div>
              <div class="mt-1 text-2xl font-semibold text-gray-900">—</div>
              <div class="mt-2 flex items-center gap-2">
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style="color:{deltaQuote >= 0
                    ? '#059669'
                    : '#DC2626'}; transform: rotate({deltaQuote >= 0
                    ? 0
                    : 180}deg)"
                >
                  <path d="M10 4l5 6H5l5-6z"></path>
                </svg>
                <span
                  class="text-sm font-medium"
                  class:text-emerald-600={deltaQuote >= 0}
                  class:text-rose-600={deltaQuote < 0}
                >
                  {formatDelta(deltaQuote)}
                </span>
                <span class="text-xs text-gray-500">Since last month</span>
              </div>
            </div>
            <!-- Supplier Rating -->
            <div class="p-6">
              <div class="text-sm text-gray-500">Supplier Rating</div>
              <div
                class="mt-1 flex items-center gap-2 text-2xl font-semibold text-gray-900"
              >
                <svg
                  class="h-6 w-6 text-yellow-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.967 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.035a1 1 0 00-1.175 0L6.61 16.3c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.973 8.72c-.783-.57-.379-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.076-3.292z"
                  />
                </svg>
                <span class="text-gray-900 text-2xl">5.0</span>
                <span class="text-sm font-normal text-gray-500">(17)</span>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style="color:{deltaSupplier1 >= 0
                    ? '#059669'
                    : '#DC2626'}; transform: rotate({deltaSupplier1 >= 0
                    ? 0
                    : 180}deg)"
                >
                  <path d="M10 4l5 6H5l5-6z"></path>
                </svg>
                <span
                  class="text-sm font-medium"
                  class:text-emerald-600={deltaSupplier1 >= 0}
                  class:text-rose-600={deltaSupplier1 < 0}
                >
                  {formatDelta(deltaSupplier1)}
                </span>
                <span class="text-xs text-gray-500">Since last month</span>
              </div>
            </div>
            <!-- Supplier Rating 2 -->
            <div class="p-6">
              <div class="text-sm text-gray-500">Supplier Rating</div>
              <div
                class="mt-1 flex items-center gap-2 text-2xl font-semibold text-gray-900"
              >
                <svg
                  class="h-6 w-6 text-yellow-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.967 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.035a1 1 0 00-1.175 0L6.61 16.3c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.973 8.72c-.783-.57-.379-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.076-3.292z"
                  />
                </svg>
                <span class="text-gray-900 text-2xl">5.0</span>
                <span class="text-sm font-normal text-gray-500">(17)</span>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style="color:{deltaSupplier2 >= 0
                    ? '#059669'
                    : '#DC2626'}; transform: rotate({deltaSupplier2 >= 0
                    ? 0
                    : 180}deg)"
                >
                  <path d="M10 4l5 6H5l5-6z"></path>
                </svg>
                <span
                  class="text-sm font-medium"
                  class:text-emerald-600={deltaSupplier2 >= 0}
                  class:text-rose-600={deltaSupplier2 < 0}
                >
                  {formatDelta(deltaSupplier2)}
                </span>
                <span class="text-xs text-gray-500">Since last month</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Row 2: Quote table -->
      <section class="col-span-12 lg:col-span-12 lg:row-start-2">
        <!-- Quote table card -->
        <div class="mt-6 rounded-xl border border-gray-200 bg-white">
          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 p-4">
            <!-- <button
              class="rounded-lg bg-white px-4 py-2 text-indigo-600 ring-1 ring-inset ring-indigo-200 font-medium hover:bg-indigo-50 transition disabled:opacity-50"
              on:click={handleAddToCart}
              disabled={isAdding || isAccepting}
            >
              {isAdding ? "Adding..." : "Save"}
            </button> -->
            <button
              class="rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              on:click={goToCheckoutForm}
              disabled={isAdding || isAccepting}
            >
              {isAccepting ? "Processing..." : "Accept"}
            </button>
          </div>
          <div class="px-4 pb-4">
            <div class="overflow-auto rounded-lg border border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >Name</th
                    >
                    <th
                      class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >Unit Price</th
                    >
                    <th
                      class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >price per sample</th
                    >
                    <th
                      class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >Discount</th
                    >
                    <th
                      class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >Line Total</th
                    >
                    <th
                      class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                      >Net</th
                    >
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  {#each lineItems as item}
                    {#key item.name + (item.sub ?? "")}
                      <tr>
                        <td class="px-6 py-4">
                          <div class="text-gray-900">
                            {item.name}
                            {#if item.sub}
                              <span class="text-gray-300"> | </span>
                              <span class="text-indigo-600 hover:underline"
                                >{item.sub}</span
                              >
                            {/if}
                          </div>
                        </td>
                        <td class="px-6 py-4 text-right text-gray-900"
                          >{currency(item.unit)}</td
                        >
                        <!-- Qty controls -->
                        <td class="px-6 py-4 text-right text-gray-900">
                          <div
                            class="inline-flex items-center justify-end gap-2"
                          >
                            <button
                              class="h-7 w-7 rounded-md ring-1 ring-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                              on:click={decreaseQuantity}
                              disabled={quantity <= 1 ||
                                isAdding ||
                                isAccepting}
                              aria-label="Decrease quantity">−</button
                            >
                            <input
                              class="w-16 rounded-md border border-gray-300 px-2 py-1 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                              type="number"
                              min="1"
                              max="999"
                              bind:value={quantity}
                              on:input={handleQtyInput}
                              disabled={isAdding || isAccepting}
                            />
                            <button
                              class="h-7 w-7 rounded-md ring-1 ring-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                              on:click={increaseQuantity}
                              disabled={isAdding || isAccepting}
                              aria-label="Increase quantity">+</button
                            >
                          </div>
                        </td>
                        <td class="px-6 py-4 text-right text-gray-900">
                          {item.discount
                            ? `${(item.discount * 100).toFixed(0)}%`
                            : "—"}
                        </td>
                        <td class="px-6 py-4 text-right text-gray-900">
                          {currency(item.unit * item.qty)}
                        </td>
                        <td class="px-6 py-4 text-right text-gray-900">
                          {currency(
                            item.unit * item.qty * (1 - (item.discount ?? 0)),
                          )}
                        </td>
                      </tr>
                    {/key}
                  {/each}
                </tbody>
                <tfoot>
                  <tr class="bg-gray-50">
                    <td class="px-6 py-3 text-right text-gray-600" colspan="5"
                      >Subtotal</td
                    >
                    <td class="px-6 py-3 text-right text-gray-900 font-medium"
                      >{currency(subtotal)}</td
                    >
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="px-6 py-3 text-right text-gray-600" colspan="5"
                      >Discount</td
                    >
                    <td class="px-6 py-3 text-right text-rose-600 font-medium"
                      >- {currency(totalDiscount)}</td
                    >
                  </tr>
                  <tr class="bg-gray-100">
                    <td class="px-6 py-4" colspan="2">
                      <button
                        type="button"
                        class="rounded-lg bg-white px-3 py-2 text-indigo-600 ring-1 ring-inset ring-indigo-200 font-medium hover:bg-indigo-50 transition"
                        on:click={handleAddMoreTest}
                      >
                        Add More Test
                      </button>
                    </td>
                    <td
                      class="px-6 py-4 text-right font-semibold text-gray-900"
                      colspan="3">Order Total</td
                    >
                    <td class="px-6 py-4 text-right font-semibold text-gray-900"
                      >{currency(orderTotal)}</td
                    >
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Tabs -->
          <div class="px-4">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex gap-6" aria-label="Tabs">
                {#each ["Collaborate", "Attachments"] as tab}
                  <button
                    class="whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium transition"
                    class:border-indigo-600={activeTab === tab}
                    class:text-indigo-600={activeTab === tab}
                    class:border-transparent={activeTab !== tab}
                    class:text-gray-500={activeTab !== tab}
                    on:click={() => (activeTab = tab as typeof activeTab)}
                  >
                    {tab}
                  </button>
                {/each}
              </nav>
            </div>
            <div class="py-4">
              {#if activeTab === "Collaborate"}
                <div class="text-sm text-gray-600">
                  Start a thread with the supplier here…
                </div>
              {:else}
                <div class="text-sm text-gray-600">
                  Upload and view attachments here…
                </div>
              {/if}
            </div>
          </div>
        </div>
      </section>

      <!-- Right: Teams sidebar removed -->
    </div>

    <!-- Supplier profile and trust -->
    <section class="mt-6 rounded-xl border border-gray-200 bg-white p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <ShieldCheck class="h-5 w-5 text-emerald-500" aria-hidden="true" />
          <h3 class="text-base font-semibold text-gray-900">
            Supplier profile and trust
          </h3>
        </div>
      </div>
      <div class="mt-4">
        <div class="text-sm text-gray-600">Accreditations</div>
        <div class="mt-3 flex flex-wrap gap-2">
          <span
            class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
            >GLP</span
          >
          <span
            class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
            >ISO/IEC 17025</span
          >
          <span
            class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
            >CAP</span
          >
          <span
            class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
            >CLIA</span
          >
        </div>
      </div>
    </section>

    <!-- Sample requirements and logistics -->
    <section class="mt-6 rounded-xl border border-gray-200 bg-white p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <ClipboardList class="h-5 w-5 text-indigo-500" aria-hidden="true" />
          <h3 class="text-base font-semibold text-gray-900">
            Sample requirements and logistics
          </h3>
        </div>
      </div>
      <ul
        class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 list-disc pl-5"
      >
        <li>Volume</li>
        <li>Containers</li>
        <li>Preservatives</li>
        <li>Storage temperature</li>
        <li>Biosafety level</li>
        <li>Sample retention and disposal policy</li>
      </ul>
    </section>

    <!-- Past project highlights -->
    <section class="mt-6 rounded-xl border border-gray-200 bg-white p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Award class="h-5 w-5 text-amber-500" aria-hidden="true" />
          <h3 class="text-base font-semibold text-gray-900">
            Past project highlights
          </h3>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-lg bg-gray-50 p-4">
          <div class="text-sm text-gray-600">GLP studies completed</div>
          <div class="mt-1 text-2xl font-semibold text-gray-900">120</div>
        </div>
        <div class="rounded-lg bg-gray-50 p-4">
          <div class="text-sm text-gray-600">Avg. client rating</div>
          <div class="mt-1 text-2xl font-semibold text-gray-900">4.9/5</div>
        </div>
        <div class="rounded-lg bg-gray-50 p-4">
          <div class="text-sm text-gray-600">On-time delivery</div>
          <div class="mt-1 text-2xl font-semibold text-gray-900">96%</div>
        </div>
      </div>
    </section>
  {/if}
</main>
