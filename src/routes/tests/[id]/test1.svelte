<script lang="ts">
  // Demo data — replace with real data from your load function or API
  const title = "Atomic Spectroscopy – Supplier";
  const description =
    "Atomic spectroscopy is a set of analytical techniques that study the interaction of electromagnetic radiation with atoms to determine the elemental composition of a sample";

  const items = [
    { name: "Animal Models and Studies", detail: "Animal costs", listPrice: 57500, qty: 1 },
    { name: "Animal Models and Studies", detail: "Study Duration", listPrice: 172500, qty: 1 },
    { name: "Animal Models and Studies", detail: "Final Report", listPrice: 74750, qty: 1 }
  ];

  const requesterTeam = [
    { name: "Avery Smith", subtitle: "Gazelle Pharma - Cambridge", role: "Owner" }
  ];

  const supplierTeam = [
    { name: "Brendan Harvey", role: "Project Manager at NovaSphere Labs" },
    { name: "Suzana Marusic", role: "President at NovaSphere Labs" },
    { name: "Kacey Caradonna", role: "Director of Product at NovaSphere Labs" }
  ];

  const rating = { score: 5.0, reviews: 17 };

  const fmtCurrency = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  const orderTotal = items.reduce((sum, it) => sum + it.listPrice * it.qty, 0);

  const initials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
</script>

