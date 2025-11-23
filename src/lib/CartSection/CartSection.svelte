<script lang="ts">
    import { API_URL } from "$lib/store/api";
    import { toast } from "svelte-sonner";
    import { fade, fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { user, isAuthenticated } from "$lib/store";
    import { writable } from "svelte/store";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    type CartItem = {
        id: number;
        name: string;
        price: number;
        number_of_samples: number;
        image: string;
    };

    export let isOpen = false;
    export const cartItems = writable<CartItem[]>([]);

    // Responsive: track window width
    let width = 1200;
    if (browser) {
        onMount(() => {
            width = window.innerWidth;
            const resize = () => (width = window.innerWidth);
            window.addEventListener("resize", resize);
            return () => window.removeEventListener("resize", resize);
        });
    }

    $: isMobile = width <= 480;
    $: isTablet = width > 480 && width <= 900;

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
            goto("/checkout/payment");
        } catch (error) {
            toast.error("Something went wrong!");
            console.error(error);
        }
    }

    $: if (isOpen && $isAuthenticated) {
        fetchCart();
    }
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

{#if isOpen}
    <div
        class="backdrop {isMobile ? 'mobile' : isTablet ? 'tablet' : ''}"
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
            style="
                width: {isMobile ? '100vw' : isTablet ? '90vw' : '500px'};
                max-width: {isMobile ? '100vw' : isTablet ? '90vw' : '500px'};
                top: {isMobile || isTablet ? 'auto' : '70px'};
                border-radius: {isMobile || isTablet
                ? '18px 18px 0 0'
                : '20px'};
                bottom: {isMobile ? '0' : 'auto'};
                left: {isMobile ? '0' : 'auto'};
                right: {isMobile ? '0' : '0'};
                box-shadow: {isMobile
                ? '0 -2px 16px rgba(0,0,0,0.18)'
                : '0 5px 15px rgba(0,0,0,0.15)'};
            "
            role="presentation"
            aria-label="Cart container"
            transition:fade={{ duration: 200 }}
            on:click|stopPropagation
            on:keydown|stopPropagation
        >
            <div
                class="cart-panel"
                style="
                min-height: {isMobile ? '35vh' : isTablet ? '40vh' : '400px'};
                max-height: {isMobile
                    ? '85vh'
                    : isTablet
                      ? '80vh'
                      : 'calc(100vh - 60px)'};
                border-radius: {isMobile || isTablet
                    ? '18px 18px 0 0'
                    : '20px'};
                padding-bottom: {isMobile ? '80px' : '0'};
            "
                transition:fly={{
                    x: isMobile ? 0 : 400,
                    y: isMobile ? 200 : 0,
                    duration: 300,
                }}
            >
                <div class="cart-header {isMobile ? 'mobile-header' : ''}">
                    <h2 style="font-size: {isMobile ? '1.2rem' : '1.4rem'}">
                        Your Cart ({totalItems})
                    </h2>
                    <button
                        class="close-btn {isMobile ? 'mobile-close' : ''}"
                        on:click={closeCart}
                        aria-label="Close cart"
                    >
                        <svg
                            width={isMobile ? "32" : "24"}
                            height={isMobile ? "32" : "24"}
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

                <div class="cart-content {isMobile ? 'mobile-content' : ''}">
                    {#if $cartItems.length === 0}
                        <p class="empty-message">
                            Your cart is currently empty
                        </p>
                    {:else}
                        <div class="cart-items">
                            {#each $cartItems as item (item.id)}
                                <div
                                    class="cart-item {isMobile
                                        ? 'mobile-item'
                                        : ''}"
                                    style="gap: {isMobile ? '10px' : '15px'};"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        class="item-image"
                                        style="width: {isMobile
                                            ? '48px'
                                            : isTablet
                                              ? '60px'
                                              : '80px'}; height: {isMobile
                                            ? '48px'
                                            : isTablet
                                              ? '60px'
                                              : '80px'};"
                                    />
                                    <div class="item-details">
                                        <h3
                                            style="font-size: {isMobile
                                                ? '1rem'
                                                : '18px'}"
                                        >
                                            {item.name}
                                        </h3>
                                        <p
                                            style="font-size: {isMobile
                                                ? '0.98rem'
                                                : '1rem'}"
                                        >
                                            ${item.price.toFixed(2)} × {item.number_of_samples}
                                        </p>
                                    </div>
                                    <div
                                        class="item-actions"
                                        style="gap: {isMobile
                                            ? '8px'
                                            : '10px'};"
                                    >
                                        <span
                                            style="font-size: {isMobile
                                                ? '1rem'
                                                : '1.1rem'}"
                                            >{item.number_of_samples}</span
                                        >
                                        <button
                                            class="remove-btn"
                                            style="font-size: {isMobile
                                                ? '2rem'
                                                : '2rem'}"
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
                    <div
                        class="cart-summary {isMobile ? 'mobile-summary' : ''}"
                    >
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                {/if}

                <div class="cart-footer {isMobile ? 'mobile-footer' : ''}">
                    <button
                        class="checkout-btn"
                        style="font-size: {isMobile ? '1.1rem' : '1.1rem'}"
                        on:click={proceedToCheckout}>Proceed to Checkout</button
                    >
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
        width: 100vw;
        height: 100vh;
        z-index: 99;
        display: flex;
        justify-content: flex-end;
    }
    .backdrop.mobile,
    .backdrop.tablet {
        justify-content: center !important;
        align-items: flex-end !important;
        z-index: 3000 !important;
    }
    .cart-container {
        position: fixed;
        right: 0;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        background: white;
    }
    .cart-panel {
        width: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 1000;
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
        background: #0c017b;
        color: white;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-weight: bold;
        transition: transform 0.3s;
    }
    .checkout-btn:hover {
        transform: scale(1.05);
    }
    .cart-item {
        display: flex;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }
    .item-details {
        flex: 1;
    }
    .item-details h3 {
        margin: 0 0 5px 0;
    }
    .item-actions {
        display: flex;
        align-items: center;
    }
    .remove-btn {
        background: none;
        border: none;
        color: #ff3d00;
        cursor: pointer;
        margin-left: 5px;
        transition: color 0.2s;
    }
    .remove-btn:hover {
        color: #b71c1c;
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

    /* --- MOBILE ONLY STYLES --- */
    @media (max-width: 480px) {
        .backdrop.mobile {
            align-items: flex-end !important;
            background: rgba(0, 0, 0, 0.18);
        }
        .cart-container {
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            top: auto !important;
            border-radius: 18px 18px 0 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.18) !important;
        }
        .cart-panel {
            min-height: 35vh !important;
            max-height: 85vh !important;
            border-radius: 18px 18px 0 0 !important;
            padding-bottom: 80px !important;
            overflow-x: hidden;
        }
        .cart-header {
            position: sticky;
            top: 0;
            background: #fff;
            z-index: 10;
            padding: 18px 16px 18px 20px !important;
            border-radius: 18px 18px 0 0;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .close-btn {
            font-size: 2rem !important;
            padding: 8px !important;
        }
        .cart-content {
            padding: 16px 10px 10px 10px !important;
            max-height: 45vh !important;
            overflow-y: auto;
        }
        .cart-items {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .cart-item {
            padding: 10px 0 10px 0 !important;
            border-bottom: 1px solid #f2f2f2;
            align-items: center;
            gap: 10px !important;
        }
        .item-image {
            border-radius: 10px;
            object-fit: cover;
            width: 48px !important;
            height: 48px !important;
        }
        .item-details h3 {
            font-size: 1rem !important;
            margin-bottom: 2px !important;
        }
        .item-details p {
            font-size: 0.98rem !important;
        }
        .item-actions {
            gap: 8px !important;
        }
        .remove-btn {
            font-size: 2rem !important;
            padding: 0 6px !important;
        }
        .cart-summary {
            padding: 10px 16px !important;
            border-top: 1px solid #eee;
            background: #fafaff;
            font-size: 1.05rem;
        }
        .cart-footer {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background: #fff;
            border-radius: 0 0 18px 18px;
            padding: 14px 18px 18px 18px !important;
            box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
            z-index: 20;
        }
        .checkout-btn {
            width: 100%;
            padding: 15px 0 !important;
            font-size: 1.1rem !important;
            border-radius: 50px;
        }
        .empty-message {
            margin-top: 30px !important;
            font-size: 1.05rem !important;
        }
    }
</style>
