<script lang='ts'>
  import { createEventDispatcher } from 'svelte';
  export let searchTerm: string;
  export let onSearch: (term: string) => void;
  export let categories: Array<{ category_name: string; [key: string]: any }>;
  export let subcategories: Array<{ category_name: string; [key: string]: any }>;

  let showMenu = false;
  // Dynamically generate filters from categories
  $: filters = categories ? categories.map(c => c.category_name) : [];
  let selectedFilters = new Set();

  const dispatch = createEventDispatcher();

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function toggleFilter(filter: string) {
    selectedFilters.has(filter)
      ? selectedFilters.delete(filter)
      : selectedFilters.add(filter);
  }

  function applyFilters() {
    // Dispatch selected filters to parent or use as needed
    dispatch('filter', { selected: Array.from(selectedFilters) });
    showMenu = false;
  }

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    onSearch(input.value);

    // Smart search logic
    const term = input.value.toLowerCase();
    const catResults = categories?.filter(c =>
      c.category_name.toLowerCase().includes(term)
    ) || [];
    const subcatResults = subcategories?.filter(s =>
      s.category_name.toLowerCase().includes(term)
    ) || [];
    dispatch('smartsearch', { categories: catResults, subcategories: subcatResults });
  }
</script>

<style>
  :root {
    --content-width: 980px; /* match cards list width */
  }

  .section-wrapper {
    font-family: 'Roboto', serif;
    padding: 24px 16px; /* responsive page gutters */
    position: relative;
  }

  /* New container to align with cards */
  .container {
    max-width: var(--content-width);
    margin: 0 auto;
  }

  .title {
    font-family: 'Roboto', serif;
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 12px 0;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    position: relative;
    flex-wrap: wrap;
  }

  .filter-button {
    font-family: 'Roboto', serif;
    border: 1.5px solid #ccc;
    border-radius: 9999px;
    padding: 0.75rem 1.5rem;
    background-color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 2;
  }

  .filter-button:hover {
    background-color: #f9f9f9;
    border-color: #888;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  }

  .dropdown-menu {
    position: absolute;
    top: 3.8rem;
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 1rem;
    padding: 1.5rem;
    min-width: 300px;
    max-width: 350px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    z-index: 1;
    opacity: 0;
    transform: translateY(-10px);
    animation: dropdownSlide 0.3s ease-out forwards;
  }

  @keyframes dropdownSlide {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .checkbox-item {
    font-family: 'Roboto', serif;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.4rem 0.8rem;
    border-radius: 50px;
    transition: all 0.2s ease-in-out;
    color: #414141;
  }

  .checkbox-item:hover {
    background-color: #2709cf79;
    color: white;
    transform: scale(1.05);
  }


  .checkbox-item input[type='checkbox'] {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 2px solid #555;
    position: relative;
    outline: none;
    cursor: pointer;
    background-color: white;
    transition: all 0.2s ease;
  }

  .checkbox-item input[type='checkbox']:checked {
    background-color: #2709cf79;
    border-color: #2709cf79;
  }

  .checkbox-item input[type='checkbox']:checked::before {
    content: '✔';
    position: absolute;
    top: 0;
    left: 2px;
    font-size: 14px;
    color: white;
    font-weight: bold;
    line-height: 18px;
  }

  .apply-button {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .apply-button button {
    font-family: 'Roboto', serif;
    padding: 0.6rem 1.5rem;
    border: none;
    background-color: #2709cf79;
    color: white;
    border-radius: 999px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background 0.3s;
  }

  .apply-button button:hover {
    background-color: #3b7ccc;
  }

  .search-bar {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 0.4rem 0;
    flex: 1 1 auto;   /* allow to grow/shrink */
    min-width: 0;     /* remove hard min */
  }

  .search-bar input {
    font-family: 'Roboto', serif;
    border: none;
    outline: none;
    width: 100%;
    padding-left: 0.5rem;
    font-size: 1rem;
    color: #333;
  }

  .icon {
    font-size: 1.1rem;
    color: gray;
  }

  input::placeholder {
    color: #888;
  }


  /* Mobile */
  @media (max-width: 720px) {
    .controls {
      flex-direction: column;
      align-items: stretch;
    }
    .search-bar {
      width: 100%;
    }
  }
</style>

<div class="section-wrapper">
  <div class="container">
    <h2 class="title">Explore our solutions</h2>

    <div class="controls">
      <div class="search-bar">
        <span class="icon">
          <img src="assets/icon/Search/search.svg" alt="Menu Icon" width="24" height="24"/>
        </span>
        <input
          type="text"
          placeholder="Search categories"
          bind:value={searchTerm}
          on:input={handleInput}
        />
      </div>

      {#if showMenu}
        <div class="dropdown-menu">
          {#each filters as filter}
            <label class="checkbox-item">
              <input
                type="checkbox"
                checked={selectedFilters.has(filter)}
                on:change={() => toggleFilter(filter)}
              />
              {filter}
            </label>
          {/each}

          <div class="apply-button">
            <button on:click={applyFilters}>Apply</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
