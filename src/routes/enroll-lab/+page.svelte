<script lang="ts">
  import {
    Rocket,
    Package,
    Wallet,
    Server,
    Eye,
    ShieldCheck,
    Workflow,
    Handshake,
    Gem,
    HandCoins,
    PersonStanding,
    Signature,
  } from "lucide-svelte";
  import CollaboratorModal from "./CollaboratorModal/CollaboratorModal.svelte";
  let showCollaboratorModal = false;
  const labs = ["Merck", "Equinox", "Thermo Fisher", "BioRad", "Agilent"];
  const PRIMARY = "#0c017b";
  const ACCENT = "#0c017b";
  const WAVE = "#ffede9";
  const poster = `/assets/enroll-lab/navy-medicine-ClECCcfGN_k-unsplash.jpg`;

  // Dynamic feature sections
  interface FeatureBullet {
    icon: any;
    title: string;
    body: string;
  }
  interface FeatureSection {
    title: string;
    description: string;
    bullets: FeatureBullet[];
    image: string;
    imagePosition: "left" | "right";
    footer?: string;
  }

  const featureSections: FeatureSection[] = [
    {
      title: "Expand Faster, Smarter & Easier",
      description:
        "Why spend on heavy sales or marketing when researchers can come directly to you—Our platform connects you with researchers you’d never reach through traditional channels.",
      bullets: [
        {
          icon: Rocket,
          title: "Scalable Growth Model",
          body: "Expand visibility, access broader markets, diversify your services, and unlock new revenue streams without increasing overhead.",
        },
        {
          icon: Package,
          title: "End-to-End Logistics Support",
          body: "We handle the pickup & delivery so samples arrive ready for processing reducing delays and manual follow‑ups.",
        },
        {
          icon: Server,
          title: "Centralized Platform",
          body: "Manage requests, communication, documents, and payment status in one unified dashboard purpose-built for lab operations.",
        },
        {
          icon: Wallet,
          title: "Lower Customer Acquisition Costs",
          body: "With a unified platform, customers come directly to your services—reducing marketing spend and bringing high-quality demand.",
        },
      ],
      image: "/assets/enroll-lab/figure1.png",
      imagePosition: "right",
      footer:
        "Focus on precision science—we handle reach, workflows, and movement.",
    },
    {
      title: "Visibility, Trust, & Intelligence—All in One Platform",
      description:
        "Operate with higher confidence: be discovered by the right projects, transact securely, and optimize your internal workflows with live insights.",
      bullets: [
        {
          icon: Eye,
          title: "Greater Visibility & In-Platform ads",
          body: "Display your strengths and certifications to trusted researchers, and amplify your reach through precise in-platform ads.",
        },
        {
          icon: ShieldCheck,
          title: "Secure & Transparent Payments",
          body: "Protected transaction flow with milestone clarity—no chasing invoices, no opaque billing, faster cash cycle.",
        },
        {
          icon: Workflow,
          title: "Digital Workflow & Insights",
          body: "Structured request intake, status timelines, utilization metrics, and error‑reducing checklists drive higher throughput per technician.",
        },
        {
          icon: PersonStanding,
          title: "Brand Onboarding",
          body: "Reaching the right brands is hard—onboarding them is even harder. Phial connects your lab with thousands of ready-to-work customers.",
        },
      ],
      image: "/assets/enroll-lab/Group 197.png",
      imagePosition: "left",
      footer: "More Reach. More Trust. More Growth.",
    },
    {
      title: "Total Service Freedom—Unlocked !",
      description:
        "Everything you need to operate freely—instant platform-wide authorization, full service publishing, and complete control over pricing.",
      bullets: [
        {
          icon: Handshake,
          title: "Master Service Agreement (MSA)",
          body: "MSA gives you instant authorization to work with every customer on the platform, making onboarding and collaboration effortless.",
        },
        {
          icon: Gem,
          title: "Publish Custom or Specialized Services",
          body: "Give researchers full visibility into everything your lab offers standard tests, specialized analyses or custom services.",
        },
        {
          icon: HandCoins,
          title: "Full Control Over Your Pricing",
          body: "Set service prices that matches your effort. You have complete control over rates and offer custom pricing for specialized projects.",
        },
        {
          icon: Signature,
          title: "Choose Which Projects or Clients to Accept",
          body: "You maintain full control over which projects and clients you take on—ensuring every request aligns with your expertise & capabilities."
        }
    ],
      image: "/assets/enroll-lab/figure2.png",
      imagePosition: "right",
      footer: "You offer. You price. You win.",
    },
  ];

  // Dynamic onboarding steps (unchanged)
  interface OnboardingStep {
    title: string;
    description: string;
    bullets: string[];
    cta?: { label: string; href: string };
  }
  const onboardingSteps: OnboardingStep[] = [
    {
      title: "Register",
      description: "Join our network and expand your reach without limits.",
      bullets: [
        "Start receiving opportunities",
        "No setup, or hidden fees",
        "Become part of a professional network",
      ],
      // cta: { label: "Get started", href: "/become-collaborator" }
    },
    {
      title: "Get Verified",
      description:
        "Get verified in 24–48 hours & become eligible to receive requests.",
      bullets: [
        "Stand out from competitors",
        "Access high-value projects",
        "Ensure compliance, security, and credibility",
      ],
      // cta: { label: "Get started", href: "/become-collaborator" }
    },
    {
      title: "Start",
      description:
        "Congratulations! You've unlocked access to 100+ companies and brands.",
      bullets: [
        "Instant visibility & reach",
        "Secure payments & logistics support",
        "Faster collaborations, smoother workflows & real growth",
      ],
      // cta: { label: "Get started", href: "/become-collaborator" }
    },
  ];

  // FAQ dynamic data
  interface FaqItem {
    question: string;
    answer: string;
  }

  // What kind of labs are eligible to join the platform?
  // what support is available if I have issues or questions?, 
  // What happens if I need to pause or temporarily stop accepting new projects?
  // Is there a minimum commitment or contract period for labs?
  // /How do I update my lab’s profile or service offerings?
  let faqs: FaqItem[] = [
    {
      question: "What kind of labs are eligible to join the platform ?",
      answer: "From CROs and NABL-accredited facilities to small independent labs and large-scale research centers—every qualified lab is welcome to join our platform.",
    },
    {
      question: "What happens if I need to pause or temporarily stop accepting new projects?",
      answer: "You have full control over your workload, simply pause or stop accepting new projects anytime. Ongoing projects must still be completed and delivered, but beyond that, you’re free to resume whenever you’re ready.",
    },
    {
      question: "Is there a minimum commitment or contract period for labs?",
      answer:
        "There’s no minimum commitment or contract period. Your only obligation is to complete and deliver the projects you choose to accept. Beyond that, you’re free to take on new work whenever you want.",
    },
    {
      question: "How do I update my lab’s profile or service offerings?",
      answer:
        "Once your lab is registered and verified, you’ll receive access to our platform dashboard, where you can easily update your profile, services, pricing, and offerings anytime.",
    },
    {
      question:
        "What support is available if I have issues or questions?",
      answer: "Phial provides 24/7 support to all partner labs. If you have any questions or issues, simply reach out through our support channels, and our team will assist you as quickly as possible.",
    },
    // {
    //   question: "Will I incur fees if I change my plan?",
    //   answer: "No, you can change your plan at any time without incurring fees.",
    // },
    // {
    //   question: "What happens if I cancel my plan?",
    //   answer:
    //     "You will retain access until the end of your billing cycle, after which your account will be downgraded.",
    // },
    // {
    //   question: "What happens when employees leave my business?",
    //   answer:
    //     "You can archive users at any time, and you will not be billed for archived users.",
    // },
  ];

  let openIndex: number | null = null;
  function toggleFaq(idx: number) {
    openIndex = openIndex === idx ? null : idx;
  }
