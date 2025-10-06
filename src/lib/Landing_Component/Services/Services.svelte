<script context="module" lang="ts">
  interface Feature { label: string; type: 'positive' | 'negative'; }
  interface CTA { label: string; href: string; }
  export interface ServiceCard {
    id?: string | number;
    title: string;
    description: string;
    image: string;
    alt?: string;
    tag?: string;
    cta?: CTA;
    features: Feature[];
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-svelte';

  // Props: pass items or provide a fetchUrl that returns an array of ServiceCard
  export let items: ServiceCard[] = [];
  export let fetchUrl: string | undefined = undefined;
      // Dynamic theme (match solutions page defaults)
  export const PRIMARY = '#0c017b';
  export const ACCENT = '#f26a60';
  export const WAVE = '#ffede9';
  export const SMALL = "#4B5563";

  const fallbackItems: ServiceCard[] = [
    {
      id: 'gut-microbiota',
      tag: 'SERVICE',
      title: 'Investigating the Role of Gut Microbiota',
      description:
        "Our platform provides a seamless doorstep-to-lab service—simply book your test online, and we’ll handle pickup, secure delivery, compliance, and regulatory paperwork for you. With 24/7 availability, you save time, cut costs, and eliminate logistical stress. All while ensuring your samples reach trusted, certified labs for fast and accurate results.",
      image: '/assets/Services/national-cancer-institute-DYQfoftWGXw-unsplash.jpg',
      features: [
        { label: '24/7 Service Availability', type: 'positive' },
        { label: 'Secure Logistics & Delivery', type: 'positive' },
        { label: 'Cost & Time Savings', type: 'positive' },
        // { label: 'Compliance & Documentation', type: 'positive' }

      ],
      cta: { label: 'Explore More', href: '#' }
    },
    {
      id: 'cancer-research',
      tag: 'SERVICE',
      title: 'Advanced Cancer Research',
      description:
        'Experience faster turnaround times with our streamlined logistics and lab coordination, ensuring your research never slows down. We prioritize the security and privacy of your samples, including strict IP protection at every stage. With just one master contract, you gain seamless access to a network of certified labs—eliminating repetitive paperwork and collaborate with multiple labs effortlessly.',
      image: '/assets/Services/cdc-WCEOtVmk2VY-unsplash.jpg',
      features: [
        { label: 'Faster turnaround time (TAT)', type: 'positive' },
        { label: 'Sample security & privacy', type: 'positive' },
        { label: 'One master contract', type: 'positive' }
      ],
      cta: { label: 'Explore More', href: '#' }
    },
    {
      id: 'neuroscience',
      tag: 'SERVICE',
      title: 'Neuroscience Breakthroughs',
      description:
        'with qualified labs and experienced professionals who not only deliver accurate results but also provide clear, detailed report analysis. With transparent communication and expert guidance, you gain the confidence to interpret findings correctly and advance your research without delays or guesswork.',
      image: '/assets/Services/chromatograph-_whop2XD0Mk-unsplash.jpg',
      features: [
        { label: 'Seamless Post-Result Communication', type: 'positive' },
        { label: 'Qualified Lab Experts', type: 'positive' },
        { label: 'Accurate Results & Report Analysis', type: 'positive' }
      ],
      cta: { label: 'Explore More', href: '#' }
    }
  ];

  let services: ServiceCard[] = fallbackItems;
  $: services = items && items.length ? items : services;

  let slider: HTMLDivElement | null = null;

  function slide(dir: number) {
    if (!slider) return;
    const card = slider.querySelector(".card");
    if (!card) return;
    const cardWidth = (card as HTMLDivElement).offsetWidth + 24; // card + gap
    slider.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  }

  onMount(async () => {
    if (!fetchUrl) return;
    try {
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
      const data: ServiceCard[] = await res.json();
      if (Array.isArray(data) && data.length) services = data;
    } catch (e) {
      console.error(e);
    }
  });
</script>

<svelte:head>
  <!-- Inter font (match Carousel.svelte) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <div class="slider-wrapper">
    <button class="arrow left" on:click={() => slide(-1)} aria-label="Previous">
      <ChevronLeft size={24} />
    </button>
    
    <div class="slider-container" bind:this={slider}>
      {#each services as item (item.id || item.title)}
        <div class="card">
          <img src={item.image} alt={item.alt ?? item.title} />
          <div class="card-content">
            {#if item.tag}<span class="badge service">{item.tag}</span>{/if}
            <h3 style="color: {PRIMARY};">{item.title}</h3>
            <p>{item.description}</p>
            {#if item.cta}
              <a href={item.cta.href} class="primary-btn" style="background: {PRIMARY};">{item.cta.label}</a>
            {/if}
            {#if item.features?.length}
              <ul class="features">
                {#each item.features as f, i}
                  <li>
                    {#if f.type === 'positive'}
                      <CheckCircle class="icon positive" />
                    {:else}
                      <XCircle class="icon negative" />
                    {/if}
                    {f.label}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <button class="arrow right" on:click={() => slide(1)} aria-label="Next">
      <ChevronRight size={24} />
    </button>
  </div>
</main>

<style>
  .slider-wrapper {
    position: relative;
    overflow: hidden;
    margin: auto;

    /* Use Inter font in this component */
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  }

  .slider-container {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 1rem;
    scroll-behavior: smooth;
  }

  .card {
    flex: 0 0 75%;
    display: flex;
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    scroll-snap-align: start;
    height: 580px;
  }

  .card img {
    width: 45%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .card-content {
    width: 55%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Bigger, bolder headline */
  .card-content h3 {
    font-size: clamp(2.1rem, 2.6vw + 1.1rem, 3.4rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.015em;
    margin-bottom: 1rem;
    color: #1746a2;
  }

  /* Description in black */
  .card-content p {
    color: #000;
    font-weight: 400;
    font-size: clamp(0.95rem, 0.4vw + 0.9rem, 1.125rem);
    line-height: 1.6;
    margin-bottom: 1.2rem;
  }

  .primary-btn {
    background: #1746a2;
    color: #fff;
    font-weight: 600;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    text-decoration: none;
    display: inline-block;
    margin-bottom: 1rem;
    align-self: flex-start;
  }

  .features {
    list-style: none;
    padding: 0;
    font-size: 0.95rem;
  }

  .features li {
    display: flex;
    align-items: center;
    margin-bottom: 0.6rem;
    gap: 0.5rem;
  }

  /* Lucide icon styles */
  .icon { width: 20px; height: 20px; flex: 0 0 auto; }
  .icon.positive { color: #16a34a; }
  .icon.negative { color: #ef4444; }

  /* Badge */
  .badge {
    align-self: flex-start;
    display: inline-flex;
    padding: 0.3rem 0.6rem;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.75rem;
  }
  .badge.service {
    background: #16a34a;
    color: #fff;
    border: 1px solid #15803d;
  }

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1746a2;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .arrow.left { left: -20px; }
  .arrow.right { right: -20px; }

  @media (max-width: 768px) {
    .slider-wrapper {
      max-width: none;
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      overflow: visible;
    }

    .slider-container {
      gap: 0.875rem;
      padding: 0 clamp(8px, 2vw, 16px) 1rem clamp(44px, 12vw, 80px);
      scroll-padding-left: clamp(44px, 12vw, 80px);

      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .slider-container::-webkit-scrollbar { display: none; }

    .arrow { display: none; }

    .card {
      flex: 0 0 94%;
      max-width: 94%;
      flex-direction: column;
      height: auto;
      border-radius: 16px;
    }

    .card img {
      width: 100%;
      height: clamp(220px, 32vh, 320px);
      object-fit: cover;
    }

    .card-content {
      width: 100%;
      padding: 1rem 1rem 1.25rem;
    }
  }
</style>
