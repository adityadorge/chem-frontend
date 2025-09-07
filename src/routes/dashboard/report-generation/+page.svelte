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

  // Tab logic: Only All Orders, Canceled, Completed
  const tabs = [
    { label: "All Orders", key: "all" },
    { label: "Canceled", key: "canceled" },
    { label: "Completed", key: "completed" }
  ];
  let activeTab = "all";

  // Filter orders by tab (no drafts/shipping)
  function getFilteredOrders() {
    let filtered = orders;
    if (activeTab === "completed") filtered = filtered.filter(o => o.statusClass === "deliver");
    else if (activeTab === "canceled") return []; // Replace with your canceled logic if needed
    return filtered;
  }

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

  let expandedOrderId: string | null = null;
  let search = "";
</script>

<div class="order-container">
  <!-- Header -->
  <div class="order-header">
    <div>
      <h3>Report</h3>
      <small>Report Created: {order.created} at {order.time}</small>
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
    </div>
    <div class="transactions-table-wrapper">
      <table class="transactions-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Report</th>
          </tr>
        </thead>
        <tbody>
          {#each getFilteredOrders() as row}
            <tr class="order-row" on:click={() => toggleExpand(row.id)} class:expanded={expandedOrderId === row.id}>
              <td><input type="checkbox" /></td>
              <td>
                <div class="order-title">{row.title}</div>
                <div class="order-id">#{row.id}</div>
              </td>
              <td>{row.customer}</td>
              <td>{row.date}</td>
              <td>
                <span class="status-badge {row.statusClass}">
                  {row.status}
                </span>
              </td>
              <td>
                <div class="order-actions">
                  <button class="view-btn" on:click|stopPropagation={() => alert('View ' + row.id)}>View</button>
                  <button class="download-btn" on:click|stopPropagation={() => alert('Download ' + row.id)}>Download</button>
                </div>
              </td>
            </tr>
            {#if expandedOrderId === row.id}
              <tr class="order-expand-row">
                <td colspan="6" style="padding:0; border: none;">
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


/* Responsive for mobile */
@media (max-width: 900px) {
  .order-container {
    grid-template-columns: 1fr;
  }
  .order-header {
    grid-column: span 1;
  }
}

*,
*:after,
*:before {
  box-sizing: border-box;
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

@media (max-width: 700px) {
  .expand-simple {
    padding: 0.8em 0.7em;
  }
  .expand-row-grid {
    grid-template-columns: 1fr;
    gap: 0.5em 0;
  }
}

.order-actions {
  display: flex;
  gap: 0.5em;
}
.view-btn, .download-btn {
  border: none;
  border-radius: 8px;
  padding: 0.4em 1em;
  font-weight: 600;
  font-size: 0.97em;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
}
.view-btn {
  background: #4f46e5;
  color: #fff;
}
.view-btn:hover {
  background: #3730a3;
}
.download-btn {
  background: #f3f4f6;
  color: #4f46e5;
}
.download-btn:hover {
  background: #e0e7ff;
}

.status-badge {
  display: inline-block;
  padding: 0.3em 1em;
  border-radius: 12px;
  font-size: 0.95em;
  font-weight: 600;
  text-transform: capitalize;
  background: #f3f4f6;
  color: #7b7b93;
  border: 1px solid #e5e7eb;
}
.status-badge.processing,
.status-badge.pending {
  background: #fff7ed;
  color: #f59e42;
  border-color: #fde68a;
}
.status-badge.deliver {
  background: #e0f2fe;
  color: #0284c7;
  border-color: #bae6fd;
}
.status-badge.shipping {
  background: #ede9fe;
  color: #7c3aed;
  border-color: #c7d2fe;
}

</style>