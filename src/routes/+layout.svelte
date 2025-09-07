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
</script>

<div class="page-root">
    {#if !$isDashboard}
        <Navbar/>
    {/if}
    <Toaster richColors />
    <slot />
    {#if !$isDashboard}
        {#if $isLandingPage}
            <FooterLanding />
        {:else}
            <Footer />
        {/if}
    {/if}
</div>

<style>
.page-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.page-root > :global(main), 
.page-root > :global(.container) {
    flex: 1 0 auto;
}
</style>

