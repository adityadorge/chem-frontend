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

<!-- Card matches reference: image block + meta (kicker + title with arrow) -->
<article
  class="article-card"
  role="button"
  tabindex="0"
  on:click={handleActivate}
  on:keydown={handleKeydown}
  aria-label={title}
>
  <div class="img-wrap">
    <img class="img" src={icon} alt={title} loading="lazy" />
  </div>

  <div class="meta">
    <span class="kicker">{kicker}</span>
    <h3 class="title">
      {title}
      <svg class="arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </h3>
  </div>
</article>

<style>
  /* Root card container (no fixed width; lets grid control sizing) */
  .article-card {
    display: block;
    cursor: pointer;
    outline: none;
    background: transparent;
    user-select: none;
  }
  .article-card:focus-visible .img-wrap {
    box-shadow: 0 0 0 3px rgba(62, 39, 183, 0.35);
  }

  /* Image block */
  .img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(12, 1, 123, 0.08);
    background: #f3f4f8;
  }
  .img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translateZ(0);
    transition: transform .25s ease;
    display: block;
  }
  .article-card:hover .img {
    transform: scale(1.02);
  }

  /* Meta (kicker + title) */
  .meta {
    margin-top: 12px;
  }
  .kicker {
    display: inline-block;
    color: #7a68f5;              /* purple like the reference */
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: #3e27b7;              /* bold purple title */
    font-weight: 800;
    font-size: 20px;
    line-height: 1.35;
  }
  .article-card:hover .title {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
  .arrow {
    color: currentColor;
    flex: 0 0 auto;
  }

  /* Clamp title to two lines to keep grid tidy */
  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  /* Mobile tweaks */
  @media (max-width: 560px) {
    .title { font-size: 18px; }
  }
</style>
