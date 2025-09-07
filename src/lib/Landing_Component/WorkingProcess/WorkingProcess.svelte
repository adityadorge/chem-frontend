<script>
  const trustedSteps = [
    {
      number: "01",
      title: "Book Test",
      description: "Choose your required test online just in few clicks.",
      icon: "/assets/icon/WorkingProcess/notebook-svgrepo-com.svg",
    },
    {
      number: "02",
      title: "Collection",
      description:
        "600M+ Users: Trusted by over 600 million users around the world",
      icon: "/assets/icon/WorkingProcess/car-svgrepo-com(2).svg",
    },
    {
      number: "03",
      title: "Testing",
      description:
        "100+ countries Have used Landwind to create functional websites",
      icon: "/assets/icon/WorkingProcess/reagent-bottle-svgrepo-com(1).svg",
    },
    {
      number: "04",
      title: "Report",
      description: "Transactions per day",
      icon: "/assets/icon/WorkingProcess/documentation-svgrepo-com.svg",
    },
  ];
</script>

<section class="trusted-section">
  <div class="trusted-container">
    <div class="trusted-text">
      <p class="trusted-subtitle">Our Working Process</p>
      <h2 class="trusted-heading">
        Trusted by over 600 million users and 10,000 teams
      </h2>
      <p class="trusted-description">
        We've designed a seamless service booking flow to eliminate the hassle
        traditionally involved in lab sample testing. Whether you're a student,
        researcher, or institution, you can now book tests in just a few
        steps—completely online, with zero phone calls or emails.
      </p>
      <ul class="trusted-bullets">
        <li>
          <span class="checkmark">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#1746a2" />
              <path
                d="M6 10.5l3 3 5-5"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          High reliability
        </li>
        <li>
          <span class="checkmark">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#1746a2" />
              <path
                d="M6 10.5l3 3 5-5"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          Secure processes
        </li>
        <li>
          <span class="checkmark">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#1746a2" />
              <path
                d="M6 10.5l3 3 5-5"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          Global reach
        </li>
      </ul>
      <div class="trusted-links">
        <a href="#" class="trusted-link"
          >Explore Legality Guide <span>→</span></a
        >
        <a href="#" class="trusted-link"
          >Visit the Trust Center <span>→</span></a
        >
      </div>
    </div>
    <div class="trusted-grid">
      {#each trustedSteps as step}
        <div class="trusted-item">
          <div class="icon-circle">
            <img src={step.icon} alt={step.title} />
            <div class="step-number">{step.number}</div>
          </div>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .trusted-bullets {
    margin-top: 0.75rem;
    text-align: left;
    list-style: none;
    color: #1e40af;
    font-size: 1rem;
    padding-left: 0;
  }
  .trusted-bullets li {
    margin-bottom: 0.35rem;
    display: flex;
    align-items: center;
    gap: 0.3em;
  }
  .checkmark {
    display: inline-flex;
    align-items: center;
    margin-right: 0.3em;
  }
  .trusted-section {
    background: #fff;
    padding: 4rem 1rem;
    color: #111;
    margin-top: 3rem;
    padding-left: 7rem;
  }

  .trusted-container {
    max-width: 1200px;
    margin: auto;
    display: grid;
    gap: 6rem; /* Increased gap between content and trustedSteps */
    grid-template-columns: 1fr;
  }
  .trusted-text {
    margin-left: -3.5rem; /* Shift content a little to the left for laptop view */
  }

  @media (min-width: 1024px) {
    .trusted-container {
      grid-template-columns: 1fr 1fr;
      gap: 8rem; /* Even more gap for laptop view */
    }
  }

  .trusted-subtitle {
    color: #1e40af;
    font-weight: 600;
    font-size: 1.125rem;
  }

  .trusted-heading {
    margin: 0.75rem 0;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .trusted-description {
    color: #6b7280;
    font-weight: 300;
    font-size: 1.125rem;
  }

  .trusted-links {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .trusted-link {
    color: #1e40af;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: color 0.3s;
  }

  .trusted-link:hover {
    color: #1d4ed8;
  }

  .trusted-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .trusted-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

@media (max-width: 767px) {
  .trusted-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem; /* Increased gap between step items for mobile view */
    justify-items: start;
    align-items: start;
    padding-left: 0.5rem;
    padding-right: 5rem;
    width: 100%;
    box-sizing: border-box;
  }
  .trusted-item {
    min-width: 0;
    max-width: 100%;
    margin: 0;
    padding: 0.5rem 0.2rem;
    box-sizing: border-box;
  }
  .icon-circle {
    width: 70px;
    height: 70px;
  }
  .icon-circle img {
    width: 50px;
    height: 50px;
  }
  .step-number {
    width: 22px;
    height: 22px;
    font-size: 0.8rem;
    bottom: -7px;
    right: -7px;
  }
  .trusted-item h3 {
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }
  .trusted-item p {
    font-size: 0.95rem;
  }
}

  .trusted-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .icon-circle {
    position: relative;
    width: 95px;
    height: 95px;
    margin: 0 auto 1rem;
    border: 2px dashed #d4e4f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    box-shadow: 0 2px 12px rgba(30, 64, 175, 0.07);
    transition:
      transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
      box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1),
      border-color 0.6s cubic-bezier(0.23, 1, 0.32, 1),
      background 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    will-change: transform, box-shadow, border-color, background;
  }

  .icon-circle:hover {
    transform: scale(1.13) rotate(-3deg);
    box-shadow:
      0 8px 32px rgba(30, 64, 175, 0.18),
      0 1.5px 8px rgba(30, 64, 175, 0.1);
    border-color: #1746a2;
    background: linear-gradient(135deg, #f0f6ff 60%, #e3eaff 100%);
    z-index: 2;
  }
  .icon-circle img {
    width: 70px;
    height: 70px;
  }

  .step-number {
    position: absolute;
    bottom: -10px;
    right: -10px;
    background: #0f8bdc;
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .trusted-item h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .trusted-item p {
    color: #6b7280;
    font-weight: 300;
  }
</style>
