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


  let scrolled = false;
  let menuOpen = false;
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
      const res = await fetch("http://localhost:8000/app1/categories/");
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
        `http://localhost:8000/app1/categories/${parentId}/subcategories/`,
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

  function handleScroll() {
    scrolled = window.scrollY > 50; // Adjusted for smooth scroll effect
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
</script>

<svelte:window on:scroll={handleScroll} />

<nav class="nav-bar {scrolled ? 'sticky' : ''}">
  <div class="container nav-contains">
    <div class="app-name">
      <a href="/"><span>APP NAME</span></a>
    </div>
    <div class="nav-links">
      <a
        href="/testing"
        class="mega-box-btn"
        on:click|preventDefault={() => goto("/testing")}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
      >
        Testing
      </a>
      <a href="/services">Services</a>
      <a href="/learn">Learn</a>
      <a href="/about">About Us</a>
      <a href="/enroll-lab" class="quote-btn">Enroll your lab</a>
      {#if $isAuthenticated}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a href="/profile">
          <img
            src="/assets/profile-icon/profile.svg"
            alt="Profile"
            width="30"
            height="30"
            style="vertical-align: middle;"
          />
        </a>
      {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      {/if}
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <a
        href="#"
        class="cart-link"
        on:click|preventDefault={toggleCart}
        style="display: inline-flex; align-items: center;"
      >
        <img
          src="/assets/cart/cart1.svg"
          alt="Profile"
          width="30"
          height="30"
          style="vertical-align: middle;"
        />
      </a>

      <!-- Add CartSection component -->
      <CartSection bind:isOpen={cartOpen} />
    </div>

    <button class="hamburger" on:click={() => (menuOpen = !menuOpen)}>
      <img src="/assets/navbar/menu-line.svg" alt="menu" />
    </button>
  </div>
</nav>

{#if menuOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="mobile-menu" on:click={() => (menuOpen = false)}>
    <div class="mobile-menu-content" on:click|stopPropagation>
      <a href="/testing" on:click={() => (menuOpen = false)}>Testing</a>
      <a href="/services" on:click={() => (menuOpen = false)}>Services</a>
      <a href="/learn" on:click={() => (menuOpen = false)}>Learn</a>
      <a href="/about" on:click={() => (menuOpen = false)}>About Us</a>
      <a href="/profile" on:click={() => (menuOpen = false)}>Profile</a>
      <a
        href="/request-quote"
        class="quote-btn-mobile"
        on:click={() => (menuOpen = false)}>Request A Quote</a
      >
    </div>
  </div>
{/if}

<style>
  :root {
    --main-font: "Roboto", sans-serif;
  }
  * {
    font-family: var(--main-font);
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
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.12);
  }

  .nav-contains {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .nav-bar.sticky {
    width: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.18);
    background-color: rgba(255, 255, 255, 0.95);
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
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .nav-links a:hover {
    background-color: #2709cf79;
    color: white;
    transform: scale(1.05);
  }

  .quote-btn {
    background-color: #2709cf79;
    color: white !important;
    padding: 6px 12px; /* Slimmer */
    font-size: 0.9rem;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.2s ease-in-out;
  }

  .quote-btn:hover {
    transform: scale(1.05);
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

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    z-index: 2000;
    animation: slideIn 0.2s forwards;
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .mobile-menu-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50px;
  }

  .mobile-menu-content a {
    padding: 12px;
    text-decoration: none;
    color: black;
    font-size: 18px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    transition: all 0.2s ease-in-out;
  }

  .mobile-menu-content a:hover {
    background-color: #2709cf79;
    color: white;
  }

  @media screen and (max-width: 768px) {
    .nav-links {
      display: none;
    }
    .hamburger {
      display: flex;
    }
  }

  /* Prevent body scrolling when cart is open */
  :global(body.cart-open) {
    overflow: hidden;
  }
</style>