</script>

<!-- Main content section -->
<section class="relative w-full overflow-hidden">
  <div class="mx-auto max-w-7xl px-6 py-16 md:py-20">
    <div class="grid items-center gap-12 md:grid-cols-2">
      <div>
        <p
          class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
          style="background:{WAVE}; color:{PRIMARY}"
        >
          Collaborators
        </p>
        <div class="mt-4">
          <h1
            class="font-extrabold leading-tight tracking-tight text-4xl md:text-5xl"
            style="color:{PRIMARY};"
          >
            Empowering You To <br />Grow, Scale & Succeed!
          </h1>
          <p class="text-xl text-gray-600" style="margin-top:40px;">
            Running a research facility is tough—limited scalability, low
            visibility, manual workflows, and logistics hurdles slow growth and
            and many remain underutilized without the right ecosystem.
          </p>
        </div>
        <div class="mt-8 flex items-center gap-4">
          <a
            href="javascript:void(0)"
            class="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white shadow-sm ring-1 ring-transparent transition-colors bg-[color:var(--primary)] hover:bg-[#3621c9] focus:outline-none focus:ring-2 focus:ring-offset-2"
            style="--primary:{PRIMARY}"
            on:click={() => (showCollaboratorModal = true)}
          >
            Become a Collaborator
          </a>
        </div>
      </div>
      <div
        class="relative h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] rounded-xl overflow-hidden shadow-lg"
      >
        <img
          src={poster}
          alt="Team collaborating in store backroom"
          class="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  </div>
