<script>
  import { Toaster, toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import { loginUser } from "../../lib/store/api";
  import { user } from "$lib/store";
  import { onDestroy } from "svelte";
  import { setUser, loadUser } from "$lib/store/auth";
  import { goto } from "$app/navigation";
  import { sendPasswordResetEmail } from "../../lib/store/api";

  let email = "";

  async function handleResetPassword() {
    try {
      const response = await sendPasswordResetEmail(email);
      if (response.success) {
        toast.success("Reset link sent to your email.");
      } else {
        toast.error(response.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset link.");
    }
  }
</script>

<Toaster richColors />

<main class="container flex-box">
  <div class="login-container">
    <h1 class="header">Reset Password</h1>
    <form on:submit|preventDefault={handleResetPassword}>
      <div class="text_field">
        <input name="email" type="email" bind:value={email} required />

        <span></span>
        <label for="email">E-mail</label>
      </div>

      <button class="submit-btn">Confirm</button>
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
    margin-top: 50px;
  }
  .login-container {
    position: block;
    width: 500px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 15px #b9b9b9;
    padding: 10px;
  }

  .header {
    text-align: center;
    padding: 0px 0px 20px 0px;
  }

  .container form {
    padding: 0px 40px;
  }

  .text_field {
    position: relative;
    border-bottom: 2px solid #adadad;
    margin: 30px 0px;
  }

  .text_field input {
    width: 100%;
    padding: 0px 5px;
    height: 40px;
    border: none;
    background: none;
    outline: none;
  }

  .text_field label {
    position: absolute;
    top: 50%;
    left: 5px;
    color: #adadad;
    transform: translateY(-50%);
    transition: 0.5s;
    pointer-events: none;
  }

  .text_field span::before {
    content: " ";
    position: absolute;
    top: 40px;
    left: 0px;
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

  .submit-btn {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    height: 50px;
    border-radius: 50px;
    background-color: #2709cf79;
    outline: none;
    cursor: pointer;
    border: none;
    color: white;
    transition: all 0.1s ease-in-out;
    font-size: 18px;
    font-weight: 300;
  }

  .submit-btn:active {
    transform: translateY(3px);
    box-shadow: none !important;
  }

  .submit-btn:hover {
    box-shadow: 0 20px 30px -6px rgba(39, 9, 207, 0.475);
  }
</style>
