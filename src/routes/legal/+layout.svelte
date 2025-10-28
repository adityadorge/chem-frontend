<script lang="ts">
  const updated = "24 October 2025";
  const navItems = [
    { href: "overview", label: "Overview" },
    { href: "terms", label: "Terms" },
    { href: "privacy", label: "Privacy Policy" },
    { href: "cookies", label: "Cookies" }
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen text-gray-800 font-[Montserrat]">
  <!-- Header -->
  <header class="bg-[#f5f4f5]">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
        Company's term and policies
      </h1>
    </div>
  </header>

  <!-- Mobile nav -->
  <div class="md:hidden top-0 z-20 bg-[#f5f4f5] shadow sticky">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
      <details class="w-full">
        <summary class="cursor-pointer select-none text-sm font-medium text-gray-700">
          Menu
        </summary>
        <nav class="mt-3 grid grid-cols-2 gap-2 pb-2">
          {#each navItems as item}
            <a href={item.href}
              class="block rounded border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">
              {item.label}
            </a>
          {/each}
        </nav>
      </details>
    </div>
  </div>

  <!-- Main -->
  <main class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex gap-10">
    <!-- Sidebar -->
    <aside class="hidden md:block w-64 shrink-0">
      <div class="sticky top-20">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Legal
        </p>
        <nav class="space-y-1">
          {#each navItems as item}
            <a
              href={item.href}
              class="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </a>
          {/each}
        </nav>
      </div>
    </aside>

    <!-- Routed content -->
    <section class="flex-1 space-y-14">
      <slot />
    </section>
  </main>
</div>