<script lang="ts">
  import { API_URL } from "$lib/store/api";
  import { Toaster, toast } from "svelte-sonner";
  import { onMount, tick } from "svelte";
  import { loginUser, sendPasswordResetEmail } from "../../lib/store/api";
  import { user } from "$lib/store";
  import { goto } from "$app/navigation";
  import { Mail, Lock, Facebook, Chrome, Apple } from "lucide-svelte";

  let email = "";
  let password = "";
  let gsiReady = false;
  let gsiEl: HTMLDivElement | null = null; // target container
  let isLoggingIn = false;

  // Forgot-password modal state
  let showForgotModal = false;
  let forgotEmail: string = "";
  let isSendingReset = false;

  function openForgotModal() {
    forgotEmail = email; // prefill with typed login email
    showForgotModal = true;
  }
  function closeForgotModal() {
    showForgotModal = false;
  }
  async function handleResetPassword() {
    if (isSendingReset) return;
    isSendingReset = true;
    try {
      const response = await sendPasswordResetEmail(forgotEmail);
      if (response?.success) {
        toast.success("Reset link sent to your email.");
        showForgotModal = false;
      } else {
        toast.error(response?.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset link.");
    } finally {
      isSendingReset = false;
    }
  }

  const REGISTER_PATH = "/register";
  function goRegister() {
    goto(REGISTER_PATH);
  }

  async function handleLogin() {
    if (isLoggingIn) return;
    isLoggingIn = true;
    try {
      const response = await loginUser({ email, password });
      if (response?.tokens) {
        user.set({
          id: response.user?.id,
          email: response.user?.email,
          name: response.user?.name,
          access_token: response.tokens.access,
          refresh_token: response.tokens.refresh
        });
        toast.success("Login successful!");
        goto("/");
      } else {
        toast.error(response?.error || "Login failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Login failed");
    } finally {
      isLoggingIn = false;
    }
  }

  async function InitializeGoogleLogin() {
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      // @ts-ignore
      google.accounts.id.initialize({
        client_id: `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`,
        callback: handleCredentialResponse
      });

      gsiReady = true;
      await tick(); // ensure the {#if gsiReady} container is in the DOM

      const target = gsiEl ?? document.getElementById("googleSignInButton");
      // avoid duplicate renders
      if (target && target.childElementCount === 0) {
        // @ts-ignore
        google.accounts.id.renderButton(target, {
          theme: "outline",
          size: "large",
          width: 340
        });
      }
    } catch (e) {
      gsiReady = false;
      console.error("Google GSI init failed:", e);
    }
  }

  async function handleCredentialResponse(response: any) {
    if (!response?.credential) {
      toast.error("Google login failed");
      return;
    }
    try {
      const r = await fetch(`${API_URL}/auth/exchange-token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
        credentials: "include"
      });
      if (!r.ok) return toast.error("Backend authentication failed.");
      const data = await r.json();
      if (!data?.tokens) return toast.error("Invalid backend response.");

      user.set({
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.name,
        access_token: data.tokens.access,
        refresh_token: data.tokens.refresh
      });
      toast.success("Login successful!");
      goto("/");
    } catch (e) {
      console.error(e);
      toast.error("An error occurred during authentication.");
    }
  }

  onMount(() => {
    InitializeGoogleLogin();
  });
</script>

<Toaster richColors />

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Wrapper -->
<main class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif]">

  <!-- Left: Feature panel -->
  <section
    class="relative flex items-center justify-center lg:justify-center px-6 sm:px-10 lg:px-12 xl:px-14 py-12 lg:py-16 bg-[#3d1cba] text-white overflow-hidden rounded-tr-[120px]"
  >
    <!-- widened a bit on large screens -->
    <div class="max-w-xl w-full lg:max-w-xl lg:mx-auto">
      <!-- Image only: no frame, no shadow -->
      <img
        src="/assets/login/hanin-abouzeid-yYN8sk9nb-0-unsplash.svg"
        alt="Feature preview"
        class="w-full h-64 sm:h-72 lg:h-[440px] xl:h-[500px] object-contain mb-8"
      />

      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Deputy HR ✨</h2>
      <p class="mt-4 text-white/90 text-base sm:text-lg leading-relaxed">
        Hire great talent, simplify onboarding, manage their growth,
        and boost employee retention. All in one place.
      </p>
      <a href="#" class="mt-5 inline-block underline underline-offset-4 font-medium">Learn more</a>
      
    </div>
  </section>

  <!-- Right: Login form -->
  <section class="w-full flex items-start lg:items-center justify-center px-4 sm:px-6 py-10 lg:py-0">
    <div class="w-full max-w-md">
      <!-- New: Heading + subtext -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Welcome back</h1>
        <p class="mt-1 text-sm text-gray-500">Sign in to continue to your account</p>
      </div>

      <!-- Email -->
      <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <div class="relative">
        <input
          id="login-email"
          name="email"
          type="email"
          bind:value={email}
          required
          disabled={isLoggingIn}
          class="w-full h-12 rounded-md border border-[#4c3ee0]/40 focus:border-[#3E28D9] focus:ring-2 focus:ring-[#3E28D9]/30 outline-none px-3 pr-10 text-gray-900 placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder=""
        />
        <Mail size={18} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <!-- Password + Forgot -->
      <div class="mt-5 flex items-center justify-between">
        <label for="login-password" class="block text-sm font-medium text-gray-700">Password</label>
        <button
          type="button"
          class="text-sm text-[#3E28D9] hover:text-[#2f1cc8] underline-offset-2"
          on:click={openForgotModal}
          aria-haspopup="dialog"
          aria-controls="forgot-password-modal"
        >
          Forgot Password?
        </button>
      </div>
      <div class="relative mt-1">
        <input
          id="login-password"
          name="password"
          type="password"
          bind:value={password}
          required
          disabled={isLoggingIn}
          class="w-full h-12 rounded-md border border-[#4c3ee0]/40 focus:border-[#3E28D9] focus:ring-2 focus:ring-[#3E28D9]/30 outline-none px-3 pr-10 text-gray-900 placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder=""
        />
        <Lock size={18} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <!-- Log in button -->
      <button
        class="mt-6 inline-flex w-full items-center justify-center h-12 rounded-md bg-[#3d1cba] text-white font-semibold hover:bg-[#3621c9] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        on:click|preventDefault={handleLogin}
        disabled={isLoggingIn}
        aria-busy={isLoggingIn}
      >
        {#if isLoggingIn}
          <span class="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
          Logging in...
        {:else}
          Log in
        {/if}
      </button>

      <!-- New: Register button -->
      <button
        class="mt-3 inline-flex w-full items-center justify-center h-12 rounded-md border border-[#3d1cba] text-[#3d1cba] font-semibold hover:bg-[#3d1cba]/5 transition-colors"
        on:click|preventDefault={goRegister}
        aria-label="Create an account"
      >
        Create an account
      </button>

      <!-- Divider -->
      <div class="my-6 flex items-center gap-3 text-gray-400">
        <span class="h-px flex-1 bg-gray-200"></span>
        <span class="text-sm">or login with</span>
        <span class="h-px flex-1 bg-gray-200"></span>
      </div>

      <!-- Social buttons -->
      <div class="grid grid-cols-1 gap-3">
        <!-- <button type="button" class="w-full h-11 rounded-md bg-indigo-50 text-gray-900 hover:bg-indigo-100 transition flex items-center justify-center gap-2">
          <Facebook size={18} class="text-[#1877F2]" />
          <span class="font-medium">Facebook</span>
        </button> -->

        {#if gsiReady}
          <!-- Google renders here -->
          <div bind:this={gsiEl} id="googleSignInButton" class="w-full flex items-center justify-center h-11 rounded-md"></div>
        {:else}
          <!-- Fallback button -->
          <button type="button" class="w-full h-11 rounded-md bg-indigo-50 text-gray-900 hover:bg-indigo-100 transition flex items-center justify-center gap-2" on:click={InitializeGoogleLogin}>
            <Chrome size={18} class="text-[#FBBC05]" />
            <span class="font-medium">Google</span>
          </button>
        {/if}

        <!-- <button type="button" class="w-full h-11 rounded-md bg-indigo-50 text-gray-900 hover:bg-indigo-100 transition flex items-center justify-center gap-2">
          <Apple size={18} class="text-black" />
          <span class="font-medium">Apple</span>
        </button> -->

        <!-- Xero (no Lucide brand) – keep consistent styling -->
        <!-- <button type="button" class="w-full h-11 rounded-md bg-indigo-50 text-gray-900 hover:bg-indigo-100 transition flex items-center justify-center gap-2">
          <span class="h-2 w-2 rounded-full bg-sky-400"></span>
          <span class="font-medium">Xero</span>
        </button> -->
      </div>


      
    </div>
  </section>
</main>

{#if showForgotModal}
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-black/40 z-40" on:click={closeForgotModal} />
  <!-- Modal -->
  <div
    id="forgot-password-modal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-label="Reset password"
    on:click|stopPropagation
  >
    <div class="w-full max-w-md rounded-lg bg-white shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Reset Password</h2>
        <button class="text-gray-500 hover:text-gray-700" on:click={closeForgotModal} aria-label="Close">✕</button>
      </div>
      <form on:submit|preventDefault={handleResetPassword} class="space-y-4">
        <div>
          <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="forgot-email"
            type="email"
            bind:value={forgotEmail}
            required
            class="w-full h-11 rounded-md border border-gray-300 focus:border-[#3E28D9] focus:ring-2 focus:ring-[#3E28D9]/30 outline-none px-3"
            placeholder="you@example.com"
          />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            class="inline-flex items-center justify-center h-11 px-4 rounded-md bg-[#3d1cba] text-white font-semibold hover:bg-[#3621c9] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSendingReset}
          >
            {#if isSendingReset}
              <span class="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
              Sending...
            {:else}
              Send reset link
            {/if}
          </button>
          <button type="button" class="h-11 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50" on:click={closeForgotModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
