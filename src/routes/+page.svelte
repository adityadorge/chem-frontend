<script lang="ts">
  import { API_URL } from "$lib/store/api";
  import Carousel from "$lib/Landing_Component/Carousel/Carousel.svelte";
  import ExploreFields from "$lib/Landing_Component/ExploreFields/ExploreFields.svelte";
  import { onMount } from "svelte";
  import TrustedLabPartners from "$lib/Landing_Component/TrustedLabPartners/TrustedLabPartners.svelte";
  import Services from "$lib/Landing_Component/Services/Services.svelte";
  import TrailSnackLayout from "$lib/Landing_Component/TrailSnackLayout/TrailSnackLayout.svelte";
  import NoteToCeo from "$lib/Landing_Component/NoteToCeo/NoteToCeo.svelte";
  import WorkingProcess from "$lib/Landing_Component/WorkingProcess/WorkingProcess.svelte";
  import Comparison from "$lib/Landing_Component/Comparison/Comparison.svelte";
  import { Rocket } from "lucide-svelte";
  interface Category {
    image_url: string;
    category_name: string;
    description: string;
    info: string;
    id: number;
  }

  let categories: Category[] = [];

  async function fetchCategories() {
    const response = await fetch(`${API_URL}/app1/categories/`);
    const data: Category[] = await response.json();
    categories = data;
  }

  onMount(() => {
    fetchCategories();
  });

  // Add theme tokens for the pill
  const PRIMARY = '#0c017b';
  const WAVE = '#ffede9';
</script>

<main>
  <div class="relative">
    <Carousel />
  </div>
  <TrustedLabPartners />
  <WorkingProcess />
  <!-- Card grid container -->
  <div class="relative flex flex-wrap justify-center gap-2 bg-white rounded-2xl pt-4 pb-20">
    <section class="w-full">
      <div class="grid max-w-screen-xl px-4 pt-4 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-4 lg:grid-cols-12 lg:pt-4">
        <div class="flex flex-col items-center justify-center text-center lg:col-start-4 lg:col-span-6 mx-auto">
          <p class="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-lg mb-4" style="background:{WAVE}; color:{PRIMARY}">
            Disciplines We Serve
          </p>
          <h1 class="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-black">
            Bridging Every <br> <span class="whitespace-nowrap">Scientific Frontier.</span>
          </h1>
          <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Our multidisciplinary approach brings together expertise across diagnostics, pharmaceuticals, biotechnology, and advanced materials — creating a seamless ecosystem where ideas evolve into impact.
          </p>
          <div class="flex items-center justify-center w-full max-w-md mx-auto mt-4">
            <a href="/testing"
              class="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-200 transition hover:border-blue-400 hover:shadow-md"
            >
              <Rocket size={20} aria-hidden="true" class="text-[#1746a2] mr-3" />
              <span class="flex-1 text-gray-500 text-base font-medium text-left">Explore Services</span>
              <svg class="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
    <!-- <a class="absolute top-8 left-56 bg-[#0c017b] text-white font-semibold px-7 py-3 rounded-xl text-[1.08rem] shadow-md transition-colors duration-200 hover:bg-blue-700 z-10 no-underline
      md:left-32
      lg:left-[clamp(32px,8vw,120px)] 
      sm:static sm:block sm:mx-auto sm:w-[90%] sm:text-center"
      href="/testing">
      Explore All Fields
    </a> -->
    {#if categories.length > 0}
      {#each categories.slice(0, 6) as category}
        <ExploreFields
          icon={category.image_url}
          title={category.category_name}
          description={category.description}
        />
      {/each}
    {/if}
  </div>

<Services />
<Comparison />
<NoteToCeo />
</main>

<style>
</style>
