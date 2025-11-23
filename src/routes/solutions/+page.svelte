<script lang="ts">
  import {
    BadgeCheck, 
    ChevronDown, 
    ChevronUp, 
    TestTubeDiagonal,
    Package, 
    Scale, 
    LockKeyhole,
    ChartCandlestick,
    ChartNoAxesCombined,
    CalendarCheck,
    Sunrise,
    IndianRupee,
    Wallet,
    MousePointerClick,
    SendHorizontal,
    BicepsFlexed,
    Swords,
    RouteOff,
    CircleParkingOff,
    BadgeIndianRupee,
    Move,
    ClockArrowUp
  } from 'lucide-svelte';
  import { base } from '$app/paths';

  const PRIMARY = '#0c017b';
  const ACCENT = '#f26a60';
  const WAVE = '#ffede9';

  const features = [
    'Let us take care of your complete research workload',
    'Boost your growth with a flexible ecosystem available 24/7.',
    'Reduce logistics costs and minimize compliance risks.'
  ];

  // Base-aware static image (fallback)
  const poster = `${base}/assets/solutions/national-cancer-institute-9dxalrR0xFI-unsplash.jpg`;

  // function openVideo() {
  //   window.open('https://unsplash.com/s/photos/retail', '_blank');
  // }

  // Tabs
  type Tab = 'testing' | 'logistic' | 'compliance' | 'security';
  let active: Tab = 'testing';
  let openIndex: number | null = 0;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'testing', label: 'Testing', icon: TestTubeDiagonal },
    { id: 'logistic', label: 'Logistics', icon: Package },
    { id: 'compliance', label: 'Compliance', icon: Scale },
    { id: 'security', label: 'Security', icon: LockKeyhole }
  ];

  const content: Record<Tab, {
    title: string;
    intro: string;
    items: { title: string; body: string }[];
    image: string;
    statTitle: string;
    statSub: string;
  }> = {
    testing: {
      title: 'A Full Lab, Right in Your Pocket',
      intro: 'From market research to market-ready, Phial helps you bring better products to market faster, smarter, and with zero hassle.',
      items: [
        { title: 'Food, Chemistry, Pharma—you name it, we’ve got it.', body: 'Our broad ecosystem covers every major discipline, ensuring you find the exact testing service your product requires.' },
        { title: 'Right Testing, Right Experts, Right Labs', body: 'Our platform brings together a full range of disciplines so you can access the right testing, the right experts, and the right labs, all in one place.' },
        { title: 'Faster Turnaround. Faster Growth.', body: 'Rapid turnaround times mean you can make decisions, improve products, and grow without delays' }
      ],
      image: "/assets/solutions/cdc-IFpQtennlj8-unsplash.jpg",
      statTitle: 'Get Results 30% Faster.',
      statSub: 'creating employee schedules'
    },
    logistic: {
      title: 'First Mile. Last Mile. Fully Covered.',
      intro: 'From sample pickup to final drop-off at dedicated labs, we handle every step of your logistics seamlessly and reliably.',
      items: [
        { title: 'From doorstep pickup to lab delivery', body: 'we collect your samples from your doorstep, maintain full chain-of-custody, real-time tracking, & deliver them to the lab without delays.' },
        { title: 'Standalone Sample Logistics', body: 'Our standalone sample logistics service lets you fully utilize our delivery network for safe, timely, and hassle-free sample transportation.' },
        { title: 'Lower Costs, Higher Transparency.', body: 'Experience reduced operational costs with complete visibility at every step, ensuring smarter, more efficient decision-making.' }
      ],
      image: "/assets/solutions/dwiinshito-YY28__SJSXE-unsplash.jpg",
      statTitle: '17% Fewer Delays',
      statSub: 'with real-time alerts'
    },
    compliance: {
      title: 'Compliance, Simplified !',
      intro: 'We ensure your samples, documentation, and processes meet all required standards. From certifications to reporting, we help you stay fully compliant without the usual complexity.',
      items: [
        { title: 'Single Unified Master Contract', body: 'With one Master Agreement, you gain instant access to numerous labs and their services—no more duplicate paperwork or repetitive compliance steps.' },
        { title: 'Chain of Custody (CoC)', body: 'Maintain full transparency and trust with a secure Chain of Custody that records each handoff, movement, and action taken on your sample from pickup to testing.' },
        { title: 'Cut the complexity from your operations.', body: 'With one click, you place your testing request— we handle logistics, compliance, and paperwork so you can focus on what truly matters.' }
      ],
      image: "/assets/solutions/robert-visual-diary-berlin-EKG8a4ib0tw-unsplash.jpg",
      statTitle: '27% reduction in clutter',
      statSub: 'per new location'
    },
    security: {
      title: 'Security so strong, even we can’t gossip about you.',
      intro: 'Every sample is handled securely, every result is accurate, and all sensitive information remains confidential.',
      items: [
        { title: 'Intellectual Property Protection (IP)', body: 'We enforce strict IP protection measures including controlled access, encrypted workflows, and secure lab partnerships to guarantee your proprietary data remains uncompromised' },
        { title: 'Standard Operating Procedures (SOPs)', body: 'Our SOPs define every step for safe, consistent, and compliant handling, transport, and testing of samples minimizing risks and maintaining the highest standards of quality.' },
        { title: 'Regulatory Compliance & Legal Security', body: 'Our platform ensures all operations comply with local and international standards, including HIPAA, ISO, GLP, and GMP' }
      ],
      image: "/assets/solutions/national-cancer-institute-ct10qdGv1hQ-unsplash.jpg",
      statTitle: 'Increased 67% Uptime',
      statSub: 'trusted at scale'
    }
  };

  function setTab(id: Tab) {
    active = id;
    openIndex = 0;
  }

  function handleTabClick(e: MouseEvent, id: Tab) {
    setTab(id);
    // Smoothly center the clicked tab in view on small screens
    (e.currentTarget as HTMLElement)?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }

  type RetainItem = { icon: any; title: string; body: string };
  type RetainSection = {
    id: string;
    title: string;
    items: RetainItem[];
    image: string;
    quote: string;
    quoteBy: string;
    reverse?: boolean;        // if true: content first, image second
    gradient: string;         // radial-gradient css value
    spacingClass?: string;    // optional extra spacing tweaks
  };

  const retainSections: RetainSection[] = [
    {
      id: 'retain-a',
      title: 'Research as a Service (RaaS)',
      items: [
        {
          icon: CalendarCheck,
          title: 'Build Your Product From Idea to Market Ready',
          body: 'Our 360° lab ecosystem helps you develop, test, refine, and validate your product from idea to market-ready—covering R&D, testing, compliance, quality checks, and certifications in one seamless workflow'
        },
        {
          icon: Sunrise,
          title: 'Custom R&D Services',
          body: 'We tailor our R&D services to your exact requirements. From specialized workflows to expert guidance, we ensure you get reliable, high-quality solutions that match your research goals.'
        },
        {
          icon: IndianRupee,
          title: 'Enterprise-Ready Service',
          body: 'AMC, maintenance, calibration, compliance support, training, and high-volume testing—everything your enterprise needs for smooth, compliant, scalable operations.'
        }
      ],
      image: "/assets/solutions/national-cancer-institute-7cjEoVWKbJc-unsplash.jpg",
      quote: '“Their custom R&D services were exactly what we needed. The team understood our requirements, designed the right workflow, and delivered high-quality results on schedule. This level of expertise and reliability is hard to find.”',
      quoteBy: 'Production Manager – Mid-sized Company',
      gradient: 'radial-gradient(700px 260px at 10% 20%, ' + WAVE + ', transparent)',
      reverse: false,
      spacingClass: 'py-15 mt-15'
    },
    {
      id: 'retain-b',
      title: 'Benchmarking & Insights',
      items: [
        {
          icon: ChartNoAxesCombined,
          title: 'Measure Your Product Against Industry Standards',
          body: 'Get a 360° performance view of your product with data-backed benchmarking across 10+ industry standards—so you always know exactly where you stand in the market.'
        },
        {
          icon: ChartCandlestick,
          title: 'Outsmart the Competition with Better Data',
          body: 'Gain a competitive edge with insights that go far beyond simple test reports—performance benchmarks, quality comparisons, and failure patterns that reveal exactly where to improve and how to stay ahead.'
        },
        {
          icon: BicepsFlexed,
          title: 'Identify Strengths & Weaknesses Areas',
          body: 'See what’s working and what’s not. We pinpoint key strengths and weaknesses so you can make smarter decisions and improve faster.'
        }
      ],
      image: "/assets/solutions/national-cancer-institute-rHfsPolwIgk-unsplash.jpg",
      quote: '“Before Phial, we were building in the dark. Their insights showed us where we were strong and where we were falling behind. We improved our product, cut costs, and hit the shelves faster—all because we finally had the right data.”',
      quoteBy: 'CTO, Early-Stage Startup',
      gradient: 'radial-gradient(700px 260px at 80% 20%, ' + WAVE + ', transparent)',
      reverse: true,
      spacingClass: 'pb-20 pt-2 md:pt-4'
    },
    // {
    //   id: 'retain-a',
    //   title: 'Market Research & Analytics',
    //   items: [
    //     {
    //       icon: ChartPie,
    //       title: 'Schedules they love, in their pocket',
    //       body: 'Make it simple to swap shifts, check schedules, or request PTO in one app.'
    //     },
    //     {
    //       icon: Megaphone,
    //       title: 'Stay connected as you expand',
    //       body: 'Keep everyone aligned in a central hub and avoid schedule mix‑ups or no‑shows.'
    //     },
    //     {
    //       icon: FileCheck2,
    //       title: 'Simplify timesheets and labor compliance',
    //       body: 'Prepare accurate payroll and comply with local wage and hour laws.'
    //     }
    //   ],
    //   image: "/assets/solutions/juno-jo-Um4iB59lS2A-unsplash.jpg",
    //   quote: '“Ease of use, transparency, and our team being able to see their shifts and schedules — that’s been a big win for us.”',
    //   quoteBy: 'District Manager & IT Program Manager',
    //   gradient: 'radial-gradient(700px 260px at 10% 20%, ' + WAVE + ', transparent)',
    //   reverse: false,
    //   spacingClass: 'py-20'
    // },
    {
      id: 'retain-a',
      title: 'Seamless Platform Interface',
      items: [
        {
          icon: Wallet,
          title: 'Free to Use — No Credit Card, No Hidden Fees',
          body: 'Our platform is completely free. No credit card, subscription, or deposits required just sign in and instantly access 100+ verified labs and 1,000+ testing services.'
        },
        {
          icon: MousePointerClick,
          title: 'Smart Booking Interface',
          body: 'Place your testing requests instantly through our intuitive interface— no calls, emails, or back-and-forth needed. Just choose your test, upload details, and you’re done. Fast, simple, and frustration free.'
        },
        {
          icon: SendHorizontal,
          title: 'Dedicated Communication Channel',
          body: 'Communicate with lab professionals through a dedicated chat channel. Ask questions, clarify requirements, share documents, & get expert guidance without switching platforms or waiting endlessly.'
        }
      ],
      image: "/assets/solutions/national-cancer-institute-zoFbfT0M_BU-unsplash.jpg",
      quote: '“Instead of calling multiple labs and waiting for quotes, we booked our tests in minutes. The process was smooth, transparent, and surprisingly fast. This platform has become our go-to for all product testing needs.”',
      quoteBy: 'R&D Engineering Lead',
      gradient: 'radial-gradient(700px 260px at 80% 20%, ' + WAVE + ', transparent)',
      reverse: false,
      spacingClass: 'pb-20 pt-2 md:pt-4'
    },
  ];
