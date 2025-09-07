<script lang="ts">
  import { page } from "$app/stores";

  type LineItem = {
    id: number;
    name: string;
    sublink?: { label: string; href?: string };
    listPrice: number;
    qty: number;
  };

  $: quoteId = $page.params.id;

  // Mock data to match the screenshot
  let title = "Atomic Spectroscopy – Supplier";
  let description =
    "Atomic spectroscopy is a set of analytical techniques that study the interaction of electromagnetic radiation with atoms to determine the elemental composition of a sample";

  let items: LineItem[] = [
    {
      id: 1,
      name: "Animal Models and Studies",
      sublink: { label: "Animal costs", href: "#" },
      listPrice: 57500,
      qty: 1
    },
    {
      id: 2,
      name: "Animal Models and Studies",
      sublink: { label: "Study Duration", href: "#" },
      listPrice: 172500,
      qty: 1
    },
    {
      id: 3,
      name: "Animal Models and Studies",
      sublink: { label: "Final Report", href: "#" },
      listPrice: 74750,
      qty: 1
    }
  ];

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  $: orderTotal = items.reduce((sum, it) => sum + it.listPrice * it.qty, 0);

  let activeTab: "collaborate" | "attachments" = "collaborate";

  function acceptQuote() {
    // hook up to API as needed
    alert("Quote accepted");
  }

  type Person = { name: string; org?: string; role?: string };
  const requester: Person = {
    name: "Avery Smith",
    org: "Gazelle Pharma - Cambridge",
    role: "Owner"
  };
  const supplierTeam: Person[] = [
    { name: "Brendan Harvey", role: "Project Manager at NovaSphere Labs" },
    { name: "Suzana Marusic", role: "President at NovaSphere Labs" },
    { name: "Kacey Caradonna", role: "Director of Product at NovaSphere Labs" }
  ];

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
</script>

