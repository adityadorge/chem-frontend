<script lang="ts">
  let email = '';

  function handleForgotPassword() {
    // Add your backend request here to send a password reset link
    console.log('Reset link sent to:', email);
    alert('If this email is registered, a password reset link will be sent.');
  }
</script>

<svelte:head>
  <title>Forgot Password - Research Dashboard</title>
  <link rel="shortcut icon" href="/assets/dashboard_assets/compiled/svg/favicon.svg" type="image/x-icon" />
  <link rel="stylesheet" href="/assets/dashboard_assets/compiled/css/app.css" />
  <link rel="stylesheet" href="/assets/dashboard_assets/compiled/css/app-dark.css" />
  <link rel="stylesheet" href="/assets/dashboard_assets/compiled/css/auth.css" />
</svelte:head>

<div id="auth">
  <div class="row h-100">
    <div class="col-lg-5 col-12">
      <div id="auth-left">
        <div class="auth-logo">
          <a href="/"><img src="/assets/dashboard_assets/compiled/svg/logo.svg" alt="Logo" /></a>
        </div>
        <h1 class="auth-title">Forgot Password</h1>
        <p class="auth-subtitle mb-5">Input your email and we will send you a reset password link.</p>

        <form on:submit|preventDefault={handleForgotPassword}>
          <div class="form-group position-relative has-icon-left mb-4">
            <input
              type="email"
              class="form-control form-control-xl"
              placeholder="Email"
              bind:value={email}
              required
            />
            <div class="form-control-icon">
              <i class="bi bi-envelope"></i>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg shadow-lg mt-5">
            Send
          </button>
        </form>

        <div class="text-center mt-5 text-lg fs-4">
          <p class="text-gray-600">
            Remember your account?
            <a href="/auth/login" class="font-bold">Log in</a>.
          </p>
        </div>
      </div>
    </div>

    <div class="col-lg-7 d-none d-lg-block">
      <div id="auth-right">
        <!-- Optional image or background content -->
      </div>
    </div>
  </div>
</div>