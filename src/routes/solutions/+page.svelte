<script lang="ts">
  import {
    Play, BadgeCheck, CalendarDays, Building2, Store, Factory, ChevronDown, ChevronUp,
    Smartphone, Megaphone, FileCheck2, Quote
  } from 'lucide-svelte';
  import { base } from '$app/paths';

  const PRIMARY = '#0c017b';
  const ACCENT = '#f26a60';
  const WAVE = '#ffede9';

  const features = [
    'Make more sales with staffing that matches demand',
    'Boost retail staff retention with flexible schedules',
    'Bring down labor costs and compliance risks'
  ];

  // Base-aware static image (fallback)
  const poster = `${base}/assets/about-us/team.jpg`;

  function openVideo() {
    window.open('https://unsplash.com/s/photos/retail', '_blank');
  }

  // Tabs
  type Tab = 'single' | 'multi' | 'franchise' | 'enterprise';
  let active: Tab = 'single';
  let openIndex: number | null = 0;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'single', label: 'Single location', icon: CalendarDays },
    { id: 'multi', label: 'Multi location', icon: Building2 },
    { id: 'franchise', label: 'Franchise', icon: Store },
    { id: 'enterprise', label: 'Enterprise', icon: Factory }
  ];

  const content: Record<Tab, {
    title: string;
    intro: string;
    items: { title: string; body: string }[];
    image: string;
    statTitle: string;
    statSub: string;
  }> = {
    single: {
      title: 'End last-minute scheduling chaos',
      intro: 'Quickly create and share schedules from any device—save time and reduce last‑minute chaos.',
      items: [
        { title: 'Control your labor costs', body: 'Track wage costs as you schedule and keep staffing aligned to sales and demand.' },
        { title: 'Automate key compliance requirements', body: 'Build fair work and break rules into your schedules and avoid fines.' },
        { title: 'Remove scheduling hassles for your team', body: 'Publish shifts instantly, swap requests, and time-off all in one place.' }
      ],
      image: poster,
      statTitle: '15 hrs/month saved',
      statSub: 'creating employee schedules'
    },
    multi: {
      title: 'Standardize and scale across locations',
      intro: 'Templates and approvals help your managers keep every site on the same playbook.',
      items: [
        { title: 'Centralized templates', body: 'Clone best-practice rosters and apply them across stores in seconds.' },
        { title: 'Approval workflows', body: 'Set manager approvals for changes and ensure audit trails.' },
        { title: 'Real-time visibility', body: 'See coverage gaps and overtime risk across all locations.' }
      ],
      image: poster,
      statTitle: '7% less overtime',
      statSub: 'with real-time alerts'
    },
    franchise: {
      title: 'Give franchisees simple, powerful tools',
      intro: 'Easy to adopt, easy to support, and flexible for local needs.',
      items: [
        { title: 'Role-based access', body: 'Owners, managers, and staff get the right tools without the noise.' },
        { title: 'Local rules, global policy', body: 'Respect local labor laws while keeping network-wide standards.' },
        { title: 'Self-serve onboarding', body: 'Spin up new stores with prebuilt templates and checklists.' }
      ],
      image: poster,
      statTitle: '4 days faster launch',
      statSub: 'per new location'
    },
    enterprise: {
      title: 'Operate at enterprise scale',
      intro: 'APIs, SSO, and enterprise-grade security keep IT happy while ops move faster.',
      items: [
        { title: 'Integrate your stack', body: 'Connect payroll, POS, and HRIS to automate data flow.' },
        { title: 'Granular permissions', body: 'Fine-grained access control across regions and brands.' },
        { title: 'Insights and audits', body: 'Advanced reporting and exports for finance and compliance.' }
      ],
      image: poster,
      statTitle: '99.99% uptime',
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
          Retail Workforce
        </p>

        <h1
          class="mt-4 font-extrabold leading-tight tracking-tight text-4xl md:text-5xl"
          style="color: {PRIMARY}"
        >
          Take your stores to a new level of efficiency with
          <br class="hidden md:block" />
          <span class="relative inline-block">
            <span class="absolute inset-x-0 bottom-1 h-3 -z-10 rounded" style="background:{WAVE}"></span>
            retail scheduling software
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
            href="#"
            class="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white shadow-sm ring-1 ring-transparent transition-colors hover:bg-white  hover:ring-[color:var(--primary)]"
            style="--primary:{PRIMARY}; background-color:{PRIMARY}"
          >
            Book a demo
          </a>
          <button
            class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[color:var(--primary)] transition-colors hover:bg-[color:var(--wave)]"
            style="--primary:{PRIMARY}; --wave:{WAVE}"
            on:click={openVideo}
          >
            <Play size={18} style="color: {PRIMARY}" />
            Watch overview
          </button>
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

          <button
            aria-label="Play video"
            class="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/85 shadow-md ring-2 ring-white/70 backdrop-blur transition hover:bg-white"
            on:click={openVideo}
          >
            <Play size={30} style="color: {PRIMARY}" />
          </button>
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
      Tackle today’s challenges and<br class="hidden md:block" />
      tomorrow’s opportunities with Deputy
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

        <a href="#" class="mt-4 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
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
              <span class="text-lg font-extrabold">UWH</span>
            </div>
            <div>
              <p class="text-xl font-extrabold" style="color:{PRIMARY}">{content[active].statTitle}</p>
              <p class="text-sm text-gray-600">{content[active].statSub}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Retain team members section -->
<section class="relative w-full">
  <div class="mx-auto max-w-7xl px-6 py-20 mt-20">
    <div class="grid gap-12 md:grid-cols-2 md:items-start">
      <!-- Left: layered app mock -->
      <div class="relative mx-auto w-full max-w-xl md:mx-0 md:order-1 md:pr-10 md:pb-24">
        <!-- back card -->
        <div
          class="relative h-[260px] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-black/5 sm:h-[320px] lg:h-[400px]"
          style="background: radial-gradient(700px 260px at 10% 20%, {WAVE}, transparent)"
        >
          <img
            src={poster}
            alt="Scheduling app preview"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- quote -->
        <figure class="mt-10 md:mt-16 max-w-lg">
          <figcaption class="mb-3 flex items-center gap-3 text-gray-400">
            <span class="h-5 w-16 rounded bg-gray-200"></span>
            <span class="text-xs uppercase tracking-wide">Customer story</span>
          </figcaption>
          <blockquote class="text-sm font-medium italic text-gray-700 leading-relaxed">
            “Ease of use, transparency, and our team being able to see their shifts and schedules —
            that’s been a big win for us.”
          </blockquote>
          <p class="mt-2 text-xs text-gray-500">
            District Manager & IT Program Manager
          </p>
        </figure>
      </div>

      <!-- Right: bullets -->
      <div class="md:order-2 md:pl-8">
        <h2 class="text-3xl font-extrabold md:text-4xl" style="color:{PRIMARY}">
          Retain your team members
        </h2>

        <ul class="mt-8 space-y-8 max-w-prose">
          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Smartphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Schedules they love, in their pocket
              </h3>
              <p class="mt-2 text-gray-600">
                Make it simple to swap shifts, check schedules, or request PTO in one app.Make it simple to swap shifts, check schedules, or request PTO in one app.Make it simple to swap shifts, check schedules, or request PTO in one app.
              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Megaphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Stay connected as you expand
              </h3>
              <p class="mt-2 text-gray-600">
                Keep everyone aligned in a central hub and avoid schedule mix‑ups or no‑shows.Keep everyone aligned in a central hub and avoid schedule mix‑ups or no‑shows.
              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <FileCheck2 size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Simplify timesheets and labor compliance
              </h3>
              <p class="mt-2 text-gray-600">
                Prepare accurate payroll and comply with local wage and hour laws.
              </p>
            </div>
          </li>
        </ul>

        <a
          href="#"
          class="mt-8 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
          style="color:{PRIMARY}"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Retain team members section (mirrored: content left, image + quote right) -->
<section class="relative w-full overflow-hidden -mt-12 sm:-mt-14 md:-mt-16">
  <div class="mx-auto max-w-7xl px-6 pt-2 md:pt-4 pb-20">
    <div class="grid gap-12 md:grid-cols-2 md:items-start">
      <!-- Left: bullets/content -->
      <div class="md:pr-8">
        <h2 class="text-3xl font-extrabold md:text-4xl" style="color:{PRIMARY}">
          Retain your team members
        </h2>

        <ul class="mt-8 space-y-8 max-w-prose">
          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Smartphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Schedules they love, in their pocket
              </h3>
              <p class="mt-2 text-gray-600">
                Simple shift swaps, schedule checks, and PTO—everything in one app.
              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Megaphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Stay connected as you expand
              </h3>
              <p class="mt-2 text-gray-600">
                Keep teams aligned in one place and avoid schedule mix‑ups or no‑shows.
              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <FileCheck2 size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Simplify timesheets and compliance
              </h3>
              <p class="mt-2 text-gray-600">
                Accurate payroll prep and easier compliance with local wage and hour laws.
              </p>
            </div>
          </li>
        </ul>

        <a
          href="#"
          class="mt-8 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
          style="color:{PRIMARY}"
        >
          Learn more
        </a>
      </div>

      <!-- Right: image + quote -->
      <div class="relative mx-auto w-full max-w-xl md:mx-0 md:pl-10">
        <div
          class="relative h-[260px] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-black/5 sm:h-[320px] lg:h-[400px]"
          style="background: radial-gradient(700px 260px at 80% 20%, {WAVE}, transparent)"
        >
          <img
            src={poster}
            alt="Scheduling app preview"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <figure class="mt-10 max-w-lg md:mt-12">
          <figcaption class="mb-3 flex items-center gap-3 text-gray-400">
            <span class="h-5 w-16 rounded bg-gray-200"></span>
            <span class="text-xs uppercase tracking-wide">Customer story</span>
          </figcaption>
          <blockquote class="text-sm font-medium italic leading-relaxed text-gray-700">
            “Ease of use, transparency, and our team being able to see their shifts and schedules —
            that’s been a big win for us.”
          </blockquote>
          <p class="mt-2 text-xs text-gray-500">
            District Manager & IT Program Manager
          </p>
        </figure>
      </div>
    </div>
  </div>
</section>
<!-- Retain team members section -->
<section class="relative w-full">
  <div class="mx-auto max-w-7xl px-6 pt-2 md:pt-4 pb-20">
    <div class="grid gap-12 md:grid-cols-2 md:items-start">
      <!-- Left: layered app mock -->
      <div class="relative mx-auto w-full max-w-xl md:mx-0 md:order-1 md:pr-10 md:pb-24">
        <!-- back card -->
        <div
          class="relative h-[260px] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-black/5 sm:h-[320px] lg:h-[400px]"
          style="background: radial-gradient(700px 260px at 10% 20%, {WAVE}, transparent)"
        >
          <img
            src={poster}
            alt="Scheduling app preview"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- quote -->
        <figure class="mt-10 md:mt-16 max-w-lg">
          <figcaption class="mb-3 flex items-center gap-3 text-gray-400">
            <span class="h-5 w-16 rounded bg-gray-200"></span>
            <span class="text-xs uppercase tracking-wide">Customer story</span>
          </figcaption>
          <blockquote class="text-sm font-medium italic text-gray-700 leading-relaxed">
            “Ease of use, transparency, and our team being able to see their shifts and schedules —
            that’s been a big win for us.”
          </blockquote>
          <p class="mt-2 text-xs text-gray-500">
            District Manager & IT Program Manager
          </p>
        </figure>
      </div>

      <!-- Right: bullets -->
      <div class="md:order-2 md:pl-8">
        <h2 class="text-3xl font-extrabold md:text-4xl" style="color:{PRIMARY}">
          Retain your team members
        </h2>

        <ul class="mt-8 space-y-8 max-w-prose">
          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Smartphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Schedules they love, in their pocket
              </h3>
              <p class="mt-2 text-gray-600">
                Make it simple to swap shifts, check schedules, or request PTO in one app.Make it simple to swap shifts, check schedules, or request PTO in one app.Make it simple to swap shifts, check schedules, or request PTO in one app.
              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Megaphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Stay connected as you expand
              </h3>
              <p class="mt-2 text-gray-600">
                Keep everyone aligned in a central hub and avoid schedule mix‑ups or no‑shows.Keep everyone aligned in a central hub and avoid schedule mix‑ups or no‑shows.
              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <FileCheck2 size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Simplify timesheets and labor compliance
              </h3>
              <p class="mt-2 text-gray-600">
                Prepare accurate payroll and comply with local wage and hour laws.
              </p>
            </div>
          </li>
        </ul>

        <a
          href="#"
          class="mt-8 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
          style="color:{PRIMARY}"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Retain team members section (mirrored: content left, image + quote right) -->
<section class="relative w-full overflow-hidden -mt-12 sm:-mt-14 md:-mt-16">
  <div class="mx-auto max-w-7xl px-6 pt-2 md:pt-4 pb-20">
    <div class="grid gap-12 md:grid-cols-2 md:items-start">
      <!-- Left: bullets/content -->
      <div class="md:pr-8">
        <h2 class="text-3xl font-extrabold md:text-4xl" style="color:{PRIMARY}">
          Retain your team members
        </h2>

        <ul class="mt-8 space-y-8 max-w-prose">
          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Smartphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Schedules they love, in their pocket
              </h3>
              <p class="mt-2 text-gray-600">
                Simple shift swaps, schedule checks, and PTO—everything in one app.
              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <Megaphone size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Stay connected as you expand
              </h3>
              <p class="mt-2 text-gray-600">
                Keep teams aligned in one place and avoid schedule mix‑ups or no‑shows.
              </p>
            </div>
          </li>

          <li class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-content-center rounded-full" style="background:{WAVE}; color:{PRIMARY}">
              <FileCheck2 size={22} />
            </div>
            <div class="leading-relaxed">
              <h3 class="text-xl font-bold" style="color:{PRIMARY}">
                Simplify timesheets and compliance
              </h3>
              <p class="mt-2 text-gray-600">
                Accurate payroll prep and easier compliance with local wage and hour laws.
              </p>
            </div>
          </li>
        </ul>

        <a
          href="#"
          class="mt-8 inline-block text-base font-semibold underline decoration-2 underline-offset-4"
          style="color:{PRIMARY}"
        >
          Learn more
        </a>
      </div>

      <!-- Right: image + quote -->
      <div class="relative mx-auto w-full max-w-xl md:mx-0 md:pl-10">
        <div
          class="relative h-[260px] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-black/5 sm:h-[320px] lg:h-[400px]"
          style="background: radial-gradient(700px 260px at 80% 20%, {WAVE}, transparent)"
        >
          <img
            src={poster}
            alt="Scheduling app preview"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <figure class="mt-10 max-w-lg md:mt-12">
          <figcaption class="mb-3 flex items-center gap-3 text-gray-400">
            <span class="h-5 w-16 rounded bg-gray-200"></span>
            <span class="text-xs uppercase tracking-wide">Customer story</span>
          </figcaption>
          <blockquote class="text-sm font-medium italic leading-relaxed text-gray-700">
            “Ease of use, transparency, and our team being able to see their shifts and schedules —
            that’s been a big win for us.”
          </blockquote>
          <p class="mt-2 text-xs text-gray-500">
            District Manager & IT Program Manager
          </p>
        </figure>
      </div>
    </div>
  </div>
</section>



<style>
  /* Hide horizontal scrollbar on mobile while keeping scrollable area */
  :global(.no-scrollbar) {
    -ms-overflow-style: none; /* IE/Edge */
    scrollbar-width: none;    /* Firefox */
  }
  :global(.no-scrollbar::-webkit-scrollbar) {
    display: none;            /* Chrome/Safari */
  }
</style>

