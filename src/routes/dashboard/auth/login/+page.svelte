<script lang="ts">
  import { onMount } from 'svelte';
  let username = '';
  let password = '';
  let keepLoggedIn = false;

  function handleLogin() {
    // Add your login logic here (API call, JWT, etc.)
    console.log({ username, password, keepLoggedIn });
  }

  onMount(() => {
    // Optional: dark/light theme init logic
  });
</script>

<svelte:head>
  <title>Login - Research Dashboard</title>
  <link rel="shortcut icon" href="/assets/dashboard_assets/compiled/svg/favicon.svg" type="image/x-icon">
  <link rel="stylesheet" href="/assets/dashboard_assets/compiled/css/app.css">
  <link rel="stylesheet" href="/assets/dashboard_assets/compiled/css/app-dark.css">
  <link rel="stylesheet" href="/assets/dashboard_assets/compiled/css/auth.css">
</svelte:head>

<div id="auth">
  <div class="row h-100">
    <div class="col-lg-5 col-12">
      <div id="auth-left">
        <div class="auth-logo">
          <a href="/"><img src="/assets/dashboard_assets/compiled/svg/logo.svg" alt="Logo" /></a>
        </div>
        <h1 class="auth-title">Log in.</h1>
        <p class="auth-subtitle mb-5">Log in with your data that you entered during registration.</p>

        <form on:submit|preventDefault={handleLogin}>
          <div class="form-group position-relative has-icon-left mb-4">
            <input
              type="text"
              class="form-control form-control-xl"
              placeholder="Username"
              bind:value={username}
              required
            />
            <div class="form-control-icon">
              <i class="bi bi-person"></i>
            </div>
          </div>

          <div class="form-group position-relative has-icon-left mb-4">
            <input
              type="password"
              class="form-control form-control-xl"
              placeholder="Password"
              bind:value={password}
              required
            />
            <div class="form-control-icon">
              <i class="bi bi-shield-lock"></i>
            </div>
          </div>

          <div class="form-check form-check-lg d-flex align-items-end">
            <input
              class="form-check-input me-2"
              type="checkbox"
              id="keepLoggedIn"
              bind:checked={keepLoggedIn}
            />
            <label class="form-check-label text-gray-600" for="keepLoggedIn">
              Keep me logged in
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg shadow-lg mt-5">
            Log in
          </button>
        </form>

        <div class="text-center mt-5 text-lg fs-4">
          <p class="text-gray-600">
            Don't have an account?
            <a href="/auth/register" class="font-bold">Sign up</a>.
          </p>
          <p>
            <a class="font-bold" href="/auth/forgot-password">Forgot password?</a>.
          </p>
        </div>
      </div>
    </div>

    <div class="col-lg-7 d-none d-lg-block">
      <div id="auth-right">
        <!-- Optional background or image here -->
      </div>
    </div>
  </div>
</div>
