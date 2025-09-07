<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  const cards = [
    {
      title: "Connecting Researchers with Certified Testing Labs – Seamlessly.",
      text: "Our mission is to streamline the lab sample delivery process, ensuring that individual researchers and institutions can seamlessly transport their samples to certified labs and receive accurate results—efficiently and hassle-free.",
      img: "assets/carousel/carousel_1.jpg",
      insights: [
        { number: "5+", label: "Lab Partners" },
        { number: "25+", label: "Tests Conducted" },
        { number: "10+", label: "Miles Traveled" }
      ]
    },
    {
      title: "From Your Doorstep to Certified Testing Laboratory <br>– No More Lab Visits",
      text: "Limited access to certified labs, high travel costs, and the burden of managing packaging, delivery, and coordination all fall on researchers taking valuable time away from actual research.",
      img: "assets/carousel/carousel_2.jpg",
      insights: [
        { number: "4.8+", label: "Avg Rating" },
        { number: "25+", label: "Years Experience" },
        { number: "7K+", label: "Trusted Partners" }
      ]
    },
    {
      title: "All You Need, All in One Place.",
      text: "We offer a wide variety of certified tests across disciplines—right at your fingertips. Whether you're a student or a seasoned researcher, find every test you need in one place, without the hassle of searching across multiple labs.",
      img: "assets/carousel/carousel_3.jpg",
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
    interval = setInterval(nextCard, 5000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  function manualNav(fn: () => void) {
    if (interval) clearInterval(interval);
    fn();
    interval = setInterval(nextCard, 5000);
  }
</script>

<main>
  <section class="home-hero">
    <div class="home-hero__container">
      <div class="home-hero__wrapper">
        <div class="home-hero__content">
          <div class="home-hero__title-container">
            <h1 class="home-hero__title" data-split data-tadam>
              {@html cards[current].title}
            </h1>
            <p class="home-hero__text" data-tadam>
              {cards[current].text}
            </p>
            <button class="cta-under-title">Get Started</button>
            <div class="hero-insights">
              {#each cards[current].insights as insight}
                <div class="insight">
                  <span class="insight-number">{insight.number}</span>
                  <span class="insight-label">{insight.label}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>
        <div class="home-hero__image-container">
          <div class="home-hero__image-wrapper">
            <img
              class="home-hero__image"
              src={cards[current].img}
              alt={cards[current].title.replace(/<[^>]*>/g, "")}
            />
            <div class="carousel-nav carousel-nav--image">
              <button
                class="carousel-arrow"
                on:click={() => manualNav(prevCard)}
                aria-label="Previous"
              >&#8592;</button>
              <button
                class="carousel-arrow"
                on:click={() => manualNav(nextCard)}
                aria-label="Next"
              >&#8594;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  @import url("https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap");

  :global(*) {
    font-family: "Roboto", Arial, Helvetica, sans-serif;
  }

  .home-hero {
    background: linear-gradient(to top, #0a2f79 0%, #ffffff 100%);
    padding-bottom: 20px;
  }

  @media only screen and (min-width: 37.5rem) {
    .home-hero {
      height: 100vh;
      min-height: 1250px;
    }
  }

  @media only screen and (min-width: 64.0625rem) {
    .home-hero {
      min-height: 800px;
    }
  }

  .home-hero__container {
    height: 90%;
    margin-left: auto;
    margin-right: auto;
    max-width: none;
    padding: 20px;
  }

  .home-hero__wrapper {
    background-color: #ffffff;
    border-radius: 20px;
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    min-height: 480px;
    transition: min-height 0.3s;
  }

  @media only screen and (min-width: 64.0625rem) {
    .home-hero__wrapper {
      flex-direction: row;
      padding: 20px;
      align-items: stretch;
    }
  }

  .home-hero__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: left;
    padding: 0 8.33333%;
    width: 58.33333%;
    height: 100%;
    min-height: 400px;
    transition: min-height 0.3s;
  }

  .home-hero__title-container {
    min-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    text-align: left;
  }

  .home-hero__title {
    min-height: 40px;
    display: block;
    margin-bottom: 8px;
    color: #1746a2;
    text-align: left;
    font-size: min(3.5vw, 60px);
    transition: color 0.2s;
    font-weight: 700;
  }

  .home-hero__text {
    text-align: justify;
    width: 100%;
    margin-bottom: 0;
    padding: 0;
    color: #000000;
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 400;
  }

  @media only screen and (min-width: 37.5rem) {
    .home-hero__text {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
  }

  .home-hero__image-container {
    margin-bottom: 0;
    position: relative;
    width: 100%;
  }

  @media only screen and (min-width: 37.5rem) {
    .home-hero__image-container {
      margin-bottom: 70px;
    }
  }

  @media only screen and (min-width: 64.0625rem) {
    .home-hero__image-container {
      height: 100%;
      margin-bottom: 0;
      width: 41.66666%;
    }
  }

  .home-hero__image-wrapper {
    height: 400px;
  }

  .home-hero__image-wrapper:after {
    background: none;
    border-radius: 20px;
    content: "";
    display: block;
    padding-bottom: 130%;
    position: relative;
    z-index: 1;
  }

  @media only screen and (min-width: 37.5rem) {
    .home-hero__image-wrapper:after {
      background: none;
      padding-bottom: 75%;
    }
  }

  @media only screen and (min-width: 64.0625rem) {
    .home-hero__image-wrapper {
      height: 100%;
    }
  }

  .home-hero__image {
    border-radius: 20px;
    height: 100%;
    left: 0;
    object-fit: cover;
    object-position: center top;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
  }

  @media (max-width: 600px) {
    .home-hero__image-wrapper {
      width: 80vw;
      height: 180px;
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 12px rgba(23,70,162,0.08);
      border-radius: 20px;
      position: relative;
    }
    .home-hero__image {
      width: 90%;
      height: 90%;
      left: 5%;
      top: 5%;
      position: absolute;
      border-radius: 16px;
      box-shadow: none;
      background: #fff;
    }
  }

  .cta-under-title {
    display: block;
    margin: 0 0 24px 0;
    align-self: flex-start;
    padding: 12px 32px;
    background: #1746a2;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .cta-under-title:hover {
    background: #0f357a;
  }

  .carousel-nav {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 16px;
  }

  .carousel-nav--image {
    position: absolute;
    left: 20px;
    bottom: 20px;
    display: flex;
    gap: 16px;
    z-index: 2;
  }

  .carousel-arrow {
    background: #1746a2;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .carousel-arrow:hover {
    background: #0f357a;
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

  @media (max-width: 600px) {
    .hero-insights {
      gap: 20px;
      flex-direction: column;
      align-items: flex-start;
    }
    .insight-number {
      font-size: 1.3rem;
    }
    .insight-label {
      font-size: 0.95rem;
    }
  }

  .home-hero__title,
  .home-hero__text,
  .hero-insights {
    min-height: 0;
    max-width: 100%;
    overflow-wrap: break-word;
  }
</style>