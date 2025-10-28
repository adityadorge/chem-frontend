<script lang="ts">
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import { user, isAuthenticated } from "$lib/store";
  import { get } from "svelte/store";
  import { getProtectedData } from "$lib/store/api";
  import { writable } from "svelte/store";
  import CartSection from "$lib/CartSection/CartSection.svelte";
  import { goto } from "$app/navigation";
  import { loadUser, clearUser } from "$lib/store/auth"; // changed: added clearUser
  import { API_URL } from "$lib/store/api";
  import {
    ShoppingBag,
    Utensils,
    HeartPulse,
    Hotel,
    Building2,
    MapPin,
    Store,
    TrendingUp,
    ShieldCheck,
    Zap,
    Smile,
    ChevronRight,
    ChevronDown ,
    ChevronUp
  } from "lucide-svelte";

  let scrolled = false;
  let dropdownOpen = false;
  let cartOpen = false;
  const authValid = writable(false);
  let isMobile = false;

  // Mega menu
  interface Category {
    id: number;
    category_name: string;
    description: string;
    image_url: string;
    info: string;
    subcategories: string[];
    created_at: string;
    updated_at: string;
  }

  const categories = writable<Category[]>([]);
  const subcategories = writable<{ [key: number]: Category[] }>({});

  let hoveredCategoryId: number | null = null;
  let hoveredSubCategoryId: number | null = null;

  onMount(async () => {
    fetchCategories();
    // loadUser(); // moved to root layout so dashboard works without Navbar
    checkAuth();

    const mq = window.matchMedia("(max-width: 900px)");
    isMobile = mq.matches;
    mq.addEventListener("change", e => isMobile = e.matches);
  });

  async function fetchCategories() {
    try {
      const res = await fetch(`${API_URL}/app1/categories/`);
      const data = await res.json();
      categories.set(data);
    } catch (e) {
      toast.error("Failed to fetch categories");
      console.error(e);
    }
  }

  async function checkAuth() {
    const currentUser = get(user);
    if (!currentUser?.access_token) return;

    try {
      const res = await getProtectedData(currentUser.access_token);
      console.log(currentUser.access_token);
      if (res?.status === 200 || res?.ok) {
        authValid.set(true);
      }
    } catch (e) {
      authValid.set(false);
    }
  }

  // Fetch subcategories by parent ID
  async function fetchSubcategories(parentId: number) {
    const currentSubs = get(subcategories);
    if (currentSubs[parentId]) return; // already fetched

    try {
      const res = await fetch(
        `${API_URL}/app1/categories/${parentId}/subcategories/`,
      );
      const data = await res.json();

      subcategories.update((s) => {
        s[parentId] = data;
        return s;
      });
    } catch (e) {
      console.error("Failed to fetch subcategories:", e);
    }
  }

  function toggleCart() {
    cartOpen = !cartOpen;
  }

  // Throttle + hysteresis to avoid flip-flop near the threshold
  let ticking = false;
  function handleScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      const ON = 70;   // turn sticky on after this
      const OFF = 30;  // turn sticky off only when above is undone enough
      scrolled = scrolled ? y > OFF : y > ON;
      ticking = false;
    });
  }

  function handleMouseEnter() {
    clearTimeout(megaMenuTimeout);
    dropdownOpen = true;
  }

  let megaMenuTimeout: ReturnType<typeof setTimeout>;
  function handleMouseLeave() {
    clearTimeout(megaMenuTimeout);
    megaMenuTimeout = setTimeout(() => {
      dropdownOpen = false;
      hoveredCategoryId = null; // Reset hovered category
      hoveredSubCategoryId = null; // Reset hovered subcategory
    }, 200);
  }

  let menuOpen = false;

  // Mobile-only items (different from desktop)
  const mobileNav = [
    { label: "Testing", href: "/testing" },
    { label: "Solutions", href: "/solutions" },
    { label: "Learn", href: "/learn" },
    { label: "About", href: "/about-us" },
    { label: "Collaborator", href: "/enroll-lab" }, // moved into the list
  ];

  function openMobile() {
    menuOpen = true;
    document.body.classList.add("menu-open");
  }
  function closeMobile() {
    menuOpen = false;
    document.body.classList.remove("menu-open");
  }
  async function go(href: string) {
    await goto(href);
    closeMobile();
  }

  // ---------------- SOLUTIONS MEGA MENU (desktop) ----------------
  let solutionsOpen = false;
  let solutionsTimeout: ReturnType<typeof setTimeout>;

  function openSolutions() {
    clearTimeout(solutionsTimeout);
    solutionsOpen = true;
  }
  function scheduleCloseSolutions() {
    clearTimeout(solutionsTimeout);
    solutionsTimeout = setTimeout(() => {
      solutionsOpen = false;
    }, 140);
  }
  function closeSolutionsImmediate() {
    clearTimeout(solutionsTimeout);
    solutionsOpen = false;
  }

  interface MegaItem {
    label: string;
    href: string;
    icon: any;
  }

  const industries: MegaItem[] = [
    { label: "Retail", href: "/solutions/retail", icon: ShoppingBag },
    { label: "Hospitality", href: "/solutions/hospitality", icon: Utensils },
    { label: "Healthcare", href: "/solutions/healthcare", icon: HeartPulse },
    { label: "Hotels", href: "/solutions/hotels", icon: Hotel },
    { label: "See all industries", href: "/solutions/industries", icon: Building2 }
  ];

  const businessTypes: MegaItem[] = [
    { label: "Single location", href: "/solutions/single-location", icon: MapPin },
    { label: "Multi-location", href: "/solutions/multi-location", icon: MapPin },
    { label: "Franchise", href: "/solutions/franchise", icon: Store },
    { label: "Enterprise", href: "/solutions/enterprise", icon: Building2 }
  ];

  const businessOutcomes: MegaItem[] = [
    { label: "Profitability", href: "/solutions/profitability", icon: TrendingUp },
    { label: "Compliance", href: "/solutions/compliance", icon: ShieldCheck },
    { label: "Efficiency", href: "/solutions/efficiency", icon: Zap },
    { label: "Team engagement", href: "/solutions/team-engagement", icon: Smile }
  ];

  const latestResource = {
    image: "/assets/solutions/national-cancer-institute-DYQfoftWGXw-unsplash.jpg", // replace with actual asset
    title: "Guide: Cost saving hacks",
    excerpt:
      "Strategies & tools to build a resilient, cost‑efficient operation.",
    href: "/resources/cost-saving-hacks"
  };

  // Optional: enable first tap on touch devices to just open mega menu, second tap navigates.
  function handleSolutionsClick(e: MouseEvent) {
    // Only intercept on large screens (desktop mega menu visible) AND touch/pointer coarse
    if (window.matchMedia('(max-width: 768px)').matches) return; // mobile uses normal nav
    if (window.matchMedia('(pointer: coarse)').matches && !solutionsOpen) {
      e.preventDefault();
      openSolutions();
    }
  }

  // ---- Profile dropdown state/handlers ----
  let profileOpen = false;
  let profileMenuEl: HTMLElement | null = null;
  let loggingOut = false; // add

  function toggleProfileMenu() {
    profileOpen = !profileOpen;
  }
  function closeProfileMenu() {
    profileOpen = false;
  }
  function onWindowClick(e: MouseEvent) {
    const target = e.target as Node | null;
    if (profileMenuEl && target && !profileMenuEl.contains(target)) {
      closeProfileMenu();
    }
  }
  async function handleLogout() {
    loggingOut = true; // add
    try {
      await fetch(`${API_URL}/auth/logout/`, { method: "POST", credentials: "include" });
      toast.success("Logged out");
    } catch (_) {
      // no-op
    } finally {
      user.set(null);
      clearUser();
      closeProfileMenu();
      loggingOut = false; // add (will navigate but keeps state consistent)
      goto("/");
    }
  }
