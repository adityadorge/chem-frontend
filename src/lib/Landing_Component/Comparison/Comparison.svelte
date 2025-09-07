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
      title: "Work with tools you already use",
      description:
        "Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease.",
      image: "/assets/enroll-lab/images/feature-1.png",
      imageAlt: "dashboard feature image",
      imageFirst: false,
      features: [
        { label: "Continuous integration and deployment", a: true, b: false },
        { label: "Development workflow", a: true, b: false },
        { label: "Knowledge management", a: true, b: false }
      ],
      footer:
        "Deliver great service experiences fast - without the complexity of traditional ITSM solutions."
    },
    {
      title: "We invest in the world’s potential",
      description:
        "Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease.",
      image: "/assets/enroll-lab/images/feature-2.png",
      imageAlt: "feature image 2",
      imageFirst: true,
      features: [
        { label: "Dynamic reports and dashboards", a: true, b: false },
        { label: "Templates for everyone", a: true, b: false },
        { label: "Development workflow", a: true, b: false },
        { label: "Limitless business automation", a: true, b: false },
        { label: "Knowledge management", a: true, b: false }
      ],
      footer:
        "Deliver great service experiences fast - without the complexity of traditional ITSM solutions."
    },
    {
      title: "Work with tools you already use",
      description:
        "Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease.",
      image: "/assets/enroll-lab/images/feature-1.png",
      imageAlt: "dashboard feature image",
      imageFirst: false,
      features: [
        { label: "Continuous integration and deployment", a: true, b: false },
        { label: "Development workflow", a: true, b: false },
        { label: "Knowledge management", a: true, b: false }
      ],
      footer:
        "Deliver great service experiences fast - without the complexity of traditional ITSM solutions."
    }
  ];
</script>

<section class="bg-gray-50 dark:bg-gray-800">
  <div class="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
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