<div class="page">
  <!-- Header -->
  <div class="page-header">
    <div class="page-title">
      <h1>{title}</h1>
      <p class="muted">{description}</p>
    </div>
    <button class="btn btn-primary">Compare Related Requests</button>
  </div>

  <!-- KPI / Summary strip -->
  <div class="kpis">
    <div class="kpi-card">
      <div class="kpi-label">Total</div>
      <div class="kpi-value">{fmtCurrency(orderTotal)}</div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Turnaround Time</div>
      <div class="kpi-value">—</div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Quote Valid Until</div>
      <div class="kpi-value">—</div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Supplier Rating</div>
      <div class="rating">
        <svg aria-hidden="true" viewBox="0 0 24 24" class="star">
          <path
            d="M12 .9l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 15.9 6.2 18.9l1.1-6.5L2.5 7.8l6.6-.9L12 .9z"
            fill="currentColor"
          />
        </svg>
        <span class="kpi-value">{rating.score.toFixed(1)}</span>
        <span class="muted">({rating.reviews})</span>
      </div>
    </div>
  </div>

  <!-- Main content -->
  <div class="content-grid">
    <!-- Left: Quote details -->
    <section class="card">
      <div class="card-header">
        <h2>Quote details</h2>
        <button class="btn btn-accent">Accept</button>
      </div>

      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th class="col-name">Name</th>
              <th>List Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {#each items as it}
              <tr>
                <td class="col-name">
                  <div class="name-cell">
                    <span class="main">{it.name}</span>
                    <span class="divider">|</span>
                    <a href="javascript:void(0)" class="link">{it.detail}</a>
                  </div>
                </td>
                <td>{fmtCurrency(it.listPrice)}</td>
                <td>{it.qty}</td>
                <td>{fmtCurrency(it.listPrice * it.qty)}</td>
              </tr>
            {/each}
          </tbody>
        </table>

        <div class="order-total">
          <div class="label">Order Total:</div>
          <div class="value">{fmtCurrency(orderTotal)}</div>
        </div>
      </div>

      <div class="tabs">
        <button class="tab active">Collaborate</button>
        <button class="tab">Attachments</button>
      </div>

      <div class="composer">
        <textarea placeholder="Start a thread with the supplier here..."></textarea>
        <div class="composer-actions">
          <button class="btn btn-secondary">Send</button>
        </div>
      </div>
    </section>

    <!-- Right: People cards -->
    <aside class="sidebar">
      <section class="card">
        <div class="card-header">
          <h3>Requester Team</h3>
          <a href="javascript:void(0)" class="link">Edit</a>
        </div>
        <ul class="people">
          {#each requesterTeam as p}
            <li class="person">
              <div class="avatar" aria-hidden="true">{initials(p.name)}</div>
              <div class="meta">
                <div class="name">{p.name}</div>
                <div class="sub">{p.subtitle}</div>
                {#if p.role}<div class="role">{p.role}</div>{/if}
              </div>
            </li>
          {/each}
        </ul>
      </section>

      <section class="card">
        <div class="card-header">
          <h3>Supplier Team</h3>
          <a href="javascript:void(0)" class="link">Edit</a>
        </div>
        <ul class="people">
          {#each supplierTeam as p}
            <li class="person">
              <div class="avatar" aria-hidden="true">{initials(p.name)}</div>
              <div class="meta">
                <div class="name">{p.name}</div>
                <div class="sub">{p.role}</div>
              </div>
            </li>
          {/each}
        </ul>
      </section>
    </aside>
  </div>
</div>

<style>
  :root {
    --bg: #fafbfc;
    --text: #111827;
    --muted: #6b7280;
    --border: #e5e7eb;
    --card: #ffffff;
    --primary: #5b3df6;   /* purple */
    --accent: #1f6feb;    /* blue */
    --accent-contrast: #ffffff;
    --shadow-sm: 0 1px 2px rgba(0,0,0,.06);
    --shadow-lg: 0 10px 30px rgba(0,0,0,.08);
    --radius: 14px;
  }

  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 28px 28px 64px;
    color: var(--text);
    background: var(--bg);
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
  }

  .muted { color: var(--muted); }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 20px;
  }
  .page-title h1 {
    font-weight: 800;
    letter-spacing: -0.02em;
    font-size: 34px;
    margin: 0 0 8px;
  }
  .page-title p { max-width: 860px; line-height: 1.5; }

  .btn {
    border: none;
    border-radius: 12px;
    padding: 12px 18px;
    font-weight: 600;
    cursor: pointer;
    transition: transform .02s ease, box-shadow .2s ease, opacity .2s ease;
    white-space: nowrap;
  }
  .btn:active { transform: translateY(1px); }
  .btn-primary {
    background: var(--primary);
    color: #fff;
    box-shadow: var(--shadow-sm);
  }
  .btn-accent {
    background: var(--accent);
    color: var(--accent-contrast);
  }
  .btn-secondary {
    background: #f3f4f6;
    color: #111827;
  }

  /* KPI cards */
  .kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    margin: 16px 0 28px;
  }
  .kpi-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px;
    box-shadow: var(--shadow-sm);
    min-height: 82px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .kpi-label {
    font-size: 12px;
    text-transform: uppercase;
    color: var(--muted);
    letter-spacing: .06em;
    margin-bottom: 6px;
  }
  .kpi-value {
    font-size: 22px;
    font-weight: 800;
  }
  .rating {
    display: flex; align-items: center; gap: 8px;
  }
  .rating .star {
    width: 18px; height: 18px; color: #f7b500;
  }

  /* Main grid */
  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
  }
  .card-header h2, .card-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
  }

  /* Table */
  .table-wrap { padding: 10px 20px 16px; }
  .table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
  .table thead th {
    text-transform: uppercase;
    font-size: 12px;
    color: var(--muted);
    text-align: left;
    padding: 12px 12px;
    border-bottom: 1px solid var(--border);
  }
  .table .col-name { width: 55%; }
  .table tbody td {
    padding: 18px 12px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }
  .name-cell {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    line-height: 1.2;
  }
  .name-cell .main { font-weight: 600; }
  .name-cell .divider { color: var(--muted); }
  .name-cell .link {
    color: #4f46e5;
    text-decoration: none;
  }
  .name-cell .link:hover { text-decoration: underline; }

  .order-total {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    padding: 16px 8px 4px;
    font-weight: 800;
    font-size: 18px;
  }
  .order-total .label { color: var(--muted); font-weight: 700; }

  /* Tabs + composer */
  .tabs {
    display: flex;
    gap: 22px;
    padding: 4px 20px 0;
    border-top: 1px solid var(--border);
  }
  .tab {
    background: transparent;
    border: none;
    padding: 14px 4px;
    cursor: pointer;
    color: var(--muted);
    font-weight: 600;
    position: relative;
  }
  .tab.active { color: var(--text); }
  .tab.active::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 2px;
    background: var(--primary);
    border-radius: 2px;
  }

  .composer {
    padding: 12px 20px 20px;
  }
  .composer textarea {
    width: 100%;
    min-height: 70px;
    resize: vertical;
    border-radius: 12px;
    border: 1px solid var(--border);
    padding: 12px 14px;
    font: inherit;
    outline: none;
    transition: border-color .2s ease, box-shadow .2s ease;
    background: #fff;
  }
  .composer textarea:focus {
    border-color: #c7d2fe;
    box-shadow: 0 0 0 3px rgba(99,102,241,.15);
  }
  .composer-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
  }

  /* Sidebar people */
  .sidebar { display: flex; flex-direction: column; gap: 24px; }
  .people {
    list-style: none;
    padding: 10px 16px 18px;
    margin: 0;
  }
  .person { display: flex; gap: 12px; align-items: center; padding: 10px 4px; }
  .avatar {
    width: 40px; height: 40px; flex: 0 0 40px;
    border-radius: 999px;
    background: linear-gradient(135deg, #8ab4ff, #6c63ff);
    color: #fff; font-weight: 800;
    display: grid; place-items: center;
    box-shadow: var(--shadow-sm);
  }
  .meta .name { font-weight: 700; }
  .meta .sub { color: var(--muted); font-size: 13px; }
  .meta .role { color: var(--muted); font-size: 12px; margin-top: 2px; }
  .link {
    color: #4f46e5; text-decoration: none; font-weight: 600;
  }
  .link:hover { text-decoration: underline; }

  /* Responsive */
  @media (max-width: 1100px) {
    .content-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 780px) {
    .kpis { grid-template-columns: 1fr 1fr; }
    .page-header { flex-direction: column; align-items: stretch; }
    .btn { width: 100%; }
  }
</style>