</script>

<!-- merged window listeners to avoid undefined handler error -->
<svelte:window
  on:scroll={handleScroll}
  on:click={onWindowClick}
  on:keydown={(e)=>{ if (e.key === 'Escape') profileOpen = false; }}
/>

<nav class="nav-bar {scrolled ? 'sticky' : ''}">
  <div class="container nav-contains">
    <div class="app-name">
      <a href="/"><span>APP NAME</span></a>
    </div>
    <div class="nav-links">
      <!-- desktop (unchanged) -->
      <a
        href="/testing"
        class="mega-box-btn"
        on:click|preventDefault={() => goto("/testing")}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
      >Testing</a>
      <a
        href="/solutions"
        class="solutions-trigger {solutionsOpen ? 'active' : ''}"
        on:mouseenter={openSolutions}
        on:focus={openSolutions}
        on:mouseleave={scheduleCloseSolutions}
        on:blur={scheduleCloseSolutions}
        on:click={handleSolutionsClick}
        on:keydown={(e)=>{ if(e.key === 'Escape'){ closeSolutionsImmediate(); (e.currentTarget as HTMLElement).blur(); }}}
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
        <div class="profile-menu" bind:this={profileMenuEl}>
          <button
            class="profile-trigger"
            on:click={toggleProfileMenu}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
          >
            <img src="/assets/profile-icon/profile.svg" alt="Profile" width="30" height="30" style="vertical-align: middle;" />
          </button>
          {#if profileOpen}
            <div class="profile-dropdown" role="menu">
              <a href="/dashboard" class="menu-item" role="menuitem" on:click={closeProfileMenu}>Dashboard</a>
              <button
                class="menu-item danger"
                role="menuitem"
                on:click={handleLogout}
                disabled={loggingOut}
                aria-busy={loggingOut}
              >
                {#if loggingOut}
                  <span class="spinner" aria-hidden="true"></span>
                  <span class="sr-only">Logging out…</span>
                {:else}
                  Logout
                {/if}
              </button>
            </div>
          {/if}
        </div>
      {:else}
        <a href="/login">Login</a>
        <!-- <a href="/register">Register</a> -->
      {/if}
      <!-- Desktop: inline cart section -->
      <a href="#" class="cart-link" on:click|preventDefault={toggleCart}>
        <img src="/assets/cart/cart1.svg" alt="Cart" width="30" height="30" />
      </a>
      {#if cartOpen && !isMobile}
        <CartSection bind:isOpen={cartOpen} />
      {/if}
    </div>
    <!-- Mobile actions: cart + hamburger -->
    <div class="mobile-actions">
      <a
        href="#"
        class="cart-link mobile-cart"
        on:click|preventDefault={toggleCart}
        aria-label="Open cart"
      >
        <img src="/assets/cart/cart1.svg" alt="Cart" width="28" height="28" />
      </a>
      <button class="hamburger" on:click={openMobile} aria-label="Open menu">
        <img src="/assets/navbar/menu-line.svg" alt="menu" />
      </button>
    </div>
  </div>
</nav>

{#if solutionsOpen}
  <!-- Mega menu (desktop only) -->
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
          <h4 class="mega-heading">INDUSTRIES</h4>
          <ul class="mega-list">
            {#each industries as item}
              <li>
                <a href={item.href} class="mega-link" role="menuitem">
                  <span >
                    <svelte:component this={item.icon} size={26} />
                  </span>
                  <span class="text">{item.label}</span>
                  <ChevronRight size={16} class="chev" aria-hidden="true" />
                </a>
              </li>
            {/each}
          </ul>
        </div>
        <div class="mega-col">
          <h4 class="mega-heading">BUSINESS TYPE</h4>
          <ul class="mega-list">
            {#each businessTypes as item}
              <li>
                <a href={item.href} class="mega-link" role="menuitem">
                  <span>
                    <svelte:component this={item.icon} size={26} />
                  </span>
                  <span class="text">{item.label}</span>
                  <ChevronRight size={16} class="chev" aria-hidden="true" />
                </a>
              </li>
            {/each}
          </ul>
        </div>
        <div class="mega-col">
          <h4 class="mega-heading">BUSINESS OUTCOMES</h4>
          <ul class="mega-list">
            {#each businessOutcomes as item}
              <li>
                <a href={item.href} class="mega-link" role="menuitem">
                  <span>
                    <svelte:component this={item.icon} size={26} />
                  </span>
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
  <!-- Full-screen overlay -->
  <div class="mobile-overlay" on:click={closeMobile}>
    <div class="mobile-panel" on:click|stopPropagation>
      <div class="mobile-topbar">
        <div class="brand">
          <img src="/favicon.png" alt="Logo" width="24" height="24" />
          <span>APP NAME</span>
        </div>
        <button class="close-btn" on:click={closeMobile} aria-label="Close menu">×</button>
      </div>

      <ul class="mobile-list">
        {#each mobileNav as item}
          <li>
            <button class="list-row" on:click={() => go(item.href)} aria-label={item.label}>
              <span class="row-text">{item.label}</span>
              <svg class="chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707A1 1 0 118.707 5.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </li>

          {#if item.href === "/enroll-lab" && !$isAuthenticated}
            <li class="auth-li">
              <div class="mobile-auth">
                <button class="btn-outline auth-btn" on:click={() => go("/login")}>Login</button>
                <button class="btn-primary auth-btn" on:click={() => go("/register")}>Register</button>
              </div>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  </div>
{/if}

{#if cartOpen && isMobile}
  <div class="cart-mobile-overlay" on:click={() => cartOpen = false}>
    <div class="cart-mobile-panel" on:click|stopPropagation>
      <button class="cart-mobile-close" on:click={() => cartOpen = false} aria-label="Close cart">×</button>
      <CartSection bind:isOpen={cartOpen} />
    </div>
  </div>
{/if}

<style>
  /* Import Inter font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  :root { 
    --main-font: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    --brand: #1746a2; 
  }
  * { font-family: var(--main-font); }

  /* Avoid animating layout properties; keep transforms/opacity only */
  .nav-bar {
    margin: 25px auto;
    padding: 8px 20px;
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 85%;
    border-radius: 40px;
    background-color: rgba(255,255,255,0.9);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease;
    box-shadow: 0 3px 12px rgba(0,0,0,.12);
    will-change: transform;
    transform: translateZ(0);
  }

  .nav-bar.sticky {
    width: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: 0 3px 12px rgba(0,0,0,.18);
    background-color: rgba(255,255,255,.95);
  }

  /* Mobile: keep dimensions constant to prevent bounce */
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

  .nav-contains { display: flex; justify-content: space-between; align-items: center; }
  .nav-links { display: flex; align-items: center; gap: 15px; }
.nav-links a { 
  text-decoration: none; 
  padding: 6px 12px; 
  font-size: .9rem; 
  color: #414141; 
  border-radius: 50px; 
  font-weight: 500; 
  transition: background-color .2s ease, color .2s ease; 
  cursor: pointer; 
}

/* Limit hover styling to top-level nav links only */
.nav-links > a:hover { 
  background-color: #1746a2; 
  color: #fff; 
}

/* Keep dropdown (Dashboard) text dark and readable on hover */
.profile-dropdown .menu-item { 
  color: #1f2937; /* slate-800 */
}
.profile-dropdown .menu-item:hover,
.profile-dropdown .menu-item:focus {
  background: #eaf1fb;  /* light brand tint */
  color: #111827;       /* gray-900 */
}

  .quote-btn { 
    background-color: #1746a2; 
    color: #fff !important; 
    padding: 6px 12px; 
    font-size: .9rem; 
    border-radius: 50px; 
    font-weight: 600; 
    transition: all .2s; 
  }
  .hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 8px; }

  /* Mobile overlay + panel (responsive) */
  .mobile-overlay {
    position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.35);
    width: 100vw; max-width: 100vw; overflow-x: hidden;
  }
  .mobile-panel {
    position: absolute; inset: 0; background: #fff;
    display: grid; grid-template-rows: auto auto 1fr;
    height: 100dvh; animation: fadeIn .15s ease-out;
    width: 100vw; max-width: 100vw; overflow-x: hidden;
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }

  .mobile-topbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 14px; border-bottom: 1px solid #eee; }
  .brand { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 18px; }

  .close-btn { appearance: none; background: none; border: 0; font-size: 28px; line-height: 1; cursor: pointer; color: #333; padding: 4px 8px; }

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
    background: var(--brand);
    color: #fff;
    border: 1px solid var(--brand);
  }
  .btn-outline {
    background: #fff;
    color: var(--brand);
    border: 1px solid var(--brand);
  }
  .btn-primary:active, .btn-outline:active { transform: scale(0.98); }
  .btn-primary:focus-visible, .btn-outline:focus-visible {
    outline: 2px solid #111; outline-offset: 2px;
  }

  .mobile-list { list-style: none; margin: 0; padding: 8px 0; overflow-y: auto; }
  .mobile-list li { border-bottom: 1px solid #eee; }

  .list-row {
    width: 100%;
    padding: 16px 16px;
    text-align: left; background: none; border: 0; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    font-size: clamp(16px, 4.2vw, 19px); color: #111;
  }
  .list-row:active { background-color: #f5f5f5; }

  .row-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .chevron { width: 14px; height: 14px; color: #9ca3af; flex: 0 0 auto; }

  /* -------- Solutions Mega Menu Styles (desktop only) -------- */
  .solutions-trigger {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding-right: 10px;
  }
  /* remove old caret if desired */

  .solutions-mega {
    position: absolute;
    left: 0;
    top: 100px; /* below initial nav height (~margin + height) */
    width: 100%;
    z-index: 900;
    background: linear-gradient(90deg,#ffffff 0%, #ffffff 65%, #f5f6ff 100%);
    border-top: 1px solid #e9e9f3;
    box-shadow: 0 8px 28px -6px rgba(23,25,70,0.15), 0 2px 6px rgba(23,25,70,0.08);
    animation: megaFade .16s ease-out;
    font-size: 14px;
  }
  .nav-bar.sticky + .solutions-mega {
    top: 64px; /* smaller when sticky */
  }
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
  .mega-col {}
  .mega-heading {
    font-size: 11px;
    letter-spacing: .15em;
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
    transition: background .15s ease, color .15s ease;
  }
  .mega-link:focus-visible {
    outline: 2px solid #2e2fa2;
    outline-offset: 2px;
  }
  .mega-link:hover {
    background: #f2f4ff;
    color: #181946;
  }
  .icon-bubble {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--icon-bg);
    border: 1px solid var(--icon-border);
    color: var(--icon-color);
  }
  .mega-link .chev {
    color: #6f72a8;
    opacity: 0;
    transition: opacity .15s ease, transform .15s ease;
  }
  .mega-link:hover .chev {
    opacity: 1;
    transform: translateX(2px);
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
    background: linear-gradient(135deg,#d6dbff,#e9ecff);
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
  .res-title:hover {
    text-decoration: underline;
  }
  .res-excerpt {
    font-size: 13px;
    line-height: 1.35;
    color: #4a4e70;
    margin: 0;
  }
  @media (max-width: 1240px) {
    .solutions-inner {
      padding: 30px 28px 38px;
    }
    .solutions-columns {
      gap: 40px;
      grid-template-columns: repeat(3,1fr) 300px;
    }
  }
  @media (max-width: 980px) {
    .solutions-columns {
      grid-template-columns: repeat(3,1fr);
    }
    .mega-resource {
      display: none;
    }
  }
  @media (max-width: 768px) {
    .solutions-mega {
      display: none;
    }
    .solutions-trigger.active {
      background: transparent;
    }
  }
  @media (max-width: 900px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
  }

  :global(body.menu-open) { overflow: hidden; }

  /* Profile dropdown */
  .profile-menu {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
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
  .profile-dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    min-width: 170px;
    background: #fff;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    box-shadow: 0 10px 24px rgba(0,0,0,.08);
    padding: 6px;
    z-index: 1200;
    display: grid;
    gap: 4px;
  }
  .profile-dropdown .menu-item {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: 0;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 0.92rem;
    color: #222;
    text-decoration: none;
    cursor: pointer;
  }
  .profile-dropdown .menu-item:hover {
    background: #f5f7ff;
  }
  .profile-dropdown .menu-item.danger {
    color: #b01212;
  }
  .profile-dropdown .menu-item.danger:hover {
    background: #fff5f5;
  }
  .profile-dropdown .menu-item[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-right-color: currentColor;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
    animation: spin .6s linear infinite;
    vertical-align: middle;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,1px,1px);
    white-space: nowrap; border: 0;
  }

  /* ...existing code... */
.cart-link.mobile-cart {
  display: none;
  margin-right: 8px;
}
@media (max-width: 900px) {
  .cart-link.mobile-cart {
    display: inline-flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
  }
  .nav-links .cart-link {
    display: none;
  }
}

.mobile-actions {
  display: none;
  align-items: center;
  gap: 10px;
}
@media (max-width: 900px) {
  .mobile-actions {
    display: flex;
  }
  .cart-link.mobile-cart {
    display: inline-flex;
  }
  .nav-links .cart-link {
    display: none;
  }
}
</style>

