<script lang="ts">
  import {
    HeartPulse, 
    Utensils, 
    ShoppingBag, 
    Wheat, 
    Sparkles, 
    Factory, 
    BookOpen, 
    Ticket,
    ArrowRight,
    FileCheck2, 
    Smartphone, 
    Megaphone,
    Cog,
    MapPin,
    Sprout,
    GraduationCap,
    HandHeart,
    Landmark
  } from 'lucide-svelte';
  import { base } from '$app/paths';

  const PRIMARY = '#0c017b';
  const ACCENT = '#0c017b';
  const WAVE = '#ffede9';

  const poster = `${base}/assets/solutions/industries-we-serve/industries-we-serve.jpg`;

  type Industry = {
    title: string;
    description: string;
    href: string;
    icon: any;
  };

  const industries: Industry[] = [
    {
      title: 'Startups',
      description: 'Startups move fast—so we help you get affordable, reliable testing quickly, allowing you to build, validate, and launch without delays.',
      href: '',
      icon: Sprout
    },
    {
      title: 'Manufacturing',
      description: 'With everything in one place, you can streamline production and ensure every batch meets industry standards.',
      href: '',
      icon: Cog
    },
    {
      title: 'SMEs & MSMEs',
      description: 'Spend more time building great products and less time chasing labs, paperwork, and testing delays.',
      href: '#',
      icon: MapPin
    },
    {
      title: 'Universities',
      description: 'Innovation thrives when great minds have what they need at their fingertips. Empowering researchers to focus on breakthroughs, not barriers.',
      href: '#',
      icon: GraduationCap
    },
    {
      title: "NGO's",
      description: 'One helping hand for your goodwill. Another for building an innovative, healthier tomorrow.',
      href: '#',
      icon: HandHeart
    },
    {
      title: 'Enterprise',
      description: 'Enterprises rely on us for a scalable ecosystem that connects them to certified labs, manages compliance, and ensures seamless logistics.',
      href: '#',
      icon: Factory
    },
    {
      title: 'Education',
      description: 'Whether a personal project or impactful research, we support you with easy lab operation so you can focus on your discovery.',
      href: '#',
      icon: BookOpen
    },
    {
      title: 'Government',
      description: 'Centralized platform to access verified labs, ensure compliance, and manage samples efficiently',
      href: '#',
      icon: Landmark
    }
  ];
</script>

<section class="relative w-full overflow-hidden">

  <div class="mx-auto max-w-7xl px-6 py-16 md:py-20">
    <div class="grid items-center gap-12 md:grid-cols-2">
      <div>
        <p class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
           style="background:{WAVE}; color:{PRIMARY}">
          Whom We Serve
        </p>

        <h1
          class="mt-4 font-extrabold leading-tight tracking-tight text-4xl md:text-5xl"
          style="color: {PRIMARY}"
        >
          Making laboratory services effortless, affordable, &amp; accessible for every sector.
        </h1>
        <p class="items-start text-xl text-gray-600 mt-8 space-y-5">Laboratory and testing services should never be a barrier to innovation. Yet many industries struggle with high testing costs, limited access to certified labs, and logistical challenges that slow down decision-making.</p>
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
        <div class="relative h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] overflow-hidden rounded-2xl shadow-lg">

          <div class="pointer-events-none absolute -inset-8 -z-10 rounded-3xl blur-2xl opacity-50"
               style="background: radial-gradient(600px 220px at 70% 40%, {WAVE}, transparent)"></div>

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

<!-- Retain team members section -->
<section class="relative w-full">
  <div class="mx-auto max-w-7xl px-6 py-1 mt-1">
        <div class="mb-14 text-center">
      <h2 class="text-3xl md:text-4xl font-extrabold leading-tight" style="color:{PRIMARY}">
        " We believe that every business should know exactly where their product stands "
      </h2>
    </div>
    <div class="grid gap-12 md:grid-cols-2 md:items-start">
      <!-- Left: bullets (duplicated design) -->
      <div class="md:pr-8">
        <h2 class="text-2xl font-extrabold md:text-4xl" style="color:{PRIMARY}">
          Why We Serve These Industries
        </h2>

        <ul class="mt-8 space-y-8 max-w-prose">
          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Smartphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Compliance and Regulatory Challenges
              </h3>
              <p class="mt-2 text-gray-600">
                Transporting samples comes with strict safety and documentation requirements that often cause delays and added costs. We manage all compliance and paperwork for you, ensuring smooth and hassle-free sample delivery to the right lab.
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Megaphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Limited or Inaccessible Lab Services 
              </h3>
              <p class="mt-2 text-gray-600">
                Identifying the right lab for specific sample types is often difficult, time-consuming, and confusing. We simplify this by bringing you access to <span class="underline decoration-2 underline-offset-4 whitespace-nowrap">100+ verified, trusted labs</span> ready to handle every sample testing need.
              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <FileCheck2 size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                No Dedicated Transportation Solutions
              </h3>
              <p class="mt-2 text-gray-600">
                we provide a dedicated, reliable & streamlined <span class="underline decoration-2 underline-offset-4 whitespace-nowrap">sample pickup and delivery service</span>.
              </p>
            </div>
          </li>
        </ul>

        <a
          href="/solutions"
          class="mt-8 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
          style="color:{PRIMARY}"
        >
          Learn more
        </a>
      </div>

      <!-- Right: bullets -->
      <div class="md:pl-8">
        <h2 class="text-2xl font-extrabold md:text-4xl" style="color:{PRIMARY}">
          Services Designed for You
        </h2>

        <ul class="mt-8 space-y-8 max-w-prose">
          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Smartphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                No Expensive Testing Processes
              </h3>
              <p class="mt-2 text-gray-600">
                Research is costly especially when 30–40% of the work relies on external sample testing with high fees and long wait times. With our platform, you can compare 100+ labs and 1,000+ services in one place, saving both money and your most valuable resource: <span class="underline decoration-2 underline-offset-4 whitespace-nowrap">time</span>.
              </p>
            </div>
          </li>

         
          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <FileCheck2 size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Wide Range of Disciplines & Services
              </h3>
              <p class="mt-2 text-gray-600">
                Life gets easier when everything you need is in one place. Whether it’s <span class="underline decoration-2 underline-offset-4 whitespace-nowrap">chemicals, cosmetics, food, or beverages</span>—You can find the right testing service from 1,000+ options in just one click. No more endless web searching.

              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Megaphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Faster Turnaround Times
              </h3>
              <p class="mt-2 text-gray-600">
                With our certified labs, you can be confident in receiving reliable, high-quality, and <span class="underline decoration-2 underline-offset-4 whitespace-nowrap">faster testing every time.</span>
              </p>
            </div>
          </li>
        </ul>

        <a
          href="/solutions"
          class="mt-8 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
          style="color:{PRIMARY}"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
</section>

<section class="bg-white pt-0 mt-20 overflow-x-hidden">
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
        Choose Yours<br />
        <span class="sm:whitespace-nowrap"
          >Research &amp; Innovation.</span
        >
      </h1>
      <!-- <p
        class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 break-words"
      >
        From CROs to NABL-accredited labs, our trusted partners support
        every stage of your research—delivering specialized testing,
        compliance, and advanced facilities with accuracy, reliability,
        and speed, so you can innovate with confidence.
      </p> -->
    </div>
  </div>
</section>

<!-- Industries grid -->
<section class="bg-white">
  <div class="mx-auto max-w-7xl px-6 md:py-16">
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
