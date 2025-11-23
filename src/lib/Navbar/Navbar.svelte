<script lang="ts">
  import { onMount } from "svelte";
  import { isAuthenticated } from "$lib/store";
  import CartSection from "$lib/CartSection/CartSection.svelte";
  import { goto } from "$app/navigation";
  import {
    User,
    MapPin,
    ShieldCheck,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    PackageOpen,
    SmilePlus,
    FlaskConical,
    Hamburger,
    Cog,
    GraduationCap,
    Microscope,
    ArrowDownAZ,
    ArrowUpAZ,
    ChartColumnIncreasing,
    TruckElectric,
    Palette,
    Expand,
  } from "lucide-svelte";

  let scrolled = false;
  let cartOpen = false;
  let isMobile = false;
  let menuOpen = false;
  let solutionsOpen = false;
  let mobileSolutionsOpen = false;
  let solutionsTimeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const update = () => (isMobile = mq.matches);
    update();
    mq.addEventListener("change", update);
  });

  function toggleCart() {
    cartOpen = !cartOpen;
  }

  function toggleMobileSolutions() {
    mobileSolutionsOpen = !mobileSolutionsOpen;
  }

  // Throttled scroll -> sticky hysteresis
  let ticking = false;
  function handleScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      const ON = 70;
      const OFF = 30;
      scrolled = scrolled ? y > OFF : y > ON;
      ticking = false;
    });
  }

  // Mobile nav
  const mobileNav = [
    { label: "Testing", href: "/testing" },
    { label: "Solutions", href: "/solutions" },
    { label: "Learn", href: "/learn" },
    { label: "About", href: "/about-us" },
    { label: "Collaborator", href: "/enroll-lab" },
  ];

  function openMobile() {
    menuOpen = true;
    document.body.classList.add("menu-open");
  }
  function closeMobile() {
    menuOpen = false;
    document.body.classList.remove("menu-open");
    mobileSolutionsOpen = false;
  }
  async function go(href: string) {
    await goto(href);
    closeMobile();
  }

  // Solutions mega menu
  function openSolutions() {
    clearTimeout(solutionsTimeout);
    solutionsOpen = true;
  }
  function scheduleCloseSolutions() {
    clearTimeout(solutionsTimeout);
    solutionsTimeout = setTimeout(() => (solutionsOpen = false), 140);
  }
  function closeSolutionsImmediate() {
    clearTimeout(solutionsTimeout);
    solutionsOpen = false;
  }

  interface MegaItem {
    label: string;
    href: string;
    icon: typeof User;
  }
  // Healthcare, Pharmaceuticals, Food & Beverage, Chemicals, Environment, Agriculture, Forensics, 
  // Cosmetics, Petrochemicals, Construction, Electronics, Automotive, Textiles, Mining, and Research.

  const disciplines: MegaItem[] = [
    { label: "Researchers", href: "", icon: User },
    { label: "Chemical", href: "", icon: FlaskConical },
    { label: "Cosmetics", href: "", icon: SmilePlus },
    { label: "Food & Beverage", href: "", icon: Hamburger },
    { label: "See all disciplines", href: "/solutions/disciplines-we-serve", icon: ArrowDownAZ },
  ];

  const industries: MegaItem[] = [
    { label: "Manufacturers", href: "", icon: Cog },
    { label: "SMEs / MSMEs", href: "", icon: MapPin },
    { label: "Universities", href: "", icon: GraduationCap },
    { label: "Research Labs", href: "", icon: Microscope },
    { label: "See all industries", href: "/solutions/industries-we-serve", icon: ArrowUpAZ },
  ];

  const popularServices: MegaItem[] = [
    { label: "Logistics", href: "/solutions", icon: TruckElectric },
    { label: "Compliance", href: "/solutions", icon: ShieldCheck },
    { label: "Benchmarking", href: "/solutions", icon: ChartColumnIncreasing },
    { label: "RaaS", href: "/solutions", icon: Palette },
    { label: "See all services", href: "/solutions", icon: Expand },
  ];

  const latestResource = {
    image: "/assets/solutions/national-cancer-institute-DYQfoftWGXw-unsplash.jpg",
    title: "Guide: Cost saving hacks",
    excerpt: "Strategies & tools to build a resilient, cost‑efficient operation.",
    href: "/learn",
  };

  // Touch: first tap opens menu, second navigates (desktop only)
  function handleSolutionsClick(e: MouseEvent) {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches && !solutionsOpen) {
      e.preventDefault();
      openSolutions();
    }
  }
