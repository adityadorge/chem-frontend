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
</script>

<div class="order-page">
  <section class="transactions-section">
    <div class="transactions-header">
      <div class="tabs">
        {#each tabs as tab}
          <button
            class="tab {activeTab === tab.key ? 'active' : ''}"
            on:click={() => (activeTab = tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        {/each}
      </div>
      <div class="actions">
        <button class="export-btn">Export CSV</button>
      </div>
    </div>

    <div class="transactions-filters">
      <div class="search-box">
        <input type="text" placeholder="Search..." bind:value={search} />
      </div>
      <select class="filter-btn" bind:value={paymentFilter}>
        <option value="all">All Payments</option>
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
      </select>
      <select class="filter-btn" bind:value={statusFilter}>
        <option value="all">All Status</option>
        <option value="Processing">Processing</option>
        <option value="Deliver">Deliver</option>
        <option value="Shipping">Shipping</option>
      </select>
    </div>

    <div class="transactions-table-wrapper">
      {#if loading}
        <div class="loading">Loading orders…</div>
      {:else if loadError}
        <div class="error">{loadError}</div>
      {:else}
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {#each getFilteredOrders() as row}
              <tr
                class="order-row card-row"
                on:click={() => toggleExpand(row.id)}
                class:expanded={expandedOrderId === row.id}
              >
                <td>
                  <div class="order-title">{row.title}</div>
                  <div class="order-id">#{row.id}</div>
                </td>
                <td>{row.customer}</td>
                <td>{row.date}</td>
                <td><span class={row.payment === "Paid" ? "paid" : "unpaid"}>{row.payment}</span></td>
                <td>{row.price}</td>
                <td>{row.stock}</td>
                <td><span class={"status " + row.statusClass}>{row.status}</span></td>
              </tr>
              {#if expandedOrderId === row.id}
                <tr class="order-expand-row">
                  <td colspan="7">
                    <div class="expand-simple" in:slide={{ duration: 180 }} out:fade={{ duration: 100 }}>
                      <div class="expand-row-grid">
                        <div><span class="expand-label">Order ID:</span><span>#{row.id}</span></div>
                        <div><span class="expand-label">Customer:</span><span>{row.customer}</span></div>
                        <div><span class="expand-label">Date:</span><span>{row.date}</span></div>
                        <div><span class="expand-label">Payment:</span><span>{row.payment}</span></div>
                        <div><span class="expand-label">Price:</span><span>{row.price}</span></div>
                        <div><span class="expand-label">Status:</span><span>{row.status}</span></div>
                      </div>
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

<style>
.order-page {
  width: 100%;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

.transactions-section {
  background: #f8f9fb;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.tab {
  background: none;
  border: none;
  font-weight: 600;
  color: #7b7b93;
  padding: 0.4em 1em;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.tab.active {
  background: #fff;
  color: #4f46e5;
  box-shadow: 0 1px 4px rgba(79,70,229,0.15);
}

.actions {
  display: flex;
}
.export-btn {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #4f46e5;
  font-weight: 500;
  border-radius: 6px;
  padding: 0.4em 1em;
  cursor: pointer;
}

.transactions-filters {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.search-box input,
.filter-btn {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.4em 0.8em;
  font-size: 0.9em;
}

.transactions-table-wrapper {
  background: #fff;
  border-radius: 10px;
  overflow-x: auto;
}
.transactions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
  min-width: 700px;
}
.transactions-table th,
.transactions-table td {
  padding: 0.8em;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}
.transactions-table th {
  color: #7b7b93;
  font-weight: 600;
}
.order-title {
  font-weight: 600;
}
.order-id {
  font-size: 0.85em;
  color: #9ca3af;
}
.paid {
  color: #22c55e;
  font-weight: 600;
}
.unpaid {
  color: #e11d48;
  font-weight: 600;
}
.status {
  padding: 0.2em 0.8em;
  border-radius: 6px;
  font-size: 0.85em;
  font-weight: 600;
}
.status.processing {
  background: #fff7e6;
  color: #eab308;
}
.status.deliver {
  background: #e6f9ec;
  color: #22c55e;
}
.status.shipping {
  background: #e0e7ff;
  color: #4f46e5;
}

.order-row {
  cursor: pointer;
  transition: background 0.13s;
}
.order-row:hover,
.order-row.expanded {
  background: #f9fafb;
}
.order-expand-row td {
  background: #f8f9fb;
}

.expand-simple {
  padding: 1em;
}
.expand-row-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.5em 1em;
}
.expand-label {
  color: #7b7b93;
  font-weight: 600;
  margin-right: 0.5em;
}

.loading,
.error {
  padding: 1rem;
}
.error {
  color: #b91c1c;
}

/* Responsive */
@media (max-width: 768px) {
  .transactions-section {
    padding: 1rem;
  }
  .transactions-table {
    font-size: 0.85em;
  }
  .tabs {
    gap: 0.3rem;
  }
}
</style>
