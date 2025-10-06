<script lang="ts">
  import {
    Apple,
    Play,
    Phone,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Plus,
    Minus
  } from "lucide-svelte";

  const year = new Date().getFullYear();

  // Link groups reused in the mobile accordion
  const features = [
    "Analytics",
    "Auto scheduling",
    "Break planning compliance",
    "Demand forecasting",
    "Integrations",
    "Labor law compliance",
    "Mobile app",
    "Scheduling",
    "Task management",
    "Time tracking"
  ];

  const product = ["Pricing", "Product tour", "See what's new"];
  const businessSize = ["Enterprise", "Franchise", "Multi location", "Small or medium-sized"];
  const resources = ["Blog", "Customer stories", "Customer reviews", "Newsroom", "Refer a friend", "Scheduling ROI Calculator"];
  const security = ["Account security", "API best practices", "Report a vulnerability", "Security center"];
  const company = ["About us", "Careers", "Partners", "Press", "Why us", "Workforce management"];

  type Section =
    | { id: string; title: string; type: "links"; items: string[] }
    | { id: string; title: string; type: "contact" };

  const sections: Section[] = [
    { id: "features", title: "FEATURES", type: "links", items: features },
    { id: "product", title: "PRODUCT", type: "links", items: product },
    { id: "business", title: "BUSINESS SIZE", type: "links", items: businessSize },
    { id: "resources", title: "RESOURCES", type: "links", items: resources },
    { id: "security", title: "SECURITY", type: "links", items: security },
    { id: "company", title: "COMPANY", type: "links", items: company },
    { id: "contact", title: "CONTACT US", type: "contact" }
  ];

  let open: Record<string, boolean> = {};
  function toggle(id: string) {
    open[id] = !open[id];
    open = { ...open };
  }

  const panelId = (id: string) => `footer-panel-${id}`;
</script>

