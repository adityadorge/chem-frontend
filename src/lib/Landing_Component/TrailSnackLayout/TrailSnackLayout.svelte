<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  type Topic =
    | "fitness"
    | "outdoors"
    | "breakfast"
    | "school"
    | "work"
    | "travel";

  let topics: Topic[] = [
    "fitness",
    "outdoors",
    "breakfast",
    "school",
    "work",
    "travel",
  ];
  let activeTopic: Topic = "fitness";

  let intervalId: ReturnType<typeof setInterval>;

  // Cycle topics every 3 seconds
  onMount(() => {
    intervalId = setInterval(() => {
      const currentIndex = topics.indexOf(activeTopic);
      const nextIndex = (currentIndex + 1) % topics.length;
      activeTopic = topics[nextIndex];
    }, 5000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  const contentMap: Record<
    Topic,
    {
      image: string;
      tagline: string;
      title: string;
      description: string;
    }
  > = {
    fitness: {
      image: "assets/TrailSnack/claudio-schwarz-q8kR_ie6WnI-unsplash.jpg",
      tagline: "fitness",
      title: "power your workout",
      description:
        "Fuel your body with essential nutrients. Perfect pre or post-workout solution for sustained energy.",
    },
    outdoors: {
      image: "assets/TrailSnack/cdc-OZcQIhidMTw-unsplash.jpg",
      tagline: "outdoors",
      title: "ultimate trail snack",
      description:
        "ditch the dry bar and sticky goo for a light and refreshing smoothie on your next run, hike or bike ride.",
    },
    breakfast: {
      image:
        "assets/TrailSnack/hush-naidoo-jade-photography-SZJoYW4eLHE-unsplash.jpg",
      tagline: "breakfast",
      title: "morning fuel boost",
      description:
        "Start your day energized with a wholesome smoothie packed with fiber, vitamins, and flavor.",
    },
    school: {
      image: "assets/TrailSnack/handiwork-nyc-_fA8Ppg3Yhs-unsplash.jpg",
      tagline: "school",
      title: "smart snack for students",
      description:
        "Healthy and tasty snack to keep students focused and energized throughout the school day.",
    },
    work: {
      image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34",
      tagline: "work",
      title: "productive workday fuel",
      description:
        "Beat the afternoon slump with a delicious smoothie that keeps your mind sharp and alert.",
    },
    travel: {
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350",
      tagline: "travel",
      title: "travel-friendly refreshment",
      description:
        "Easy to carry and refreshing—your perfect travel companion for long journeys and layovers.",
    },
  };
</script>

<!-- Title and description above tabs -->
<div class="header-section">
  <span class="tagline-pill">made to move with you</span>
  <h1 class="main-title">doorstep pickup, lab dropoff</h1>
  <p class="main-description">
    Smooth, nutritious blends for every part of your day — wherever you go,
    we’re there with you.
  </p>

  <!-- Tabs inside the same container -->
  <div class="tabs">
    {#each topics as topic}
      <button
        class:active-tab={activeTopic === topic}
        on:click={() => (activeTopic = topic)}
      >
        {topic}
      </button>
    {/each}
  </div>
</div>
<div class="card-wrapper">
  <!-- Main card -->
  <div class="card-container">
    <!-- Image on left -->
    <div class="card-image">
      <img src={contentMap[activeTopic].image} alt={activeTopic} />
    </div>

    <!-- Text on right -->
    <div class="card-content">
      <p class="tagline">{contentMap[activeTopic].tagline}</p>
      <h1 class="title">{contentMap[activeTopic].title}</h1>
      <p class="description">{contentMap[activeTopic].description}</p>

      <!-- Pagination dots (placeholder for future carousel) -->
      <div class="dots">
        {#each Array(6) as _, i}
          <span class:active-dot={i === topics.indexOf(activeTopic)}></span>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .card-wrapper {
    background-color: #f8f8f8; /* light grey */
    padding: 3rem 1rem;
  }

  .header-section {
    text-align: center;
    background-color: #f8f8f8;
    padding: 2rem 1rem 1rem;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    margin-top: 2rem;
  }

  .tagline-pill {
    display: inline-block;
    background-color: #30b1dd;
    color: white;
    padding: 0.3rem 1rem;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .main-title {
    color: #004aad;
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 1.5rem;
  }
  .main-description {
    color: #004aad;
    font-size: 1.15rem;
    font-weight: 400;
    line-height: 1.6;
    max-width: 700px;
    margin: 0 auto 2rem;
    opacity: 0.85;
  }
  /* Moved tab styles inside header-section */
  .tabs {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }

  .tabs button {
    background: transparent;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 999px;
    border: 1px solid #004aad;
    font-weight: 500;
    color: #004aad;
    transition: background 0.3s ease;
  }

  .tabs button.active-tab {
    background: #1746a2;
    color: white; /* Much better contrast */
    font-weight: 700;
  }

  button {
    background: transparent;
    /* color: white; */
    border: none;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 999px;
    font-weight: 500;
    transition: background 0.3s ease;
  }

  button.active-tab {
    background: white;
    /* color: #ff6720; */
    font-weight: 700;
  }

  .card-container {
    background: white;
    border-radius: 20px;
    margin: 2rem auto;
    padding: 0;
    display: flex;
    max-width: 1300px; /* Increased overall container */
    min-height: 550px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    position: relative; /* Needed for absolute positioning */
  }

  .card-image {
    flex: 1.2; /* More space for image */
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px; /* Fully rounded corners */
    padding: 0.5rem; /* Optional: subtle spacing from container */
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
  }
  .tagline {
    color: #555;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #222;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .description {
    color: #666;
    font-size: 1rem;
    line-height: 1.5;
  }

  .dots {
    position: absolute;
    bottom: 3rem; /* Padding from the bottom */
    left: 75%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
  }

  .dots span {
    width: 40px; /* Wider width */
    height: 4px;
    background: #ddd;
    border-radius: 2px;
    transition: all 0.3s;
  }

  .dots span.active-dot {
    background: #222;
  }

  @media (max-width: 768px) {
    .card-container {
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
    }

    .card-image img {
      width: 100%;
      height: 250px;
      object-fit: cover;
    }

    .card-content {
      align-items: center;
      text-align: center;
    }
  }

  @media (max-width: 600px) {
    .card-wrapper {
      padding: 1rem 0.5rem;
    }
    .header-section {
      padding: 1.2rem 0.5rem 0.5rem;
      margin-top: 1rem;
      border-radius: 12px 12px 0 0;
    }
    .main-title {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .main-description {
      font-size: 1rem;
      margin-bottom: 1.2rem;
      max-width: 100%;
    }
    .tabs {
      gap: 0.7rem;
      flex-wrap: wrap;
    }
    .tabs button {
      font-size: 0.95rem;
      padding: 0.4rem 0.7rem;
    }
    .card-container {
      flex-direction: column;
      align-items: center;
      padding: 0.7rem;
      min-height: 0;
      max-width: 100%;
      border-radius: 12px;
    }
    .card-image {
      width: 100%;
      margin-bottom: 1rem;
    }
    .card-image img {
      width: 100%;
      height: 400px; /* Increased image height for mobile view */
      object-fit: cover;
      border-radius: 12px;
      padding: 0;
    }
    .card-content {
      margin-top: -4rem; /* Move content even closer to the image */
      padding-top: 0;
      padding-bottom: 0.7rem;
      padding-left: 0.7rem;
      padding-right: 0.7rem;
      align-items: center;
      text-align: center;
    }
    .title {
      font-size: 1.3rem;
      margin-bottom: 0.7rem;
    }
    .description {
      font-size: 0.95rem;
    }
    .dots {
      position: static;
      margin-top: 1.2rem;
      left: auto;
      bottom: auto;
      transform: none;
      gap: 0.5rem;
      justify-content: center;
    }
    .dots span {
      width: 24px;
      height: 4px;
    }
  }
</style>
