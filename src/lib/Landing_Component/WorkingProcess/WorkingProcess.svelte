<script>
  import { FolderSearch, Boxes, FlaskConical, NotepadText, BadgeCheck } from "lucide-svelte";
  export const PRIMARY = '#0c017b';
  export const ACCENT = '#f26a60';
  export const WAVE = '#ffede9';
  export const SMALL = "#4B5563";
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
      <p style="background:{WAVE}; color:{PRIMARY}" class="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-lg mb-4">Our Working Process</p>
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
      <ul style="color: {PRIMARY}" class="trusted-bullets">
        <li>
          <BadgeCheck size={24} style="color: {ACCENT}" class="mt-0.5 shrink-0" />
          High Reliability
        </li>
        <li>
          <BadgeCheck size={24} style="color: {ACCENT}" class="mt-0.5 shrink-0" />
          Secure Processes
        </li>
        <li>
          <BadgeCheck size={24} style="color: {ACCENT}" class="mt-0.5 shrink-0" />
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
  class="col-span-2 grid grid-cols-2 gap-4"
>
<div class="bg-white shadow-lg rounded-lg p-5 flex flex-col items-center">
  <span class="bg-[#d7e3fc] rounded-full flex items-center justify-center w-16 h-16 mb-2">
    <FolderSearch
      class="w-14 h-12"
      strokeWidth={1}
      aria-hidden="true"
      fill="white"
    />
  </span>
  <p class="font-light text-gray-500 dark:text-gray-400 text-center">
    Browse a variety of fields and partner labs to find the right fit.
  </p>
</div>
<div class="bg-white shadow-lg rounded-lg p-5 flex flex-col items-center">
  <span class="bg-[#d7e3fc] rounded-full flex items-center justify-center w-16 h-16 mb-2">
    <Boxes
      class="w-14 h-12"
      strokeWidth={1}
      aria-hidden="true"
      fill="white"
    />
  </span>
  <p class="font-light text-gray-500 dark:text-gray-400 text-center">
    No more lab visits—we take care of pickup & regulations for you.
  </p>
</div>      
<div class="bg-white shadow-lg rounded-lg p-5 flex flex-col items-center">
  <span class="bg-[#d7e3fc] rounded-full flex items-center justify-center w-16 h-16 mb-2">
    <NotepadText
     class="w-14 h-12"
      strokeWidth={1}
      aria-hidden="true"
      fill="white"
    />
  </span>
  <p class="font-light text-gray-500 dark:text-gray-400 text-center">
    Receive comprehensive reports with precise and reliable results
  </p>
</div>
<div class="bg-white shadow-lg rounded-lg p-5 flex flex-col items-center">
  <span class="bg-[#d7e3fc] rounded-full flex items-center justify-center w-16 h-16 mb-2">
    <FlaskConical
      class="w-14 h-12"
      strokeWidth={1}
      aria-hidden="true"
      fill="white"
    />
  </span>
  <p class="font-light text-gray-500 dark:text-gray-400 text-center">
    Tested by highly qualified experts, ensuring reliable & accurate results.
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
