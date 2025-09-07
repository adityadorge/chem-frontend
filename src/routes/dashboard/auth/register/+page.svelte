<script lang="ts">
  let email = '';
  let username = '';
  let password = '';
  let confirmPassword = '';

  function handleRegister() {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Registration logic here (e.g., API call to Django backend)
    console.log({
      email,
      username,
      password,
      confirmPassword
    });
  }
</script>

<svelte:head>
  <title>Register - Research Dashboard</title>
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
        <h1 class="auth-title">Sign Up</h1>
        <p class="auth-subtitle mb-5">Input your data to register to our website.</p>

        <form on:submit|preventDefault={handleRegister}>
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

          <div class="form-group position-relative has-icon-left mb-4">
            <input
              type="password"
              class="form-control form-control-xl"
              placeholder="Confirm Password"
              bind:value={confirmPassword}
              required
            />
            <div class="form-control-icon">
              <i class="bi bi-shield-lock"></i>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg shadow-lg mt-5">
            Sign Up
          </button>
        </form>

        <div class="text-center mt-5 text-lg fs-4">
          <p class="text-gray-600">
            Already have an account?
            <a href="/auth/login" class="font-bold">Log in</a>.
          </p>
        </div>
      </div>
    </div>

    <div class="col-lg-7 d-none d-lg-block">
      <div id="auth-right">
        <!-- Optional image or background -->
      </div>
    </div>
  </div>
</div>
