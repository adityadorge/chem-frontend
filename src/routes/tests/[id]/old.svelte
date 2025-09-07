<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Toaster, toast } from "svelte-sonner";
  import { user, isAuthenticated } from "$lib/store";
  import { get } from "svelte/store";
  import { goto } from "$app/navigation";

  interface Test {
    id: number;
    test_name: string;
    image_url: string;
    test_description: string;
    test_price: number;
  }

  let test: Test | null = null;
  let loading = true;
  let error: string | null = null;

  let quantity = 1;
  let isLoading = false;

  const currentUser = get(user);
  $: id = $page.params.id;

  async function loadTest() {
    loading = true;
    error = null;
    try {
      const res = await fetch(`http://localhost:8000/app1/tests/${id}/`);
      if (!res.ok) throw new Error("Failed to fetch test");
      test = await res.json();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "Failed to load";
    } finally {
      loading = false;
    }
  }

  onMount(loadTest);

  function increaseQuantity() {
    quantity++;
  }
  function decreaseQuantity() {
    if (quantity > 1) quantity--;
  }

  async function handleAddToCart() {
    if (!get(isAuthenticated)) {
      toast.error("Please login to add items to your cart.");
      return;
    }
    isLoading = true;
    try {
      const res = await fetch("http://localhost:8000/add-to-cart/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test_id: test?.id, quantity }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to add to cart");
      }
      toast.success(`Added ${quantity} ${test?.test_name} to cart!`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to add to cart");
    } finally {
      isLoading = false;
    }
  }

  async function goToCheckout() {
    if (!get(isAuthenticated)) {
      toast.error("Please login before buying.");
      return;
    }
    isLoading = true;
    try {
      const res = await fetch("http://localhost:8000/add-to-ordersummary/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test_id: test?.id, quantity }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to add to order summary");
      }
      toast.success(`Added ${quantity} ${test?.test_name} to order summary!`);
      goto("/checkout");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to proceed");
    } finally {
      isLoading = false;
    }
  }
</script>

<Toaster richColors />

<main class="detail-container">
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if test}
    <div class="detail">
      <div class="left-section">
        <div class="image-container">
          <img src={test.image_url} alt={test.test_name} class="popup-image" />
        </div>
        <div class="price">₹{test.test_price}</div>
      </div>

      <div class="divider"></div>

      <div class="right-section">
        <h2 class="product-title">{test.test_name}</h2>
        <p class="product-description">{test.test_description}</p>

        <div class="product-info">
          <h3>Product Details</h3>
          <p>Price: ₹{test.test_price}</p>
        </div>

        <div class="quantity-selector">
          <button class="quantity-btn" on:click={decreaseQuantity} disabled={quantity <= 1} aria-label="Decrease quantity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="quantity-value">{quantity}</span>
          <button class="quantity-btn" on:click={increaseQuantity} aria-label="Increase quantity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div class="action-buttons">
          <button class="add-to-cart" on:click={handleAddToCart} disabled={isLoading}>
            {#if isLoading}
              <span class="loading-spinner">⏳</span>
            {:else}
              Add to Cart
            {/if}
          </button>
          <button class="buy-now" on:click={goToCheckout}>Buy Now</button>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  .detail-container {
    padding: 24px;
    display: flex;
    justify-content: center;
  }

  .detail {
    width: 100%;
    max-width: 980px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    display: flex;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 30px;
    gap: 30px;
  }

  .left-section {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .image-container {
    width: 100%;
    max-width: 320px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    padding: 16px;
    background: #f8f8f8;
    border-radius: 8px;
    border: 1px solid #eee;
  }

  .popup-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .price {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
  }

  .divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, #ddd, transparent);
  }

  .right-section {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  .product-title {
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 12px;
  }

  .product-description {
    font-size: 16px;
    line-height: 1.6;
    color: #6c757d;
    margin-bottom: 22px;
  }

  .product-info h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 2px solid #2709cf79;
  }

  .product-info p {
    font-size: 15px;
    line-height: 1.6;
    color: #6c757d;
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    margin: 28px 0;
    background: white;
    padding: 8px 15px;
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    width: fit-content;
  }

  .quantity-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .quantity-btn:hover { background-color: #e9ecef; transform: scale(1.05); }
  .quantity-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .quantity-btn svg { color: #495057; }

  .quantity-value {
    font-size: 18px;
    font-weight: 500;
    margin: 0 20px;
    min-width: 30px;
    text-align: center;
  }

  .action-buttons {
    display: flex;
    gap: 15px;
    margin-top: auto;
  }

  .add-to-cart, .buy-now {
    flex: 1;
    padding: 14px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-to-cart {
    background-color: white;
    border: 2px solid #2709cf;
    color: #2709cf;
  }
  .add-to-cart:hover { background-color: #f0f2ff; }

  .buy-now {
    background-color: #2709cf;
    border: 2px solid #2709cf;
    color: white;
  }
  .buy-now:hover { background-color: #1e07a8; border-color: #1e07a8; }

  .error { color: #b00020; }
</style>
