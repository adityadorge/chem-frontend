<script lang="ts">
  import { goto } from "$app/navigation";
  import { Building2, Star, Clock3 } from "lucide-svelte"; // ✅ lucide icons

  interface Test {
    id: number;
    test_name: string;
    image_url: string;
    test_description: string;
    test_price: number;
    supplier_rating?: number;
    turnaround_time?: string;
    company_name?: string;
    fulfilled?: boolean;
  }

  export let test: Test;

  // Fallbacks / dummy values
  const icon = test?.image_url || "/assets/default-icon.svg";
  const title = test?.test_name || "Comprehensive Blood Panel";
  const description =
    test?.test_description ||
    "A full diagnostic panel covering essential blood health markers.";
  const price = test?.test_price ?? 2500;
  const companyName = test?.company_name ?? "Acme Labs Pvt. Ltd.";
  const supplierRating = test?.supplier_rating ?? 4.6;
  const turnaroundTime = test?.turnaround_time ?? "3-5 days";
  const fulfilled = test?.fulfilled ?? true;

  const formatINR = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);

  function viewDetails() {
    goto(`/tests/${test.id}`);
  }
</script>

<article class="card" on:click={viewDetails}>
  <!-- Header -->
  <div class="card-header">
    <img class="icon" src={icon} alt={title} />
    <div class="header-text">
      <h2 class="title">{title}</h2>
      <p class="company">
        <Building2 /> {companyName}
      </p>
    </div>
    <div class="status">
      {#if fulfilled}
        <span class="fulfilled">Fulfilled</span>
      {:else}
        <span class="pending">Pending</span>
      {/if}
    </div>
  </div>

  <!-- Description -->
  <p class="description">{description}</p>

  <!-- Footer -->
  <div class="card-footer">
    <div class="meta">
      <span class="rating">
        <Star class="icon-inline star" /> {supplierRating}
      </span>
      <span class="turnaround">
        <Clock3 class="icon-inline" /> {turnaroundTime}
      </span>
    </div>
    <div class="actions">
      <span class="price">{formatINR(price)}</span>
      <button class="btn">View Details</button>
    </div>
  </div>
</article>

<style>
  :root {
    --bg: #ffffff;
    --text: #111827;
    --muted: #6b7280;
    --border: #e5e7eb;
    --hover: #f9fafb;
    --fulfilled: #16a34a;
    --pending: #f59e0b;
    --shadow: rgba(0, 0, 0, 0.05);
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 20px;
    border-radius: 16px;
    background: var(--bg);
    border: 1px solid var(--border);
    box-shadow: 0 2px 6px var(--shadow);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }

  .icon {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }

  .header-text {
    flex: 1;
    min-width: 0;
  }

  .title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text);
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .company {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 2px 0 0;
    font-size: 0.9rem;
    color: var(--muted);
  }

  .status {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    white-space: nowrap;
  }

  .fulfilled {
    color: var(--fulfilled);
    background: #ecfdf5;
    border-color: #bbf7d0;
  }

  .pending {
    color: var(--pending);
    background: #fffbeb;
    border-color: #fde68a;
  }

  .description {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--muted);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .meta {
    display: flex;
    gap: 16px;
    font-size: 0.9rem;
    color: var(--muted);
  }

  .rating,
  .turnaround {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }

  .star {
    color: #fbbf24; /* golden yellow for star */
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .price {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
  }

  .btn {
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--hover);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn:hover {
    background: #f3f4f6;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .card {
      padding: 16px;
      gap: 10px;
    }
    .title {
      font-size: 1rem;
    }
    .company {
      font-size: 0.8rem;
    }
    .card-footer {
      flex-direction: column;
      align-items: flex-start;
    }
    .actions {
      width: 100%;
      justify-content: space-between;
    }
    .btn {
      flex-grow: 1;
      text-align: center;
    }
  }
</style>
