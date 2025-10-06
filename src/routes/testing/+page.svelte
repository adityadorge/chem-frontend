<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { get } from "svelte/store";
  import CardsSection from "$lib/Testing_Component/CardsSection/CardsSection.svelte";
  import Filter from "$lib/Testing_Component/Filter/Filter.svelte";
  import TestCardsSection from "$lib/Testing_Component/TestCardsSection/TestCardsSection.svelte";
  import Navbar from "$lib/Navbar/Navbar.svelte";
  import { goto } from "$app/navigation";
  import { API_URL } from "$lib/store/api";

  let searchTerm: string = "";

  interface Category {
    image_url: string;
    category_name: string;
    description?: string;
    info?: string;
    id: number;
  }

  interface Subcategory {
    category_name: string;
    description?: string;
    info?: string;
    image_url: string;
  }

  interface Test {
    id: number;
    test_name: string;
    image_url: string;
    test_description: string;
    test_price: number;
  }

  type BreadcrumbItem = {
    label: string;
    type: "home" | "category" | "subcategory";
    data: any;
  };

  let breadcrumbPath: BreadcrumbItem[] = [
    { label: "Home", type: "home", data: null },
  ];
  let categories: Category[] = [];
  let selectedCategory: Category | null = null;
  let subcategories: Subcategory[] = [];
  let tests: Test[] = [];

  // Fetch the category data from the Django API
  async function fetchCategories() {
    const response = await fetch(`${API_URL}/app1/categories/`);
    const data: Category[] = await response.json();
    categories = data;
  }

  // Fetch subcategories for a selected category
  async function fetchData(categoryId: number) {
    const subcategories_response = await fetch(
      `${API_URL}/app1/categories/${categoryId}/subcategories/`
    );
    const subcategories_data: Subcategory[] =
      await subcategories_response.json();
    subcategories = subcategories_data;

    const test_response = await fetch(
      `${API_URL}/app1/categories/${categoryId}/tests/`
    );
    const test_data: Test[] = await test_response.json();
    tests = test_data;
  }

  $: categoryId = $page.url.searchParams.get("category");
  // Reactively fetch data when categoryId changes
  function updateSelectionFromUrl() {
    const cat = categories.find((c) => c.id === Number(categoryId));
    if (cat) {
      selectedCategory = cat;
      fetchData(selectedCategory.id);
    }
  }
  $: if (categoryId && categories.length) {
    updateSelectionFromUrl();
  }

  // Fetch categories when the component is mounted
  onMount(() => {
    fetchCategories().then(() => {
      if (typeof window !== "undefined") {
        // Read URL params
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("category");
        if (categoryId) {
          const cat = categories.find((c) => c.id === Number(categoryId));
          if (cat) {
            selectedCategory = cat;
            fetchData(cat.id);
          }
        }
        window.addEventListener("popstate", handlePopState);
      }
    });
  });

  /**************** *This is the breadcrumb implementation **************/

  function goBack(level: number) {
    // Keep breadcrumb up to the desired level
    breadcrumbPath = breadcrumbPath.slice(0, level + 1);

    // Update state based on the new breadcrumb
    const last = breadcrumbPath[breadcrumbPath.length - 1];
    if (last.type === "home") {
      selectedCategory = null;
      subcategories = [];
      tests = [];
    } else if (last.type === "category") {
      selectedCategory = last.data;
      fetchData(last.data.id);
    } else if (last.type === "subcategory") {
      // Optionally handle subcategory state here
    }
  }

  function navigateTo(item: {
    label: string;
    type: "category" | "subcategory";
    data: any;
  }) {
    // Find if this item already exists in the path
    let idx = -1;
    if (item.type === "category") {
      idx = breadcrumbPath.findIndex(
        (b) => b.type === "category" && b.data?.id === item.data.id
      );
    } else if (item.type === "subcategory") {
      idx = breadcrumbPath.findIndex(
        (b) =>
          b.type === "subcategory" &&
          b.data?.category_name === item.data.category_name
      );
    }
    if (idx === -1) {
      breadcrumbPath = [...breadcrumbPath, item];
    } else {
      breadcrumbPath = breadcrumbPath.slice(0, idx + 1);
    }
  }
  /**************** *This is the breadcrumb implementation **************/

  // Handle the click on the arrow link to fetch subcategories
  function showSubcategories(categoryOrSubcategory: Category | Subcategory) {
    // If it's a Category (has id), treat as category
    if ("id" in categoryOrSubcategory) {
      const category = categoryOrSubcategory as Category;
      selectedCategory = category;
      subcategories = [];
      tests = [];
      navigateTo({
        label: category.category_name,
        type: "category",
        data: category,
      });
      fetchData(category.id);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("category", category.id.toString());
        url.searchParams.delete("test");

        // Use goto instead of history.pushState
        goto(url.pathname + url.search, {
          replaceState: false, // Set to true if you want to replace instead of push
          noScroll: false, // You can set true if you want to avoid scrolling
          keepFocus: true, // Keep focus where it was
        });
      }
    } else {
      // It's a subcategory
      const subcategory = categoryOrSubcategory as Subcategory;
      navigateTo({
        label: subcategory.category_name,
        type: "subcategory",
        data: subcategory,
      });
      // Optionally, fetch tests for subcategory here if needed
      // fetchTestsForSubcategory(subcategory);
    }
  }

  // Listen for back/forward navigation
  function handlePopState(event: PopStateEvent) {
    // Read the current URL and update state accordingly
    const url = new URL(window.location.href);
    const categoryId = url.searchParams.get("category");
    const testId = url.searchParams.get("test");

    if (!categoryId) {
      // Home
      breadcrumbPath = [{ label: "Home", type: "home", data: null }];
      selectedCategory = null;
      subcategories = [];
      tests = [];
    } else {
      // Find the category
      const cat = categories.find((c) => c.id === Number(categoryId));
      if (cat) {
        selectedCategory = cat;
        breadcrumbPath = [
          { label: "Home", type: "home", data: null },
          { label: cat.category_name, type: "category", data: cat },
        ];
        fetchData(cat.id);
      }
      // If you support subcategories in URL, add logic here
    }
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", handlePopState);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("popstate", handlePopState);
    }
  });

  // Header UI state
  let pageTitle = "Testing";
  let pageSubtitle =
    "The go-to place for employers, managers, and employees to connect and learn about the world of work";

  let selectedCategoryId: string = "";
  let selectedSubcategoryName: string = "";

  function onSelectCategory(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    selectedCategoryId = value;

    if (!value) {
      // Reset to Home
      breadcrumbPath = [{ label: "Home", type: "home", data: null }];
      selectedCategory = null;
      subcategories = [];
      tests = [];
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("category");
        url.searchParams.delete("test");
        goto(url.pathname + url.search, { replaceState: true });
      }
      return;
    }

    const id = Number(value);
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      // Drive your existing flow
      showSubcategories(cat);
    }
  }

  function onSelectSubcategory(e: Event) {
    selectedSubcategoryName = (e.target as HTMLSelectElement).value;
    // If you later fetch tests by subcategory, trigger it here.
  }

  function showResults() {
    // Smooth scroll to cards
    if (typeof window !== "undefined") {
      document
        .querySelector(".cards-wrapper")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  let mobileFiltersOpen = false; // mobile-only toggle

  // ----- Content section (Latest / Featured) -----
  type LatestItem = {
    id: number;
    type: string;
    title: string;
    description: string;
    image: string;
    href: string;
  };

  type FeaturedItem = {
    id: number;
    title: string;
    image: string;
    href: string;
  };

  let latestContent: LatestItem[] = [
    {
      id: 1,
      type: "EBOOK",
      title: "Retailer’s Guide to Labor Demand Forecasting",
      description:
        "Learn how top retailers are using labor demand forecasting to stay cost-efficient, match their staffing to customer demand, and maximize sales.Learn how top retailers are using labor demand forecasting to stay cost-efficient, match their staffing to customer demand, and maximize sales.",
      image:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1600&auto=format&fit=crop",
      href: "#"
    },
    {
      id: 2,
      type: "REPORT",
      title: "Shift Pulse Report 2024",
      description:
        "Learn how top retailers are using labor demand forecasting to stay cost-efficient, match their staffing to customer demand, and maximize sales.Learn how top retailers are using labor demand forecasting to stay cost-efficient, match their staffing to customer demand, and maximize sales.",
      image:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1600&auto=format&fit=crop",
      href: "#"
    },
    {
      id: 3,
      type: "GUIDE",
      title: "How to Navigate Fair Workweek Laws",
      description:
        "Learn how top retailers are using labor demand forecasting to stay cost-efficient, match their staffing to customer demand, and maximize sales.Learn how top retailers are using labor demand forecasting to stay cost-efficient, match their staffing to customer demand, and maximize sales.",
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop",
      href: "#"
    }
  ];
  let latestIndex = 0;

  let featuredItems: FeaturedItem[] = [
    {
      id: 1,
      title: "Check out state labor laws in our Compliance Hub",
      image:
        "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=600&auto=format&fit=crop",
      href: "#"
    },
    {
      id: 2,
      title: "Guide to Fair Workweek Laws",
      image:
        "https://images.unsplash.com/photo-1554774853-b415df9eeb92?q=80&w=600&auto=format&fit=crop",
      href: "#"
    },
    {
      id: 3,
      title: "Shift Pulse Report 2024",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop",
      href: "#"
    }
  ];
  // ...existing code...
</script>

<!-- Replace the old breadcrumb + Filter with the new hero header -->
<section class="testing-hero">
  <!-- Decorative shapes -->
  <div class="decor decor-left" aria-hidden="true">
    <svg width="120" height="70" viewBox="0 0 120 70" fill="none">
      <path
        d="M5 20c20-20 40 20 60 0s40 20 50 10"
        stroke="#FFC32E"
        stroke-width="8"
        stroke-linecap="round"
        fill="none"
      />
      <path
        d="M5 40c20-20 40 20 60 0s40 20 50 10"
        stroke="#FFC32E"
        stroke-width="8"
        stroke-linecap="round"
        fill="none"
      />
      <path
        d="M5 60c20-20 40 20 60 0s40 20 50 10"
        stroke="#FFC32E"
        stroke-width="8"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
  </div>
  <div class="decor decor-right" aria-hidden="true">
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path
        d="M20 80c15-35 20-55 40-40s-5 35 10 40 20-15 30-20"
        stroke="#B39CFF"
        stroke-width="16"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
  </div>

  <!-- Centered content -->
  <div class="hero-inner">
    <nav class="hero-crumbs" aria-label="Breadcrumb">
      {#each breadcrumbPath as crumb, i}
        {#if i > 0}
          <span class="crumb-sep">/</span>
        {/if}
        <span
          class="crumb"
          on:click={() => goBack(i)}
          aria-current={i === breadcrumbPath.length - 1 ? "page" : undefined}
        >
          {crumb.label}
        </span>
      {/each}
    </nav>

    <h1 class="max-w-2xl mx-auto mb-4 text-center text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
      {pageTitle}
    </h1>
    <p class="max-w-2xl mb-6 mx-auto text-center font-light text-white-500 lg:mb-8 md:text-lg lg:text-xl dark:text-white-400">{pageSubtitle}</p>

    <!-- Blue section bottom wave -->
    <div class="hero-wave" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0,64 C240,96 480,32 720,48 C960,64 1200,112 1440,96 L1440,120 L0,120 Z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  </div>
</section>

<!-- Light underlay with floating filter bar -->
<section class="testing-underlay">
  <div class="filters-dock">
    <!-- Mobile toggle (hidden on larger screens) -->
    <button
      class="filters-toggle"
      type="button"
      on:click={() => (mobileFiltersOpen = !mobileFiltersOpen)}
      aria-expanded={mobileFiltersOpen}
      aria-controls="filtersBar"
    >
      <span>START YOUR SEARCH</span>
      <svg class:open={mobileFiltersOpen} class="chev" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>

    <!-- single-line toolbar: label + controls -->
    <div id="filtersBar" class="filters-bar" class:mobile-open={mobileFiltersOpen}>
      <span class="filters-label">FILTER BY</span>
      <div class="filters-row">
        <!-- Category -->
        <div class="pill">
          <select on:change={onSelectCategory} bind:value={selectedCategoryId} aria-label="Content type">
            <option value="">Content type</option>
            {#each categories as c}
              <option value={c.id}>{c.category_name}</option>
            {/each}
          </select>
        </div>

        <!-- Subcategory -->
        <div class="pill">
          <select on:change={onSelectSubcategory} bind:value={selectedSubcategoryName} aria-label="Topic" disabled={!subcategories.length}>
            <option value="">{subcategories.length ? "Topic" : "Select category first"}</option>
            {#each subcategories as sc}
              <option value={sc.category_name}>{sc.category_name}</option>
            {/each}
          </select>
        </div>

        <!-- Placeholder -->
        <div class="pill">
          <select aria-label="Business type" disabled>
            <option>Business type</option>
          </select>
        </div>

        <!-- Search -->
        <div class="pill pill-input">
          <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M21 21l-4.3-4.3m1.8-5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" fill="none" stroke="#9aa0a6" stroke-width="2" stroke-linecap="round" />
          </svg>
          <input type="search" placeholder="Search" bind:value={searchTerm} aria-label="Search tests" />
        </div>

        <!-- Button -->
        <button class="pill-btn" type="button" on:click={showResults}>Show results</button>
      </div>
    </div>
  </div>
</section>

<!-- Content section: Latest content (left) + Featured (right) -->
<section class="content-section">
  <div class="content-container">
    <div class="content-grid">
      <!-- Left: Latest content -->
      <div class="latest-col">
        <h2 class="section-h2">Latest content</h2>

        {#if latestContent.length}
          {#key latestIndex}
            <article class="latest-card">
              <img class="latest-img" src={latestContent[latestIndex].image} alt="" />
              <div class="latest-body">
                <span class="type-pill">{latestContent[latestIndex].type}</span>

                <a class="latest-title" href={latestContent[latestIndex].href}>
                  {latestContent[latestIndex].title}
                  <svg class="link-arrow" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>

                <p class="latest-desc">{latestContent[latestIndex].description}</p>

                <div class="dots" role="tablist" aria-label="Latest slides">
                  {#each latestContent as _, i}
                    <button
                      class="dot"
                      class:active={i === latestIndex}
                      aria-label={`Go to slide ${i + 1}`}
                      aria-selected={i === latestIndex}
                      role="tab"
                      on:click={() => (latestIndex = i)}
                    />
                  {/each}
                </div>
              </div>
            </article>
          {/key}
        {/if}
      </div>

      <!-- Right: Featured list + subscribe banner -->
      <aside class="featured-col">
        <h2 class="section-h2">Featured</h2>

        <ul class="featured-list">
          {#each featuredItems as f}
            <li class="featured-item">
              <a class="featured-link" href={f.href}>
                <div class="thumb-wrap">
                  <div class="thumb-bg"></div>
                  <img class="thumb" src={f.image} alt="" />
                </div>
                <span class="feat-text">{f.title}</span>
                <svg class="feat-arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </li>
          {/each}
        </ul>

        <div class="subscribe-card" role="region" aria-label="Subscribe">
          <div class="sub-left">
            <div class="sub-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M4 6h16v12H4z" fill="#FFC32E"/><path d="M4 6l8 6 8-6" fill="none" stroke="#A66E00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="sub-copy">
              <p class="sub-title">Subscribe to our newsletter</p>
              <p class="sub-desc">to get workplace tips delivered straight to your inbox</p>
            </div>
          </div>
          <a class="sub-btn" href="#">Subscribe now</a>
        </div>
      </aside>
    </div>

    <!-- Divider between content section and cards -->
    <div
      class="content-divider"
      role="separator"
      aria-label="select from wide variety of categories"
    >
      <span class="content-divider__text">select from wide variety of categories</span>
    </div>
  </div>
</section>

<main>
  <div class="cards-container">
    <div class="cards-wrapper" class:list={tests.length > 0 && selectedCategory}>
      {#if categories.length > 0 && !selectedCategory}
        <div class="card-grid">
          {#each categories
            .filter((category) =>
              category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort(
              (a, b) =>
                b.category_name.toLowerCase().startsWith(searchTerm.toLowerCase())
                  ? 1
                  : a.category_name.toLowerCase().startsWith(searchTerm.toLowerCase())
                  ? -1
                  : 0
            ) as category}
            <CardsSection
              icon={category.image_url}
              title={category.category_name}
              description={category.description}
              info={category.info}
              category={category}
              {showSubcategories}
            />
          {/each}
        </div>
      {/if}

      {#if subcategories.length > 0 && selectedCategory}
        <div class="card-grid">
          {#each subcategories
            .filter((subcategory) =>
              subcategory.category_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort(
              (a, b) =>
                b.category_name.toLowerCase().startsWith(searchTerm.toLowerCase())
                  ? 1
                  : a.category_name.toLowerCase().startsWith(searchTerm.toLowerCase())
                  ? -1
                  : 0
            ) as subcategory}
            <CardsSection
              icon={subcategory.image_url}
              title={subcategory.category_name}
              description={subcategory.description}
              info={subcategory.info}
              category={subcategory}
              {showSubcategories}
            />
          {/each}
        </div>
      {/if}

      {#if tests.length > 0 && selectedCategory}
        {#each tests
          .filter((test) => test.test_name.toLowerCase().includes(searchTerm.toLowerCase()))
          .sort((a, b) => (b.test_name.toLowerCase().startsWith(searchTerm.toLowerCase()) ? 1 : a.test_name.toLowerCase().startsWith(searchTerm.toLowerCase()) ? -1 : 0)) as test}
          <TestCardsSection
            {test}
          />
        {/each}
      {/if}
    </div>
  </div>
</main>

<style>
  /* Colors */
  :root {
    --hero: #0c017b; /* deep blue */
    --hero-light: #eff1ff; /* light blue tint */
    --text-muted: #eff1ff;
    --accent: #3e27b7;
    --accent-2: #0c017b;
  }

  /* Hero header */
  .testing-hero {
    position: relative;
    background: var(--hero);
    color: #fff;
    overflow: hidden;
  }
  .hero-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 56px 20px 140px; /* bottom extra for wave */
    text-align: center;
  }
  .hero-crumbs {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--text-muted);
    font-size: 12px;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .crumb {
    cursor: pointer;
    opacity: 0.95;
  }
  .crumb:hover {
    text-decoration: underline;
  }
  .crumb-sep {
    opacity: 0.6;
  }

  .hero-title {
    font-size: clamp(28px, 4.2vw, 44px);
    font-weight: 800;
    margin: 0 0 10px;
  }
  .hero-subtitle {
    max-width: 760px;
    margin: 0 auto;
    font-size: clamp(14px, 2vw, 18px);
    line-height: 1.5;
    color: #eef0ff;
    opacity: 0.95;
  }

  /* Bottom wave of the hero (inherits --hero color) */
  .hero-wave {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    color: var(--hero);
    line-height: 0;
  }
  .hero-wave svg {
    width: 100%;
    height: 120px;
    display: block;
  }

  /* Decorative squiggles */
  .decor {
    position: absolute;
    pointer-events: none;
    opacity: 0.9;
  }
  .decor-left {
    left: clamp(8px, 6vw, 80px);
    top: 80px;
  }
  .decor-right {
    right: clamp(8px, 6vw, 120px);
    bottom: 80px;
  }

  /* Light underlay below the wave, hosting the filter bar */
  /* Bigger light-blue section */
  .testing-underlay {
    position: relative;
    background: var(--hero-light);
    padding: 60px 0 50px; /* increased height */
  }

  /* Dock width and position under the wave */
  .filters-dock {
    width: min(1240px, calc(100% - 32px)); /* a bit wider */
    margin: 0 auto 0; /* pull up slightly under the wave */
    background: transparent;
  }

  /* One-line bar: label + controls */
  .filters-bar {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 44px;
    /* subtle alignment to baseline */
    padding-inline: 2px;
  }

  /* Label kept on one line */
  .filters-label {
    color: var(--accent);
    font-weight: 800;
    letter-spacing: 1.6px;
    font-size: 12px;
    white-space: nowrap;   /* keep on one line */
    margin: 0;             /* remove previous margins */
  }

  /* Controls row stays on one line; scrolls horizontally if cramped */
  .filters-row {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1 1 auto;
    flex-wrap: nowrap;           /* force single line */
    overflow-x: auto;            /* allow horizontal scroll if needed */
    overflow-y: hidden;
    scrollbar-width: thin;       /* Firefox */
  }
  .filters-row::-webkit-scrollbar { height: 6px; }
  .filters-row::-webkit-scrollbar-thumb { background: #d7daf3; border-radius: 4px; }

  /* Pills */
  .pill,
  .pill-btn,
  .pill-input {
    height: 44px;
    border-radius: 10px;
    flex: 0 0 auto; /* don’t shrink */
  }
  .pill {
    background: #fff;
    border: 1px solid #e6e7ee;
    box-shadow: 0 1px 2px rgba(60,64,67,.16), 0 2px 6px rgba(60,64,67,.08);
    display: flex;
    align-items: center;
    padding: 0 12px;
    min-width: 160px; /* stable width so items align neatly */
  }
  .pill select {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: #2b2b2b;
  }
  .pill select:disabled { color: #9aa0a6; }

  /* Search grows a bit but stays on one line */
  .pill-input {
    min-width: 240px;
    width: 320px;       /* pleasant width on desktop */
    max-width: 420px;
    background: #fff;
    border: 1px solid #e6e7ee;
    box-shadow: 0 1px 2px rgba(60,64,67,.16), 0 2px 6px rgba(60,64,67,.08);
    padding: 0 12px;
    display: flex;
    align-items: center;
  }
  .pill-input .icon { margin-right: 8px; flex: 0 0 auto; }
  .pill-input input {
    flex: 1 1 auto;
    height: 100%;
    border: none;
    outline: none;
    font-size: 14px;
    background: transparent;
    color: #2b2b2b;
  }

  /* Button */
  .pill-btn {
    padding: 0 18px;
    background: #fff;
    color: var(--accent);
    font-weight: 700;
    border: 2px solid var(--accent);
    box-shadow: 0 1px 2px rgba(60,64,67,.06);
    cursor: pointer;
    transition: background .15s, color .15s, transform .05s, border-color .15s;
    white-space: nowrap; /* keep button text one line */
  }
  .pill-btn:hover { background: var(--accent); color: #fff; border-color: var(--accent-2); }
  .pill-btn:active { transform: translateY(1px); }

  /* Mobile toggle (hidden by default) */
  .filters-toggle {
    display: none;
  }

  @media (max-width: 720px) {
    .filters-toggle {
      display: flex;            /* was inline-flex */
      align-items: center;
      gap: 8px;
      width: fit-content;       /* shrink to label width */
      max-width: 100%;
      margin: 0 auto 10px;      /* center horizontally */
      background: transparent;
      border: 0;
      color: var(--accent);
      font-weight: 800;
      letter-spacing: 1.6px;
      font-size: 12px;
      text-transform: uppercase;
      cursor: pointer;
    }
    .filters-toggle .chev {
      transition: transform .2s ease;
    }
    .filters-toggle .chev.open {
      transform: rotate(180deg);
    }

    /* Collapse the bar by default on mobile */
    .filters-bar {
      display: none;
      padding-inline: 0;
    }
    .filters-bar.mobile-open {
      display: block;
    }

    /* Hide label on mobile to match reference */
    .filters-label {
      display: none;
    }

    /* Stack controls vertically and make them full-width */
    .filters-row {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      overflow: visible; /* no horizontal scroll on mobile stack */
    }

    .pill,
    .pill-input,
    .pill-btn {
      width: 100%;
      min-width: 0;
      height: 48px; /* slightly taller touch target */
      border-radius: 12px;
    }

    .pill-input { width: 100%; }

    .pill-btn {
      font-weight: 700;
      justify-content: center;
    }

    /* Reduce top padding to match compact mobile header spacing */
    .testing-underlay {
      padding: 80px 0 40px;
    }
  }

  /* ===== Content section (Latest / Featured) ===== */
  .content-section {
    background: #fff;
    padding: 24px 0 8px;
  }
  .content-container {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .content-grid {
    display: grid;
    grid-template-columns: 1.4fr 1.2fr; /* was 1.6fr 1fr: give Featured more space */
    gap: 36px;
    align-items: start;
  }
  .section-h2 {
    color: var(--accent-2);
    font-size: 24px;
    font-weight: 800;
    margin: 0 0 16px;
  }

  /* Latest */
  .latest-card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(12, 1, 123, 0.08);
    background: transparent;
  }
  .latest-img {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 7; /* was 16 / 9: shorter image */
    object-fit: cover;
    display: block;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  .latest-body {
    background: #fffaea;
    padding: 26px 24px 20px; /* was 22px 20px 18px: more content space */
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    position: relative;
  }
.type-pill {
    display: block;            /* stack above the title */
    color: #7a68f5;
    letter-spacing: 1.3px;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .latest-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #201a8a;
    font-weight: 800;
    font-size: 20px;
    text-decoration: none;
  }
  .latest-title:hover { text-decoration: underline; }
  .latest-desc {
    margin: 10px 0 12px;
    color: #5b5e6a;
    line-height: 1.6;
  }
  .dots {
    display: flex;
    gap: 8px;
    padding: 4px 0 2px;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #e4e7f9;
    border: 0;
    cursor: pointer;
  }
  .dot.active { background: #3e27b7; }

  /* Featured list */
  .featured-list {
    list-style: none;
    margin: 0 0 18px;
    padding: 0;
    border-bottom: 1px solid #ececf6;
  }
  .featured-item { border-top: 1px solid #ececf6; }
  .featured-item + .featured-item {
    margin-top: 12px;            /* space between items */
  }
  .featured-link {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;                  /* was 14px */
    padding: 16px 2px;          /* was 14px 2px */
    text-decoration: none;
    color: #1b1f2a;
  }
  .thumb-wrap {
    position: relative;
    width: 132px;                /* bigger thumbnail */
    height: 76px;
  }
  .thumb-bg {
    position: absolute; inset: 0;
    background: var(--accent);
    border-radius: 10px;
  }
  .thumb {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    border-radius: 10px;
    transform: translate(6px, 6px);
    box-shadow: 0 6px 16px rgba(19, 16, 96, 0.25);
  }
  .feat-text {
    font-weight: 700;
    color: #2b2b2b;
    font-size: 17px;             /* subtle text upsize */
    line-height: 1.35;
  }
  .feat-arrow { color: var(--accent-2); }

  /* Subscribe card */
  .subscribe-card {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    align-items: center;
    background: #fdeae4;
    border-radius: 14px;
    padding: 18px;
    margin-top: 18px;
  }
  .sub-left { display: flex; align-items: center; gap: 12px; }
  .sub-icon {
    background: #ffcf6b;
    color: #a86a00;
    width: 40px; height: 40px;
    border-radius: 10px;
    display: grid; place-items: center;
  }
  .sub-title {
    margin: 0 0 2px;
    color: #221b7e;
    font-weight: 800;
  }
  .sub-desc {
    margin: 0;
    color: #5b5e6a;
  }
  .sub-btn {
    background: var(--accent-2);
    color: #fff;
    text-decoration: none;
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: 800;
    white-space: nowrap;
  }
  .sub-btn:hover { background: var(--accent); }

  /* Add space above the grid layout */
  .content-grid {
    margin-top: 16px;
  }

  /* Divider between the grid layout and cards (visible with centered label) */
  .content-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 40px 0 12px; /* more space above the divider */
  }
  .content-divider::before,
  .content-divider::after {
    content: "";
    flex: 1 1 auto;
    height: 2px;
    background: linear-gradient(
      to right,
      rgba(12, 1, 123, 0),
      rgba(12, 1, 123, 0.28),
      rgba(12, 1, 123, 0)
    );
  }
  .content-divider__text {
    background: var(--accent-2); /* #0c017b */
    color: #fff;                 /* white text */
    font-weight: 800;
    font-size: 15px;             /* a bit bigger */
    letter-spacing: 0.04em;
    padding: 10px 18px;          /* a bit bigger */
    border-radius: 9999px;
    border: 0;                   /* remove light border */
    box-shadow: 0 2px 10px rgba(12, 1, 123, 0.18);
    text-transform: none;
    white-space: nowrap;
  }

  @media (min-width: 981px) {
    .content-grid { margin-top: 24px; }
    .content-divider { margin: 56px 0 16px; }
  }

  /* Responsive */
  @media (max-width: 980px) {
    .content-grid { grid-template-columns: 1fr; gap: 28px; }
  }
  @media (max-width: 560px) {
    .thumb-wrap { width: 110px; height: 66px; }
    .latest-title { font-size: 18px; }
  }

  /* Desktop-only: make content section wider and a touch larger */
  @media (min-width: 981px) {
    .content-section { padding: 40px 0 20px; }         /* a bit taller */
    .content-container { max-width: 1360px; }          /* was 1240px */

    .content-grid {
      grid-template-columns: 1.7fr 1.3fr;              /* Latest wider, Featured still large */
      gap: 56px;                                       /* was 48px */
    }

    /* Latest: longer + larger text area */
    .latest-body { padding: 36px 32px 28px; }          /* was 32px 28px 24px */
    .latest-title { font-size: 24px; }                 /* was 22px */
    .latest-desc { font-size: 16px; line-height: 1.7; }/* more readable, taller */

    /* Featured: bigger tiles */
    .featured-link { gap: 18px; padding: 18px 4px; }   /* was 16px 2px */
    .thumb-wrap { width: 196px; height: 112px; }       /* was 168px x 96px */
    .feat-text { font-size: 22px; }                    /* was 20px */
  }

  /* Container to align cards with the page content width */
  .cards-container {
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Grid for category and subcategory cards only (tests remain unchanged) */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
    align-items: stretch;
  }

  @media (min-width: 981px) {
    .card-grid {
      gap: 24px;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }

  @media (max-width: 560px) {
    .card-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
