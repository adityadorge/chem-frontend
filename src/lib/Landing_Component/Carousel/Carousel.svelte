<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  const cards = [
    {
      title: "Connecting Researchers with Certified Testing Labs <br>– Seamlessly.",
      text: "Our mission is to streamline the lab sample delivery process, ensuring that individual researchers and institutions can seamlessly transport their samples to certified labs and receive accurate results—efficiently and hassle-free.",
      img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
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
      title: "From Your Doorstep to Certified Testing Laboratory <br>– No More Lab Visits",
      text: "Limited access to certified labs, high travel costs, and the burden of managing packaging, delivery, and coordination all fall on researchers taking valuable time away from actual research.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
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

<div class="hero-section">
  <div class="hero-content">
    <h1>{@html cards[current].title}</h1>
    <div class="hero-buttons">
      <a class="main-btn" href="#">Get a quote</a>
      <a class="secondary-btn" href="#">See our products</a>
    </div>
    <p class="hero-desc">{cards[current].text}</p>
    <div class="hero-insights">
      {#each cards[current].insights as insight}
        <div class="insight">
          <span class="insight-number">{insight.number}</span>
          <span class="insight-label">{insight.label}</span>
        </div>
      {/each}
    </div>
  </div>
  <div class="hero-image-card">
    <div class="image-wrapper">
      <img src={cards[current].img} alt="Hero Image" />
      <div class="advice-card">
        <span class="advice-tag">{cards[current].advice.tag}</span>
        <a href={cards[current].advice.link} class="advice-text">{@html cards[current].advice.text}</a>
        <div class="advice-arrows">
          <button on:click={() => manualNav(prevCard)} aria-label="Previous">&#8592;</button>
          <button on:click={() => manualNav(nextCard)} aria-label="Next">&#8594;</button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.hero-section {
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
  font-size: 2.5rem;
  font-weight: 700;
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
  color: #888;
  font-size: 1.1rem;
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

.advice-card {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(23,70,162,0.08);
  padding: 16px 20px;
  min-width: 220px;
  max-width: 80%;
}

.advice-tag {
  display: block;
  font-size: 0.9rem;
  color: #1746a2;
  font-weight: 600;
  margin-bottom: 8px;
}

.advice-text {
  display: block;
  color: #1746a2;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 8px;
}

.advice-arrows {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  justify-content: flex-end;
}

.advice-arrows button {
  background: #eaf1fb;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  color: #1746a2;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.advice-arrows button:hover {
  background: #1746a2;
  color: #fff;
}

@media (max-width: 900px) {
  .hero-section {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
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
  .advice-card {
    padding: 4px 6px;
    min-width: 80px;
    max-width: 80%;
    font-size: 0.7rem;
    border-radius: 5px;
    bottom: 6px;
    left: 6px;
  }
  .advice-tag {
    font-size: 0.75rem;
    margin-bottom: 2px;
  }
  .advice-text {
    font-size: 0.8rem;
    margin-bottom: 2px;
  }
  .advice-arrows button {
    width: 25px;
    height: 25px;
    font-size: 0.75rem;
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
}
</style>