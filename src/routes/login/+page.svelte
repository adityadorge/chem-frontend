<script lang="ts">
  import { API_URL } from "$lib/store/api";
  import { toast } from "svelte-sonner"; // removed Toaster
  import { onMount } from "svelte";
  import { loginUser } from "../../lib/store/api";
  import { user } from "$lib/store";
  import { onDestroy } from "svelte";
  import { setUser, loadUser } from "$lib/store/auth";
  import { goto } from "$app/navigation";

  let error = "";
  let email = "";
  let password = "";

  async function handleLogin() {
    const response = await loginUser({ email, password });
    if (response?.tokens) {
      user.set({
        id: response.user?.id,
        email: response.user?.email,
        name: response.user?.name,
        access_token: response.tokens.access,
        refresh_token: response.tokens.refresh,
      });
      loadUser(); // Load user data into store
      toast.success("Login successful!");
      goto("/");
    } else {
      toast.error(response?.error || "Login failed");
    }
  }

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
    // Explicitly typed as 'any' to avoid implicit 'any' error
    if (!response.credential) {
      toast.error("Google login failed");
      console.error("Google login failed response:", response);
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
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.name,
          access_token: data.tokens.access,
          refresh_token: data.tokens.refresh,
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

  onMount(() => {
    console.log("running");
    InitializeGoogleLogin();
  });
</script>

<main class="container flex-box">
  <div class="login-container">
    <h1 class="header">Login</h1>
    <form on:submit|preventDefault={handleLogin}>
      <div class="text_field">
        <input name="email" type="email" bind:value={email} required />

        <span></span>
        <label for="email">E-mail</label>
      </div>
      <div class="text_field">
        <input name="password" type="password" bind:value={password} required />
        <span></span>
        <label for="password">Password</label>
      </div>
      <div class="forgot_pass">
        <a href="ForgotPassword/">Forgot Password?</a>
      </div>
      <button class="submit-btn">Login</button>
      <div class="signup_link">
        Not a member? <a href="/register">Register</a>
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

  .login-container {
    position: relative;
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
    top: 40px;
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

  .forgot_pass {
    margin: -4px 0 18px 5px;
  }

  .forgot_pass a {
    text-decoration: none;
    color: #a6a6a6;
    cursor: pointer;
    font-size: clamp(12px, 3.3vw, 14px);
  }

  .signup_link {
    margin: 20px 0;
    text-align: center;
    color: #666666;
    font-size: clamp(13px, 3.6vw, 15px);
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

  .btn_google_Login {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  @media (max-width: 480px) {
    .login-container {
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    }
  }
</style>
