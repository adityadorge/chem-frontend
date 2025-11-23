<script lang="ts">
  import {
    HeartPulse, Utensils, ShoppingBag, Wheat, Sparkles, Factory, BookOpen, Ticket, ArrowRight,

    FlaskConical,

    Hamburger,

    SmilePlus,

    Rabbit,

    Syringe





  } from 'lucide-svelte';
  import { base } from '$app/paths';

  const PRIMARY = '#0c017b';
  const ACCENT = '#0c017b';
  const WAVE = '#ffede9';

  const poster = `${base}/assets/solutions/disciplines-we-serve/Group 196.svg`;

  type Industry = {
    title: string;
    description: string;
    href: string;
    icon: any;
  };

  const industries: Industry[] = [
    {
      title: 'Chemicals',
      description: 'Validating a new formulation ? We’ve got you covered with our comprehensive chemistry testing services.',
      href: '#',
      icon: FlaskConical
    },
    {
      title: 'Food & Beverage',
      description: 'From Testing to Tasting – Know your product’s standing among competitors.',
      href: '#',
      icon: Hamburger
    },
    {
      title: 'Cosmetics',
      description: 'Beauty and the least – time spent wrestling with complicated logistics and compliance issues',
      href: '#',
      icon: SmilePlus
    },
    {
      title: 'Environment',
      description: 'Bunny-approved, supporting you to create impactful work for a better environment.',
      href: '#',
      icon: Rabbit
    },
    {
      title: 'Agriculture',
      description: 'From seed to succeed – ensuring quality at every step of your agricultural journey.',
      href: '#',
      icon: Wheat
    },
    {
      title: 'Construction & Mining',
      description: 'Rock-solid solutions for all your construction and mining projects, ensuring reliable, precise, and safe results every time.',
      href: '#',
      icon: Factory
    },
    {
      title: 'Healthcare',
      description: 'Smart in mind & true at heart, our services are designed to support you as you make a difference for others in need.',
      href: '#',
      icon: HeartPulse
    },
    {
      title: 'Pharmaceuticals',
      description: 'Cure to your logistical woes – ensuring your pharmaceutical products meet the highest standards of quality and safety.',
      href: '#',
      icon: Syringe
    }
  ];
</script>

<section class="relative w-full overflow-hidden">

  <div class="mx-auto max-w-7xl px-6 py-16 md:py-20">
    <div class="grid items-center gap-12 md:grid-cols-2">
      <div>
        <p class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
           style="background:{WAVE}; color:{PRIMARY}">
            What We Serve
        </p>

        <h1
          class="mt-4 font-extrabold leading-tight tracking-tight text-4xl md:text-5xl"
          style="color: {PRIMARY}"
        >
          Everything you need, 
          <br class="hidden md:block" />
          <span class="relative inline-block">
            All in one place.
          </span>
        </h1>
        <p class="items-start text-xl text-gray-600 mt-8 space-y-5">Whether it’s chemicals, food products, skincare, pharmaceuticals, or medical samples—you’ll find every testing service you need in one destination.</p>
        <div class="mt-8 flex items-center gap-4">
        <a
            href="/testing"
            class="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white shadow-sm ring-1 ring-transparent transition-colors bg-[color:var(--primary)] hover:bg-[#3621c9] focus:outline-none focus:ring-2 focus:ring-offset-2"
            style="--primary:{PRIMARY}"
            >
            Explore Services
        </a>
        </div>
      </div>

      <div>
        <div class="relative h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] overflow-hidden ">
      
          <img
            src={poster}
            alt="Team collaborating in store backroom"
            class="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bg-white pt-0 mt-0 overflow-x-hidden">
  <div
    class="grid w-full max-w-screen-xl px-2 sm:px-4 pt-4 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-4 lg:grid-cols-12 lg:pt-4"
  >
    <div
      class="flex flex-col items-center justify-center text-center lg:col-start-4 lg:col-span-6 mx-auto"
    >
      <h1
        class="max-w-2xl mb-4 text-3xl sm:text-2xl md:text-5xl xl:text-6xl font-extrabold leading-none tracking-tight"
        style="color: {PRIMARY}"
      >
        Find Yours<br />
        <span class="sm:whitespace-nowrap">Research &amp; Innovation.</span>
      </h1>
      <p
        class="max-w-2xl mb-6 font-light text-gray-600 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 break-words"
      >
        From CROs to NABL-accredited labs, our trusted partners support
        every stage of your research—delivering specialized testing,
        compliance, and advanced facilities with accuracy, reliability,
        and speed, so you can innovate with confidence.
      </p>
    </div>
  </div>
</section>

<!-- Industries grid -->
<section class="bg-white">
  <div class="mx-auto max-w-7xl px-6 py-12 md:py-16">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      {#each industries as item (item.title)}
        <div
          class="group relative flex flex-col rounded-2xl bg-white p-8 md:p-10 shadow-md transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          style="--primary:{PRIMARY}"
        >
          <div
            class="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl"
            style="background:{WAVE}"
          >
            <svelte:component
              this={item.icon}
              class="h-8 w-8"
              style="color:{ACCENT}"
              stroke-width="2"
            />
          </div>

          <h3 class="text-xl md:text-2xl font-semibold" style="color:{PRIMARY}">
            {item.title}
          </h3>

          <p class="mt-3 text-slate-600 text-base md:text-lg leading-relaxed">
            {item.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>