<script lang="ts">
    import "../app.css";
    import { Toaster } from "svelte-sonner";
    import Navbar from "$lib/Navbar/Navbar.svelte";
    import Footer from "$lib/Footer/Footer.svelte";
    import FooterLanding from "$lib/Footer/FooterLanding.svelte";
    import { derived } from "svelte/store";
    import { page } from '$app/stores';

    // Check if current route is dashboard
    const isDashboard = derived(page, $page => $page.url.pathname.startsWith('/dashboard'));
    const isLandingPage = derived(page, $page => $page.url.pathname === '/');
    // Hide chrome on login route
    const isAuthPage = derived(page, $page => $page.url.pathname.startsWith('/login'));
    const isRegisterPage = derived(page, $page => $page.url.pathname.startsWith('/register'));
</script>

<div class="page-root">
  {#if !$isDashboard && !$isAuthPage && !$isRegisterPage}
    <Navbar/>
  {/if}
  <Toaster richColors />
  <main >
    <slot />
  </main>
  {#if !$isDashboard && !$isAuthPage && !$isRegisterPage}
    <Footer />
  {/if}
</div>

<style>
.page-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%; /* Ensures full width */
}
</style>

