<script lang="ts">
  import { Home, LayoutDashboard, User, Boxes, MessageSquare, ShieldCheck, Settings, LogOut, Menu } from "lucide-svelte";
  let collapsed = false;

  const menu = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Profile", icon: User, href: "/dashboard/profile" },
    { name: "Order", icon: Boxes, href: "/dashboard/order-detail" },
    { name: "Email", icon: MessageSquare, href: "/dashboard/email" },
    { name: "Verification", icon: ShieldCheck, href: "/dashboard/verify" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    { name: "Logout", icon: LogOut, href: "/logout" },
  ];

  function handleMenuClick() {
    // Close only for screens < 1024px (Tailwind lg)
    if (window.innerWidth < 1024) {
      collapsed = true;
    }
  }
</script>

<aside
  class={`h-screen bg-white shadow-lg flex flex-col fixed top-0 left-0 z-40 box-border px-4
    transition-[width,transform] duration-300
    ${collapsed
      ? 'w-[80px] -translate-x-full lg:translate-x-0'
      : 'w-[256px] translate-x-0'}`}
>
  <!-- Brand -->
  <div class="flex items-center h-[72px]">
    <button
      class="mr-3 pl-2 text-[#0c017b] focus:outline-none shrink-0"
      on:click={() => collapsed = !collapsed}
      aria-label="Toggle sidebar"
    >
      <span class="icon flex items-center justify-center w-9 h-9 shrink-0">
        <Menu size={28} strokeWidth={2} class="text-[#0c017b] block" />
      </span>
    </button>
    {#if !collapsed}
      <a href="/" class="font-sans text-[2.2rem] tracking-[0.05em] text-[#0c017b] font-bold leading-none">
        <span class="phi-big">φ</span>hial
      </a>
    {/if}
  </div>

  <!-- Menu -->
  <nav class="flex-1 overflow-y-auto">
    <ul class="space-y-2">
      {#each menu as item}
        <li>
          <a
            href={item.href}
            on:click={handleMenuClick}
            class="menu-item group relative flex items-center h-12 rounded-lg hover:bg-gray-100 text-[#0c017b] transition-colors duration-150 px-2 text-base md:text-[1.05rem] leading-[1.25]"
          >
            <span class="icon flex items-center justify-center w-9 h-9 shrink-0">
              <svelte:component this={item.icon} size="28" class="text-[#0c017b] block" />
            </span>
            <span
              class={`ml-3 whitespace-nowrap transition-[opacity,margin,max-width] duration-200 ease-in-out max-w-[220px]
                ${collapsed ? 'opacity-0 ml-0 max-w-0 pointer-events-none' : 'opacity-100'}`}
            >
              {item.name}
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>

{#if !collapsed}
  <!-- Backdrop on small screens; click to close -->
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30 lg:hidden"
    on:click={() => (collapsed = true)}
    aria-hidden="true"
  ></div>
{/if}

{#if collapsed}
  <button
    class="fixed top-[18px] left-6 z-50 lg:hidden bg-white shadow-lg rounded-full p-0"
    on:click={() => collapsed = false}
    aria-label="Open sidebar"
  >
    <span class="icon flex items-center justify-center w-9 h-9 shrink-0">
      <Menu size={28} strokeWidth={2} class="text-[#0c017b] block" />
    </span>
  </button>
{/if}

<main
  class={`h-screen box-border overflow-y-auto bg-gray-50 transition-[margin] duration-300
    pt-8 pb-16 px-6
    ml-0 ${collapsed ? 'lg:ml-[80px]' : 'lg:ml-[256px]'}
  `}
>
  <slot />
</main>

<style>
  .phi-big {
    font-size: 2.4rem;
    font-weight: bold;
    vertical-align: middle;
    margin-right: 2px;
    color: #0c017b;
    font-family: 'Inter', sans-serif;
  }
</style>