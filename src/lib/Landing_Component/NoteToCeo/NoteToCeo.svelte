<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/store/api";
  import { Toaster, toast } from "svelte-sonner";
  import { user } from "$lib/store";
  import { get } from "svelte/store";

  let selectedOptions: string[] = [];
  let customSuggestion = "";
  let isSubmitting = false;

  export const PRIMARY = '#0c017b';
  export const ACCENT = '#f26a60';
  export const WAVE = '#ffede9';
  export const SMALL = "#4B5563";

  const commonSuggestions = [
    "Improve turnaround time",
    "Add more home services",
    "Enhance report clarity",
    "Offer live chat support",
    "Expand diagnostic packages"
  ];

  // NEW: rating state
  let rating: number = 0;
  let hoverRating: number = 0;

  onMount(() => {
    selectedOptions = [];
    customSuggestion = "";
  });

  function toggleOption(option: string, checked: boolean) {
    if (checked) {
      if (!selectedOptions.includes(option)) {
        selectedOptions = [...selectedOptions, option];
      }
    } else {
      selectedOptions = selectedOptions.filter((s) => s !== option);
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (isSubmitting) return;

    isSubmitting = true;

    const currentUser = get(user);
    if (!currentUser?.access_token) {
      toast.error("Please log in to send your suggestion.");
      isSubmitting = false;
      return;
    }

    try {
      const res = await fetch(`${API_URL}/suggestions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.access_token}`,
        },
        body: JSON.stringify({
          selected_options: selectedOptions,
          message: customSuggestion,
          rating, // remove if backend doesn't accept this yet
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.detail || "Submission failed.");
      }

      toast.success("We appreciate your suggestion—your feedback helps us improve.");
      selectedOptions = [];
      customSuggestion = "";
      rating = 0;
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="font-inter antialiased w-full bg-[#90c4ff]">
  <div class="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
      <!-- Left: Title, copy, media -->
      <div class="space-y-6 md:space-y-7">
        <div class="space-y-4 md:space-y-5">
          <div class="space-y-2 md:space-y-3">
            <p style="background:{WAVE}; color:{PRIMARY}" class="inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-lg mb-4">Note To CEO</p>
            <p class="font-light text-slate-700 sm:text-xl dark:text-slate-700">
              This message goes directly to the CEO. Your suggestions and
                opinions are highly valued and play a crucial role in helping us
                improve continuously. We appreciate your honest feedback.
            </p>
          </div>

          <!-- Media preview block (no negative margin) -->
          <div>
            <img
              src="assets/note-to-ceo/employee-working-office-interior-workplace-flat-vector-illustration.png"
              alt="Report preview"
              class="w-full h-64 md:h-72 object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Right: Card form -->
      <div class="relative">
        <div class="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-5 md:p-8">
          <h3 class="text-[22px] md:text-[24px] font-extrabold text-slate-900 mb-4 tracking-tight">
            Send your note
          </h3>

          <form class="space-y-5" on:submit={handleSubmit}>
            <!-- Common suggestions -->
            <div>
              <p class="text-sm font-semibold text-slate-900 mb-5">Select common suggestions</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {#each commonSuggestions as option}
                  <label
                    class="flex items-center gap-2 rounded-full border px-3 py-2 cursor-pointer select-none transition
                    {selectedOptions.includes(option)
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'}"
                  >
                    <input
                      type="checkbox"
                      class="h-4 w-4 accent-indigo-600"
                      checked={selectedOptions.includes(option)}
                      on:change={(e) => toggleOption(option, (e.target as HTMLInputElement).checked)}
                    />
                    <span class="text-[14px] leading-5">{option}</span>
                  </label>
                {/each}
              </div>
            </div>

            <!-- Rating -->
            <fieldset>
              <legend class="text-sm font-semibold text-slate-900 mb-2.5">
                How satisfied were you with the overall experience?
              </legend>
              <div class="flex items-center gap-2" on:mouseleave={() => (hoverRating = 0)}>
                {#each [1, 2, 3, 4, 5] as n}
                  <label class="cursor-pointer select-none" on:mouseenter={() => (hoverRating = n)}>
                    <input
                      type="radio"
                      name="satisfaction"
                      class="sr-only"
                      value={n}
                      checked={rating === n}
                      on:change={() => (rating = n)}
                      aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
                    />
                    <svg
                      class="h-7 w-7 transition-colors"
                      class:text-amber-400={(hoverRating || rating) >= n}
                      class:text-slate-300={(hoverRating || rating) < n}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </label>
                {/each}
                <span class="ml-2 text-sm text-slate-600">{rating ? `${rating}/5` : 'No rating'}</span>
              </div>
              <p class="text-xs text-slate-500 mt-3">1 = Not satisfied, 5 = Very satisfied</p>
            </fieldset>

            <!-- Message -->
            <div>
              <p class="text-sm font-semibold text-slate-900 mb-5">Write your own suggestion</p>
              <textarea
                bind:value={customSuggestion}
                placeholder="Type your suggestion here..."
                required
                class="min-h-[140px] w-full rounded-xl border border-slate-200 px-4 py-3 text-[15px] leading-6
                       placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <!-- Submit -->
            <button
              type="submit"
              class="relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-semibold
                     shadow-lg hover:shadow-xl transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-[#0c017b] focus:ring-offset-2
                     disabled:opacity-70 disabled:cursor-not-allowed
                     bg-[#0c017b] text-white border border-[#0a0166]"
              style="background:#0c017b; color:#fff; border-color:#0a0166;"
              disabled={isSubmitting}
            >
              {#if isSubmitting}
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                Sending...
              {:else}
                Send to CEO
              {/if}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* Inter font + smooth rendering */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .font-inter {
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }
</style>

