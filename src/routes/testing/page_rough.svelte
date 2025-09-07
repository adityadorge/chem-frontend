<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { get } from "svelte/store";
  import CardsSection from "$lib/Testing_Component/CardsSection/CardsSection.svelte";
  import Filter from "$lib/Testing_Component/Filter/Filter.svelte";
  import TestCardsSection from "$lib/Testing_Component/TestCardsSection/TestCardsSection.svelte";
  import Navbar from "$lib/Navbar/Navbar.svelte";
  import { goto } from "$app/navigation";

  let searchTerm: string = "";

  interface Category {
    image_url: string;
    category_name: string;
    description: string;
    info: string;
    id: number;
  }

  interface Subcategory {
    category_name: string;
    description: string;
    info: string;
    image_url: string;
  }

  interface Test {
    id: number;
    test_name: string;
    image_url: string;
    test_description: string;
    test_price: number;
  }

  // ...existing code...

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
    const response = await fetch("http://localhost:8000/app1/categories/");
    const data: Category[] = await response.json();
    categories = data;
  }

  // Fetch subcategories for a selected category
  async function fetchData(categoryId: number) {
    const subcategories_response = await fetch(
      `http://localhost:8000/app1/categories/${categoryId}/subcategories/`
    );
    const subcategories_data: Subcategory[] =
      await subcategories_response.json();
    subcategories = subcategories_data;

    const test_response = await fetch(
      `http://localhost:8000/app1/categories/${categoryId}/tests/`
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
</script>

<div class="testpage-container">
  <div class="breadcrumb">
    {#each breadcrumbPath as crumb, i}
      {#if i > 0}
        <span class="breadcrumb-separator">/</span>
      {/if}
      <span
        class="breadcrumb-item"
        on:click={() => goBack(i)}
        aria-current={i === breadcrumbPath.length - 1 ? "page" : undefined}
        style="font-weight: {i === breadcrumbPath.length - 1
          ? 'bold'
          : 'normal'}"
      >
        {crumb.label}
      </span>
    {/each}
  </div>

  <Filter
    bind:searchTerm
    onSearch={(term) => (searchTerm = term)}
    {categories}
    {subcategories}
    on:filter={(e) => {
      // e.detail.category and e.detail.subcategory
      // Use these to filter your displayed categories/tests
      // Example:
      selectedCategory =
        categories.find((c) => c.category_name === e.detail.category) ?? null;
      // Optionally filter subcategories/tests here as well
    }}
  />
</div>

<main class="card-container">
  {#if categories.length > 0 && !selectedCategory}
    <!-- search the parent card according to character -->
    {#each categories
      .filter((category) => category.category_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
      .sort((a, b) => (b.category_name
          .toLowerCase()
          .startsWith(searchTerm.toLowerCase()) ? 1 : a.category_name
                .toLowerCase()
                .startsWith(searchTerm.toLowerCase()) ? -1 : 0)) as category}
      <CardsSection
        icon={category.image_url}
        title={category.category_name}
        description={category.description}
        info={category.info}
        {category}
        {showSubcategories}
      />
    {/each}
  {/if}

  {#if subcategories.length > 0 && selectedCategory}
    <!-- search the subcategory card according to character -->
    {#each subcategories
      .filter((subcategory) => subcategory.category_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
      .sort((a, b) => (b.category_name
          .toLowerCase()
          .startsWith(searchTerm.toLowerCase()) ? 1 : a.category_name
                .toLowerCase()
                .startsWith(searchTerm.toLowerCase()) ? -1 : 0)) as subcategory}
      <CardsSection
        icon={subcategory.image_url}
        title={subcategory.category_name}
        description={subcategory.description}
        info={subcategory.info}
        category={subcategory}
        {showSubcategories}
      />
    {/each}
  {/if}

  {#if tests.length > 0 && selectedCategory}
    {#each tests
      .filter((test) => test.test_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
      .sort((a, b) => (b.test_name
          .toLowerCase()
          .startsWith(searchTerm.toLowerCase()) ? 1 : a.test_name
                .toLowerCase()
                .startsWith(searchTerm.toLowerCase()) ? -1 : 0)) as test}
      <TestCardsSection
        icon={test.image_url}
        title={test.test_name}
        description={test.test_description}
        info={`Price: ₹${test.test_price}`}
        {test}
      />
    {/each}
  {/if}
</main>

<style>
  /* ...existing styles... */
  .breadcrumb {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-family: "Alegreya", serif;
    font-size: 1.1rem;
    color: #555;
    letter-spacing: 0.5px;
    padding: 4px 24px; /* Reduced vertical padding */
    margin: 8px 0 8px 0; /* Reduced top and bottom margin */
    max-width: 900px;
    gap: 0.5rem;
  }

  .breadcrumb-item {
    cursor: pointer;
    transition: color 0.2s;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .breadcrumb-item:hover {
    color: #2709cf;
    background: #ececff;
    text-decoration: underline;
  }

  .breadcrumb-separator {
    color: #b0b0b0;
    font-size: 1.2em;
    user-select: none;
  }
</style>
