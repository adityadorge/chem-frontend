<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from "$app/navigation";

  interface Test {
    id: number;
    test_name: string;
    image_url?: string;
    test_description?: string;
    test_price?: number;
    company_name?: string;
    stat?: string | number;
    badge_color?: string;
  }

  export let test: Test;
  export let view: 'grid' | 'list' = 'grid';

  const href = `/tests/${test.id}`;
  const testName = test?.test_name ?? "Untitled Test";
  const description =
    test?.test_description ??
    "Deputy Announces Exclusive Global Partnership with Predelo to Bring AI to Shift-Based Businesses.";
  const imageUrl = test?.image_url;
  const lab = test?.company_name ?? "ASL LAB";
  const labColor = test?.badge_color ?? "#22e3b8";
  const stat = test?.stat;

  const isList = view === 'list';

  const dispatch = createEventDispatcher();

  function open(e: Event) {
    e.preventDefault();
    // Instead of navigating directly, emit event so parent can show labs layer
    dispatch('select', { test });
  }
</script>

<a
  href={href}
  on:click|preventDefault={open}
  aria-label={`${testName} – See more`}
  class={`group rounded-[18px] overflow-hidden bg-white no-underline text-current
          transition-[transform,box-shadow] duration-200 ease-out will-change-transform
          shadow-[0_10px_25px_rgba(16,24,40,0.12),0_4px_12px_rgba(16,24,40,0.06)]
          hover:shadow-[0_16px_40px_rgba(16,24,40,0.16),0_6px_16px_rgba(16,24,40,0.08)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
          ${isList
            ? 'grid grid-cols-[280px_1fr] gap-[18px] h-auto items-stretch max-[700px]:grid-cols-1'
            : 'flex flex-col h-full'}`}
>
  <div class={`relative bg-[#0f007a] ${isList
      ? 'h-auto min-h-[170px] max-[700px]:h-[190px] max-[700px]:min-h-[190px]'
      : 'h-[220px] max-[640px]:h-[190px]'}`
  }>
    {#if imageUrl}
      <img src={imageUrl} alt="" loading="lazy" decoding="async" class="w-full h-full object-cover block" />
    {/if}

    {#if lab}
      <span
        class="absolute top-[14px] left-[14px] text-[12px] font-extrabold tracking-[0.02em]
               px-[10px] py-[6px] rounded-full uppercase select-none
               text-[#0a2540] shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
        style={`background: ${labColor};`}
      >
        {lab}
      </span>
    {/if}

    {#if stat}
      <span
        class="absolute top-[14px] right-[14px] font-extrabold text-[14px] text-[#cbd5ff]
               px-[10px] py-[6px] rounded-[10px] border
               backdrop-blur-[6px]
               border-[rgba(203,213,255,0.2)]
               bg-[rgba(15,0,122,0.55)]"
      >
        {stat} ▲
      </span>
    {/if}
  </div>

  <div class={`grid ${isList ? 'pt-[16px] pr-[18px] pb-[16px] pl-[18px]' : 'pt-[18px] pr-[22px] pb-[22px] pl-[22px]'}
               grid-rows-[auto_1fr_auto] gap-[10px] flex-1 min-h-0`}
  >
    <p class={`m-0 text-[#0c017b] font-extrabold leading-[1.3]
               ${isList ? 'text-[20px] mb-[2px]' : 'text-[22px] mb-[4px]'}`}
    >
      {testName}
    </p>

    <h3 class={`m-0 text-[#0f172a] font-extrabold leading-[1.35] overflow-hidden
                ${isList ? 'text-[18px] line-clamp-2' : 'text-[20px] line-clamp-3'}`}
    >
      {description}
    </h3>

    <div class="flex items-center justify-start mt-[6px]">
      <span class="inline-flex items-center gap-[6px] text-[#0c017b] font-bold underline underline-offset-[3px] hover:brightness-90">
        See more
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="flex-none">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
  </div>
</a>