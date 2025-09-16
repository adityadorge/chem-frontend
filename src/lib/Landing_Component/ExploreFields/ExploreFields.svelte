<script lang="ts">
  export let icon = "/assets/default-icon.svg";
  export let title = "Default Title";
  export let description = "Default description here.";
  export let info = "Default info here.";
</script>

<div class="folder-card">
  <div class="folder-card-body">
    <div class="folder-card-icon">
      <img src={icon} alt={`${title} Icon`} />
    </div>
    <div class="folder-card-text">
      <h3 class="folder-card-title">{title}</h3>
      <p class="folder-card-desc">{description}</p>
    </div>
  </div>
</div>

<style>
  .folder-card {
    position: relative;
    width: 450px;
    min-height: 240px;
    background: rgba(255, 255, 255, 0.9);
    /* border: 1.5px solid #e2e8f0; */
    border-radius: 20px;
    padding: 36px 24px;
    margin: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      box-shadow 0.3s ease,
      transform 0.2s ease;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  }

  .folder-card:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }

  .folder-card-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    text-align: left;
    width: 100%;
  }

  .folder-card-icon {
    width: 80px; /* Increased from 56px */
    height: 80px; /* Increased from 56px */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .folder-card-icon img {
    width: 55px; /* Increased from 32px */
    height: 55px; /* Increased from 32px */
    object-fit: contain;
  }

  .folder-card-text {
    width: 100%;
    text-align: left;
  }

  .folder-card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937; /* Slate-800 */
    margin: 0;
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }

  .folder-card-desc {
    font-size: 0.95rem;
    color: #64748b; /* Slate-500 */
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    margin-top: 6px;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .folder-card {
      width: 100%;
    }
  }
</style>
