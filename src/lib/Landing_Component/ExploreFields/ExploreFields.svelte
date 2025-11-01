<script lang="ts">
  export let icon = "/assets/default-icon.svg";
  export let title = "Default Title";
  export let description = "Default description here.";
  export let info = "Default info here.";
</script>



<div class="relative w-[450px] min-h-[240px] bg-white/90 rounded-2xl p-9 m-4 flex items-center justify-center shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
  <img src={icon} alt={`${title} Icon`} class="absolute inset-0 w-full h-full object-cover z-0" />
  <!-- Overlay for better text visibility -->
  <div class="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>
  <div class="relative z-20 flex flex-col items-center gap-5 text-left w-full">
    <div class="w-full text-center">
      <h3 class="text-3xl font-extrabold text-white m-0 font-inter">{title}</h3>
    </div>
  </div>
</div>