<main class="page">
  <header class="header">
    <div class="header-left">
      <h1 class="title">{title}</h1>
      <p class="subtitle">{description}</p>
    </div>
    <div class="header-right">
      <button class="btn btn-gradient">Compare Related Requests</button>
    </div>
  </header>

  <section class="stats">
    <div class="stat">
      <div class="stat-label">Total</div>
      <div class="stat-value">{formatCurrency(orderTotal)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Turnaround Time</div>
      <div class="stat-value dim">—</div>
    </div>
    <div class="stat">
      <div class="stat-label">Quote Valid Until</div>
      <div class="stat-value dim">—</div>
    </div>
    <div class="stat">
      <div class="stat-label">Supplier Rating</div>
      <div class="stat-value rating">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#F5B301" aria-hidden="true">
          <path d="M12 .587l3.668 7.431L24 9.748l-6 5.85 1.416 8.264L12 19.771l-7.416 4.091L6 15.598 0 9.748l8.332-1.73z"/>
        </svg>
        <span>5.0</span>
        <span class="dim">(17)</span>
      </div>
    </div>
  </section>

  <section class="content">
    <div class="left">
      <div class="card">
        <div class="card-head">
          <h3>Quote details</h3>
          <button class="btn btn-primary" on:click={acceptQuote}>Accept</button>
        </div>

        <div class="table">
          <div class="thead">
            <div class="th name">Name</div>
            <div class="th price">List Price</div>
            <div class="th qty">Qty</div>
            <div class="th total">Total</div>
          </div>

          {#each items as it}
            <div class="trow">
              <div class="td name">
                <div class="name-wrap">
                  <div class="name-main">{it.name}</div>
                  {#if it.sublink}
                    <a class="sublink" href={it.sublink.href}>{it.sublink.label}</a>
                  {/if}
                </div>
              </div>
              <div class="td price">{formatCurrency(it.listPrice)}</div>
              <div class="td qty">{it.qty}</div>
              <div class="td total">{formatCurrency(it.listPrice * it.qty)}</div>
            </div>
          {/each}

          <div class="tfoot">
            <div class="tfoot-spacer"></div>
            <div class="tfoot-label">Order Total:</div>
            <div class="tfoot-value">{formatCurrency(orderTotal)}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="tabs">
          <button
            class:active={activeTab === "collaborate"}
            on:click={() => (activeTab = "collaborate")}
          >
            Collaborate
          </button>
          <button
            class:active={activeTab === "attachments"}
            on:click={() => (activeTab = "attachments")}
          >
            Attachments
          </button>
        </div>

        {#if activeTab === "collaborate"}
          <div class="tab-body">
            <input
              class="thread-input"
              placeholder="Start a thread with the supplier here..."
            />
          </div>
        {:else}
          <div class="tab-body dim">No attachments yet.</div>
        {/if}
      </div>
    </div>

    <aside class="right">
      <div class="card team">
        <div class="card-head">
          <h3>Requester Team</h3>
          <a class="link">Edit</a>
        </div>
        <div class="person">
          <div class="avatar" aria-hidden="true">{initials(requester.name)}</div>
          <div class="person-info">
            <div class="person-name">{requester.name}</div>
            <div class="person-org dim">{requester.org}</div>
            <div class="person-role dim">{requester.role}</div>
          </div>
        </div>
      </div>

      <div class="card team">
        <div class="card-head">
          <h3>Supplier Team</h3>
          <a class="link">Edit</a>
        </div>
        {#each supplierTeam as p}
          <div class="person">
            <div class="avatar" aria-hidden="true">{initials(p.name)}</div>
            <div class="person-info">
              <div class="person-name">{p.name}</div>
              <div class="person-role dim">{p.role}</div>
            </div>
          </div>
        {/each}
      </div>
    </aside>
  </section>
</main>

<style>
  :global(body) { background: #f7f8fb; }

  .page {
    max-width: 1200px;
    margin: 24px auto 56px;
    padding: 0 20px;
    color: #111827;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
  }

  /* Header */
  .header {
    display: flex;
    gap: 16px;
    align-items: start;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .title { font-size: 28px; font-weight: 700; margin: 0 0 6px; }
  .subtitle { color: #6b7280; max-width: 860px; margin: 0; }
  .btn { border: none; cursor: pointer; font-weight: 600; border-radius: 10px; }
  .btn-gradient {
    padding: 12px 16px;
    color: #fff;
    background: linear-gradient(90deg, #6757ff, #7b4dff);
    box-shadow: 0 8px 24px rgba(103, 87, 255, 0.35);
  }
  .btn-primary {
    padding: 10px 14px;
    background: #3b82f6;
    color: #fff;
  }
  .btn-primary:hover { background: #2966cf; }

  /* Stats */
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 18px;
  }
  .stat {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px 18px;
    box-shadow: 0 8px 24px rgba(17, 24, 39, 0.04);
  }
  .stat-label { color: #6b7280; font-size: 13px; margin-bottom: 6px; }
  .stat-value { font-weight: 700; font-size: 20px; display: flex; align-items: center; gap: 6px; }
  .rating span { display: inline-block; }
  .dim { color: #9ca3af; }

  /* Content layout */
  .content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 18px;
    align-items: start;
  }

  .card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(17, 24, 39, 0.05);
  }
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    border-bottom: 1px solid #eef0f3;
  }
  .card-head h3 { margin: 0; font-size: 16px; }

  /* Table */
  .table { width: 100%; }
  .thead, .trow {
    display: grid;
    grid-template-columns: 1fr 160px 80px 160px;
    gap: 12px;
    padding: 14px 18px;
    align-items: center;
  }
  .thead {
    color: #6b7280;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid #eef0f3;
  }
  .trow { border-bottom: 1px solid #f1f3f5; }
  .trow:last-of-type { border-bottom: none; }
  .name-wrap { display: flex; gap: 8px; align-items: baseline; }
  .name-main { font-weight: 600; }
  .sublink {
    color: #6366f1;
    text-decoration: none;
    font-size: 13px;
  }
  .sublink:hover { text-decoration: underline; }

  .tfoot {
    display: grid;
    grid-template-columns: 1fr 240px 160px;
    gap: 12px;
    padding: 14px 18px 18px;
    align-items: center;
    border-top: 1px solid #eef0f3;
  }
  .tfoot-spacer { grid-column: 1 / 2; }
  .tfoot-label {
    grid-column: 2 / 3;
    justify-self: end;
    font-weight: 700;
  }
  .tfoot-value {
    grid-column: 3 / 4;
    font-weight: 700;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 16px;
    padding: 10px 12px 0;
    border-bottom: 1px solid #eef0f3;
  }
  .tabs button {
    background: transparent;
    border: none;
    padding: 10px 2px;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    position: relative;
  }
  .tabs button.active {
    color: #111827;
  }
  .tabs button.active::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: -1px;
    height: 2px;
    background: #6757ff;
    border-radius: 2px 2px 0 0;
  }
  .tab-body { padding: 14px 18px 18px; }
  .thread-input {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px 14px;
    outline: none;
  }
  .thread-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }

  /* Right column: team */
  .team .person {
    display: flex;
    gap: 12px;
    padding: 14px 18px;
    border-top: 1px solid #f3f4f6;
    align-items: center;
  }
  .team .person:first-of-type { border-top: 1px solid #eef0f3; }
  .avatar {
    width: 40px; height: 40px;
    border-radius: 999px;
    display: grid; place-items: center;
    font-weight: 700; color: #fff;
    background: linear-gradient(135deg, #7b4dff, #6757ff);
  }
  .person-name { font-weight: 600; }
  .person-org, .person-role { font-size: 13px; }

  /* Responsive */
  @media (max-width: 1024px) {
    .stats { grid-template-columns: repeat(2, 1fr); }
    .content { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .thead, .trow { grid-template-columns: 1fr 120px 60px 120px; }
    .header { flex-direction: column; gap: 10px; }
    .header-right { align-self: flex-start; }
  }
</style>