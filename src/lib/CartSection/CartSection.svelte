<script lang="ts">
    import { toast } from "svelte-sonner";
    import { fade, fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { user, isAuthenticated } from "$lib/store";
    import { writable } from "svelte/store";
    import { goto } from "$app/navigation";
    // Define the type for cart items
    import { API_URL } from "$lib/store/api";
    
    type CartItem = {
        id: number;
        name: string;
        price: number;
        quantity: number;
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
                    quantity: number;
                    image_url: string;
                }) => ({
                    id: item.id,
                    name: item.test_name,
                    price: parseFloat(item.test_price),
                    quantity: item.quantity,
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

    async function updateQuantity(id: number, newQuantity: number) {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`${API_URL}/cart/update/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${$user?.access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cart_id: id, quantity: newQuantity }),
            });

            if (!response.ok) throw new Error("Failed to update quantity");

            cartItems.update((items) =>
                items.map((item) =>
                    item.id === id ? { ...item, quantity: newQuantity } : item,
                ),
            );
        } catch (error) {
            toast.error("Failed to update quantity");
            console.error(error);
        }
    }

    async function removeItem(id: number) {
        try {
            const response = await fetch(
                `${API_URL}/cart/delete/${id}/`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${$user?.access_token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

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
        const response = await fetch(`${API_URL}/add-cart-to-ordersummary/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${$user?.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cart: $cartItems
            }),
        });

        const data = await response.json();

        if (!response.ok || data.status !== "success") {
            toast.error(data.message || "Failed to proceed to checkout");
            return;
        }

        toast.success("Order summary created!");
        // cartItems.set([]); // Clear cart
        // Redirect to checkout page (adjust the path as needed)
        window.location.href = "/checkout";
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
    $: if (! $isAuthenticated) {
        cartItems.set([]);
    }

    $: totalItems = $cartItems.reduce((sum, item) => sum + item.quantity, 0);
    $: subtotal = $cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
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
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { closeCart(); } }}
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
                                            ${item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <div class="item-actions">
                                        <button
                                            class="quantity-btn"
                                            on:click={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1,
                                                )}
                                            disabled={item.quantity <= 1}
                                            >−</button
                                        >
                                        <span>{item.quantity}</span>
                                        <button
                                            class="quantity-btn"
                                            on:click={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1,
                                                )}>+</button
                                        >
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
                    <button class="checkout-btn" on:click={proceedToCheckout}>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100svw;
        height: 100svh;
        z-index: 99;
        display: flex;
        justify-content: flex-end;
    }

    .cart-container {
        position: fixed;
        top: 70px;
        right: 0;
        width: 500px; /* Increased width */
        max-height: calc(100vh - 60px);
        z-index: 1000;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
    }

    .cart-panel {
        width: 100%;
        height: auto;
        min-height: 400px; /* Increased min-height */
        max-height: calc(100vh - 60px);
        background: white;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-radius: 20px;
        z-index: 1000;
    }

    .cart-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }

    .cart-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
    }

    .cart-content {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
    }

    .empty-message {
        text-align: center;
        color: #666;
        margin-top: 40px;
    }

    .cart-footer {
        padding: 20px;
        border-top: 1px solid #eee;
    }

    .checkout-btn {
        width: 100%;
        padding: 12px;
        background: #2709cf79;
        color: white;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-weight: bold;
    }

    .checkout-btn:hover {
        transform: scale(1.05);
        transition: all 0.3s;
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

    .item-details h3 {
        margin: 0 0 5px 0;
        font-size: 18px; /* increased font size */
    }

    .item-actions {
        display: flex;
        align-items: center;
        gap: 10px; /* increased gap */
    }

    .quantity-btn {
        width: 30px; /* increased button width */
        height: 30px; /* increased button height */
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
    }

    .quantity-btn:hover {
        transform: scale(1.05);
        transition: all 0.3s;
    }

    .remove-btn {
        background: none;
        border: none;
        color: #ff3d00;
        cursor: pointer;
        font-size: 40px; /* increased font size */
        margin-left: 5px;
    }

    .cart-summary {
        padding: 15px 20px;
        border-top: 1px solid #eee;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    @media (max-width: 480px) {
        .cart-container {
            width: 100%;
            max-height: calc(100vh - 60px);
        }
    }
</style>
