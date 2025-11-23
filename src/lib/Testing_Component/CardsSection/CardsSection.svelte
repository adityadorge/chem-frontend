<script lang="ts">
  export let icon = "/assets/default-icon.svg";
  export let title = "Default Title";
  export let description = "Default description here.";
  export let info = "Default info here.";
  export let category: any;
  export let showSubcategories: (c: any) => void;

  // optional: allow overriding the kicker label (defaults to ARTICLE)
  export let kicker: string = "ARTICLE";

  function handleActivate() {
    showSubcategories?.(category);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  }
</script>

<article
  class="group block cursor-pointer outline-none bg-transparent select-none"
  role="button"
  tabindex="0"
  on:click={handleActivate}
  on:keydown={handleKeydown}
  aria-label={title}
>
  <div
    class="relative w-full aspect-[16/9] rounded-[14px] overflow-hidden bg-[#f3f4f8]
           shadow-[0_6px_20px_rgba(12,1,123,0.08)]
           group-focus-visible:shadow-[0_0_0_3px_rgba(62,39,183,0.35)]"
  >
    <img
      class="absolute inset-0 w-full h-full object-cover block transform-gpu transition-transform duration-200 ease-out group-hover:scale-[1.02]"
      src={icon}
      alt={title}
      loading="lazy"
    />
  </div>

  <div class="mt-3">
    <!-- Make label block -->
    <span class="block text-[#7a68f5] font-extrabold text-[12px] tracking-[1.6px] uppercase mb-2">
      {kicker}
    </span>
    <!-- Make heading block (flex) -->
    <h3
      class="m-0 flex items-center gap-2 text-[#3e27b7] font-extrabold text-[20px] leading-[1.35]
             line-clamp-2 overflow-hidden
             group-hover:underline decoration-2 underline-offset-[3px]
             max-[560px]:text-[18px]"
    >
      {title}
      <svg class="flex-none" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </h3>
  </div>
</article>
