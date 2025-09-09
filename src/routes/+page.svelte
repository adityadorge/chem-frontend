<script lang="ts">
  import Carousel from "$lib/Landing_Component/Carousel/Carousel.svelte";
  import ExploreFields from "$lib/Landing_Component/ExploreFields/ExploreFields.svelte";
  import { onMount } from "svelte";
  import TrustedLabPartners from "$lib/Landing_Component/TrustedLabPartners/TrustedLabPartners.svelte";
  import Services from "$lib/Landing_Component/Services/Services.svelte";
  import TrailSnackLayout from "$lib/Landing_Component/TrailSnackLayout/TrailSnackLayout.svelte";
  import NoteToCeo from "$lib/Landing_Component/NoteToCeo/NoteToCeo.svelte";
  import WorkingProcess from "$lib/Landing_Component/WorkingProcess/WorkingProcess.svelte";
  import Comparison from "$lib/Landing_Component/Comparison/Comparison.svelte";
  import { API_URL } from "$lib/store/api";

  interface Category {
    image_url: string;
    category_name: string;
    description: string;
    info: string;
    id: number;
  }

  let categories: Category[] = [];

  async function fetchCategories() {
    const response = await fetch(`${API_URL}/categories`);
    const data: Category[] = await response.json();
    categories = data;
  }


  onMount(() => {
    fetchCategories();
  });

  // Example cards array (replace/add as needed)
  const serviceCards = [
    {
      image: "assets/Services/national-cancer-institute.jpg",
      title: "Investigating the Role of Gut Microbiota ",
      description:
        "Recent studies have highlighted the gut-brain axis as a critical pathway in the development of neurodegenerative diseases such as Parkinson’s and Alzheimer’s. Researchers are increasingly focusing on how microbial dysbiosis in the gastrointestinal tract may influence neural inflammation and cognitive decline. ",
      bullet1: "Assistance en cas d’urgence 24/7",
      bullet2: "Soins dentaires et médicaux d’urgence",
      bullet3: "Options de montant de protection et de franchise disponible",
    },
    {
      image:
        "assets/Services/national-cancer-institute-rb8hr3cXD4A-unsplash.jpg",
      title: "Machine Learning Models for Early Detection of Sepsis",
      description:
        "Sepsis remains a leading cause of mortality in intensive care units (ICUs) worldwide, often due to delayed diagnosis and intervention. In response, researchers are leveraging machine learning algorithms to identify early physiological and biochemical markers predictive of sepsis onset.",
      bullet1: "Couverture soins médicaux d'urgence",
      bullet2: "Paiement mensuel possible",
      bullet3: "Options de franchise disponible",
    },
    {
      image:
        "assets/Services/national-cancer-institute-DYQfoftWGXw-unsplash.jpg",
      title:
        "3D Bioprinting of Functional Human Tissues for Regenerative Medicine",
      description:
        "Recent advances in 3D bioprinting technology are paving the way for the creation of functional human tissues, offering new solutions for regenerative medicine. This innovative approach aims to address the shortage of organ donors and improve the success rates of transplants.",
      bullet1: "Couverture soins médicaux d'urgence",
      bullet2: "Paiement mensuel possible",
      bullet3: "Options de franchise disponible",
    },
    {
      image:
        "assets/Services/national-cancer-institute-L7en7Lb-Ovc-unsplash.jpg",
      title:
        "AI-Powered Early Detection of Diabetic Retinopathy Using Retinal Imaging",
      description:
        "Recent advances in AI and retinal imaging technology are enabling the early detection of diabetic retinopathy, a leading cause of blindness. By analyzing retinal images with machine learning algorithms, clinicians can identify at-risk patients and intervene earlier.",
      bullet1: "Couverture soins médicaux d'urgence",
      bullet2: "Paiement mensuel possible",
      bullet3: "Options de franchise disponible",
    },
    // Add more cards as needed
  ];
</script>

<div class="carousel-stack">
  <Carousel />
</div>



<main>
  <TrustedLabPartners />
  <WorkingProcess />
  <!-- Card grid container -->
  <div class="fields-cards-container">
    <a class="fields-action-btn" href="/testing">Explore All Fields</a>
    {#if categories.length > 0}
      <!-- Limit categories to only 6 -->
      {#each categories.slice(0, 6) as category}
        <ExploreFields
          icon={category.image_url}
          title={category.category_name}
          description={category.description}
        />
      {/each}
    {/if}
  </div>

  <div class="services-carousel-container">
    <div class="svg-top-left">
      <img
        src="/assets/icon/double-qoutes/double-quote-serif-left-svgrepo-com.svg"
        alt="quote icon"
        class="quote-icon"
      />
      <span class="quote-label">Popular Services </span>
    </div>
    <div class="svg-bottom-right">
      <img
        src="/assets/icon/double-qoutes/double-quote-serif-left-svgrepo-com.svg"
        alt="quote icon"
      />
    </div>
    <!-- Horizontal Scrollable Carousel -->
    <div class="services-carousel">
      <Services />
    </div>
  </div>
  <TrailSnackLayout />
  <Comparison />
  <NoteToCeo />
</main>

<style>
  :root {
    --main-font: "Roboto", sans-serif;
  }
  * {
    font-family: var(--main-font);
  }
  .svg-top-left {
    display: flex;
    align-items: center;
    gap: 105px;
    position: absolute;
    top: 30px;
    left: 40px;
    z-index: 5;
  }

  .quote-icon {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .quote-label {
    background-color: #dbecff;
    color: #001e6c;
    font-weight: 600;
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .services-carousel-container {
    position: relative; /* ADD THIS */
    padding: 80px 0 110px 0;
    margin-top: 0px;
    background: #174698;
  }

  .services-carousel {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    gap: 0px; /* adds gap between cards */
    padding-left: 14rem; /* creates left space before first card */
    padding-right: 2rem; /* optional: makes spacing on both ends equal */
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin-top: 50px;
  }

  .services-carousel::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }

  .svg-bottom-right {
    position: absolute;
    bottom: 20px;
    right: 32px;
    width: 80px;
    height: 80px;
    z-index: 5;
  }

  .svg-bottom-right img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transform: rotate(180deg); /* optional */
  }

  .carousel-stack {
    position: relative;
  }

  .fields-cards-container {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 32px;
    margin-top: 60px;
    margin-bottom: 32px;
    background: #f8f8f8;
    border-radius: 18px;
    padding: 100px 0 32px 0; /* Increased top padding for space between button and cards */
  }

  .fields-action-btn {
    position: absolute;
    top: 32px;
    left: 220px; /* Changed from right: 48px to left: 48px */
    right: auto; /* Ensure right is unset */
    background: #1746a2;
    color: #fff;
    font-weight: 600;
    padding: 12px 28px;
    border-radius: 12px;
    border: none;
    font-size: 1.08rem;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
    transition: background 0.18s;
    cursor: pointer;
    z-index: 2;
    text-decoration: none;
  }

  .fields-action-btn:hover {
    background: #1d4ed8;
  }

  @media (max-width: 700px) {
    .fields-action-btn {
      position: static;
      display: block;
      margin: 0 auto 18px auto;
      width: 90%;
      text-align: center;
    }
  }
</style>
