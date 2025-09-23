<script lang="ts">
  // Column headers
  export let colA = "Our platform";
  export let colB = "Others";

  // Types for clarity
  type FeatureRow = {
    label: string;
    a: boolean; // availability for colA
    b: boolean; // availability for colB
  };

  type Section = {
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    imageFirst?: boolean; // true => image on the left
    features: FeatureRow[];
    footer?: string;
  };

  // Default content (override by passing `sections` from parent)
  export let sections: Section[] = [
    {
      title: "Focus on what matters: your research",
      description:
        "Enable faster research outcomes without the complexity of traditional lab processes. Streamline testing workflows, eliminate inefficiencies, & deliver accurate results with ease.",
      image: "/assets/comparison/figure-1.png",
      imageAlt: "dashboard feature image",
      imageFirst: false,
      features: [
        { label: "Access to Certified Research Facilities", a: true, b: false },
        { label: "Time & Cost Efficiency", a: true, b: false },
        { label: "Faster Turnaround Time (TAT)", a: true, b: false }
      ],
      footer:
        "No more wasting hours — book tests, send samples, and get accurate results faster, all from one seamless platform."
    },
    {
      title: "We invest in the individual’s potential",
      description:
        "True growth stems from the quality of knowledge one gains. Our platform empowers researchers by removing barriers, connecting them to the right labs, and ensuring that their work is not hindered by inefficiencies.",
      image: "assets/comparison/figure-2.png",
      imageAlt: "feature image 2",
      imageFirst: true,
      features: [
        { label: "Doorstep Sample Pickup", a: true, b: false },
        { label: "Dynamic Reports and Dashboards", a: true, b: false },
        { label: "Handle Compliance & Documentation", a: true, b: false },
        { label: "Post-Result Communication", a: true, b: false },
      ],
      footer:
        "Potential transforms into collective progress. We exist to make that transformation possible."
    },
    {
      title: "Science doesn’t wait, and neither do we.",
      description:
        "Our round-the-clock service ensures uninterrupted access and support for your research needs. Managed with utmost care and strict confidentiality, safeguarding both your data and intellectual property. We ensure every report is accurate, reliable, and research-ready.",
      image: "/assets/comparison/figure-3.png",
      imageAlt: "dashboard feature image",
      imageFirst: false,
      features: [
        { label: "Quality of Results", a: true, b: false },
        { label: "Secure Handling & Strict IP Protection", a: true, b: false },
        { label: "24/7 service availability", a: true, b: false }
      ],
      footer:
        "Science moves faster, smoother, and smarter—with us by your side."
    }
  ];
</script>

<section class="bg-gray-50 dark:bg-gray-800 font-sans">
  <div class="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">

    <!-- Page headline -->
    <header class="text-center mb-8 sm:mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Why Settle for Outdated Methods?
        <span class="text-[#174698] dark:text-[#174698] pencil-underline">Research Made Modern</span>
      </h1>
    </header>

    {#each sections as s}
      <div class="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
        {#if s.imageFirst}
          <img
            class="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex"
            src={s.image}
            alt={s.imageAlt ?? "feature image"}
          />
        {/if}

        <div class="text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {s.title}
          </h2>
          <p class="mb-8 font-light lg:text-xl">
            {s.description}
          </p>

          <div class="pt-8 my-7 border-t border-gray-200 dark:border-gray-700 overflow-x-auto rounded-lg">
            <table class="w-full text-left">
              <thead class="text-xs uppercase text-gray-600 dark:text-gray-400">
                <tr>
                  <th scope="col" class="py-3 pr-6">Features</th>
                  <th scope="col" class="py-3 px-6 text-center">{colA}</th>
                  <th scope="col" class="py-3 px-6 text-center">{colB}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white">
                {#each s.features as f}
                  <tr>
                    <th scope="row" class="py-4 pr-6 font-medium">{f.label}</th>
                    <td class="px-6 text-center">
                      {#if f.a}
                        <svg class="inline w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="sr-only">Available</span>
                      {:else}
                        <svg class="inline w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                          <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span class="sr-only">Not available</span>
                      {/if}
                    </td>
                    <td class="px-6 text-center">
                      {#if f.b}
                        <svg class="inline w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="sr-only">Available</span>
                      {:else}
                        <svg class="inline w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                          <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span class="sr-only">Not available</span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>

          {#if s.footer}
            <p class="mb-8 font-light lg:text-xl">{s.footer}</p>
          {/if}
        </div>

        {#if !s.imageFirst}
          <img
            class="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex"
            src={s.image}
            alt={s.imageAlt ?? "feature image"}
          />
        {/if}
      </div>
    {/each}
  </div>
</section>

<style>
  .pencil-underline {
    position: relative;
    display: inline-block;
    padding-bottom: 0.4em; /* was 0.25em */
  }
  .pencil-underline::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.15em; /* was 0.05em */
    height: 0.65em;  /* was 0.6em */
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 28' preserveAspectRatio='none'><path d='M2 16c50-6 100 2 150-2s100-8 150-2 50 6 96 2' fill='none' stroke='%23174698' stroke-width='6' stroke-linecap='round' stroke-opacity='0.9'/><path d='M2 22c50-6 100 2 150-2s100-8 150-2 50 6 96 2' fill='none' stroke='%23174698' stroke-width='2.5' stroke-linecap='round' stroke-opacity='0.65'/></svg>");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    pointer-events: none;
  }
</style>