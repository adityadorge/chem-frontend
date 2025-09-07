<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  let showDropdown = false;

  let order = {
    number: "#256894",
    created: "Sun, May 7, 2022",
    time: "06:24 AM",
    customer: {
      name: "Jonathon Smith",
      email: "customer1@domain.com",
      phone: "+1 215 54756322",
    },
    address: {
      line: "14 Anglesey Road",
      building: "James Court",
      street: "Anglesey Road",
      postcode: "En34hy",
    },
    items: [
      {
        name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        qty: 1,
        price: 109.95,
        image: "https://via.placeholder.com/60",
      },
      {
        name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        qty: 1,
        price: 109.95,
        image: "https://via.placeholder.com/60",
      },
      {
        name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        qty: 1,
        price: 109.95,
        image: "https://via.placeholder.com/60",
      },
    ],
    history: [
      { status: "Delivered", date: "24 May 2022" },
      { status: "Shipped", date: "24 May 2022" },
      { status: "Dispatched from warehouse", date: "26 May 2022" },
      { status: "Pickup being Prepared", date: "26 May 2022" },
    ],
    summary: {
      subtotal: 375,
      discount: 5,
      deliveryFee: 0,
      platformFee: 5,
      cardCharge: 4.5,
    },
    payment: {
      type: "Card",
      last4: "65482",
    },
  };

  function markAs(status: string) {
    alert(`Order marked as ${status}`);
    showDropdown = false;
  }

  // Tab logic
  const tabs = [
    { label: "All Orders", key: "all" },
    { label: "Drafts", key: "drafts" },
    { label: "Canceled", key: "canceled" },
    { label: "Shipping", key: "shipping" },
    { label: "Completed", key: "completed" }
  ];
  let activeTab = "all";

  // Example: Filter orders by tab (replace with your real filter logic)
  function getFilteredOrders() {
    let filtered = orders;

    // Tab filter
    if (activeTab === "shipping") filtered = filtered.filter(o => o.statusClass === "shipping");
    else if (activeTab === "completed") filtered = filtered.filter(o => o.statusClass === "deliver");
    else if (activeTab === "drafts" || activeTab === "canceled") return [];

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(
        o =>
          o.title.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.toLowerCase().includes(search.toLowerCase()) ||
          o.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(o => o.payment === paymentFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    return filtered;
  }

  // Your orders array (move your order objects here)
  const orders = [
    {
      id: "ID247190",
      title: "Burberry - Leather Jack",
      customer: "Estiaq Noor",
      date: "July 14, 2024, 12:20 PM",
      payment: "Paid",
      price: "$644.00",
      stock: "44/100",
      status: "Processing",
      statusClass: "processing"
    },
    {
      id: "ID247131",
      title: "Jacquemus - Nimes Denim",
      customer: "Ahmed Baky",
      date: "July 14, 2024, 12:34 PM",
      payment: "Paid",
      price: "$644.00",
      stock: "164/200",
      status: "Deliver",
      statusClass: "deliver"
    },
    {
      id: "ID247120",
      title: "Max Mara - Pacos Jacket",
      customer: "Rezaul Karim",
      date: "July 14, 2024, 01:10 PM",
      payment: "Unpaid",
      price: "$644.00",
      stock: "18/200",
      status: "Shipping",
      statusClass: "shipping"
    },
    {
      id: "ID247821",
      title: "Balmain - Denim Jacket",
      customer: "Mushfuq",
      date: "July 14, 2024, 02:40 PM",
      payment: "Unpaid",
      price: "$644.00",
      stock: "64/100",
      status: "Deliver",
      statusClass: "deliver"
    },
    {
      id: "ID247205",
      title: "Burberry - breasted blazer",
      customer: "Rahul Kabir",
      date: "July 14, 2024, 02:44 PM",
      payment: "Paid",
      price: "$644.00",
      stock: "97/100",
      status: "Shipping",
      statusClass: "shipping"
    },
    {
      id: "ID247631",
      title: "Balmain - Crepe blazer",
      customer: "Irtiza Tasin",
      date: "July 14, 2024, 03:24 PM",
      payment: "Paid",
      price: "$644.00",
      stock: "52/100",
      status: "Deliver",
      statusClass: "deliver"
    },
    {
      id: "ID247930",
      title: "Gucchi - Horsebit",
      customer: "Mufidul Islam",
      date: "July 14, 2024, 04:00 PM",
      payment: "Paid",
      price: "$644.00",
      stock: "4/100",
      status: "Deliver",
      statusClass: "deliver"
    },
    {
      id: "ID247930",
      title: "Gucchi - Horsebit",
      customer: "Mufidul Islam",
      date: "July 14, 2024, 04:00 PM",
      payment: "Paid",
      price: "$644.00",
      stock: "4/100",
      status: "Deliver",
      statusClass: "deliver"
    },
  ];

  function toggleExpand(orderId: string) {
    expandedOrderId = expandedOrderId === orderId ? null : orderId;
  }

  // Track which order row is expanded (by order id)
  let expandedOrderId: string | null = null;

  let search = "";
  let paymentFilter = "all";
  let statusFilter = "all";
</script>

<div class="order-container">
  <!-- Header -->
  <div class="order-header">
    <div>
      <h3>Order Number</h3>
      <small>Order Created: {order.created} at {order.time}</small>
    </div>
    <div class="action-menu">
      <button on:click={() => (showDropdown = !showDropdown)}>⋮</button>
      {#if showDropdown}
        <div class="dropdown">
          <div on:click={() => markAs("Picked")}>Mark As Picked</div>
          <div on:click={() => markAs("Shipped")}>Mark As Shipped</div>
          <div on:click={() => markAs("Delivered")}>Mark As Delivered</div>
          <div on:click={() => markAs("Cancelled")}>Cancel Order</div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Full-width Order Summary (Transactions Table) -->
  <section class="transactions-section full-width">
    <div class="transactions-header">
      <div class="tabs">
        {#each tabs as tab}
          <button
            class="tab {activeTab === tab.key ? 'active' : ''}"
            on:click={() => activeTab = tab.key}
            type="button"
          >
            {tab.label}
          </button>
        {/each}
      </div>
      <div class="actions">
        <button class="export-btn">Export as CSV</button>
        <button class="add-btn">+ Add Customers</button>
      </div>
    </div>
    <div class="transactions-filters">
      <div class="search-box">
        <input
          type="text"
          placeholder="Search..."
          bind:value={search}
        />
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
      <div class="date-range">
        12 July 24 - 20 July 24
      </div>
    </div>
    <div class="transactions-table-wrapper">
      <table class="transactions-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {#each getFilteredOrders() as row}
            <tr
              class="order-row card-row"
              on:click={() => toggleExpand(row.id)}
              class:expanded={expandedOrderId === row.id}
            >
              <td><input type="checkbox" /></td>
              <td>
                <div class="order-title">{row.title}</div>
                <div class="order-id">#{row.id}</div>
              </td>
              <td>{row.customer}</td>
              <td>{row.date}</td>
              <td>
                <span class={row.payment === "Paid" ? "paid" : "unpaid"}>{row.payment}</span>
              </td>
              <td>{row.price}</td>
              <td>{row.stock}</td>
              <td>
                <span class={"status " + row.statusClass}>{row.status}</span>
              </td>
            </tr>
            {#if expandedOrderId === row.id}
              <tr class="order-expand-row">
                <td colspan="8" style="padding:0; border: none;">
                  <div class="expand-simple" in:slide={{ duration: 180 }} out:fade={{ duration: 100 }}>
                    <div class="expand-row-grid">
                      <div>
                        <span class="expand-label">Order ID:</span>
                        <span>#{row.id}</span>
                      </div>
                      <div>
                        <span class="expand-label">Customer:</span>
                        <span>{row.customer}</span>
                      </div>
                      <div>
                        <span class="expand-label">Date:</span>
                        <span>{row.date}</span>
                      </div>
                      <div>
                        <span class="expand-label">Payment:</span>
                        <span>{row.payment}</span>
                      </div>
                      <div>
                        <span class="expand-label">Price:</span>
                        <span>{row.price}</span>
                      </div>
                      <div>
                        <span class="expand-label">Stock:</span>
                        <span>{row.stock}</span>
                      </div>
                      <div>
                        <span class="expand-label">Status:</span>
                        <span>{row.status}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button class="page-btn">&lt;</button>
      <button class="page-btn">1</button>
      <button class="page-btn active">2</button>
      <button class="page-btn">3</button>
      <button class="page-btn">4</button>
      <button class="page-btn">5</button>
      <span class="dots">...</span>
      <button class="page-btn">24</button>
      <button class="page-btn">&gt;</button>
    </div>
  </section>
</div>

<style>
.order-container {
  display: block;
  font-family: sans-serif;
  align-items: start;
  width: 100%;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.transactions-section.full-width {
  width: 100%;
  max-width: 100%;
  grid-column: span 2;
}

@media (max-width: 900px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .transactions-section.full-width {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

.section {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 1rem;
}

.timeline {
  list-style: none;
  padding-left: 1rem;
  border-left: 2px solid #ccc;
}

.timeline li {
  margin-bottom: 1rem;
  position: relative;
}

.timeline li::before {
  content: "";
  position: absolute;
  left: -9px;
  top: 0;
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.action-menu {
  position: relative;
}

.dropdown {
  position: absolute;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dropdown div {
  padding: 0.4rem 1rem;
  cursor: pointer;
}

.dropdown div:hover {
  background: #f0f0f0;
}

.item-summary {
  min-height: 700px;
}

/* Responsive for mobile */
@media (max-width: 900px) {
  .order-container {
    grid-template-columns: 1fr;
  }
  .order-header {
    grid-column: span 1;
  }
  .item-summary,
  .right-sections {
    grid-column: span 1 !important;
  }
}

*,
*:after,
*:before {
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  line-height: 1.5;
  min-height: 100vh;
  padding: 5rem 0;
  font-size: clamp(1rem, 2.5vw, 1.125rem);
}

section {
  width: 100%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  & + section {
    margin-top: 2.5em;
  }
}

h1 {
  font-weight: 700;
  line-height: 1.125;
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
}

h2 {
  margin-top: 0.25em;
  color: #999;
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
  & + * {
    margin-top: 1.5em;
  }
}

summary {
  background-color: #fff;
  position: relative;
  cursor: pointer;
  padding: 1em 0.5em;
  list-style: none;
  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    background-color: #f2f5f9;
  }

  div {
    display: flex;
    align-items: center;
  }

  h3 {
    display: flex;
    flex-direction: column;
  }

  small {
    color: #999;
    font-size: 0.60em;
  }

  strong {
    font-weight: 700;
  }

  span:first-child {
    width: 4rem;
    height: 4rem;
    border-radius: 10px;
    background-color: #f3e1e1;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin-right: 1.25em;
    svg {
      width: 2.25rem;
      height: 2.25rem;
    }
  }

  span:last-child {
    font-weight: 700;
    margin-left: auto;
  }

  &:focus {
    outline: none;
  }

  .plus {
    color: #289672;
  }
}

details {
  border-bottom: 1px solid #b5bfd9;
  &[open] {
    box-shadow: -3px 0 0 #b5bfd9;
  }

  &:first-of-type {
    border-top: 1px solid #b5bfd9;
  }
  & > div {
    padding: 2em 2em 0;
    font-size: 0.875em;
  }
}

dl {
  display: flex;
  flex-wrap: wrap;
  dt {
    font-weight: 700;
  }
  div {
    margin-right: 4em;
    margin-bottom: 2em;
  }
}

.qty-badge {
  background: #eee;
  color: #333;
  font-size: 0.75em;
  border-radius: 6px;
  padding: 0.2em 0.7em;
  margin-left: 5em;
  margin-right: 1em;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge {
  font-size: 0.75em;
  border-radius: 6px;
  padding: 0.2em 0.7em;
  font-weight: 600;
  margin-right: 1em;
  margin-left: 10em; 
  white-space: nowrap;
  background: #eee;
  color: #333;
  border: 1px solid #ccc;
}
.status-badge.delivered {
  background: #e6f9ec;
  color: #289672;
  border-color: #b6e7c9;
}
.status-badge.pending {
  background: #fff4e5;
  color: #b26a00;
  border-color: #ffd699;
}

.transactions-section {
  background: #f8f9fb;
  border-radius: 14px;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  margin-bottom: 2rem;
}
.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}
.tabs {
  display: flex;
  gap: 1rem;
}
.tab {
  background: none;
  border: none;
  font-weight: 600;
  color: #7b7b93;
  padding: 0.5em 1.2em;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.tab.active {
  background: #fff;
  color: #4f46e5;
  box-shadow: 0 1px 4px 0 rgba(79,70,229,0.08);
}
.actions {
  display: flex;
  gap: 0.7rem;
}
.export-btn {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #4f46e5;
  font-weight: 500;
  border-radius: 8px;
  padding: 0.5em 1.2em;
  cursor: pointer;
  transition: background 0.15s, border 0.15s;
}
.export-btn:hover {
  background: #f3f4f6;
}
.add-btn {
  background: #7c3aed;
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.5em 1.2em;
  cursor: pointer;
  transition: background 0.15s;
}
.add-btn:hover {
  background: #5b21b6;
}
.transactions-filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}
.search-box input {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5em 1em;
  font-size: 1em;
  background: #fff;
  outline: none;
  transition: border 0.15s;
}
.search-box input:focus {
  border-color: #4f46e5;
}
.filter-btn {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #7b7b93;
  border-radius: 8px;
  padding: 0.5em 1.2em;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s, border 0.15s;
}
.filter-btn:hover {
  background: #f3f4f6;
  border-color: #4f46e5;
}
.date-range {
  background: #f3f4f6;
  color: #7b7b93;
  border-radius: 8px;
  padding: 0.5em 1.2em;
  font-size: 1em;
}
.transactions-table-wrapper {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.03);
  overflow-x: auto;
}
.transactions-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 1em;
  min-width: 900px;
}
.transactions-table th, .transactions-table td {
  padding: 1em 0.8em;
  text-align: left;
  background: #fff;
}
.transactions-table th {
  color: #7b7b93;
  font-weight: 600;
  font-size: 0.98em;
  border-bottom: 2px solid #f3f4f6;
}
.transactions-table td {
  color: #22223b;
  font-weight: 500;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}
.transactions-table tr:last-child td {
  border-bottom: none;
}
.transactions-table input[type="checkbox"] {
  accent-color: #4f46e5;
  width: 1.1em;
  height: 1.1em;
  margin: 0;
}
.order-title {
  font-weight: 600;
  color: #22223b;
}
.order-id {
  color: #b5b5c3;
  font-size: 0.92em;
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
  display: inline-block;
  padding: 0.3em 1.1em;
  border-radius: 8px;
  font-size: 0.98em;
  font-weight: 600;
  background: #f3f4f6;
  color: #7b7b93;
  border: none;
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
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.3em;
  margin-top: 1.2rem;
}
.page-btn {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #7b7b93;
  border-radius: 6px;
  padding: 0.4em 0.9em;
  font-size: 0.9em;
  cursor: pointer;
  transition: background 0.15s, border 0.15s;
}
.page-btn:hover {
  background: #f3f4f6;
}
.dots {
  color: #7b7b93;
  font-weight: 500;
}

.order-row {
  cursor: pointer;
  transition: background 0.13s;
}
.order-row:hover, .order-row.expanded {
  background: #f3f4f6;
}
.order-expand-row td {
  background: #f8f9fb;
  border-bottom: 1px solid #e5e7eb;
  padding: 0;
}

.expand-simple {
  padding: 1.1em 2em 1.1em 2em;
  font-size: 0.98em;
  color: #333;
  border-top: 1px solid #e5e7eb;
  background: #f8f9fb;
  animation: fadeIn 0.2s;
}

.expand-row-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.7em 2em;
}

.expand-label {
  color: #7b7b93;
  font-weight: 600;
  margin-right: 0.5em;
  min-width: 90px;
  display: inline-block;
}

.card-row {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.18s, border 0.18s, background 0.13s;
  overflow: hidden;
}
.card-row:hover,
.card-row.expanded {
  background: #f3f4f6;
  box-shadow: 0 4px 24px 0 rgba(79,70,229,0.10);
  border-color: #c7d2fe;
}
.card-row td {
  background: transparent;
  /* Remove default table cell background */
}
.order-row:not(.card-row) td {
  background: #fff;
}

/* Optional: add spacing between card rows */
.card-row + .card-row,
.card-row + .order-expand-row {
  border-top: 16px solid #f8f9fb;
}

/* ...keep your other styles... */
</style>