</section>

<section class="bg-white py-4">
  <div class="max-w-screen-xl mx-auto px-2 sm:px-4">
    <div class="flex flex-wrap justify-center items-center gap-10">
      {#each labs as lab}
        <span
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer select-none"
        >
          {lab}
        </span>
      {/each}
    </div>
  </div>
</section>
<section class="bg-gray-50">
  <div class="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-24 lg:px-6">
    <figure class="max-w-screen-md mx-auto">
      <svg
        class="h-12 mx-auto mb-3 text-gray-400"
        viewBox="0 0 24 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
          fill="currentColor"
        />
      </svg>
      <blockquote>
        <p class="text-xl font-medium text-gray-900 md:text-2xl">
          "Our platform bridges the gap between researchers and collaborators,
          unlocking business and brand partnerships, boosting visibility, and
          streamlining operations—so you can focus on advancing science while we
          handle logistics, payments, and outreach."
        </p>
      </blockquote>
      <figcaption class="flex items-center justify-center mt-6 space-x-3">
        <div class="flex items-center divide-x-2 divide-gray-500">
          <div class="pr-3 font-medium text-gray-900">Dhanashree Kadam</div>
          <div class="pl-3 text-sm font-light text-gray-500">Co-founder & CEO</div>
        </div>
      </figcaption>
    </figure>
  </div>
</section>

<section class="bg-gray-50">
  <div
    class="max-w-screen-xl px-4 py-8 mx-auto space-y-24 lg:space-y-28 lg:py-24 lg:px-6"
  >
    {#each featureSections as fs, i}
      <section class="relative w-full">
        <div class="mx-auto max-w-7xl px-2 md:px-0">
          <div class="grid gap-12 md:grid-cols-2 md:items-center">
            {#if fs.imagePosition === "left"}
              <div
                class="relative mx-auto w-full max-w-xl md:mx-0 md:order-1 flex flex-col justify-center self-center mt-8 md:mt-0"
              >
                <img
                  src={fs.image}
                  alt={fs.title}
                  class="w-full object-cover md:max-h-[420px]"
                  loading="lazy"
                />
                {#if fs.footer}
                  <p
                    class="mt-6 text-gray-700 italic text-base leading-relaxed text-center"
                  >
                    {fs.footer}
                  </p>
                {/if}
              </div>
            {/if}

            <div
              class="{fs.imagePosition === 'left'
                ? 'md:order-2 md:pl-8'
                : 'md:order-1 md:pr-8'} self-center"
            >
              <h2
                class="text-3xl font-extrabold md:text-4xl"
                style="color:{PRIMARY}"
              >
                {fs.title}
              </h2>
              <p class="mt-4 text-gray-600 text-lg leading-relaxed max-w-prose">
                {fs.description}
              </p>
              <ul class="mt-8 space-y-8 max-w-prose">
                {#each fs.bullets as item}
                  <li class="flex items-start gap-4">
                    <div
                      class="grid h-12 w-12 shrink-0 place-content-center rounded-full"
                      style="background:{WAVE}; color:{PRIMARY}"
                    >
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
            </div>

            {#if fs.imagePosition === "right"}
              <div
                class="relative mx-auto w-full max-w-xl md:mx-0 md:order-2 flex flex-col justify-center self-center mt-8 md:mt-0"
              >
                <img
                  src={fs.image}
                  alt={fs.title}
                  class="w-full object-cover md:max-h-[420px]"
                  loading="lazy"
                />
                {#if fs.footer}
                  <p
                    class="mt-6 text-gray-700 italic text-base leading-relaxed text-center"
                  >
                    {fs.footer}
                  </p>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </section>
    {/each}
  </div>
</section>

<section>
  <div class="max-w-screen-xl px-4 py-8 mx-auto lg:pb-10 lg:px-6">
    <div class="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
      <h2 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">
        Designed to Empower Collaborators Like You.
      </h2>
      <p class="mb-5 font-light text-gray-500 sm:text-xl">
        Gain instant visibility with researchers and brands, showcase your
        expertise to the right audience, and access projects tailored to your
        strengths.
      </p>
    </div>
    <div
      class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0 lg:items-stretch"
    >
      {#each onboardingSteps as step, i}
        <div
          class="flex flex-col h-full max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow"
        >
          <h3 class="mb-4 text-2xl font-semibold">{i + 1}. {step.title}</h3>
          <p class="font-light text-gray-500 sm:text-lg">{step.description}</p>
          <div class="flex items-baseline justify-center my-8"></div>
          <ul role="list" class="mb-8 space-y-4 text-left">
            {#each step.bullets as b}
              <li class="flex items-center space-x-3">
                <svg
                  class="flex-shrink-0 w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-lg font-medium">{b}</span>
              </li>
            {/each}
          </ul>
          {#if step.cta}
            <a
              href={step.cta.href}
              class="mt-auto text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
              style="background:{PRIMARY}; --tw-ring-color:rgba(12,1,123,0.35);"
              on:mouseenter={() => {}}
            >
              {step.cta.label}
            </a>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="relative w-full overflow-hidden">
  <div class="mx-auto max-w-7xl px-6 py-8 md:py-10">
    <div class="flex flex-col items-center justify-center text-center min-h-[400px]">
      <div>
        <div class="mt-4">
          <h1
            class="font-extrabold leading-tight tracking-tight text-4xl md:text-5xl"
            style="color:{PRIMARY};"
          >
            Don’t Just Thrive<br /><span class="underline">Dominate The Market !</span>
          </h1>
          <p class="text-xl text-gray-600 mt-10 text-center max-w-prose mx-auto">
            Join Phial and put your services in front of the customers who are actively looking for what you offer. Unlock new demand, expand your reach, and dominate the market with your expertise.
          </p>
        </div>
        <div class="mt-8 flex items-center justify-center gap-4">
          <a
            href="javascript:void(0)"
            class="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white shadow-sm ring-1 ring-transparent transition-colors bg-[color:var(--primary)] hover:bg-[#3621c9] focus:outline-none focus:ring-2 focus:ring-offset-2"
            style="--primary:{PRIMARY}"
            on:click={() => (showCollaboratorModal = true)}
          >
            Become a Collaborator
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Place the modal OUTSIDE all layout containers -->
<CollaboratorModal
  open={showCollaboratorModal}
  onClose={() => (showCollaboratorModal = false)}
/>

<section class="w-full bg-white py-10">
  <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-start gap-2 sm:gap-4 md:gap-6 px-2 sm:px-4">
    <div class="w-full sm:w-1/4 min-w-[120px] mb-4 sm:mb-0 flex-shrink-0">
      <h2 class="text-3xl font-extrabold text-[#0c017b] mb-2 sm:mb-0">FAQs</h2>
    </div>
    <div class="flex-1 w-full sm:w-3/4">
      {#each faqs as faq, idx}
        <div class="border-b border-gray-200">
          <button
            class="w-full flex justify-between items-center py-5 text-left focus:outline-none"
            on:click={() => toggleFaq(idx)}
            aria-expanded={openIndex === idx}
          >
            <span class="text-base sm:text-lg font-semibold text-[#0c017b]">
              {faq.question}
            </span>
            <svg
              class="w-6 h-6 text-[#0c017b] transition-transform duration-200 flex-shrink-0"
              style="transform: rotate({openIndex === idx ? 180 : 0}deg);"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {#if openIndex === idx}
            <div class="pb-5 text-gray-700 text-base">{faq.answer}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
