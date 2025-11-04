<script lang="ts">
    import { API_URL } from "$lib/store/api";
    import { toast } from "svelte-sonner";
    import { fade, fly } from "svelte/transition";
    import { user, isAuthenticated } from "$lib/store";
    import { writable } from "svelte/store";
    import { goto } from "$app/navigation";
    // Define the type for cart items
    type CartItem = {
        id: number;
        name: string;
        price: number;
        number_of_samples: number; // <-- use this
        image: string;
    };

    export let isOpen = false;
    export const cartItems = writable<CartItem[]>([]);

    // Fetch cart items from the backend
    $: if ($isAuthenticated && isOpen) {
        fetchCart();
    }

    export async function fetchCart() {
        if (!$isAuthenticated || !$user?.access_token) {
            cartItems.set([]);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/cart`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${$user.access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch cart");

            const data = await response.json();

            const formattedCart = data.cart.map(
                (item: {
                    id: number;
                    test_name: string;
                    test_price: string;
                    number_of_samples: number;
                    image_url: string;
                }) => ({
                    id: item.id,
                    name: item.test_name,
                    price: parseFloat(item.test_price),
                    number_of_samples: item.number_of_samples,
                    image: item.image_url,
                }),
            );

            cartItems.set(formattedCart);
        } catch (error) {
            console.error("Error fetching cart:", error);
            cartItems.set([]);
        }
    }

    function closeCart() {
        isOpen = false;
    }

   async function removeItem(id: number) {
        try {
            const response = await fetch(`${API_URL}/cart/delete/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${$user?.access_token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok || data.status !== "success") {
                toast.error(data.message || "Failed to delete item");
                return;
            }

            cartItems.update((items) => items.filter((item) => item.id !== id));
            toast.success("Item removed from cart");
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Error deleting item");
        }
    }

    async function proceedToCheckout() {
        try {
            const response = await fetch(
                `${API_URL}/add-cart-to-ordersummary/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${$user?.access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cart: $cartItems,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok || data.status !== "success") {
                toast.error(data.message || "Failed to proceed to checkout");
                return;
            }

            toast.success("Order summary created!");
            // cartItems.set([]); // Clear cart
            // Redirect to checkout page (adjust the path as needed)
            goto("/checkout/payment");
        } catch (error) {
            toast.error("Something went wrong!");
            console.error(error);
        }
    }

    // Reactively fetch cart when opened or when auth changes
    $: if (isOpen && $isAuthenticated) {
        fetchCart();
    }
    // Clear cart when logged out
    $: if (!$isAuthenticated) {
        cartItems.set([]);
    }

    $: totalItems = $cartItems.reduce(
        (sum, item) => sum + item.number_of_samples,
        0,
    );
    $: subtotal = $cartItems.reduce(
        (sum, item) => sum + item.price * item.number_of_samples,
        0,
    );
</script>

<!-- Cart Section -->
{#if isOpen}
    <div
        class="backdrop"
        role="button"
        tabindex="0"
        aria-label="Close cart"
        on:click={closeCart}
        on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                closeCart();
            }
        }}
        transition:fade
    >
        <div
            class="cart-container"
            role="presentation"
            aria-label="Cart container"
            transition:fade={{ duration: 200 }}
            on:click|stopPropagation
            on:keydown|stopPropagation
        >
            <div class="cart-panel" transition:fly={{ x: 400, duration: 300 }}>
                <div class="cart-header">
                    <h2>Your Cart ({totalItems})</h2>
                    <button
                        class="close-btn"
                        on:click={closeCart}
                        aria-label="Close cart"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div class="cart-content">
                    {#if $cartItems.length === 0}
                        <p class="empty-message">
                            Your cart is currently empty
                        </p>
                    {:else}
                        <div class="cart-items">
                            {#each $cartItems as item (item.id)}
                                <div class="cart-item">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        class="item-image"
                                    />
                                    <div class="item-details">
                                        <h3>{item.name}</h3>
                                        <p>
                                            ${item.price.toFixed(2)} × {item.number_of_samples}
                                        </p>
                                    </div>
                                    <div class="item-actions">
                                        <!-- <button
                                            class="quantity-btn"
                                            on:click={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.number_of_samples - 1,
                                                )}
                                            disabled={item.number_of_samples <= 1}
                                            >−</button
                                        > -->
                                        <span>{item.number_of_samples}</span>
                                        <!-- <button
                                            class="quantity-btn"
                                            on:click={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.number_of_samples + 1,
                                                )}>+</button
                                        > -->
                                        <button
                                            class="remove-btn"
                                            on:click={() => removeItem(item.id)}
                                            >×</button
                                        >
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>

                {#if $cartItems.length > 0}
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                {/if}

                <div class="cart-footer">
                    <button class="checkout-btn" on:click={proceedToCheckout}
                        >Proceed to Checkout</button
                    >
                </div>
            </div>
        </div>
    </div>
{/if}

<style>

body {
    overflow-x: hidden !important;
}

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow-x: hidden;
        z-index: 99;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
    }

    .cart-container {
        position: fixed;
        top: 4vw;
        right: 0;
        width: min(500px, 100vw); /* ensure it never exceeds viewport */
        max-width: 100vw;
        overflow-x: hidden;
        max-height: calc(100vh - 10vw);
        z-index: 1000;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
    }

    .cart-panel {
        width: 100%;
        height: auto;
        min-height: 40vh;
        max-height: calc(100vh - 10vw);
        background: white;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        border-radius: 2vw;
        z-index: 1000;
    }

    .cart-item {
        display: flex;
        align-items: center;
        gap: 2vw;
        padding-bottom: 2vw;
        border-bottom: 1px solid #eee;
    }

    .cart-header {
        padding: 2vw;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5vw;
    }

    .cart-content {
        flex: 1;
        padding: 2vw;
        overflow-y: auto;
    }

    .empty-message {
        text-align: center;
        color: #666;
        margin-top: 2vw;
    }

    .cart-footer {
        padding: 1vw;
        border-top: 1px solid #eee;
    }

    .checkout-btn {
        width: 100%;
        padding: 0.5vw ;
        background: #0c017b;
        color: white;
        border: none;
        border-radius: 2vw;
        cursor: pointer;
        font-weight: bold;
        font-size: clamp(1rem, 2vw, 1.2rem);
    }

    .item-image {
        width: 80px; /* increased image width */
        height: 80px; /* increased image height */
        object-fit: cover;
        border-radius: 4px;
    }

    .item-details {
        flex: 1;
    }

    /* .item-details h3 {
        margin: 0 0 0.5vw 0;
        font-size: clamp(1rem, 2vw, 1.2rem);
    } */

    .item-actions {
        display: flex;
        align-items: center;
        gap: 1vw;
    }

    .remove-btn {
        background: none;
        border: none;
        color: #ff3d00;
        cursor: pointer;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        margin-left: 0.5vw;
    }

    .cart-summary {
    padding: 1vw 2vw;
    border-top: 1px solid #eee;
}

    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5vw;
    }

    /* Responsive cart for tablets and mobile */
    @media (max-width: 900px) {
        .backdrop {
            justify-content: center !important;
            align-items: flex-end !important;
            background: rgba(0, 0, 0, 0.35) !important;
            z-index: 3000 !important;
        }
        .cart-container {
            position: static !important;
            width: 100vw !important;
            max-width: 100vw !important;
            max-height: 80vh !important;
            border-radius: 18px 18px 0 0 !important;
            box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.1) !important;
            padding: 0 !important;
            top: auto !important;
            right: auto !important;
            left: auto !important;
            z-index: 3001 !important;
        }
        .cart-panel {
            min-height: 40vh !important;
            max-height: 80vh !important;
            border-radius: 18px 18px 0 0 !important;
            padding: 0 !important;
            overflow-y: auto !important;
        }
    }

    /* Extra small screens */
    @media (max-width: 480px) {
        .cart-container {
            width: 100vw;
            max-width: 100vw;
            max-height: 85vh;
            border-radius: 16px 16px 0 0;
            padding: 0;
        }
        .cart-panel {
            min-height: 35vh;
            max-height: 85vh;
            padding: 0;
        }
        .cart-header,
        .cart-footer,
        .cart-summary {
            padding: 12px 8px;
        }
        .item-image {
            width: 44px;
            height: 44px;
        }
        .item-details h3 {
            font-size: 0.95rem;
        }
        .remove-btn {
            font-size: 1.5rem;
        }
        .checkout-btn {
            padding: 12px;
            font-size: 0.95rem;
        }
    }
</style>
