<script lang="ts">
  let slider: HTMLDivElement | null = null;

  function slide(dir: number) {
    if (!slider) return;
    const card = slider.querySelector(".card");
    if (!card) return;
    const cardWidth = (card as HTMLDivElement).offsetWidth + 24; // card + gap
    slider.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  }
</script>

<main>
  <div class="slider-wrapper">
    <button class="arrow left" on:click={() => slide(-1)}>‹</button>
    
    <div class="slider-container" bind:this={slider}>
      <!-- Card 1 -->
      <div class="card">
        <img
          src="/assets/Services/national-cancer-institute-DYQfoftWGXw-unsplash.jpg"
          alt="Microscope"
        />
        <div class="card-content">
          <h3>Investigating the Role of Gut Microbiota</h3>
          <p>
            Recent studies highlight the gut-brain axis as a critical pathway in the
            development of neurodegenerative diseases.
          </p>
          <a href="#" class="primary-btn">Explore More</a>
          <ul class="features">
            <li><span>✔️</span> 24/7 Assistance</li>
            <li><span>✔️</span> Emergency medical support</li>
            <li><span>❌</span> Limited coverage</li>
          </ul>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="card">
        <img
          src="/assets/Services/national-cancer-institute-DYQfoftWGXw-unsplash.jpg"
          alt="Lab research"
        />
        <div class="card-content">
          <h3>Advanced Cancer Research</h3>
          <p>
            Our team is focused on identifying early biomarkers of cancer progression
            using state-of-the-art methods.
          </p>
          <a href="#" class="primary-btn">Explore More</a>
          <ul class="features">
            <li><span>✔️</span> Cutting-edge labs</li>
            <li><span>✔️</span> Experienced researchers</li>
            <li><span>❌</span> Limited trials</li>
          </ul>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="card">
        <img
          src="/assets/Services/national-cancer-institute-DYQfoftWGXw-unsplash.jpg"
          alt="Neuroscience"
        />
        <div class="card-content">
          <h3>Neuroscience Breakthroughs</h3>
          <p>
            Exploring how brain cells interact with microbiota and how this may
            influence brain function and cognition.
          </p>
          <a href="#" class="primary-btn">Explore More</a>
          <ul class="features">
            <li><span>✔️</span> Innovative studies</li>
            <li><span>✔️</span> Skilled team</li>
            <li><span>❌</span> High research cost</li>
          </ul>
        </div>
      </div>
    </div>

    <button class="arrow right" on:click={() => slide(1)}>›</button>
  </div>
</main>

<style>
  .slider-wrapper {
    position: relative;
    overflow: hidden;
    margin: auto;
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

  .card-content h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #222;
  }

  .card-content p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 1.2rem;
    line-height: 1.6;
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

  .features li span {
    font-size: 1.2rem;
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
    font-size: 22px;
    font-weight: bold;
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

    /* shift cards right with a left gutter; keep a little right padding */
    .slider-container {
      gap: 0.875rem;
      padding: 0 clamp(8px, 2vw, 16px) 1rem clamp(44px, 12vw, 80px);
      scroll-padding-left: clamp(44px, 12vw, 80px); /* keep snap aligned with new gutter */

      /* hide scrollbar on mobile, keep scrolling */
      -ms-overflow-style: none;     /* IE/Edge legacy */
      scrollbar-width: none;        /* Firefox */
    }

    /* WebKit (iOS Safari, Chrome/Android) */
    .slider-container::-webkit-scrollbar {
      display: none;
    }

    .arrow { display: none; }

    /* slightly narrower cards on mobile */
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
