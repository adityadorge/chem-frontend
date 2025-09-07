<script lang="ts">
  import { onMount } from "svelte";
  import { user } from "$lib/store";
  import { toast } from "svelte-sonner";
  import { get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { clearUser } from "$lib/store/auth";
  const currentUser = get(user);
  let userData: { id: number; name: string; email: string } | null = null;

  // ✅ Fetch profile info from Django backend
  async function fetchProfile() {
    try {
      const res = await fetch("http://localhost:8000/auth/profile/", {
        method: "GET",
        credentials: "include", // Send cookie with JWT
        headers: {
          Authorization: `Bearer ${currentUser.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      userData = data;
      user.update((u) => (u ? { ...u, ...data } : u)); // ✅ Merge, don't overwrite!
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load profile");
    }
  }

  // 🔁 Fetch on mount
  onMount(() => {
    fetchProfile();
  });

  // 🚪 Logout
  async function handleLogout() {
    try {
      await fetch("http://localhost:8000/auth/logout/", {
        method: "POST",
        credentials: "include",
      });

      user.set(null);
      userData = null;
      toast.success("User logged out!");
      clearUser();
      goto("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  }
</script>

<main class="container">
  <button on:click={handleLogout} class="logout-button">Logout</button>

  {#if userData}
    <div class="profile-box">
      <h2>Welcome, {userData.name}!</h2>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>User ID:</strong> {userData.id}</p>
    </div>
  {:else}
    <p>Loading profile...</p>
  {/if}
</main>

<style>
  .logout-button {
    border: none;
    background: oklch(70.4% 0.191 22.216);
    padding: 10px;
    border-radius: 10px;
    color: white;
  }

  .profile-box {
    margin-top: 20px;
    padding: 16px;
    border-radius: 8px;
    background: #f3f3f3;
  }

  .profile-box h2 {
    margin-bottom: 10px;
  }
</style>
