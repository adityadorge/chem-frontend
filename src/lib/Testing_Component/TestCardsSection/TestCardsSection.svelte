<script lang="ts">
  import { goto } from "$app/navigation";

  interface Test {
    id: number;
    test_name: string;
    image_url?: string;
    test_description?: string;
    test_price?: number;
    company_name?: string;

    // Optional extras, if you later add them
    stat?: string | number;          // e.g. "460"
    badge_color?: string;            // override pill color
  }

  export let test: Test;

  export let view: 'grid' | 'list' = 'grid'; // receives parent view

  const href = `/tests/${test.id}`;
  const testName = test?.test_name ?? "Untitled Test";
  const description =
    test?.test_description ??
    "Deputy Announces Exclusive Global Partnership with Predelo to Bring AI to Shift-Based Businesses.";
  const imageUrl = test?.image_url;
  const lab = test?.company_name ?? "ASL LAB";
  const labColor = test?.badge_color ?? "#22e3b8"; // green pill from mock
  const stat = test?.stat; // optional

  function open(e: Event) {
    e.preventDefault();
    goto(href);
  }
</script>

<a
  class="card"
  class:list={view === 'list'}
  href={href}
  on:click|preventDefault={open}
  aria-label={`${testName} – See more`}
>
  <div class="media" style={`background-color: ${imageUrl ? '#0f007a' : '#0f007a'};`}>
    {#if imageUrl}
      <img src={imageUrl} alt="" loading="lazy" decoding="async" />
    {/if}
    {#if lab}<span class="badge" style={`--badge-bg: ${labColor};`}>{lab}</span>{/if}
    {#if stat}<span class="stat">{stat} ▲</span>{/if}
  </div>

  <div class="body">
    <p class="test-name">{testName}</p>
    <h3 class="title">{description}</h3>
    <div class="footer">
      <span class="see-more">
        See more
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
  </div>
</a>

<style>
  :root {
    --card-radius: 18px;
    --shadow: 0 10px 25px rgba(16, 24, 40, 0.12), 0 4px 12px rgba(16, 24, 40, 0.06);
    --shadow-hover: 0 16px 40px rgba(16, 24, 40, 0.16), 0 6px 16px rgba(16, 24, 40, 0.08);
    --ink: #0f172a;
    --muted: #667085;
    --brand: #0c017b;   /* link/brand */
    --surface: #ffffff;
  }

  .card {
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border-radius: var(--card-radius);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    box-shadow: var(--shadow);
    transition: transform 180ms ease, box-shadow 180ms ease;
    will-change: transform;
    height: 100%;                /* fill grid cell so footer can sit at the bottom */
  }

  .media {
    position: relative;
    height: 220px;
    background: #120070; /* deep indigo fallback */
  }
  .media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .badge {
    position: absolute;
    top: 14px;
    left: 14px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.02em;
    padding: 6px 10px;
    border-radius: 999px;
    background: var(--badge-bg, #22e3b8);
    color: #0a2540;
    text-transform: uppercase;
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
    user-select: none;
  }

  .stat {
    position: absolute;
    top: 14px;
    right: 14px;
    font-weight: 800;
    font-size: 14px;
    color: #cbd5ff;
    background: rgba(15, 0, 122, 0.55);
    border: 1px solid rgba(203, 213, 255, 0.2);
    padding: 6px 10px;
    border-radius: 10px;
    backdrop-filter: blur(6px);
  }

  .body {
    display: grid;
    grid-template-rows: auto 1fr auto;  /* name | expandable description | footer */
    gap: 10px;
    padding: 18px 22px 22px;
    flex: 1 1 auto;                     /* stretch to consume remaining height */
    min-height: 0;                      /* avoid overflow in tight rows */
  }

  .test-name {
    margin: 0 0 4px 0;
    color: #0c017b; /* vivid blue header */
    font-size: 22px;
    font-weight: 800;
    line-height: 1.3;
  }

  .title {
    margin: 0;
    color: var(--ink);
    font-size: 20px;
    font-weight: 800;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 3;     /* clamp like mock */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 6px;
  }

  .see-more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--brand);
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .see-more:hover {
    filter: brightness(0.9);
  }

  /* LIST VIEW (tests only) */
  .card.list {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 18px;
    height: auto;               /* list adapts to content */
    align-items: stretch;
  }
  .card.list .media {
    height: auto;
    min-height: 170px;
  }
  .card.list .body {
    padding: 16px 18px 16px;
    grid-template-rows: auto 1fr auto; /* keep "See more" pinned */
  }
  .card.list .test-name { font-size: 20px; margin-bottom: 2px; }
  .card.list .title { font-size: 18px; -webkit-line-clamp: 2; }

  /* Stack on very small screens; toggle is hidden there anyway */
  @media (max-width: 700px) {
    .card.list { grid-template-columns: 1fr; }
    .card.list .media { height: 190px; min-height: 190px; }
  }

  /* Responsive: media height tweak if needed */
  @media (max-width: 640px) { .media { height: 190px; } }
</style>