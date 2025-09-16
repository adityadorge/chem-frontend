<script>
  import { ClipboardCheck, Truck, FlaskConical, ListTodo } from "lucide-svelte";
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

<section class="bg-white dark:bg-gray-900">
  <div
    class="items-center max-w-screen-xl px-4 py-8 mx-auto lg:grid lg:grid-cols-4 lg:gap-16 xl:gap-24 lg:py-24 lg:px-6"
  >
    <div class="col-span-2 mb-8">
      <p class="text-[#1e40af] font-semibold text-lg mb-4">Our Working Process</p>
      <h2
        class="mt-3 mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-3xl dark:text-white"
      >
        Research Made Simple:<br> Seamless Booking, Doorstep Collection & Secure Process.
      </h2>
      <p class="font-light text-gray-500 sm:text-xl dark:text-gray-400">
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
          High Reliability
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
          Secure Processes
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
          Global Reach
        </li>
      </ul>
      <div
        class="pt-6 mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div>
          <a
            href="#"
            class="inline-flex items-center text-base font-medium text-[#1746a2] hover:text-[#1746a2] dark:text-[#1746a2] dark:hover:text-[#1746a2]"
          >
            Explore Legality Guide
            <svg
              class="w-5 h-5 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path></svg
            >
          </a>
        </div>
        <div>
          <a
            href="#"
            class="inline-flex items-center text-base font-medium text-[#1746a2] hover:text-[#1746a2] dark:text-[#1746a2] dark:hover:text-[#1746a2]"
          >
            Visit the Trust Center
            <svg
              class="w-5 h-5 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path></svg
            >
          </a>
        </div>
      </div>
    </div>
    <div
      class="col-span-2 space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0"
    >
      <div>
        <!-- Replace the inline SVG below with ClipboardCheck -->
        <ClipboardCheck
          class="w-10 h-10 mb-2 text-[#1746a2] md:w-12 md:h-12"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p class="font-light text-gray-500 dark:text-gray-400">
          Browse a variety of fields and partner labs to find the right fit.
        </p>
      </div>
      <div>
        <Truck
          class="w-12 h-10 mb-2 text-[#1746a2] md:w-12 md:h-12"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p class="font-light text-gray-500 dark:text-gray-400">
          No more lab visits—we take care of pickup & regulations for you.
        </p>
      </div>
      <div>
        <FlaskConical
          class="w-12 h-10 mb-2 text-[#1746a2] md:w-12 md:h-12"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p class="font-light text-gray-500 dark:text-gray-400">
          Tested by highly qualified experts, ensuring reliable & accurate results.
        </p>
      </div>
      <div>
        <ListTodo
          class="w-12 h-10 mb-2 text-[#1746a2] md:w-12 md:h-12"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p class="font-light text-gray-500 dark:text-gray-400">
          Receive comprehensive reports with precise and reliable results
        </p>
      </div>
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
</style>