<footer class="talf-footer" role="contentinfo">
  <!-- Mobile layout (accordion) -->
  <div class="footer-mobile">
    <div class="container section-pad-mobile">
      <!-- Brand + tagline -->
      <div class="brand">
        <div class="brand-row">
          <span class="brand-name">APP NAME</span>
        </div>
        <p class="brand-tagline">
          Improving the world of work,<br />one shift at a time
        </p>

        <!-- Store badges -->
        <div class="store-badges">
          <a href="#" class="store-badge">
            <Play class="icon icon-5" /> <span>Google Play</span>
          </a>
          <a href="#" class="store-badge">
            <Apple class="icon icon-5" /> <span>App Store</span>
          </a>
        </div>
      </div>

      <!-- Accordion groups -->
      <div class="accordion">
        {#each sections as section}
          <div class="accordion-item">
            <button
              type="button"
              class="accordion-trigger"
              aria-expanded={open[section.id] ? "true" : "false"}
              aria-controls={panelId(section.id)}
              on:click={() => toggle(section.id)}
            >
              <span class="accordion-title">{section.title}</span>
              {#if open[section.id]}
                <Minus class="icon icon-4 icon-muted" />
              {:else}
                <Plus class="icon icon-4 icon-muted" />
              {/if}
            </button>

            {#if open[section.id]}
              <div id={panelId(section.id)} class="accordion-panel">
                {#if section.type === "links"}
                  <ul class="link-list">
                    {#each section.items as item}
                      <li class="link-item">
                        <a href="#" class="link-muted">{item}</a>
                      </li>
                    {/each}
                  </ul>
                {:else}
                  <!-- Contact block -->
                  <div class="contact">
                    <div class="contact-row">
                      <Phone class="icon icon-4 icon-muted" />
                      <a href="tel:+18556337889" class="link">{'1-855-633-7889'}</a>
                    </div>
                    <address class="address">
                      548 Market St PMB 77267<br />
                      San Francisco, CA<br />
                      94104-5401
                    </address>
                    <div class="social">
                      <a href="#" aria-label="LinkedIn" class="social-link"><Linkedin class="icon icon-5" /></a>
                      <a href="#" aria-label="Instagram" class="social-link"><Instagram class="icon icon-5" /></a>
                      <a href="#" aria-label="Facebook" class="social-link"><Facebook class="icon icon-5" /></a>
                      <a href="#" aria-label="YouTube" class="social-link"><Youtube class="icon icon-5" /></a>
                      <a href="#" aria-label="Twitter" class="social-link"><Twitter class="icon icon-5" /></a>
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Desktop / tablet grid -->
  <div class="footer-desktop">
    <div class="container section-pad-desktop">
      <div class="grid">
        <!-- Brand + badges -->
        <div class="col col-brand">
          <div class="brand-row">
            <span class="brand-name brand-name--md">APP NAME</span>
          </div>
          <p class="brand-tagline brand-tagline--md">
            Improving the world of work, one shift at a time
          </p>
          <div class="store-badges store-badges--row">
            <a href="#" class="store-badge"><Apple class="icon icon-5" /> <span>App Store</span></a>
            <a href="#" class="store-badge"><Play class="icon icon-5" /> <span>Google Play</span></a>
          </div>
        </div>

        <!-- Features -->
        <div class="col">
          <h3 class="col-title">FEATURES</h3>
          <ul class="link-list">
            {#each features as item}
              <li class="link-item"><a href="#" class="link-muted">{item}</a></li>
            {/each}
          </ul>
        </div>

        <!-- Product + Business Size -->
        <div class="col">
          <h3 class="col-title">PRODUCT</h3>
          <ul class="link-list">
            {#each product as item}
              <li class="link-item"><a href="#" class="link-muted">{item}</a></li>
            {/each}
          </ul>

          <h3 class="col-title mt">BUSINESS SIZE</h3>
          <ul class="link-list">
            {#each businessSize as item}
              <li class="link-item"><a href="#" class="link-muted">{item}</a></li>
            {/each}
          </ul>
        </div>

        <!-- Resources + Security -->
        <div class="col">
          <h3 class="col-title">RESOURCES</h3>
          <ul class="link-list">
            {#each resources as item}
              <li class="link-item"><a href="#" class="link-muted">{item}</a></li>
            {/each}
          </ul>

          <h3 class="col-title mt">SECURITY</h3>
          <ul class="link-list">
            {#each security as item}
              <li class="link-item"><a href="#" class="link-muted">{item}</a></li>
            {/each}
          </ul>
        </div>

        <!-- Company + Contact -->
        <div class="col col-company">
          <h3 class="col-title">COMPANY</h3>
          <ul class="link-list mb">
            {#each company as item}
              <li class="link-item"><a href="#" class="link-muted">{item}</a></li>
            {/each}
          </ul>

          <h3 class="col-title">CONTACT US</h3>
          <div class="contact">
            <div class="contact-row">
              <Phone class="icon icon-4 icon-muted" />
              <a href="tel:+18556337889" class="link">{'1-855-633-7889'}</a>
            </div>
            <address class="address">
              548 Market St PMB 77267<br />
              San Francisco, CA<br />
              94104-5401
            </address>

            <div class="social social--row">
              <a href="#" aria-label="LinkedIn" class="social-link"><Linkedin class="icon icon-5" /></a>
              <a href="#" aria-label="Instagram" class="social-link"><Instagram class="icon icon-5" /></a>
              <a href="#" aria-label="Facebook" class="social-link"><Facebook class="icon icon-5" /></a>
              <a href="#" aria-label="YouTube" class="social-link"><Youtube class="icon icon-5" /></a>
              <a href="#" aria-label="Twitter" class="social-link"><Twitter class="icon icon-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom bar (shared) -->
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <div class="footer-links">
        <a href="#" class="locale">
          <Globe class="icon icon-4" />
          <span>USA/Global</span>
        </a>
        <span class="dot"></span>
        <a href="#" class="link-muted">Legal</a>
        <span class="dot"></span>
        <a href="#" class="link-muted">Privacy Center</a>
        <span class="dot"></span>
        <a href="#" class="link-muted">Your Privacy Choices</a>
        <span class="dot"></span>
        <a href="#" class="link-muted">Sitemap</a>
      </div>

      <div class="copyright">
        © {year} APP NAME. All rights reserved.
      </div>
    </div>
  </div>
</footer>

<style>
  /* Theme tokens */
  .talf-footer {
    --footer-bg: #191f74;
    --text: #ffffff;
    --text-85: rgba(255, 255, 255, 0.85);
    --text-80: rgba(255, 255, 255, 0.80);
    --text-75: rgba(255, 255, 255, 0.75);
    --text-70: rgba(255, 255, 255, 0.70);
    --text-60: rgba(255, 255, 255, 0.60);
    --text-30: rgba(255, 255, 255, 0.30);
    --border-15: rgba(255, 255, 255, 0.15);
    --border-10: rgba(255, 255, 255, 0.10);

    --container-max: 80rem; /* ~1280px */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-14: 3.5rem;

    --radius: 0.375rem;
    --transition: 160ms ease;

    --sm: 640px;
    --md: 768px;
    --lg: 1024px;
  }

  /* Base */
  .talf-footer {
    background: var(--footer-bg);
    color: var(--text);
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .talf-footer a {
    color: inherit;
    text-decoration: none;
    transition: color var(--transition), opacity var(--transition), background var(--transition);
  }
  .talf-footer ul { margin: 0; padding: 0; list-style: none; }
  .talf-footer p,
  .talf-footer address { margin: 0; }
  .talf-footer .icon { display: inline-block; vertical-align: middle; }
  .talf-footer .icon-4 { width: 1rem; height: 1rem; }
  .talf-footer .icon-5 { width: 1.25rem; height: 1.25rem; }
  .talf-footer .icon-muted { color: var(--text-90, var(--text-80)); }

  /* Containers and sections */
  .talf-footer .container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
  @media (min-width: var(--sm)) {
    .talf-footer .container { padding-left: var(--space-6); padding-right: var(--space-6); }
  }
  @media (min-width: var(--lg)) {
    .talf-footer .container { padding-left: var(--space-8); padding-right: var(--space-8); }
  }
  .talf-footer .section-pad-mobile { padding-top: var(--space-10); padding-bottom: var(--space-10); }
  .talf-footer .section-pad-desktop { padding-top: var(--space-14); padding-bottom: var(--space-14); }

  /* Responsive visibility */
  .talf-footer .footer-mobile { display: block; }
  .talf-footer .footer-desktop { display: none; }
  @media (min-width: var(--md)) {
    .talf-footer .footer-mobile { display: none; }
    .talf-footer .footer-desktop { display: block; }
  }

  /* Brand */
  .talf-footer .brand { display: flex; flex-direction: column; gap: var(--space-5); }
  .talf-footer .brand-row { display: flex; align-items: center; gap: var(--space-2); }
  .talf-footer .brand-name { font-weight: 800; font-size: 1.875rem; letter-spacing: 0.01em; }
  .talf-footer .brand-name--md { font-size: 1.5rem; }
  .talf-footer .brand-tagline { font-size: 1rem; line-height: 1.75; color: var(--text-80); }
  .talf-footer .brand-tagline--md { font-size: 0.875rem; line-height: 1.5; color: var(--text-70); }

  /* Store badges */
  .talf-footer .store-badges { display: flex; gap: var(--space-3); }
  .talf-footer .store-badges--row { flex-direction: row; }
  .talf-footer .store-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    background: #000;
    color: #fff;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius);
    font-weight: 600;
    font-size: 0.875rem;
  }
  .talf-footer .store-badge:hover { background: #111; }

  /* Accordion */
  .talf-footer .accordion { margin-top: var(--space-8); border-top: 1px solid var(--border-15); border-bottom: 1px solid var(--border-15); }
  .talf-footer .accordion-item { border-bottom: 1px solid var(--border-15); }
  .talf-footer .accordion-item:last-child { border-bottom: none; }
  .talf-footer .accordion-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) 0;
    text-align: left;
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
  }
  .talf-footer .accordion-trigger:focus-visible {
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }
  .talf-footer .accordion-title {
    text-transform: uppercase;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.9);
  }
  .talf-footer .accordion-panel { padding-bottom: var(--space-4); }
  .talf-footer .link-list { padding-left: 0.25rem; display: flex; flex-direction: column; gap: var(--space-3); }
  .talf-footer .link-item .link-muted { color: var(--text-80); font-size: 0.8125rem; }
  .talf-footer .link-item .link-muted:hover { color: var(--text); }

  /* Contact block */
  .talf-footer .contact { display: flex; flex-direction: column; gap: var(--space-4); color: var(--text-85); font-size: 0.8125rem; }
  .talf-footer .contact-row { display: flex; align-items: center; gap: var(--space-2); }
  .talf-footer .link { color: inherit; }
  .talf-footer .link:hover { color: var(--text); }
  .talf-footer .address { font-style: normal; color: var(--text-70); line-height: 1.5; }
  .talf-footer .social { display: flex; align-items: center; gap: var(--space-4); padding-top: 0.25rem; }
  .talf-footer .social--row { padding-top: 0.5rem; }
  .talf-footer .social-link { color: var(--text-70); }
  .talf-footer .social-link:hover { color: var(--text); }

  /* Desktop grid */
  .talf-footer .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.5rem;
  }
  @media (min-width: var(--sm)) {
    .talf-footer .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
  @media (min-width: var(--md)) {
    .talf-footer .grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  }
  @media (min-width: var(--lg)) {
    .talf-footer .grid { grid-template-columns: repeat(12, minmax(0, 1fr)); }
  }
  .talf-footer .col { grid-column: span 1; }
  .talf-footer .col-brand { grid-column: span 2; }
  @media (min-width: var(--md)) {
    .talf-footer .col-brand { grid-column: span 3; }
  }
  @media (min-width: var(--lg)) {
    .talf-footer .col-brand { grid-column: span 3; }
  }
  .talf-footer .col-company { grid-column: span 2; }
  @media (min-width: var(--md)) {
    .talf-footer .col-company { grid-column: span 2; }
  }
  @media (min-width: var(--lg)) {
    .talf-footer .col-company { grid-column: span 2; }
  }
  .talf-footer .col-title {
    text-transform: uppercase;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--text-80);
    margin: 0 0 var(--space-4) 0;
  }
  .talf-footer .mt { margin-top: var(--space-8); }
  .talf-footer .mb { margin-bottom: var(--space-8); }

  /* Bottom bar */
  .talf-footer .footer-bottom { border-top: 1px solid var(--border-10); }
  .talf-footer .footer-bottom-inner {
    display: flex;
    flex-direction: row;      /* force single row */
    flex-wrap: nowrap;        /* prevent wrapping */
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding-top: var(--space-6);
    padding-bottom: var(--space-6);
  }

  .talf-footer .footer-links {
    display: flex;
    flex-wrap: nowrap;        /* keep links on one line */
    align-items: center;
    gap: var(--space-4);
    color: var(--text-75);
    font-size: 0.8125rem;
    flex: 1 1 auto;           /* allow to shrink */
    min-width: 0;             /* enable shrinking */
    white-space: nowrap;      /* prevent wrap inside */
    overflow-x: auto;         /* scroll if overflow */
    -webkit-overflow-scrolling: touch;
  }
  .talf-footer .locale { display: inline-flex; align-items: center; gap: var(--space-2); flex: 0 0 auto; }
  .talf-footer .dot { width: 0.25rem; height: 0.25rem; background: var(--text-30); border-radius: 999px; display: inline-block; flex: 0 0 auto; }

  .talf-footer .copyright {
    color: var(--text-60);
    font-size: 0.8125rem;
    flex: 0 0 auto;           /* fixed-size, no shrink */
    white-space: nowrap;      /* keep on one line */
    margin-left: var(--space-4);
  }

  /* Focus visibility for links */
  .talf-footer a:focus-visible {
    outline: 2px solid var(--text);
    outline-offset: 2px;
    border-radius: 2px;
  }
</style>