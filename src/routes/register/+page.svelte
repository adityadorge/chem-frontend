<script lang="ts">
  import { API_URL } from "$lib/store/api";
  import { Toaster, toast } from "svelte-sonner";
  import { registerUser, sendOTP, verifyOTP } from "../../lib/store/api"; // You'll define sendOTP and verifyOTP
  import { user } from "$lib/store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let full_name = "";
  let email = "";
  let password = "";
  // let phone = "";
  // let address = "";
  let otp = "";
  let showOTPInput = false;

  let error = "";

  async function InitializeGoogleLogin() {
    console.log("Loading Google script...");

    // Load the Google script dynamically
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    console.log("Initializing Google Login...");

    //@ts-ignore
    google.accounts.id.initialize({
      client_id: `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`,
      callback: handleCredentialResponse,
    });
    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large" }
    );
  }

  async function handleCredentialResponse(response: any) {
    if (!response.credential) {
      toast.error("Google login failed");
      console.error(error);
      return;
    }

    try {
      const backendResponse = await fetch(
        `${API_URL}/auth/exchange-token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential: response.credential,
          }),
          credentials: "include",
        }
      );

      if (!backendResponse.ok) {
        console.log(backendResponse);
        toast.error("Backend authentication failed.");
        return;
      }

      const data = await backendResponse.json();

      if (data.tokens) {
        user.set({
          access_token: data.tokens.access,
          refresh_token: data.tokens.refresh,
          email: data.user?.email,
          name: data.user?.name,
        });
        toast.success("Login successful!");
        goto("/");
      } else {
        toast.error("Invalid backend response: missing tokens.");
      }
    } catch (e) {
      toast.error("An error occurred during authentication.");
      console.error(e);
    }
  }

  $: console.log("running");

  onMount(() => {
    InitializeGoogleLogin();
  });

  async function handleSendOTP() {
    const res = await sendOTP(email);
    console.log(res);
    if (res.success) {
      toast.success("OTP sent to your email");
      showOTPInput = true;
    } else {
      toast.error(res.error || "Failed to send OTP");
    }
  }

  async function handleVerifyAndRegister() {
    const otpRes = await verifyOTP({ full_name, email, password }, otp);

    if (otpRes.status === 200) {
      toast.success("Registration successful! Please login.");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } else {
      toast.error(otpRes.error || "Invalid OTP");
    }
  }
</script>

<Toaster richColors />

<main class="container flex-box">
  <div class="register-container">
    <h1 class="header">Register</h1>
    <form
      on:submit|preventDefault={showOTPInput
        ? handleVerifyAndRegister
        : handleSendOTP}
    >
      <div class="text_field">
        <input type="text" name="full_name" bind:value={full_name} required />
        <span></span>
        <label for="full_name">Full Name</label>
      </div>
      <div class="text_field">
        <input type="email" bind:value={email} required />
        <span></span>
        <label for="">E-mail</label>
      </div>
      <div class="text_field">
        <input type="password" bind:value={password} required />
        <span></span>
        <label for="password">Password</label>
      </div>
      <!-- <div class="text_field">
                <input
                  type="text"
                  name="phone"
                  bind:value={phone}
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="10"
                  on:input={(e) => {
                    const target = e.target as HTMLInputElement;
                    phone = target.value.replace(/\D/g, '');
                  }}
                />
                <span></span>
                <label for="phone">Phone No. (Optional)</label>
              </div> -->
      <!-- <div class="text_field">
                <input type="text" name="address" bind:value={address} />
                <span></span>
                <label for="address">Address (Optional)</label>
            </div> -->
      {#if showOTPInput}
        <div class="text_field">
          <input type="text" bind:value={otp} required />
          <span></span>
          <label for="otp">Enter OTP</label>
        </div>
      {/if}

      <button class="submit-btn">{showOTPInput ? "Register" : "Verify"}</button>

      <!-- <button class="submit-btn">Register</button> -->
      <div class="signup_link">
        Already a member? <a href="/login">Login</a>
      </div>
      <div class="signup_link">
        <span>Or</span>
        <div class="btn_google_Login" id="googleSignInButton"></div>
      </div>
    </form>
  </div>
</main>

<style>
  .flex-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: clamp(16px, 6vh, 50px);
    padding: 0 12px; /* side gutters on small screens */
  }

  .register-container {
    position: relative;        /* fix invalid 'position: block' */
    width: 100%;
    max-width: 520px;          /* cap width for large screens */
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 0 15px #b9b9b9;
    padding: 16px clamp(16px, 5vw, 28px); /* responsive inner padding */
    margin: 0 auto;            /* center */
  }

  .header {
    text-align: center;
    padding: 0 0 16px 0;
    font-size: clamp(20px, 5vw, 28px);
  }

  .container form {
    padding: 0 clamp(12px, 5vw, 40px); /* responsive side padding */
  }

  .text_field {
    position: relative;
    border-bottom: 2px solid #adadad;
    margin: clamp(18px, 4vw, 30px) 0;
  }

  .text_field input {
    width: 100%;
    padding: 0 5px;
    height: 44px; /* taller touch target on mobile */
    border: none;
    background: none;
    outline: none;
    font-size: clamp(14px, 3.5vw, 16px);
  }

  .text_field label {
    position: absolute;
    top: 50%;
    left: 5px;
    color: #adadad;
    transform: translateY(-50%);
    transition: 0.5s;
    pointer-events: none;
    font-size: clamp(12px, 3.3vw, 14px);
  }

  .text_field span::before {
    content: " ";
    position: absolute;
    top: 44px; /* align with input height */
    left: 0;
    width: 0;
    height: 2px;
    background: #2709cf79;
    transition: 0.5s;
  }

  .text_field input:focus ~ label,
  .text_field input:valid ~ label {
    top: -5px;
    color: #2709cf79;
  }

  .text_field input:focus ~ span::before,
  .text_field input:valid ~ span::before {
    width: 100%;
    color: #2709cf79;
  }

  .signup_link {
    margin: 20px 0;
    text-align: center;
    color: #666666;
    font-size: clamp(13px, 3.6vw, 15px);
  }

  .signup_link a {
    color: #2709cf79;
    text-decoration: none;
  }

  .signup_link a:hover {
    text-decoration: underline;
    transition: all 0.2s ease-in-out;
  }

  .submit-btn {
    margin: 20px 0;
    width: 100%;
    min-height: 48px;                 /* better for touch */
    border-radius: 50px;
    background-color: #2709cf79;
    outline: none;
    cursor: pointer;
    border: none;
    color: white;
    transition: all 0.1s ease-in-out;
    font-size: clamp(15px, 4vw, 18px);
    font-weight: 400;
  }

  .submit-btn:active {
    transform: translateY(3px);
    box-shadow: none !important;
  }

  .submit-btn:hover {
    box-shadow: 0 20px 30px -6px rgba(39, 9, 207, 0.475);
  }

  .btn_google_Login {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  @media (max-width: 480px) {
    .register-container {
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    }
  }
</style>
