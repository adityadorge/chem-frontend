<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/store/api";
  // import { InitializeGoogleLogin } from "$lib/utils/googleLogin";
  import { goto } from "$app/navigation";
  import { Toaster, toast } from "svelte-sonner";
  import { user } from "$lib/store";
  import { get } from "svelte/store";

  let selectedOptions: string[] = [];
  let customSuggestion = "";
  // Reset on mount
  onMount(() => {
    selectedOptions = [];
    customSuggestion = "";
  });
  let isSubmitting = false;

  // Form submit handler
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
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.detail || "Submission failed.");
      }

      toast.success("We appreciate your suggestion—your feedback helps us improve.");
      selectedOptions = [];
      customSuggestion = "";
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="home-questions">
  <div class="home-questions__container">
    <div class="home-questions__wrapper">
      <section class="module-questions">
        <div class="module-questions__container">
          <div class="module-questions__wrapper">
            <div class="module-questions__header">              
              <h2 class="module-questions__title">Note To the CEO</h2>
            </div>
            <div class="module-questions__content">
              <p>
                This message goes directly to the CEO. Your suggestions and
                opinions are highly valued and play a crucial role in helping us
                improve continuously. We appreciate your honest feedback.
              </p>
            </div>
            <div class="module-questions__form">
              <form class="suggestion-form" on:submit={handleSubmit}>
                <p class="suggestion-form__label">Select common suggestions:</p>
                <div class="suggestion-form__options">
                  {#each ["Improve turnaround time", "Add more home services", "Enhance report clarity", "Offer live chat support", "Expand diagnostic packages"] as suggestion}
                    <label>
                      <input
                        type="checkbox"
                        value={suggestion}
                        on:change={(e) => {
                          const target = e.target as HTMLInputElement | null;
                          if (target && target.checked) {
                            selectedOptions = [...selectedOptions, suggestion];
                          } else if (target) {
                            selectedOptions = selectedOptions.filter(
                              (s) => s !== suggestion
                            );
                          }
                        }}
                      />
                      {suggestion}
                    </label>
                  {/each}
                </div>

                <p class="suggestion-form__label">Write your own suggestion:</p>
                <textarea
                  class="suggestion-form__textarea"
                  bind:value={customSuggestion}
                  placeholder="Type your suggestion here..."
                  required
                ></textarea>

                <button
                  type="submit"
                  class="suggestion-form__button"
                  disabled={isSubmitting}
                >
                  {#if isSubmitting}
                    <span class="loader"></span> Sending...
                  {:else}
                    Send to CEO
                  {/if}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</section>

<!-- Mount toaster so toast() calls show up -->
<Toaster position="top-center" richColors />

<style>
  .home-questions__container {
    background-color: #90c4ff;
    border-radius: 20px;
    margin: 10px 10px -200px; /* 👈 Negative bottom margin for overlap */
    z-index: 10;
    position: relative;
  }
  @media only screen and (min-width: 37.5rem) {
    .home-questions__container {
      margin-left: 20px;
      margin-right: 20px;
      margin-top: 0;
    }
  }
  @media only screen and (min-width: 64.0625rem) {
    .home-questions__container {
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-wrap: wrap;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -webkit-justify-content: center;
      justify-content: center;
    }
  }
  .home-questions__wrapper {
    margin-left: auto;
    margin-right: auto;
    padding: 15px 15px 70px;
  }
  @media only screen and (min-width: 600px) {
    .home-questions__wrapper {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  @media only screen and (min-width: 1025px) {
    .home-questions__wrapper {
      margin-left: auto;
      margin-right: auto;
      max-width: 1600px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  @media only screen and (min-width: 37.5rem) {
    .home-questions__wrapper {
      padding: 80px 0;
    }
  }
  @media only screen and (min-width: 64.0625rem) {
    .home-questions__wrapper {
      padding: 80px 10px;
      position: relative;
    }
  }

  @media only screen and (min-width: 64.0625rem) {
    .module-questions__wrapper {
      grid-column-gap: 16px;
      display: grid;
      grid-template-columns: 5fr 7fr;
    }
  }
  .module-questions__header {
    margin-bottom: 70px;
  }
  @media only screen and (min-width: 37.5rem) {
    .module-questions__header {
      margin-bottom: 25px;
      margin-left: 12.5%;
      margin-right: 12.5%;
      width: 75%;
    }
  }
  @media only screen and (min-width: 64.0625rem) {
    .module-questions__header {
      grid-column: 1/3;
      grid-row: 1/2;
      margin-bottom: 90px;
      margin-left: 8.33333%;
      margin-right: 50%;
      width: 41.66666%;
    }
  }
   @media only screen and (min-width: 37.5rem) {
    .module-questions__title {
      font-size: 3.125rem;
    }
  }
  @media only screen and (min-width: 64.0625rem) {
    .module-questions__title {
      font-size: 3.75rem;
    }
  }
  .module-questions__content {
    /* margin-bottom: 70px; */
    font-size: 1.1rem;
    font-weight: 500;
    color: #444;
    margin-top: 0; /* remove default space */
    line-height: 1.6;
  }
  @media only screen and (min-width: 37.5rem) {
    .module-questions__content {
      margin-left: 12.5%;
      width: 50%;
    }
  }
  @media only screen and (min-width: 64.0625rem) {
    .module-questions__content {
      align-self: flex-start;
      grid-column: 1/2;
      grid-row: 2/3;
      margin-bottom: 0;
      margin-left: 20%;
      margin-right: 20%;
      width: 60%;
    }
  }
  .suggestion-form {
    background-color: #fff;
    border-radius: 15px;
    padding: 30px;
    margin-top: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  }

  .suggestion-form__label {
    font-weight: 600;
    margin-bottom: 10px;
    color: #001e6c;
    font-size: 1rem;
  }

  .suggestion-form__options {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }

  .suggestion-form__options label {
    background-color: #e5f0ff;
    padding: 10px 15px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
  }

  .suggestion-form__options input[type="checkbox"] {
    margin-right: 8px;
    accent-color: #0057d9;
  }

  .suggestion-form__options label:hover {
    background-color: #cce3ff;
  }

  .suggestion-form__textarea {
    width: 100%;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #ccc;
    font-size: 1rem;
    min-height: 120px;
    resize: vertical;
    margin-bottom: 20px;
    font-family: inherit;
  }

  .suggestion-form__button {
    display: inline-block;
    background-color: #0057d9;
    color: white;
    padding: 12px 25px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition:
      background 0.3s,
      transform 0.2s;
  }

  .suggestion-form__button:hover {
    background-color: #0040aa;
    transform: scale(1.03);
  }
  .module-questions__form {
    grid-column: 2/3;
    grid-row: 2/3;
    margin-top: -220px;
    align-self: flex-start;
  }

  .loader {
    border: 3px solid #ffffff;
    border-top: 3px solid #0057d9;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 0.8s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 600px) {
    .home-questions__container {
      margin: 10px 8px 0 8px; /* tighter gutters, no overlap */
      border-radius: 12px;
      padding: 0;
    }

    .home-questions__wrapper {
      padding: 16px 10px 28px;
      margin-left: 0;
      margin-right: 0;
      max-width: 100%;
    }

    .module-questions__wrapper {
      display: block;
      padding: 0;
      margin: 0;
    }

    .module-questions__header {
      margin-bottom: 20px;
      margin-left: 0;
      margin-right: 0;
      width: 100%;
      text-align: left;
    }

    .module-questions__title {
      font-size: clamp(1.5rem, 5vw, 2rem);
      line-height: 1.2;
      text-align: left;
      margin-bottom: 8px;
      overflow-wrap: anywhere;
    }

    .module-questions__tag {
      font-size: 1rem;
      margin-bottom: 16px;
      padding: 6px 12px;
      border-radius: 30px;
    }

    .module-questions__content {
      font-size: 1rem;
      line-height: 1.6;
      margin-left: 0;
      margin-right: 0;
      width: 100%;
      text-align: left;
      margin-bottom: 16px;
      overflow-wrap: anywhere;
    }

    .module-questions__form {
      margin-top: 0;          /* cancel desktop negative offset */
      grid-column: auto;
      grid-row: auto;
      align-self: auto;
    }

    .suggestion-form {
      padding: 16px;
      margin-top: 10px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }

    .suggestion-form__label {
      font-size: 0.95rem;
      margin-bottom: 8px;
    }

    /* Turn chips into a responsive grid for small screens */
    .suggestion-form__options {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
      margin-bottom: 14px;
      width: 100%;
    }

    .suggestion-form__options label {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      font-size: 0.95rem;
      border-radius: 20px;
      background-color: #e5f0ff;
      width: 100%;
      overflow-wrap: anywhere;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    /* Larger, easier-to-tap checkboxes */
    .suggestion-form__options input[type="checkbox"] {
      margin: 0;
      width: 20px;
      height: 20px;
      flex: 0 0 auto;
      accent-color: #0057d9;
    }

    /* Visual selected state (mobile-only) */
    .suggestion-form__options label:has(input:checked) {
      background-color: #d6e7ff;
      border: 1px solid #8db6ff;
    }

    .suggestion-form__textarea {
      min-height: 100px;
      font-size: 0.95rem;
      margin-bottom: 14px;
      border-radius: 8px;
      width: 100%;
    }

    /* Full-width button for easier tapping */
    .suggestion-form__button {
      width: 100%;
      padding: 12px 18px;
      font-size: 1rem;
      border-radius: 6px;
    }
  }

  /* Mobile “Desktop site” / tablet range (fix responsive at 600–1024px) */
  @media (min-width: 600px) and (max-width: 1024px) {
    .home-questions__container {
      /* cancel the overlapping negative bottom margin in this range */
      margin: 10px 16px 0 16px;
      border-radius: 16px;
    }

    .home-questions__wrapper {
      padding: 24px 16px 40px;
      margin-left: 0;
      margin-right: 0;
      max-width: 100%;
    }

    .module-questions__wrapper {
      display: block; /* single column */
      padding: 0;
      margin: 0;
    }

    .module-questions__header {
      margin: 0 0 20px 0;
      width: 100%;
    }

    /* keep the title readable in the ~980px viewport used by “Desktop site” */
    .module-questions__title {
      font-size: clamp(1.75rem, 3.2vw, 2.25rem);
      line-height: 1.2;
      margin-bottom: 8px;
      overflow-wrap: anywhere;
    }

    /* override 600+ rules that squeeze content to 50% width */
    .module-questions__content {
      width: 100%;
      margin: 0 0 16px 0;
      text-align: left;
      font-size: 1.05rem;
      line-height: 1.6;
      overflow-wrap: anywhere;
    }

    /* cancel the desktop negative offset and grid placement */
    .module-questions__form {
      margin-top: 0;
      grid-column: auto;
      grid-row: auto;
      align-self: auto;
    }

    .suggestion-form {
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.05);
    }

    /* lay out chips in 2 columns for this width */
    .suggestion-form__options {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
      width: 100%;
    }

    .suggestion-form__options label {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 20px;
      background-color: #e5f0ff;
      word-break: break-word;
    }

    .suggestion-form__button {
      width: 100%;
      padding: 12px 18px;
      font-size: 1rem;
      border-radius: 8px;
    }
  }

  /* Extra-small devices */
  @media (max-width: 360px) {
    .suggestion-form__options {
      grid-template-columns: 1fr; /* stack chips on very narrow screens */
    }
  }
</style>
