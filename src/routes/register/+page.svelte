<script lang="ts">
  import { API_URL } from "$lib/store/api";
  import { toast } from "svelte-sonner";
  import { onMount, tick } from "svelte";
  import { sendOTP, verifyOTP } from "../../lib/store/api";
  import { user } from "$lib/store";
  import { goto } from "$app/navigation";
  import { Mail, Lock, Chrome, User as UserIcon } from "lucide-svelte";

  let full_name = "";
  let email = "";
  let password = "";
  let otp = "";
  let showOTPInput = false;

  let isProcessing = false;

  // Google GSI state (same pattern as login)
  let gsiReady = false;
  let gsiEl: HTMLDivElement | null = null;

  function goLogin() {
    goto("/login");
  }

  async function handleSendOTP() {
    if (isProcessing) return;
    if (!email || !full_name || !password) {
      return toast.error("Please fill all required fields");
    }

    isProcessing = true;
    try {
      const res = await sendOTP(email);
      if (res?.success) {
        toast.success("OTP sent to your email");
        showOTPInput = true;
      } else {
        toast.error(res?.error || "Failed to send OTP");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to send OTP");
    } finally {
      isProcessing = false;
    }
  }

  async function handleVerifyAndRegister() {
    if (isProcessing) return;
    if (!otp) {
      return toast.error("Please enter the OTP");
    }

    isProcessing = true;
    try {
      const otpRes = await verifyOTP({ full_name, email, password }, otp);
      if (otpRes?.status === 200) {
        toast.success("Registration successful! Please log in.");
        goto("/login");
      } else {
        toast.error(otpRes?.error || "Invalid OTP");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong !");
    } finally {
      isProcessing = false;
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
      await tick();

      const target = gsiEl ?? document.getElementById("googleSignInButton");
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

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Wrapper (same layout as login) -->
<main class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif]">
  <!-- Left: Feature panel (same visuals as login) -->
  <section
    class="relative flex items-center justify-center lg:justify-center px-6 sm:px-10 lg:px-12 xl:px-14 py-12 lg:py-16 bg-[#3d1cba] text-white overflow-hidden rounded-tr-[120px]"
  >
    <div class="max-w-xl w-full lg:max-w-xl lg:mx-auto">
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

  <!-- Right: Register form (styled like login) -->
  <section class="w-full flex items-start lg:items-center justify-center px-4 sm:px-6 py-10 lg:py-0">
    <div class="w-full max-w-md">
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Create your account</h1>
        <p class="mt-1 text-sm text-gray-500">Sign up to get started</p>
      </div>

      <!-- Full name -->
      <label for="reg-name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
      <div class="relative">
        <input
          id="reg-name"
          name="full_name"
          type="text"
          bind:value={full_name}
          required
          disabled={isProcessing || showOTPInput && isProcessing}
          class="w-full h-12 rounded-md border border-[#4c3ee0]/40 focus:border-[#3E28D9] focus:ring-2 focus:ring-[#3E28D9]/30 outline-none px-3 pr-10 text-gray-900 placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder=""
        />
        <UserIcon size={18} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <!-- Email -->
      <label for="reg-email" class="block text-sm font-medium text-gray-700 mb-1 mt-5">Email</label>
      <div class="relative">
        <input
          id="reg-email"
          name="email"
          type="email"
          bind:value={email}
          required
          disabled={isProcessing || showOTPInput && isProcessing}
          class="w-full h-12 rounded-md border border-[#4c3ee0]/40 focus:border-[#3E28D9] focus:ring-2 focus:ring-[#3E28D9]/30 outline-none px-3 pr-10 text-gray-900 placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder=""
        />
        <Mail size={18} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <!-- Password -->
      <label for="reg-password" class="block text-sm font-medium text-gray-700 mt-5">Password</label>
      <div class="relative mt-1">
        <input
          id="reg-password"
          name="password"
          type="password"
          bind:value={password}
          required
          disabled={isProcessing || showOTPInput && isProcessing}
          class="w-full h-12 rounded-md border border-[#4c3ee0]/40 focus:border-[#3E28D9] focus:ring-2 focus:ring-[#3E28D9]/30 outline-none px-3 pr-10 text-gray-900 placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder=""
        />
        <Lock size={18} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {#if showOTPInput}
        <!-- OTP -->
        <label for="reg-otp" class="block text-sm font-medium text-gray-700 mt-5">Enter OTP</label>
        <div class="relative mt-1">
          <input
            id="reg-otp"
            name="otp"
            type="text"
            bind:value={otp}
            required
            disabled={isProcessing}
            class="w-full h-12 rounded-md border border-[#4c3ee0]/40 focus:border-[#3E28D9] focus:ring-2 focus:ring-[#3E28D9]/30 outline-none px-3 text-gray-900 placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            placeholder=""
          />
        </div>
      {/if}

      <!-- Primary action -->
      {#if showOTPInput}
        <button
          class="mt-6 inline-flex w-full items-center justify-center h-12 rounded-md bg-[#3d1cba] text-white font-semibold hover:bg-[#3621c9] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          on:click|preventDefault={handleVerifyAndRegister}
          disabled={isProcessing}
          aria-busy={isProcessing}
        >
          {#if isProcessing}
            <span class="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            Registering...
          {:else}
            Register
          {/if}
        </button>
      {:else}
        <button
          class="mt-6 inline-flex w-full items-center justify-center h-12 rounded-md bg-[#3d1cba] text-white font-semibold hover:bg-[#3621c9] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          on:click|preventDefault={handleSendOTP}
          disabled={isProcessing}
          aria-busy={isProcessing}
        >
          {#if isProcessing}
            <span class="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            Sending OTP...
          {:else}
            Verify
          {/if}
        </button>
      {/if}

      <!-- Secondary: Go to Login -->
      <button
        class="mt-3 inline-flex w-full items-center justify-center h-12 rounded-md border border-[#3d1cba] text-[#3d1cba] font-semibold hover:bg-[#3d1cba]/5 transition-colors"
        on:click|preventDefault={goLogin}
        aria-label="Already have an account? Log in"
      >
        Already have an account? Log in
      </button>

      <!-- Divider -->
      <div class="my-6 flex items-center gap-3 text-gray-400">
        <span class="h-px flex-1 bg-gray-200"></span>
        <span class="text-sm">or continue with</span>
        <span class="h-px flex-1 bg-gray-200"></span>
      </div>

      <!-- Google -->
      <div class="grid grid-cols-1 gap-3">
        {#if gsiReady}
          <div bind:this={gsiEl} id="googleSignInButton" class="w-full flex items-center justify-center h-11 rounded-md"></div>
        {:else}
          <button
            type="button"
            class="w-full h-11 rounded-md bg-indigo-50 text-gray-900 hover:bg-indigo-100 transition flex items-center justify-center gap-2"
            on:click={InitializeGoogleLogin}
          >
            <Chrome size={18} class="text-[#FBBC05]" />
            <span class="font-medium">Google</span>
          </button>
        {/if}
      </div>
    </div>
  </section>
</main>