</script>

<section class="relative w-full overflow-hidden">
  <!-- Decorative shapes -->
  <!-- Right wave -->
  <svg
    aria-hidden="true"
    class="pointer-events-none absolute -z-10 right-[-12%] top-[-28%] h-[520px] w-[980px] md:right-[-8%] md:top-[-24%] md:h-[620px] md:w-[1180px]"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill={WAVE}
      d="M0,192L60,197.3C120,203,240,213,360,213.3C480,213,600,203,720,176C840,149,960,107,1080,85.3C1200,64,1320,64,1380,64L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
    />
  </svg>
  <!-- Soft blob behind left content -->
  <div
    aria-hidden="true"
    class="hidden md:block absolute -z-10 left-[-12%] top-[-8%] h-[380px] w-[380px] rounded-full opacity-60 blur-[70px]"
    style="background:{WAVE}"
  />
  <!-- Subtle dots behind left column -->
  <svg
    aria-hidden="true"
    class="hidden md:block absolute -z-10 left-6 top-20 opacity-40"
    width="220" height="120" viewBox="0 0 220 120"
  >
    <defs>
      <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="2" fill={WAVE} />
      </pattern>
    </defs>
    <rect width="220" height="120" fill="url(#dots)" />
  </svg>

  <div class="mx-auto max-w-7xl px-6 py-16 md:py-20">
    <div class="grid items-center gap-12 md:grid-cols-2">
      <!-- Left: Heading, bullets, CTA -->
      <div>
        <p class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
           style="background:{WAVE}; color:{PRIMARY}">
          Solutions
        </p>

      <h1
        class="mt-4 font-sans font-extrabold leading-tight tracking-tight text-4xl md:text-5xl"
        style="color:{PRIMARY}"
      >
        Let <span class="brand-phial"><span class="phi">φ</span></span>hial redefine how effortlessly your
        <br class="hidden md:block" />
        <span class="relative inline-block">
          <span class="absolute inset-x-0 bottom-1 h-3 -z-10 rounded" style="background:{WAVE}"></span>
          operations can run.
        </span>
      </h1>

        <ul class="mt-8 space-y-5">
          {#each features as f}
            <li class="flex items-start gap-3 text-lg text-gray-600">
              <BadgeCheck size={24} style="color: {ACCENT}" class="mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          {/each}
        </ul>

        <div class="mt-8 flex items-center gap-4">
          <a
            href="/testing"
            class="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white shadow-sm ring-1 ring-transparent transition-colors hover:bg-white  hover:ring-[color:var(--primary)]"
            style="--primary:{PRIMARY}; background-color:{PRIMARY}"
          >
            Explore Solutions
          </a>
          <!-- <button
            class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[color:var(--primary)] transition-colors hover:bg-[color:var(--wave)]"
            style="--primary:{PRIMARY}; --wave:{WAVE}"
            on:click={openVideo}
          >
            <Play size={18} style="color: {PRIMARY}" />
            Watch overview
          </button> -->
        </div>
      </div>

      <!-- Right: Media card -->
      <div>
        <div class="relative h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] overflow-hidden rounded-2xl shadow-lg">
          <!-- subtle glow -->
          <div class="pointer-events-none absolute -inset-8 -z-10 rounded-3xl blur-2xl opacity-50"
               style="background: radial-gradient(600px 220px at 70% 40%, {WAVE}, transparent)"></div>

          <img
            src={poster}
            alt="Team collaborating in store backroom"
            class="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />

          <!-- <button
            aria-label="Play video"
            class="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/85 shadow-md ring-2 ring-white/70 backdrop-blur transition hover:bg-white"
            on:click={openVideo}
          >
            <Play size={30} style="color: {PRIMARY}" />
          </button> -->
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Tabs section -->
<section class="relative w-full">
  <div class="mx-auto max-w-6xl px-6 pt-16 md:pt-20">
    <h2 class="text-center text-3xl font-extrabold leading-tight tracking-tight md:text-5xl"
        style="color:{PRIMARY}">
      See Beyond Barriers and<br class="hidden md:block" />
      Build What Comes Next with <span class="brand-phial"><span class="phi">φ</span></span>hial
    </h2>

    <!-- Segmented control -->
    <div class="mt-8 flex justify-center">
      <div class="relative w-full md:max-w-3xl">
        <!-- Edge fades for overflow (mobile only) -->
        <div class="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent md:hidden"></div>
        <div class="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent md:hidden"></div>

        <div
          role="tablist"
          aria-label="Solutions tabs"
          class="no-scrollbar flex w-full snap-x snap-mandatory items-center gap-2 overflow-x-auto rounded-full p-2 [scrollbar-gutter:stable] md:mx-auto"
          style="background:#f3f0ff;"
        >
          {#each tabs as t}
            <button
              type="button"
              role="tab"
              aria-selected={active === t.id}
              on:click={(e) => handleTabClick(e, t.id)}
              class="snap-center shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-all sm:px-4 sm:py-3 md:flex-1 md:shrink md:basis-0"
              class:bg-white={active === t.id}
              class:shadow-md={active === t.id}
              class:text-gray-600={active !== t.id}
              class:text-[var(--primary)]={active === t.id}
              style="--primary:{PRIMARY}"
            >
              <span class="inline-flex items-center gap-2">
                <svelte:component this={t.icon} size={18} style="color:{active===t.id?PRIMARY:'#6b7280'}" />
                <span>{t.label}</span>
              </span>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="mt-10 grid items-start gap-8 md:mt-14 md:grid-cols-2 md:gap-14">
      <!-- Left column -->
      <div>
        <h3 class="text-2xl font-bold md:text-3xl" style="color:{PRIMARY}">
          {content[active].title}
        </h3>
        <p class="mt-3 text-gray-600">
          {content[active].intro}
        </p>

        <a href="/testing" class="mt-4 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
           style="color:{PRIMARY}">
          Learn more
        </a>

        <ul class="mt-8 space-y-4">
          {#each content[active].items as item, i}
            <li class="rounded-2xl border border-gray-100 p-4 shadow-sm">
              <button
                type="button"
                class="flex w-full items-center justify-between text-left"
                on:click={() => openIndex = openIndex === i ? null : i}
              >
                <span class="text-lg font-semibold" style="color:{PRIMARY}">{item.title}</span>
                {#if openIndex === i}
                  <ChevronUp size={18} style="color:{PRIMARY}" />
                {:else}
                  <ChevronDown size={18} style="color:{PRIMARY}" />
                {/if}
              </button>
              {#if openIndex === i}
                <p class="mt-3 text-gray-600">{item.body}</p>
              {/if}
            </li>
          {/each}
        </ul>
      </div>

      <!-- Right column -->
      <div class="relative">
        <!-- image card -->
        <div class="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5"
             style="background: radial-gradient(800px 260px at 80% 30%, {WAVE}, transparent);">
          <img
            src={content[active].image}
            alt={content[active].title}
            class="h-[340px] w-full object-cover md:h-[420px]"
            loading="lazy"
          />
        </div>

        <!-- floating stat card -->
        <div class="absolute -bottom-6 left-4 right-4 mx-auto w-[88%] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 md:left-8 md:w-[70%]">
          <div class="flex items-center gap-4">
            <div class="grid h-12 w-16 place-content-center rounded-xl"
                 style="background:{WAVE}; color:{PRIMARY}">
              <span class="text-3xl font-extrabold">@</span>
            </div>
            <div>
              <p class="text-xl font-extrabold" style="color:{PRIMARY}">{content[active].statTitle}</p>
              <!-- <p class="text-sm text-gray-600">{content[active].statSub}</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Retain team members section -->
<section class="relative w-full mt-30">
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
              <Swords size={22} />
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
              <RouteOff size={22} />
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
              <CircleParkingOff size={22} />
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
          href="/solutions/industries-we-serve"
          class="mt-8 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
          style="color:{PRIMARY}"
        >
          Learn more
        </a>
      </div>

      <!-- Right: bullets -->
      <div class="md:pl-8">
        <h2 class="text-2xl font-extrabold md:text-4xl" style="color:{PRIMARY}">
          Why We Serve These Disciplines
        </h2>

        <ul class="mt-8 space-y-8 max-w-prose">
          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <BadgeIndianRupee size={22} />
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
              <Move size={22} />
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
              <ClockArrowUp size={22} />
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
          href="/solutions/disciplines-we-serve"
          class="mt-8 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
          style="color:{PRIMARY}"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Dynamic retain sections -->
{#each retainSections as section}
<section class="relative w-full">
  <div class="mx-auto max-w-7xl px-6 {section.spacingClass}">
    <div class="grid gap-12 md:grid-cols-2 md:items-start">
      <!-- Image/quote block -->
      <div class="relative mx-auto w-full max-w-xl md:mx-0 {section.reverse ? 'md:order-2 md:pl-10' : 'md:order-1 md:pr-10 md:pb-24'}">
        <div
          class="relative h-[260px] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-black/5 sm:h-[320px] lg:h-[400px]"
          style={"background:" + section.gradient}
        >
          <img
            src={section.image}
            alt="Scheduling app preview"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <figure class="{section.reverse ? 'mt-10 max-w-lg md:mt-12' : 'mt-10 md:mt-16 max-w-lg'}">
          <figcaption class="mb-3 flex items-center gap-3 text-gray-400">
            <span class="h-5 w-16 rounded bg-gray-200"></span>
            <span class="text-xs uppercase tracking-wide">Customer story</span>
          </figcaption>
          <blockquote class="text-sm font-medium italic leading-relaxed text-gray-700">
            {section.quote}
          </blockquote>
          <p class="mt-2 text-xs text-gray-500">
            {section.quoteBy}
          </p>
        </figure>
      </div>

      <!-- Content list -->
      <div class="{section.reverse ? 'md:order-1 md:pr-8' : 'md:order-2 md:pl-8'}">
        <h2 class="text-3xl font-extrabold md:text-4xl" style="color:{PRIMARY}">
          {section.title}
        </h2>

        <ul class="mt-8 space-y-8 max-w-prose">
          {#each section.items as item}
            <li class="flex items-start gap-4">
              <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full"
                   style="background:{WAVE}; color:{PRIMARY}">
                <svelte:component this={item.icon} size={22} />
              </div>
              <div class="leading-relaxed">
                <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                  {item.title}
                </h3>
                <p class="mt-2 text-gray-600">
                  {item.body}
                </p>
              </div>
            </li>
          {/each}
        </ul>

        <a
          href="/testing"
          class="mt-8 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
          style="color:{PRIMARY}"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
</section>
{/each}

<style>
  /* Hide horizontal scrollbar on mobile while keeping scrollable area */
  :global(.no-scrollbar) {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  :global(.no-scrollbar::-webkit-scrollbar) {
    display: none;
  }
  .brand-phial {
    display:inline-flex;
    align-items:center;
    gap:2px;
    font-weight:700;
    text-transform:none;
  }
  .brand-phial .phi {
    font-family:"InterVariable","Inter",sans-serif;
    font-weight:700;
    font-size:1.15em;
    line-height:1;
    text-transform:none;
  }
</style>

