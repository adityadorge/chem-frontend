<script lang="ts">
  let code = "";

  function handle2FAVerify() {
    // Replace with API request for 2FA verification
    console.log("2FA Code:", code);
    alert("2FA code submitted.");
  }
</script>

<svelte:head>
  <title>Two-Factor Authentication</title>
</svelte:head>

<div id="auth">
  <div class="row h-100">
    <div class="col-lg-5 col-12">
      <div id="auth-left">
        <div class="auth-logo">
          <a href="/"><img src="/assets/dashboard_assets/compiled/svg/logo.svg" alt="Logo" /></a>
        </div>
        <h1 class="auth-title">Two-Factor Authentication</h1>
        <p class="auth-subtitle mb-5">
          Enter the authentication code from your authenticator app (e.g., Google Authenticator).
        </p>

        <form on:submit|preventDefault={handle2FAVerify}>
          <div class="form-group mb-4">
            <input
              type="text"
              maxlength="6"
              class="form-control form-control-xl text-center"
              placeholder="Enter 2FA Code"
              bind:value={code}
              required
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg shadow-lg mt-3">
            Verify Code
          </button>
        </form>

        <div class="text-center mt-3">
          <p class="text-gray-600">
            Lost access to your device?
            <a href="#" class="font-bold">Recover account</a>
          </p>
        </div>
      </div>
    </div>

    <div class="col-lg-7 d-none d-lg-block">
      <div id="auth-right"></div>
    </div>
  </div>
</div>
