<script lang='ts'>
    import { PlayCircle, Rocket } from "lucide-svelte";
    import { Plus, Minus } from "lucide-svelte";

    type ValueItem = { id: number; title: string; content: string };
    const values: ValueItem[] = [
        {
            id: 1,
            title: "Customer First",
            content:
                "We put customer at the core of every decision. Every service, feature, and solution we build is designed to help them grow and succeed."
        },
        {
            id: 2,
            title: "Resilient Together",
            content:
                "Challenges are inevitable, but we never give up. We face tough times as a team—communicating openly, solving problems together, and emerging stronger."
        },
        {
            id: 3,
            title: "Always Learning",
            content:
                "We listen, share, and learn from one another. By fostering a culture of curiosity and continuous improvement, we create space for everyone to grow."
        },
        {
            id: 4,
            title: "Excellence in Action",
            content:
                "Good is not enough—we strive for excellence in everything, from sample handling to customer experience, ensuring reliability and precision."
        },
        {
            id: 5,
            title: "Respect & Empathy",
            content:
                "We treat every teammate with respect, valuing diverse perspectives and building an ecosystem rooted in empathy."
        }
    ];

    let openId: number | null = 1;
    const toggle = (id: number) => (openId = openId === id ? null : id);

    // Team data for the grid
    type TeamMember = {
        id: number;
        name: string;
        role: string;
        bio: string;
        image: string;
    };

    const team: TeamMember[] = [
        {
            id: 1,
            name: "Sienna Hewitt",
            role: "Founder & CEO",
            bio: "Former co‑founder of Opendoor. Early staff at Spotify and Clearbit.",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Ashwin Santiago",
            role: "Engineering Manager",
            bio: "Lead engineering teams at Netflix, Pitch, and Protocol Labs.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Caitlyn King",
            role: "Product Designer",
            bio: "Founding design team at Figma. Former Pleo, Stripe, and Tile.",
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 4,
            name: "Owen Garcia",
            role: "Frontend Developer",
            bio: "Former frontend dev for Linear, Coinbase, and Postscript.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
        },
        
    ];
</script>

<svelte:head>
    <link rel="canonical" href="https://https://demo.themesberg.com/landwind/" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/assets/enroll-lab/css/tailwind_output.css" rel="stylesheet">
</svelte:head>

<!-- Start block (replaced with blue hero) -->
<section class="about-hero">
  <!-- Decorative shapes -->
    
  <!-- Centered content -->
  <div class="hero-inner">
    <h1 class="max-w-2xl mx-auto mb-4 text-center text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
      About Us <br />Making Things Better !
    </h1>
    <p class="max-w-2xl mb-6 mx-auto text-center font-light text-white/80 lg:mb-8 md:text-lg lg:text-xl">
      We’re building solutions that put people first — because the best ideas happen when people come together.
    </p>
    <div class="flex items-center justify-center gap-4 sm:flex-row sm:justify-center">
      <a href="https://github.com/themesberg/landwind" class="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 bg-white/95">
        <Rocket size={18} aria-hidden="true" />
        <span class="ml-2">Get Started</span>
      </a>
      <a href="https://www.figma.com/community/file/1125744163617429490" class="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white border border-white/30 rounded-lg focus:outline-none hover:bg-white/10 focus:z-10 focus:ring-4 focus:ring-white/20">
        <PlayCircle size={18} aria-hidden="true" />
        <span class="ml-2">Watch Video</span>
      </a>
    </div>

    <!-- Bottom wave -->
    <div class="hero-wave" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,64 C240,96 480,32 720,48 C960,64 1200,112 1440,96 L1440,120 L0,120 Z" fill="currentColor"></path>
      </svg>
    </div>
  </div>
</section>
<!-- End block -->

<!-- Keep your team image just below the hero -->
<section class="relative -mt-24 md:-mt-28 lg:-mt-55 z-10">
  <div class="max-w-screen-xl px-4 pt-6 pb-0 mx-auto">
    <div class="mt-6 w-full flex justify-center">
      <img src="/assets/about-us/team.png" alt="hero image" class="w-full max-w-4xl md:max-w-5xl h-auto" />
    </div>
  </div>
