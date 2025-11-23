<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { API_URL } from "$lib/store/api";
  import { user } from "$lib/store";

  let showDropdown = false;

  type OrderItem = { id: number; test: number; test_name?: string; quantity: number; price: string };
  type OrderDTO = {
    id: number;
    order_id: string;
    total_amount: string;
    order_status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    created_at: string;
    updated_at: string;
    user_name?: string;
    items: OrderItem[];
  };

  let orders: OrderDTO[] = [];
  let loading = true;
  let loadError: string | null = null;

  const tabs = [
    { label: "All Orders", key: "all" },
    { label: "Drafts", key: "drafts" },
    { label: "Canceled", key: "canceled" },
    { label: "Shipping", key: "shipping" },
    { label: "Completed", key: "completed" }
  ];
  let activeTab = "all";
  let search = "";
  let paymentFilter: "all" | "Paid" | "Unpaid" = "all";
  let statusFilter: "all" | "Processing" | "Deliver" | "Shipping" = "all";
  let expandedOrderId: string | null = null;

  let invoiceDL: Record<string, boolean> = {};
  let reportDL: Record<string, boolean> = {};

  function toggleExpand(orderId: string) {
    expandedOrderId = expandedOrderId === orderId ? null : orderId;
  }

  function statusToClass(s: OrderDTO["order_status"]) {
    if (s === "Delivered") return "deliver";
    if (s === "Shipped") return "shipping";
    if (s === "Processing") return "processing";
    return "";
  }
  function isPaid(s: OrderDTO["order_status"]) {
    return s === "Processing" || s === "Shipped" || s === "Delivered";
  }
  function formatDate(d: string) {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  }

  async function fetchOrders() {
    loading = true;
    loadError = null;

    const currentUser = get(user);
    if (!currentUser?.access_token) {
      loadError = "Please log in to view your orders.";
      orders = [];
      loading = false;
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders-view/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentUser.access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });
      if (!res.ok) throw new Error(`Failed to load orders (${res.status})`);
      orders = await res.json();
    } catch (e: any) {
      loadError = e?.message ?? "Failed to load orders";
      orders = [];
    } finally {
      loading = false;
    }
  }

  onMount(fetchOrders);

  function getFilteredOrders() {
    const rows = orders.map((o) => {
      const title = o.items?.[0]?.test_name ?? `Order ${o.order_id}`;
      return {
        id: o.order_id,
        title,
        customer: o.user_name || "You",
        date: formatDate(o.created_at),
        payment: isPaid(o.order_status) ? "Paid" : "Unpaid",
        price: o.total_amount ? `₹${o.total_amount}` : "₹0.00",
        stock: `${o.items?.reduce((a, it) => a + (it.quantity || 0), 0)}/${o.items?.length || 0}`,
        status:
          o.order_status === "Delivered"
            ? "Deliver"
            : o.order_status === "Shipped"
            ? "Shipping"
            : o.order_status,
        statusClass: statusToClass(o.order_status)
      };
    });

    let filtered = rows;

    if (activeTab === "shipping") filtered = filtered.filter((r) => r.statusClass === "shipping");
    else if (activeTab === "completed") filtered = filtered.filter((r) => r.statusClass === "deliver");
    else if (activeTab === "drafts") return [];
    else if (activeTab === "canceled") filtered = filtered.filter((r) => r.status.toLowerCase().includes("cancel"));

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) => r.title.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
      );
    }

    if (paymentFilter !== "all") filtered = filtered.filter((r) => r.payment === paymentFilter);

    if (statusFilter !== "all") {
      if (statusFilter === "Deliver") filtered = filtered.filter((r) => r.statusClass === "deliver");
      else if (statusFilter === "Shipping") filtered = filtered.filter((r) => r.statusClass === "shipping");
      else if (statusFilter === "Processing") filtered = filtered.filter((r) => r.statusClass === "processing");
    }

    return filtered;
  }

  async function downloadBlob(url: string, filename: string) {
    const currentUser = get(user);
    if (!currentUser?.access_token) throw new Error('Not authenticated');

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${currentUser.access_token}` }
    });
    if (!res.ok) throw new Error(`Download failed (${res.status})`);

    const blob = await res.blob();
    const dlUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(dlUrl);
  }

  async function downloadInvoice(orderId: string) {
    invoiceDL = { ...invoiceDL, [orderId]: true };
    try {
      await downloadBlob(`${API_URL}/orders/${orderId}/invoice/`, `invoice-${orderId}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to download invoice.');
    } finally {
      invoiceDL = { ...invoiceDL, [orderId]: false };
    }
  }

  async function downloadReport(orderId: string) {
    reportDL = { ...reportDL, [orderId]: true };
    try {
      await downloadBlob(`${API_URL}/orders/${orderId}/report/`, `report-${orderId}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to download report.');
    } finally {
      reportDL = { ...reportDL, [orderId]: false };
    }
  }
</script>

<div class="w-full sm:pt-8">
  <header class="mb-6 rounded-[14px] bg-[#0c017b] p-4 sm:p-5 md:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start gap-6">
    <div class="order-header__left max-w-[980px]">
      <h1 class="m-0 text-[1.5rem] font-bold text-white inline-flex items-center gap-2">
        Order Details
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

      <div class="mt-5 mb-3 flex items-center gap-4">
        <h2 class="m-0 text-[1.2rem] font-semibold text-white">Orders</h2>
        <button
          type="button"
          class="bg-white shadow-md px-3 py-2 rounded-lg text-[0.85rem] cursor-pointer text-[#374151] hover:bg-[#f9fafb] hover:border-[#d1d5db] transition"
        >
          Jan 1 - Jan 30, 2024 ▾
        </button>
      </div>

      <div class="grid gap-4 mb-5 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        <div class="bg-white rounded-[10px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex flex-col gap-1 min-h-[108px]">
          <div class="text-[0.75rem] font-semibold tracking-[0.5px] uppercase text-[#6b7280]">Total Orders</div>
            <div class="text-[1.5rem] font-semibold text-[#111827] leading-[1.1]">21 -</div>
          <div class="up text-[0.7rem] font-medium inline-flex items-center gap-1 tracking-[0.3px] text-[#059669]">▲ 25.2% last week</div>
        </div>
        <div class="bg-white rounded-[10px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex flex-col gap-1 min-h-[108px]">
          <div class="text-[0.75rem] font-semibold tracking-[0.5px] uppercase text-[#6b7280]">Order items over time</div>
          <div class="text-[1.5rem] font-semibold text-[#111827] leading-[1.1]">15 -</div>
          <div class="up text-[0.7rem] font-medium inline-flex items-center gap-1 tracking-[0.3px] text-[#059669]">▲ 18.2% last week</div>
        </div>
        <div class="bg-white rounded-[10px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex flex-col gap-1 min-h-[108px]">
          <div class="text-[0.75rem] font-semibold tracking-[0.5px] uppercase text-[#6b7280]">Returns Orders</div>
          <div class="text-[1.5rem] font-semibold text-[#111827] leading-[1.1]">0 -</div>
          <div class="down text-[0.7rem] font-medium inline-flex items-center gap-1 tracking-[0.3px] text-[#dc2626]">▼ 1.2% last week</div>
        </div>
        <div class="bg-white rounded-[10px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex flex-col gap-1 min-h-[108px]">
          <div class="text-[0.75rem] font-semibold tracking-[0.5px] uppercase text-[#6b7280]">Fulfilled orders over time</div>
          <div class="text-[1.5rem] font-semibold text-[#111827] leading-[1.1]">12 -</div>
          <div class="up text-[0.7rem] font-medium inline-flex items-center gap-1 tracking-[0.3px] text-[#059669]">▲ 12.2% last week</div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 flex-nowrap self-start">
      <button class="btn-md outline bg-white text-[#111827] border border-[#e5e7eb] px-3 py-2 rounded-lg text-[0.98rem] font-medium hover:bg-[#f9fafb] hover:border-[#d1d5db] transition">
        Open Documentation
      </button>
      <button class="bg-[#4f46e5] text-white border border-[#4f46e5] px-3 py-2 rounded-lg text-[0.98rem] font-medium shadow-sm hover:bg-[#4338ca] hover:border-[#4338ca] transition">
        Setup Details
      </button>
      <button
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb] hover:border-[#d1d5db] hover:text-[#374151] transition"
        type="button"
        aria-label="More actions"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
    </div>
  </header>

  <section class=" bg-white rounded-[14px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]">
    <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
      <div class="flex gap-2 flex-wrap">
        {#each tabs as tab}
          <button
            class="font-semibold px-4 py-2 rounded-md cursor-pointer transition text-[#7b7b93] bg-transparent hover:bg-white hover:shadow-sm hover:text-[#4f46e5] {activeTab === tab.key ? 'bg-white text-[#4f46e5] shadow-[0_1px_4px_rgba(79,70,229,0.15)]' : ''}"
            on:click={() => (activeTab = tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        {/each}
      </div>
      <div class="actions flex">
        <button class="bg-white border border-[#e5e7eb] text-[#4f46e5] font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-[#f9fafb] transition">
          Export CSV
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2 mb-4 flex-wrap">
      <div class="search-box">
        <input
          type="text"
          placeholder="Search..."
          bind:value={search}
          class="border border-[#e5e7eb] rounded-md px-3 py-2 text-[1rem] focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <select
        class="border border-[#e5e7eb] rounded-md px-3 py-2 text-[1rem] focus:outline-none focus:ring-2 focus:ring-indigo-200"
        bind:value={paymentFilter}
      >
        <option value="all">All Payments</option>
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
      </select>
      <select
        class="border border-[#e5e7eb] rounded-md px-3 py-2 text-[1rem] focus:outline-none focus:ring-2 focus:ring-indigo-200"
        bind:value={statusFilter}
      >
        <option value="all">All Status</option>
        <option value="Processing">Processing</option>
        <option value="Deliver">Deliver</option>
        <option value="Shipping">Shipping</option>
      </select>
    </div>

    <div class="bg-white rounded-[10px] overflow-x-auto">
      {#if loading}
        <div class="loading p-4" role="status" aria-live="polite">Loading orders…</div>
      {:else if loadError}
        <div class="error p-4 text-[#b91c1c]" role="alert">{loadError}</div>
      {:else}
        <table class="w-full border-collapse text-[1rem] min-w-[700px]">
          <thead>
            <tr class="text-left">
              <th class="py-4 px-4 font-semibold text-[#7b7b93]">Order</th>
              <th class="py-4 px-4 font-semibold text-[#7b7b93]">Customer</th>
              <th class="py-4 px-4 font-semibold text-[#7b7b93]">Date</th>
              <th class="py-4 px-4 font-semibold text-[#7b7b93]">Payment</th>
              <th class="py-4 px-4 font-semibold text-[#7b7b93]">Price</th>
              <th class="py-4 px-4 font-semibold text-[#7b7b93]">Stock</th>
              <th class="py-4 px-4 font-semibold text-[#7b7b93]">Status</th>
              <th class="py-4 px-4 font-semibold text-[#7b7b93] text-center w-[1%] whitespace-nowrap">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {#each getFilteredOrders() as row}
              <tr
                class="cursor-pointer transition hover:bg-[#f9fafb] {expandedOrderId === row.id ? 'bg-[#f9fafb]' : ''}"
                on:click={() => toggleExpand(row.id)}
              >
                <td data-label="Order" class="py-4 px-4 border-b border-[#f3f4f6]">
                  <div class="font-semibold text-[1.05em]">{row.title}</div>
                  <div class="text-[0.95em] text-[#9ca3af]">#{row.id}</div>
                </td>
                <td data-label="Customer" class="py-4 px-4 border-b border-[#f3f4f6]">{row.customer}</td>
                <td data-label="Date" class="py-4 px-4 border-b border-[#f3f4f6]">{row.date}</td>
                <td data-label="Payment" class="py-4 px-4 border-b border-[#f3f4f6]">
                  <span class="{row.payment === 'Paid' ? 'text-[#22c55e] font-semibold' : 'text-[#e11d48] font-semibold'}">
                    {row.payment}
                  </span>
                </td>
                <td data-label="Price" class="py-4 px-4 border-b border-[#f3f4f6]">{row.price}</td>
                <td data-label="Stock" class="py-4 px-4 border-b border-[#f3f4f6]">{row.stock}</td>
                <td data-label="Status" class="py-4 px-4 border-b border-[#f3f4f6]">
                  <span
                    class="rounded-md font-semibold text-[0.95em] px-3 py-[0.3em] {row.statusClass === 'processing' ? 'bg-[#fff7e6] text-[#eab308]' : row.statusClass === 'deliver' ? 'bg-[#e6f9ec] text-[#22c55e]' : row.statusClass === 'shipping' ? 'bg-[#e0e7ff] text-[#4f46e5]' : ''}"
                  >{row.status}</span>
                </td>
                <td data-label="Invoice" class="py-4 px-4 border-b border-[#f3f4f6] text-center w-[1%] whitespace-nowrap">
                  <div class="flex justify-center">
                    <button
                      class="outline min-w-[170px] text-[0.95rem] px-3 py-2 rounded-md cursor-pointer transition border border-[#e5e7eb] bg-white text-[#4f46e5] hover:border-[#c7d2fe] hover:bg-[#eef2ff] disabled:opacity-60 disabled:cursor-not-allowed"
                      type="button"
                      on:click|stopPropagation={() => downloadInvoice(row.id)}
                      disabled={!!invoiceDL[row.id]}
                      aria-label={`Download invoice for order ${row.id}`}
                    >
                      {invoiceDL[row.id] ? 'Downloading…' : 'Download Invoice'}
                    </button>
                  </div>
                </td>
              </tr>
              {#if expandedOrderId === row.id}
                <tr>
                  <td colspan="8" class="bg-[#f8f9fb] p-0">
                    <div class="p-4 text-[1rem]" in:slide={{ duration: 180 }} out:fade={{ duration: 100 }}>
                      <div class="grid gap-x-4 gap-y-2 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
                        <div><span class="text-[#7b7b93] font-semibold mr-2 text-[0.95em]">Order ID:</span><span>#{row.id}</span></div>
                        <div><span class="text-[#7b7b93] font-semibold mr-2 text-[0.95em]">Customer:</span><span>{row.customer}</span></div>
                        <div><span class="text-[#7b7b93] font-semibold mr-2 text-[0.95em]">Date:</span><span>{row.date}</span></div>
                        <div><span class="text-[#7b7b93] font-semibold mr-2 text-[0.95em]">Payment:</span><span>{row.payment}</span></div>
                        <div><span class="text-[#7b7b93] font-semibold mr-2 text-[0.95em]">Price:</span><span>{row.price}</span></div>
                        <div><span class="text-[#7b7b93] font-semibold mr-2 text-[0.95em]">Status:</span><span>{row.status}</span></div>
                      </div>

                      {#if row.statusClass === 'deliver'}
                        <div class="mt-3 flex gap-2">
                          <button
                            class="primary text-[0.95rem] px-3 py-2 rounded-md cursor-pointer transition bg-[#4f46e5] text-white border border-[#4f46e5] hover:bg-[#4338ca] hover:border-[#4338ca] disabled:opacity-60 disabled:cursor-not-allowed"
                            type="button"
                            on:click={() => downloadReport(row.id)}
                            disabled={!!reportDL[row.id]}
                            aria-label={`Download report for order ${row.id}`}
                          >
                            {reportDL[row.id] ? 'Downloading…' : 'Download Report'}
                          </button>
                        </div>
                      {/if}
                    </div>
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
  </section>
</div>