<script lang="ts">
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import { user, isAuthenticated } from "$lib/store";
  import { get } from "svelte/store";
  import { getProtectedData } from "$lib/store/api";
  import { writable } from "svelte/store";
  import CartSection from "$lib/CartSection/CartSection.svelte";
  import { goto } from "$app/navigation";
  import { loadUser } from "$lib/store/auth";
  import { API_URL } from "$lib/store/api";


  let scrolled = false;
  let dropdownOpen = false;
  let cartOpen = false;
  const authValid = writable(false);

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
    loadUser();
    checkAuth();
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
</script>

<svelte:window on:scroll={handleScroll} />

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
      <a href="/solutions">Solutions</a>
      <a href="/learn">Learn</a>
      <a href="/about-us">About</a>
      <a href="/enroll-lab" class="quote-btn">Collaborator</a>
      {#if $isAuthenticated}
        <a href="/profile">
          <img src="/assets/profile-icon/profile.svg" alt="Profile" width="30" height="30" style="vertical-align: middle;" />
        </a>
      {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      {/if}
      <a href="#" class="cart-link" on:click|preventDefault={toggleCart} style="display: inline-flex; align-items: center;">
        <img src="/assets/cart/cart1.svg" alt="Cart" width="30" height="30" style="vertical-align: middle;" />
      </a>
      <CartSection bind:isOpen={cartOpen} />
    </div>

    <button class="hamburger" on:click={openMobile} aria-label="Open menu">
      <img src="/assets/navbar/menu-line.svg" alt="menu" />
    </button>
  </div>
</nav>

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
<style>
  /* Import Inter font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  :root { 
    --main-font: "Inter", sans-serif; 
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

.nav-links a:hover { 
  background-color: #1746a2; 
  color: #fff; 
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
  .quote-btn:hover { transform: scale(1.05); }
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

  @media screen and (max-width: 768px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
  }

  :global(body.menu-open) { overflow: hidden; }
</style>