</section>
<!-- Mission / Vision / Values -->
<section class="bg-white">
  <div class="mx-auto max-w-screen-xl px-4 md:px-6 py-20">
    <!-- Center the two-column block and keep a consistent content width -->
    <div class="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 items-start gap-y-12 md:gap-x-12 lg:gap-x-16 md:pl-8 lg:pl-12">
      <!-- Left: Mission + Vision -->
      <div class="mx-auto md:mx-0 w-full text-start md:text-left">
        <h2 class="text-5xl md:text-6xl font-extrabold text-indigo-900">Mission</h2>
        <p class="mt-6 text-xl md:text-2xl font-semibold italic text-indigo-900">
          Creating the fastest path from question to answer
        </p>
        <p class="mt-3 text-gray-500 md:text-lg lg:text-xl leading-relaxed">
          Real growth comes from knowledge. We’re building solutions that eliminate barriers, connecting them to the right partners, and ensuring their work flows without inefficiencies.
        </p>

        <h2 class="!mt-12 md:!mt-12 text-5xl md:text-6xl font-extrabold text-indigo-900">Vision</h2>
        
        <p class="mt-3 text-gray-500 md:text-lg lg:text-xl leading-relaxed">
          Enable faster research outcomes without the complexity of traditional lab processes — Our goal is simple: one platform, one marketplace, every service you need for research, zero hassle.
        </p>
      </div>

      <!-- Right: Values (accordion) -->
      <div class="mx-auto md:mx-0 w-full text-start md:text-left">
        <h2 class="text-5xl md:text-6xl font-extrabold text-indigo-900">Values</h2>

        <div class="mt-8 divide-y divide-gray-200">
          {#each values as v}
            <div class="py-5">
              <div class="flex gap-6 justify-center md:justify-start">
                <div class="pt-1 text-rose-500">
                  {#if openId === v.id}
                    <Minus size={22} strokeWidth={2.5} />
                  {:else}
                    <Plus size={22} strokeWidth={2.5} />
                  {/if}
                </div>
                <div class="flex-1">
                  <button
                    class="w-full text-2xl font-extrabold text-indigo-900 text-start md:text-left"
                    on:click={() => toggle(v.id)}
                    aria-expanded={openId === v.id}
                    aria-controls={`value-panel-${v.id}`}
                    id={`value-trigger-${v.id}`}
                  >
                    {v.title}
                  </button>
                  {#if openId === v.id}
                    <p
                      id={`value-panel-${v.id}`}
                      class="mt-3 text-gray-500 md:text-base lg:text-lg leading-relaxed"
                      role="region"
                      aria-labelledby={`value-trigger-${v.id}`}
                    >
                      {v.content}
                    </p>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
<!-- Start block -->
<section class="bg-white dark:bg-gray-900">
    <div class="max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:py-16">
        <div class="grid items-center gap-8 md:grid-cols-2">
            <!-- Left: Image -->
            <div class="order-1 md:order-none flex justify-center md:justify-start">
              <figure class="w-full max-w-2xl">
                <img
                  src="/assets/about-us/founders.png"
                  alt="Founders"
                  class="w-full h-auto rounded-2xl shadow-md"
                />
                <figcaption class="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium leading-snug text-center md:text-left">
                  <span class="text-gray-900 dark:text-white">— Dhanashree Kadam</span>
                  &amp;
                  <span class="text-gray-900 dark:text-white">Aditya Dorge</span>
                  <span class="mx-2 text-gray-400 dark:text-gray-500">•</span>
                  <span class="text-gray-500 dark:text-gray-400 font-normal">CEO &amp; Co‑founders</span>
                </figcaption>
              </figure>
            </div>

            <!-- Right: Content -->
            <div class="flex flex-col items-center text-center md:items-start md:text-left">
                <h1 class="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-black">
                    Meet The Vision <br>Behind The Mission !
                </h1>
                <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                    “What began as a project quickly grew into a mission. We recognized how operational hurdles, limited access, and logistical challenges were holding research back. That insight became our driving force—to create a solution that removes these barriers, empowers researchers, and builds a platform where science advances without limits.”
                </p>
                <div class="flex items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
                    <a href="https://github.com/themesberg/landwind" class="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 gap-2">
                        <Rocket size={18} aria-hidden="true" />
                        <span>Get Started</span>
                    </a>
                    <a href="https://www.figma.com/community/file/1125744163617429490" class="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 gap-2">
                        <PlayCircle size={18} aria-hidden="true" />
                        <span>Watch Video</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- End block -->
<!-- Team: matches the provided design -->
<section class="bg-gray-50">
  <div class="mx-auto max-w-screen-xl px-4 md:px-6 py-20">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-4xl md:text-5xl font-extrabold leading-tight text-emerald-900">
        We are the people who
        <br class="hidden sm:block" />
        make up Untitled UI
      </h2>
      <p class="mt-4 text-gray-600 md:text-lg">
        Our philosophy is simple; hire great people and give them
        the resources and support to do their best work.
      </p>
    </div>

    <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each team as m}
        <article class="p-0">
          <div class="rounded-xl overflow-hidden bg-gray-100">
            <img
              src={m.image}
              alt={m.name}
              class="w-full aspect-square md:aspect-[4/3] object-cover"
              loading="lazy"
            />
          </div>
          <div class="mt-4">
            <h3 class="text-base font-semibold text-gray-900">{m.name}</h3>
            <p class="text-sm text-gray-600">{m.role}</p>
            <p class="mt-2 text-sm text-gray-500">{m.bio}</p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
    <!-- Start block -->
    <section class="bg-gray-50 dark:bg-gray-800">
        <div class="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
            <div class="max-w-screen-sm mx-auto text-center">
                <h2 class="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">Take the first step toward transforming research today.</h2>
                <p class="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">Sign up for free. No hidden fees. No credit card required.</p>
                <a
  href="#"
  class="text-white bg-[#1746a2] hover:bg-[#133b84] focus:ring-4 focus:ring-[#1746a2]/30 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-[#1746a2] dark:hover:bg-[#0f2f6e] focus:outline-none dark:focus:ring-[#1746a2]/40"
>
  Get started
</a>
            </div>
        </div>
    </section>

<style>
  /* Hero variables */
  :global(:root) {
    --hero: #0c017b;      /* deep blue */
    --text-muted: #eff1ff;
  }

  /* Hero header (blue) */
  .about-hero {
    position: relative;
    background: var(--hero);
    color: #fff;
    overflow: hidden;
  }
  .about-hero .hero-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 56px 20px 140px; /* extra bottom for wave */
    text-align: center;
  }

  /* Decorative squiggles */
  .about-hero .decor {
    position: absolute;
    pointer-events: none;
    opacity: 0.9;
  }
  .about-hero .decor-left {
    left: clamp(8px, 6vw, 80px);
    top: 80px;
  }
  .about-hero .decor-right {
    right: clamp(8px, 6vw, 120px);
    bottom: 80px;
  }

  /* Bottom wave (inherits --hero color) */
  .about-hero .hero-wave {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    color: var(--hero);
    line-height: 0;
  }
  .about-hero .hero-wave svg {
    width: 100%;
    height: 120px;
    display: block;
  }
</style>
