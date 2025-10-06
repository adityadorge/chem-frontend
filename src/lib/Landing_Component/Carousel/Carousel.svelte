<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { ArrowLeft, ArrowRight, Play } from "lucide-svelte";
    // Dynamic theme (match solutions page defaults)
  export const PRIMARY = '#0c017b';
  export const ACCENT = '#f26a60';
  export const WAVE = '#ffede9';
  export const SMALL = "#4B5563";

  const cards = [
    {
      title: "Seamless Access to Certified Labs for Every Researcher. <br>– Quickly, Reliably, Seamlessly.",
      text: "Get Ready to Accelerate Your Research with access to a wide range of services across multiple fields — all in one place. Whether you’re a startup, researcher, or global enterprise, we connect you with trusted labs to deliver faster, more reliable results.",
      img: "assets/carousel/carousel_1.jpg",
      advice: {
        tag: "Travel Insurance 101",
        text: "How to choose your travel insurance policy:<br> A Practical Guide",
        link: "#"
      },
      insights: [
        { number: "5+", label: "Lab Partners" },
        { number: "25+", label: "Tests Conducted" },
        { number: "10+", label: "Miles Traveled" }
      ]
    },
    {
      title: "Marketplace built for research and innovation. <br>– From Your Doorstep to the Lab.",
      text: "Say goodbye to lab-hunting, wasted trips, and delivery hassles. We simplify access, logistics, and reporting—saving you time, reducing costs, and letting you focus on what matters most: advancing discoveries.",
      img: "assets/carousel/carousel_3.jpg",
      advice: {
        tag: "Travel Insurance 101",
        text: "How to choose your travel insurance policy:<br> A Practical Guide",
        link: "#"
      },
      insights: [
        { number: "4.8+", label: "Avg Rating" },
        { number: "25+", label: "Years Experience" },
        { number: "7K+", label: "Trusted Partners" }
      ]
    }
  ];

  let current = 0;
  let interval: ReturnType<typeof setInterval> | null = null;

  function nextCard() {
    current = (current + 1) % cards.length;
  }

  function prevCard() {
    current = (current - 1 + cards.length) % cards.length;
  }

  onMount(() => {
    interval = setInterval(nextCard, 7000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  function manualNav(fn: () => void) {
    if (interval) clearInterval(interval);
    fn();
    interval = setInterval(nextCard, 7000);
  }
</script>

<svelte:head>
  <!-- Inter font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="hero-section">
  <div class="hero-content">
    <p
      class="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-lg mb-4 md:mb-6"
      style="background:{WAVE}; color:{PRIMARY}"
    >
      Solutions
    </p>
    <h1 style="color:{PRIMARY}" >{@html cards[current].title}</h1>
    <div class="hero-buttons">
      <a class="main-btn" href="#" style="background-color:{PRIMARY}">Get Started</a>
       <a
        href="#"
        class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[color:var(--primary)] transition-colors hover:bg-[color:var(--wave)]"
        style="--primary:{PRIMARY}; --wave:{WAVE}"
      >
        <Play size={18} style="color:{PRIMARY}" />
        See our Services
      </a>
    </div>
    <p class="hero-desc">{cards[current].text}</p>
    <div class="hero-insights">
      {#each cards[current].insights as insight}
        <div class="insight">
          <span class="insight-number" style="color:{PRIMARY}">{insight.number}</span>
          <span class="insight-label">{insight.label}</span>
        </div>
      {/each}
    </div>
  </div>
  <div class="hero-image-card">
    <div class="image-wrapper">
      <img src={cards[current].img} alt="Hero Image" />
      <div class="nav-arrows">
        <button on:click={() => manualNav(prevCard)} aria-label="Previous">
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <button on:click={() => manualNav(nextCard)} aria-label="Next">
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</div>

<style>
.hero-section {
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  display: flex;
  background: #1746a2;
  border-radius: 24px;
  margin-top: 8px;
  margin-bottom: 32px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding: 32px;
  color: #1746a2;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  background: #fff;
}

.hero-content {
  flex: 1;
  padding: 24px;
}

.hero-content h1 {
  font-weight: 800;
  font-size: clamp(2rem, 3vw + 1rem, 3.25rem); /* responsive */
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin-bottom: 24px;
  color: #1746a2;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.main-btn, .secondary-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  transition: background 0.2s;
}

.main-btn {
  background: #1746a2;
  color: #fff;
}

.secondary-btn {
  background: #eaf1fb;
  color: #1746a2;
  border: 1px solid #1746a2;
}

.hero-desc {
  color: #475569;              /* slate-600-ish */
  font-weight: 400;            /* lighter than headline */
  font-size: clamp(0.95rem, 0.4vw + 0.9rem, 1.125rem);
  line-height: 1.6;
  margin-top: 16px;
}

.hero-insights {
  display: flex;
  gap: 40px;
  margin-top: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.insight {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.insight-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1746a2;
  line-height: 1;
}

.insight-label {
  font-size: 1rem;
  color: #888;
  margin-top: 4px;
  font-weight: 400;
}

.hero-image-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  width: 400px;
  height: 400px;
  background: #eee;
  box-shadow: 0 4px 24px rgba(23,70,162,0.08);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
}

/* New: only the arrows in bottom-left */
.nav-arrows {
  position: absolute;
  bottom: 24px;
  left: 24px;
  display: flex;
  gap: 8px;
}

.nav-arrows button {
  background: #eaf1fb;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  color: #1746a2;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;          /* center the icon */
  align-items: center;
  justify-content: center;
}

.nav-arrows button:hover {
  background: #1746a2;
  color: #fff;
}

/* Remove old advice styles */
/* .advice-card, .advice-tag, .advice-text, .advice-arrows { } */

@media (max-width: 900px) {
  .hero-section {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  /* Tweak sizes on small screens */
  .hero-content h1 {
    font-size: 2rem;
    line-height: 1.15;
  }
  .hero-desc {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .image-wrapper {
    width: 95vw;
    height: 340px;
    min-width: 220px;
    max-width: 500px;
  }
  .hero-insights {
    display: none;
  }

  /* Position arrows tighter on small screens */
  .nav-arrows {
    bottom: 6px;
    left: 6px;
  }
  .nav-arrows button {
    width: 25px;
    height: 25px;
  }
}

@media (min-width: 1024px) {
  .hero-content {
    padding-left: 65px;
    padding-right: 0;
  }
}

@media (min-width: 1200px) {
  .image-wrapper {
    width: 650px;
    height: 650px;
  }
  .hero-section {
    max-width: 1800px;
    padding: 72px;
    gap: 72px;
    min-height: 700px;
  }
  /* Make headline extra large on very wide screens */
  .hero-content h1 {
    font-size: 4rem;
  }
}
</style>