<script>
    import { Rocket } from "lucide-svelte";
    export const PRIMARY = "#0c017b";
    export const ACCENT = "#f26a60";
    export const WAVE = "#ffede9";
    export const SMALL = "#4B5563";

    const labs = ["Merck", "Equinox", "Thermo Fisher", "BioRad", "Agilent"];
</script>

<!-- Start block -->
<section class="bg-white pt-0 mt-0 overflow-x-hidden">
    <div
        class="grid w-full max-w-screen-xl px-2 sm:px-4 pt-4 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-4 lg:grid-cols-12 lg:pt-4"
    >
        <div
            class="flex flex-col items-center justify-center text-center lg:col-start-4 lg:col-span-6 mx-auto"
        >
            <p
                style="background:{WAVE}; color:{PRIMARY}"
                class="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-lg mb-4"
            >
                Our Trusted Research Collaborators
            </p>
            <h1
                class="max-w-2xl mb-4 text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-none tracking-tight text-black"
            >
                Building Trust <br />
                <span class="sm:whitespace-nowrap">Research &amp; Innovation.</span>
            </h1>
            <p
                class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl break-words"
            >
                From CROs to NABL-accredited labs, our trusted partners support
                every stage of your research—delivering specialized testing,
                compliance, and advanced facilities with accuracy, reliability,
                and speed, so you can innovate with confidence.
            </p>
            <div class="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 justify-center w-full">
                <a
                    href="/enroll-lab"
                    class="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
                >
                    <Rocket size={18} aria-hidden="true" class="mr-2" />
                    Become a Collaborator
                </a>
            </div>
        </div>
    </div>
</section>
<!-- End block -->

<section class="bg-white py-4">
    <div class="max-w-screen-xl mx-auto px-2 sm:px-4">
        <div class="flex flex-wrap justify-center items-center gap-10">
            {#each labs as lab}
                <span
                    class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-400 hover:text-blue-600 transition-colors duration-200 cursor-pointer select-none"
                >
                    {lab}
                </span>
            {/each}
        </div>
    </div>
</section>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
