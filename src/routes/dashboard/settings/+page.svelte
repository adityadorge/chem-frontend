<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL,sendPasswordResetEmail } from "$lib/store/api";
  import { user } from "$lib/store";
  import { Toaster, toast } from "svelte-sonner";
  import { Mail, Link, Key, Check } from "lucide-svelte";
  // Add imports
  import { clearUser } from "$lib/store/auth";
  import { goto } from "$app/navigation";

  type Verification = {
    id: number;
    full_name: string;
    email: string | null;
    phone_number: string | null;
    alternate_phone_number: string | null;
    date_of_birth: string | null;
    gender: string | null;
    residential_address_line1: string;
    residential_address_line2?: string | null;
    residential_city: string;
    residential_state: string;
    residential_postal_code: string;
    residential_country: string;
    status: "pending" | "approved" | "rejected";
  };

  let loadingProfile = false;
  let profileError = "";
  let verification: Verification | null = null;
  let noVerification = false;

  function title(s?: string | null) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function statusKey(s?: Verification["status"] | string | null) {
    const v = (s || "").toString().toLowerCase();
    if (v === "approved") return "approved";
    if (v === "rejected") return "rejected";
    return "pending";
  }

  function chipClasses(s?: Verification["status"]) {
    const base =
      "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full font-bold tracking-wide border transition duration-150 ease-out hover:-translate-y-[1px]";
    const key = statusKey(s);
    if (key === "approved")
      return base +
        " bg-emerald-50 border-emerald-300 text-emerald-800 shadow-[0_0_0_0_rgba(16,185,129,0.25)] hover:shadow-[0_0_0_6px_rgba(16,185,129,0.12)]";
    if (key === "rejected")
      return base +
        " bg-red-50 border-red-300 text-red-800 shadow-[0_0_0_0_rgba(239,68,68,0.25)] hover:shadow-[0_0_0_6px_rgba(239,68,68,0.12)]";
    return base +
      " bg-orange-50 border-orange-300 text-orange-900 shadow-[0_0_0_0_rgba(245,158,11,0.25)] hover:shadow-[0_0_0_6px_rgba(245,158,11,0.12)]";
  }

  function dotClasses(s?: Verification["status"]) {
    const base =
      "w-2 h-2 rounded-full shadow-[0_0_0_3px_rgba(0,0,0,0.02)_inset]";
    const key = statusKey(s);
    if (key === "approved") return base + " bg-emerald-500";
    if (key === "rejected") return base + " bg-red-500";
    return base + " bg-orange-500";
  }

  function presenceColorClass(s?: Verification["status"]) {
    const key = statusKey(s);
    if (key === "approved") return "bg-emerald-500";
    if (key === "rejected") return "bg-red-500";
    return "bg-orange-500";
  }

  let fullName = "";
  let country = "";
  let contact = "";
  let email = "";

  type Address = {
    id: number;
    country: string;
    label: string;
    mobile: string;
    pincode: string;
    flat: string;
    area: string;
    city: string;
    state: string;
  };

  function buildAddressFromVerification(v: Verification): Address | null {
    const hasAny =
      v.residential_address_line1 ||
      v.residential_city ||
      v.residential_state ||
      v.residential_postal_code ||
      v.residential_country;
    if (!hasAny) return null;
    return {
      id: v.id ?? 1,
      country: v.residential_country || "",
      label: v.full_name || "",
      mobile: v.phone_number || "",
      pincode: v.residential_postal_code || "",
      flat: v.residential_address_line1 || "",
      area: v.residential_address_line2 || "",
      city: v.residential_city || "",
      state: v.residential_state || "",
    };
  }

  let address: Address | null = null;

  let activeCard: string | null = "Security";
  function toggleCard(card: string) {
    activeCard = activeCard === card ? null : card;
  }

  onMount(async () => {
    if (!$user?.access_token) return;
    loadingProfile = true;
    try {
      const res = await fetch(`${API_URL}/verification/`, {
        headers: { Authorization: `Bearer ${$user.access_token}` },
      });
      if (res.status === 204) {
        noVerification = true;
        verification = null;
        address = null;
        return;
      }
      if (!res.ok) throw new Error();
      const v: Verification = await res.json();
      verification = v;
      fullName = v.full_name || "";
      email = v.email || "";
      contact = v.phone_number || "";
      country = v.residential_country || v.residential_state || "";
      address = buildAddressFromVerification(v);
    } catch {
      profileError = "Failed to load profile. please log in again.";
    } finally {
      loadingProfile = false;
    }
  });

  // Forgot-password modal state
  let forgotEmail: string = "";
  let isSendingReset = false;

  async function forceLogoutAndRedirect() {
    try {
      // Use the correct backend logout path
      await fetch(`${API_URL}/logout/`, {
        method: "POST",
        credentials: "include"
      });
    } catch (_) {
      // ignore
    } finally {
      // Clear client auth state
      user.set(null);
      try { clearUser(); } catch {}
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      goto("/login");
    }
  }

   const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function handleResetPassword() {
    if (isSendingReset) return;
    isSendingReset = true;
    try {
      const response = await sendPasswordResetEmail(forgotEmail);
      if (response?.success) {
        const duration = 2000; // ms
        toast.success("Reset link sent to your email.", { duration });
        await sleep(duration + 200);
        await forceLogoutAndRedirect();
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
  
</script>

<div>
  <div class="rounded-xl overflow-hidden flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#eef0f4] mb-4 bg-white">
    <div class="relative h-[12.5rem] overflow-hidden">
      <img
        class="w-full h-full object-cover scale-[1.02] saturate-[1.05] contrast-[1.02]"
        src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/pages/profile-banner.png"
        alt="Profile Banner"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.25)] pointer-events-none"></div>
    </div>
    <div class="bg-white px-4 py-[18px] flex items-center gap-6 max-[36rem]:flex-col max-[36rem]:text-center">
      <div class="flex -mt-[3.25rem]">
        <div class="relative inline-grid place-items-center p-[3px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,_#6366f1,_#22c55e,_#f59e0b,_#6366f1)]">
          <img
            class="w-[6.875rem] h-[6.875rem] object-cover rounded-full border-[6px] border-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] bg-white"
            src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/avatars/1.png"
            alt="Profile Avatar"
          />
          <span
            class={"absolute bottom-2 right-2 w-[14px] h-[14px] rounded-full border-[3px] border-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] " +
              presenceColorClass(verification?.status)}
            aria-hidden="true"
          ></span>
        </div>
      </div>
      <div class="flex flex-col">
        <h2 class="m-0 mb-1 text-xl tracking-[0.01em]">{fullName || "—"}</h2>
        <p class="m-0 text-gray-600">{email || "—"}</p>
        {#if loadingProfile}<small>Loading…</small>{/if}
        {#if profileError}<small class="text-red-700">{profileError}</small>{/if}
        {#if noVerification}
          <small class="text-gray-600">Profile not completed yet. Please submit verification details.</small>
        {/if}
      </div>

      <div class="ml-auto self-start flex flex-col items-end gap-1 max-[36rem]:ml-0 max-[36rem]:self-center max-[36rem]:items-center">
        <div class={chipClasses(verification?.status)}>
          <span class={dotClasses(verification?.status)} aria-hidden="true"></span>
          <span>{title(verification?.status) || "Pending"}</span>
        </div>
        {#if verification && (verification.status === "pending" || verification.status === "rejected")}
          <small class="text-rose-500 text-sm text-right max-[36rem]:text-center">Please complete the verification process by visiting the verification page.</small>
        {/if}
      </div>
    </div>
  </div>

  <!-- replaced .profileNav with Tailwind classes -->
  <div class="flex items-center gap-2 mb-4 max-[36rem]:flex-col max-[36rem]:justify-center max-[36rem]:items-center">
    <div class="flex gap-2 flex-row max-[36rem]:flex-col max-[36rem]:w-full">
      <button
        class={"border-none px-5 py-2.5 rounded-md cursor-pointer font-semibold w-fit hover:bg-indigo-100 hover:text-indigo-500 max-[36rem]:w-full " +
          (activeCard === "Security" ? "text-white bg-[#0c017b]" : "bg-transparent text-gray-700")}
        on:click={() => toggleCard("Security")}>Security</button>
      <button
        class={"border-none px-5 py-2.5 rounded-md cursor-pointer font-semibold w-fit hover:bg-indigo-100 hover:text-indigo-500 max-[36rem]:w-full " +
          (activeCard === "Email" ? "text-white bg-[#0c017b]" : "bg-transparent text-gray-700")}
        on:click={() => toggleCard("Email")}>Email</button>
      <!-- <button
        class={"border-none px-5 py-2.5 rounded-md cursor-pointer font-semibold w-fit hover:bg-indigo-100 hover:text-indigo-500 max-[36rem]:w-full " +
          (activeCard === "Payment" ? "text-white bg-[#0c017b]" : "bg-transparent text-gray-700")}
        on:click={() => toggleCard("Payment")}>Payment</button> -->
    </div>
  </div>
</div>

{#if activeCard === "Security"}
  <div>
    <!-- replaced .security-methods with Tailwind classes -->
    <section class="bg-white rounded-lg p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-6">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-semibold">Change Password</h3>
          <p class="text-sm text-gray-500 mt-1">Follow the steps below to reset your password safely.</p>
        </div>
      </div>

      <!-- Steps -->
      <ol class="mt-4 space-y-3">
        <li class="flex items-start gap-3">
          <div class="flex-none w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Mail size={18} />
          </div>
          <div>
            <div class="font-medium">1. Enter your email</div>
            <div class="text-sm text-gray-500">Provide the email associated with your account and press "Send reset link".</div>
          </div>
        </li>
        <li class="flex items-start gap-3">
          <div class="flex-none w-10 h-10 rounded-md bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <Link size={18} />
          </div>
          <div>
            <div class="font-medium">2. Open the link</div>
            <div class="text-sm text-gray-500">Open the email we send and click the reset link to go to the password page.</div>
          </div>
        </li>
        <li class="flex items-start gap-3">
          <div class="flex-none w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Key size={18} />
          </div>
          <div>
            <div class="font-medium">3. Update password & login</div>
            <div class="text-sm text-gray-500">Choose a new password, submit, then sign in with your new credentials.</div>
          </div>
        </li>
      </ol>

      <!-- Form -->
      <form on:submit|preventDefault={handleResetPassword} class="mt-6 space-y-4">
        <div>
          <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="forgot-email"
            type="email"
            bind:value={forgotEmail}
            required
            class="w-full h-11 rounded-md border border-gray-300 focus:border-[#3E28D9] focus:ring-2 focus:ring-[#3E28D9]/30 outline-none px-3"
            placeholder="you@example.com"
            aria-describedby="recovery-help"
          />
          <p id="recovery-help" class="text-xs text-gray-400 mt-1">We'll send a secure reset link to this email.</p>
        </div>

        <div class="flex gap-2">
          <button
            type="submit"
            class="inline-flex items-center justify-center h-11 px-4 rounded-md bg-[#0c017b] text-white font-semibold hover:bg-[#3621c9] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSendingReset}
            aria-busy={isSendingReset}
          >
            {#if isSendingReset}
              <span class="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
              Sending...
            {:else}
              <Check size={16} class="mr-2" /> Send reset link
            {/if}
          </button>
          <button
            type="button"
            class="h-11 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            on:click={() => (forgotEmail = "")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  </div>
{/if}

{#if activeCard === "Email"}
  <section class="bg-white rounded-lg p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-6">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h3 class="text-lg font-semibold">Email Notifications</h3>
        <p class="text-sm text-gray-500 mt-1">Choose what you’d like to receive in your inbox.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="h-9 px-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Reset</button>
        <button class="h-9 px-3 rounded-md bg-[#0c017b] text-white font-semibold hover:bg-[#3621c9]">Save</button>
      </div>
    </div>

    <!-- Frequency (UI only) -->
    <div class="mt-5">
      <h4 class="text-sm font-semibold text-gray-900 mb-2">Email frequency</h4>
      <div class="flex flex-wrap gap-2">
        <label class="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50">
          <input type="radio" name="freq" class="sr-only" checked />
          <span class="w-2 h-2 rounded-full bg-[#0c017b]"></span>
          <span class="text-sm">Instant</span>
        </label>
        <label class="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50">
          <input type="radio" name="freq" class="sr-only" />
          <span class="w-2 h-2 rounded-full bg-gray-300"></span>
          <span class="text-sm">Daily digest</span>
        </label>
        <label class="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50">
          <input type="radio" name="freq" class="sr-only" />
          <span class="w-2 h-2 rounded-full bg-gray-300"></span>
          <span class="text-sm">Weekly summary</span>
        </label>
      </div>
    </div>

    <!-- Sections -->
    <div class="mt-6 space-y-8">

      <!-- Helper: toggle switch UI (no logic needed) -->
      {#key 'switch-ui-only'}
        <!-- Followers, Likes & Comments -->
        <fieldset class="rounded-lg border border-[#eef0f4]">
          <legend class="px-4 py-3 text-xs font-bold tracking-wider text-[#b01273] uppercase">Followers, Likes & Comments</legend>
          <div class="px-4 py-2 border-t border-[#eef0f4]">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">New followers</div>
                <p class="text-sm text-gray-500">When someone follows you.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked />
                <div class="w-11 h-6 bg-gray-200 rounded-full transition peer-checked:bg-[#0c017b]"></div>
                <div class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
          <div class="px-4 py-2 border-t border-[#eef0f4]">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">New likes on your activities</div>
                <p class="text-sm text-gray-500">Likes for posts, comments, or reviews.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked />
                <div class="w-11 h-6 bg-gray-200 rounded-full transition peer-checked:bg-[#0c017b]"></div>
                <div class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
          <div class="px-4 py-2 border-t border-[#eef0f4]">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">New comments on one of your activities</div>
                <p class="text-sm text-gray-500">Replies and mentions on your content.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 rounded-full transition peer-checked:bg-[#0c017b]"></div>
                <div class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
          <div class="px-4 py-2 border-t border-[#eef0f4]">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Recommendations from people you follow</div>
                <p class="text-sm text-gray-500">Releases, artists, or labels recommended to you.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked />
                <div class="w-11 h-6 bg-gray-200 rounded-full transition peer-checked:bg-[#0c017b]"></div>
                <div class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
          <div class="px-4 py-2 border-t border-[#eef0f4] rounded-b-lg">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">@Mentions</div>
                <p class="text-sm text-gray-500">When someone tags you directly.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 rounded-full transition peer-checked:bg-[#0c017b]"></div>
                <div class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Releases -->
        <fieldset class="rounded-lg border border-[#eef0f4]">
          <legend class="px-4 py-3 text-xs font-bold tracking-wider text-[#b01273] uppercase">Releases</legend>
          <div class="px-4 py-2 border-t border-[#eef0f4] rounded-b-lg">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Record release events</div>
                <p class="text-sm text-gray-500">Summaries and new release alerts.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked />
                <div class="w-11 h-6 bg-gray-200 rounded-full transition peer-checked:bg-[#0c017b]"></div>
                <div class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        </fieldset>

        <!-- General -->
        <fieldset class="rounded-lg border border-[#eef0f4]">
          <legend class="px-4 py-3 text-xs font-bold tracking-wider text-[#b01273] uppercase">General</legend>
          <div class="px-4 py-2 border-t border-[#eef0f4] rounded-b-lg">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">General notifications</div>
                <p class="text-sm text-gray-500">Announcements specific to you and your account.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 rounded-full transition peer-checked:bg-[#0c017b]"></div>
                <div class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Product updates & marketing -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <fieldset class="rounded-lg border border-[#eef0f4]">
            <legend class="px-4 py-3 text-xs font-bold tracking-wider text-[#b01273] uppercase">Product updates</legend>
            <div class="px-4 py-2 border-t border-[#eef0f4] rounded-b-lg">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">New features & improvements</div>
                  <p class="text-sm text-gray-500">Release notes and product news.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" checked />
                  <div class="w-11 h-6 bg-gray-200 rounded-full transition peer-checked:bg-[#0c017b]"></div>
                  <div class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset class="rounded-lg border border-[#eef0f4]">
            <legend class="px-4 py-3 text-xs font-bold tracking-wider text-[#b01273] uppercase">Marketing</legend>
            <div class="px-4 py-2 border-t border-[#eef0f4] rounded-b-lg">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">Promotions & offers</div>
                  <p class="text-sm text-gray-500">Occasional emails about discounts or events.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 rounded-full transition peer-checked:bg-[#0c017b]"></div>
                  <div class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      {/key}
    </div>
  </section>
{/if}