</script>

<svelte:window on:scroll={handleScroll} />

<nav class="nav-bar {scrolled ? 'sticky' : ''}">
  <div class="container nav-contains">
    <a href="/"><span class="inter-brand"><span class="phi">φ</span>hial</span></a>
    <div class="nav-links">
      <a
        href="/testing"
        on:click|preventDefault={() => goto("/testing")}
      >Testing</a>
      <a
        href="/solutions"
        class="solutions-trigger {solutionsOpen ? 'active' : ''}"
        on:mouseenter={openSolutions}
        on:focus={openSolutions}
        on:mouseleave={scheduleCloseSolutions}
        on:blur={scheduleCloseSolutions}
        on:click={handleSolutionsClick}
        on:keydown={(e) => {
          if (e.key === "Escape") {
            closeSolutionsImmediate();
            (e.currentTarget as HTMLElement).blur();
          }
        }}
        aria-haspopup="true"
        aria-expanded={solutionsOpen}
      >
        Solutions
        {#if solutionsOpen}
          <ChevronUp size={16} class="solutions-icon" aria-hidden="true" />
        {:else}
          <ChevronDown size={16} class="solutions-icon" aria-hidden="true" />
        {/if}
      </a>
      <a href="/learn">Learn</a>
      <a href="/about-us">About</a>
      <a href="/enroll-lab" class="quote-btn">Collaborator</a>
      {#if $isAuthenticated}
        <div class="profile-menu">
          <button
            class="profile-trigger"
            on:click={() => goto("/dashboard")}
            aria-label="Go to dashboard"
          >
            <img
              src="/assets/profile-icon/profile.svg"
              alt="Profile"
              width="30"
              height="30"
              style="vertical-align: middle;"
            />
          </button>
        </div>
      {:else}
        <a href="/login">Login</a>
      {/if}
      <a href="#" on:click|preventDefault={toggleCart} class="cart-link">
        <PackageOpen size={30} class="text-[#0c017b]" />
      </a>
      {#if cartOpen && !isMobile}
        <CartSection bind:isOpen={cartOpen} />
      {/if}
    </div>
    <div class="mobile-actions">
      <a
        href="#"
        class="cart-link mobile-cart"
        on:click|preventDefault={toggleCart}
        aria-label="Open cart"
      >
        <PackageOpen size={30} class="text-[#0c017b]" />
      </a>
      <button
        class="hamburger"
        on:click={openMobile}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu-panel"
      >
        <img src="/assets/navbar/menu-line.svg" alt="menu" />
      </button>
    </div>
  </div>
</nav>

{#if solutionsOpen}
  <div
    class="solutions-mega"
    on:mouseenter={openSolutions}
    on:mouseleave={scheduleCloseSolutions}
    role="menu"
    aria-label="Solutions submenu"
    tabindex="0"
  >
    <div class="solutions-inner">
      <div class="solutions-columns">
        <div class="mega-col">
          <h4 class="mega-heading">WHOM WE SERVE</h4>
          <ul class="mega-list">
            {#each industries as item}
              <li>
                <a href={item.href} class="mega-link" role="menuitem">
                  <span><svelte:component this={item.icon} size={26} /></span>
                  <span class="text">{item.label}</span>
                  <ChevronRight size={16} class="chev" aria-hidden="true" />
                </a>
              </li>
            {/each}
          </ul>
        </div>
        <div class="mega-col">
          <h4 class="mega-heading">WHAT WE SERVE</h4>
          <ul class="mega-list">
            {#each disciplines as item}
              <li>
                <a href={item.href} class="mega-link" role="menuitem">
                  <span><svelte:component this={item.icon} size={26} /></span>
                  <span class="text">{item.label}</span>
                  <ChevronRight size={16} class="chev" aria-hidden="true" />
                </a>
              </li>
            {/each}
          </ul>
        </div>
        <div class="mega-col">
          <h4 class="mega-heading">POPULAR SERVICES</h4>
          <ul class="mega-list">
            {#each popularServices as item}
              <li>
                <a href={item.href} class="mega-link" role="menuitem">
                  <span><svelte:component this={item.icon} size={26} /></span>
                  <span class="text">{item.label}</span>
                  <ChevronRight size={16} class="chev" aria-hidden="true" />
                </a>
              </li>
            {/each}
          </ul>
        </div>
        <div class="mega-resource">
          <h4 class="mega-heading">LATEST RESOURCES</h4>
            <div class="resource-card">
              <div class="res-image">
                <img src={latestResource.image} alt="Resource cover" loading="lazy" />
              </div>
              <div class="res-body">
                <a class="res-title" href={latestResource.href}>{latestResource.title}</a>
                <p class="res-excerpt">{latestResource.excerpt}</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if menuOpen}
  <div class="mobile-overlay" on:click={closeMobile}>
    <div
      class="mobile-panel"
      id="mobile-menu-panel"
      on:click|stopPropagation
      aria-label="Mobile navigation panel"
    >
      <div class="mobile-topbar">
        <div class="brand">
          <span class="inter-brand">φhial</span>
        </div>
        <button class="close-btn" on:click={closeMobile} aria-label="Close menu">×</button>
      </div>

      <ul class="mobile-list">
        {#each mobileNav as item}
          {#if item.href === "/solutions"}
            <li>
              <button
                class="list-row accordion-toggle"
                on:click={toggleMobileSolutions}
                aria-expanded={mobileSolutionsOpen}
                aria-controls="mobile-solutions-accordion"
              >
                <span class="row-text">Solutions</span>
                {#if mobileSolutionsOpen}
                  <ChevronUp size={18} />
                {:else}
                  <ChevronDown size={18} />
                {/if}
              </button>

              {#if mobileSolutionsOpen}
                <div id="mobile-solutions-accordion" class="accordion-panel">
                  <div class="accordion-group">
                    <div class="accordion-heading">WHOM WE SERVE</div>
                    <ul class="sub-list">
                      {#each industries as sub}
                        <li>
                          <button class="sub-row" on:click={() => go(sub.href)}>
                            <span class="sub-text">{sub.label}</span>
                            <ChevronRight size={14} class="sub-chev" />
                          </button>
                        </li>
                      {/each}
                    </ul>
                  </div>

                  <div class="accordion-group">
                    <div class="accordion-heading">WHAT WE SERVE</div>
                    <ul class="sub-list">
                      {#each disciplines as sub}
                        <li>
                          <button class="sub-row" on:click={() => go(sub.href)}>
                            <span class="sub-text">{sub.label}</span>
                            <ChevronRight size={14} class="sub-chev" />
                          </button>
                        </li>
                      {/each}
                    </ul>
                  </div>

                  <div class="accordion-group">
                    <div class="accordion-heading">POPULAR SERVICES</div>
                    <ul class="sub-list">
                      {#each popularServices as sub}
                        <li>
                          <button class="sub-row" on:click={() => go(sub.href)}>
                            <span class="sub-text">{sub.label}</span>
                            <ChevronRight size={14} class="sub-chev" />
                          </button>
                        </li>
                      {/each}
                    </ul>
                  </div>

                  <div class="accordion-group">
                    <button class="cta-row" on:click={() => go('/solutions')}>
                      Explore all Solutions
                    </button>
                  </div>
                </div>
              {/if}
            </li>
          {:else}
            <li>
              <button
                class="list-row"
                on:click={() => go(item.href)}
                aria-label={item.label}
              >
                <span class="row-text">{item.label}</span>
                <span class="row-text">&gt;</span>
              </button>
            </li>

            {#if item.href === "/enroll-lab" && !$isAuthenticated}
              <li class="auth-li">
                <div class="mobile-auth">
                  <button
                    class="btn-outline auth-btn"
                    on:click={() => go("/login")}
                  >Login</button>
                  <button
                    class="btn-primary auth-btn"
                    on:click={() => go("/register")}
                  >Register</button>
                </div>
              </li>
            {/if}
          {/if}
        {/each}
      </ul>
    </div>
  </div>
{/if}

{#if cartOpen && isMobile}
<div class="cart-mobile-overlay" on:click={() => (cartOpen = false)}>
    <div class="cart-mobile-panel" on:click|stopPropagation>
      <button
        class="cart-mobile-close"
        on:click={() => (cartOpen = false)}
        aria-label="Close_cart"
      >×</button>
      <CartSection bind:isOpen={cartOpen} />
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1240px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2vw;
    box-sizing: border-box;
  }
  .inter-brand {
    display:inline-flex;
    font-size: 2rem;
    letter-spacing: 0.05em;
    color: #0c017b;
    font-weight: 800;
    
  }
  .phi {
  font-family:"InterVariable","Inter",sans-serif;
  font-weight:700;
  font-size:1.15em;
  line-height:1;
  text-transform:none; /* ensures lowercase stays */
}
  .nav-bar {
    margin: 25px auto;
    padding: 8px 20px;
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 85%;
    border-radius: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
    will-change: transform;
    transform: translateZ(0);
  }
  .nav-bar.sticky {
    width: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.18);
    background-color: rgba(255, 255, 255, 0.95);
  }
  @media screen and (max-width: 768px) {
    .nav-bar {
      width: 100%;
      margin: 0;
      border-radius: 0;
      padding-left: 12px;
      padding-right: 12px;
    }
    .nav-bar.sticky {
      width: 100%;
      margin: 0;
      border-radius: 0;
    }
  }
  .nav-contains {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .nav-links a {
    text-decoration: none;
    padding: 6px 12px;
    font-size: 0.9rem;
    color: #414141;
    border-radius: 50px;
    font-weight: 500;
    transition: background-color 0.2s ease, color 0.2s ease;
    cursor: pointer;
  }
  .nav-links > a:hover {
    background-color: #0c017b;
    color: #fff;
  }
  .quote-btn {
    background-color: #0c017b;
    color: #fff !important;
    padding: 6px 12px;
    font-size: 0.9rem;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.2s;
  }
  .hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    flex-direction: column;
    gap: 5px;
    padding: 8px;
  }
  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.35);
    width: 100vw;
    max-width: 100vw;
    overflow-x: hidden;
  }
  .mobile-panel {
    position: absolute;
    inset: 0;
    background: #fff;
    display: grid;
    grid-template-rows: auto auto 1fr;
    height: 100dvh;
    animation: fadeIn 0.15s ease-out;
    width: 100vw;
    max-width: 100vw;
    overflow-x: hidden;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .mobile-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 14px;
    border-bottom: 1px solid #eee;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 18px;
  }
  .close-btn {
    appearance: none;
    background: none;
    border: 0;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    color: #333;
    padding: 4px 8px;
  }
  .mobile-auth {
    padding: 12px 14px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    background: #fff;
  }
  .auth-li { border-bottom: 0; }
  .auth-btn {
    padding: 12px 14px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 16px;
    line-height: 1;
  }
  .btn-primary {
    background: var(--brand, #0c017b);
    color: #fff;
    border: 1px solid var(--brand, #0c017b);
  }
  .btn-outline {
    background: #fff;
    color: var(--brand, #0c017b);
    border: 1px solid var(--brand, #0c017b);
  }
  .btn-primary:active,
  .btn-outline:active { transform: scale(0.98); }
  .btn-primary:focus-visible,
  .btn-outline:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }
  .mobile-list {
    list-style: none;
    margin: 0;
    padding: 8px 0;
    overflow-y: auto;
  }
  .mobile-list li { border-bottom: 1px solid #eee; }
  .list-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    padding: 16px 16px;
    text-align: left;
    background: none;
    border: 0;
    cursor: pointer;
    font-size: clamp(20px, 4.2vw, 20px);
    color: #0c017b;
    font-weight: 500;
  }
  .list-row:active { background-color: #f5f5f5; }
  .row-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .solutions-trigger {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding-right: 10px;
  }
  .solutions-mega {
    position: fixed;                 /* was: absolute */
    left: 0;
    right: 0;
    top: var(--mega-top, 100px);     /* pinned to viewport */
    width: 100vw;                    /* span full viewport */
    z-index: 900;
    background: linear-gradient(90deg, #ffffff 0%, #ffffff 65%, #f5f6ff 100%);
    border-top: 1px solid #e9e9f3;
    box-shadow: 0 8px 28px -6px rgba(23, 25, 70, 0.15), 0 2px 6px rgba(23, 25, 70, 0.08);
    animation: megaFade 0.16s ease-out;
    font-size: 14px;
    transform: translateZ(0);    
  }
  .nav-bar.sticky + .solutions-mega { --mega-top: 64px; }
  @keyframes megaFade {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .solutions-inner {
    max-width: 1240px;
    margin: 0 auto;
    padding: 34px 40px 42px;
  }
  .solutions-columns {
    display: grid;
    grid-template-columns: repeat(3, 1fr) 340px;
    gap: 52px;
    align-items: start;
  }
  .mega-heading {
    font-size: 11px;
    letter-spacing: 0.15em;
    font-weight: 700;
    color: #b01273;
    margin: 0 0 18px;
  }
  .mega-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .mega-link {
    --icon-bg: #eef0ff;
    --icon-border: #d7daf7;
    --icon-color: #2e2fa2;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 12px;
    padding: 8px 10px 8px 4px;
    text-decoration: none;
    color: #1f2030;
    font-weight: 500;
    border-radius: 8px;
    position: relative;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .mega-link:focus-visible {
    outline: 2px solid #2e2fa2;
    outline-offset: 2px;
  }
  .mega-link:hover {
    background: #f2f4ff;
    color: #181946;
  }
  .mega-resource {
    border-left: 1px solid #ececf6;
    padding-left: 40px;
  }
  .resource-card {
    background: #ffffff;
    border: 1px solid #ececf6;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
  }
  .res-image {
    width: 100%;
    aspect-ratio: 16/9;
    background: linear-gradient(135deg, #d6dbff, #e9ecff);
    overflow: hidden;
  }
  .res-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .res-body {
    padding: 14px 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .res-title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.25;
    color: #142062;
    text-decoration: none;
  }
  .res-title:hover { text-decoration: underline; }
  .res-excerpt {
    font-size: 13px;
    line-height: 1.35;
    color: #4a4e70;
    margin: 0;
  }
  @media (max-width: 1240px) {
    .solutions-inner { padding: 30px 28px 38px; }
    .solutions-columns { gap: 40px; grid-template-columns: repeat(3, 1fr) 300px; }
  }
  @media (max-width: 980px) {
    .solutions-columns { grid-template-columns: repeat(3, 1fr); }
    .mega-resource { display: none; }
  }
  @media (max-width: 768px) {
    .solutions-mega { display: none; }
    .solutions-trigger.active { background: transparent; }
  }
  @media (max-width: 900px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
  }
  :global(body.menu-open) { overflow: hidden; }
  .profile-menu { position: relative; display: inline-flex; align-items: center; }
  .profile-trigger {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    border-radius: 50%;
  }
  .profile-trigger:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }
  .cart-link.mobile-cart { display: none; margin-right: 8px; }
  @media (max-width: 900px) {
    .cart-link.mobile-cart {
      display: inline-flex;
      align-items: center;
      background: none;
      border: none;
      padding: 0;
    }
    .nav-links .cart-link { display: none; }
  }
  .mobile-actions {
    display: none;
    align-items: center;
    gap: 10px;
  }
  @media (max-width: 900px) {
    .mobile-actions { display: flex; }
    .cart-link.mobile-cart { display: inline-flex; }
    .nav-links .cart-link { display: none; }
  }
  .nav-links .cart-link:hover {
    background: none;
    color: inherit;
  }
  .accordion-toggle { font-weight: 600; }
  .accordion-panel {
    padding: 8px 0 10px;
    background: #fafbff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  .accordion-group { padding: 8px 12px; }
  .accordion-heading {
    font-size: 11px;
    letter-spacing: 0.12em;
    font-weight: 700;
    color: #6b6fb3;
    text-transform: uppercase;
    margin: 6px 4px 8px;
  }
  .sub-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .sub-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 8px;
    background: none;
    border: 0;
    cursor: pointer;
    font-size: 16px;
    color: #0c017b;
    border-radius: 8px;
  }
  .sub-row:active { background: #f2f4ff; }
  .cta-row {
    width: 100%;
    margin-top: 8px;
    padding: 12px 14px;
    background: #0c017b;
    color: #fff;
    border: 0;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
