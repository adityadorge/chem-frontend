<script lang="ts">
    import { onMount } from "svelte";
    import { API_URL } from "$lib/store/api";
    import { user } from "$lib/store";
    import { page } from "$app/stores";
    import { toast } from "svelte-sonner";

    let billing = "yearly";
    let cardholder = "";
    let cardNumber = "";
    let expiration = "";
    let cvv = "";
    let postalCode = "";

    let orderSummaries: any[] = [];
    let grandTotal: string = "0.00";
    let loading = false;
    let error = "";

    onMount(() => {
        fetchOrderSummaries();
    });

    async function fetchOrderSummaries() {
        loading = true;
        error = "";
        try {
            const res = await fetch(`${API_URL}/get-ordersummary/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${$user.access_token}` },
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch order summaries");
            const data = await res.json();
            orderSummaries = data.orders || [];
            grandTotal = data.grand_total || "0.00";
        } catch (e) {
            error = e instanceof Error ? e.message : "Could not load order summaries";
        } finally {
            loading = false;
        }
    }

    async function removeOrderSummaryItem(itemId: number) {
        try {
            const res = await fetch(`${API_URL}/delete-ordersummary-item/${itemId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${$user.access_token}` },
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok || data.status !== "success") {
                toast.error(data.message || "Failed to remove item");
                return;
            }
            toast.success("Order removed!");
            // Refresh the order summary list
            fetchOrderSummaries();
        } catch (e) {
            toast.error("Could not remove item");
        }
    }
</script>

<div class="container">
    <div class="flex flex-col lg:flex-row min-h-screen gap-12 p-4 lg:p-8">
        <!-- Sidebar -->
        <div class="w-full lg:w-[40%] bg-pink-100 p-8 lg:p-12 flex flex-col justify-between rounded-3xl relative min-h-[400px]">
            <div class="pb-20 lg:pb-0">
                <div class="text-2xl lg:text-4xl font-extrabold text-blue-700 mb-6 leading-tight">
                    Our Company is amazing, but don’t just take our word for it.
                </div>
                <div class="text-base lg:text-lg text-gray-800 mb-6">
                    “I recently moved to LA from Florida and I’ve had steady freelance work all thanks to Dribbble. Best investment I've made was becoming Pro.”
                </div>
            </div>

            <!-- Add the SVG/PNG image at the bottom -->
            <img
              src="/assets/checkout/payment/floral-background.png"
              alt="Floral background"
              class="absolute left-0 bottom-0 w-full h-32 object-cover rounded-b-3xl pointer-events-none"
              style="z-index:1;"
            />
        </div>

        <!-- Main content -->
        <div class="w-full lg:w-[60%] flex justify-center items-start">
            <div class="bg-white rounded-3xl shadow-lg p-8 lg:p-12 w-full max-w-3xl flex flex-col">
                <div class="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-8">
                    Subscribe to Dribbble Pro
                </div>

                <!-- Billing Toggle -->
                <div class="flex flex-col md:flex-row gap-4 mb-8">
                    <label
                        class="flex-1 cursor-pointer border-2 rounded-xl p-4 flex flex-col items-start relative bg-white"
                        class:!border-blue-600={billing === 'monthly'}
                        class:!bg-blue-50={billing === 'monthly'}
                    >
                        <input type="radio" bind:group={billing} value="monthly" class="absolute top-3 right-3 accent-blue-600" />
                        <div class="font-medium text-gray-800">Bill monthly</div>
                        <div class="text-lg font-semibold">$12/month</div>
                        <div class="text-sm text-gray-500 mt-1">* approx. £10 GBP</div>
                    </label>

                    <label
                        class="flex-1 cursor-pointer border-2 rounded-xl p-4 flex flex-col items-start relative bg-white"
                        class:!border-blue-600={billing === 'yearly'}
                        class:!bg-blue-50={billing === 'yearly'}
                    >
                        <input type="radio" bind:group={billing} value="yearly" class="absolute top-3 right-3 accent-blue-600" />
                        <div class="font-medium text-gray-800 flex items-center gap-2">
                            Bill yearly <span class="text-emerald-600 text-sm font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">-58%</span>
                        </div>
                        <div class="text-lg font-semibold">$5/month</div>
                        <div class="text-sm text-gray-500 mt-1">* approx. £4 GBP</div>
                    </label>
                </div>

                <!-- Payment details -->
                <div class="text-xl font-bold text-gray-900 mb-4">Payment Details</div>
                <div class="flex gap-4 mb-4">
                    <button class="flex-1 border-2 rounded-lg py-3 font-semibold text-blue-600 bg-blue-50 border-blue-600">PayPal</button>
                    <button class="flex-1 rounded-lg py-3 font-semibold bg-black text-white">G Pay</button>
                </div>

                <div class="text-gray-500 text-sm mb-3">or checkout using a credit card</div>

                <!-- Credit Card Form -->
                <form class="flex flex-col gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Cardholder Name"
                        bind:value={cardholder}
                        class="border-2 border-gray-200 rounded-md p-3 w-full placeholder:text-gray-400"
                    />
                    <div class="flex gap-3">
                        <input
                            type="text"
                            placeholder="Card Number"
                            maxlength="19"
                            bind:value={cardNumber}
                            class="border-2 border-gray-200 rounded-md p-3 w-full placeholder:text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="MM/YY"
                            maxlength="5"
                            bind:value={expiration}
                            class="border-2 border-gray-200 rounded-md p-3 w-24 placeholder:text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="CVV"
                            maxlength="4"
                            bind:value={cvv}
                            class="border-2 border-gray-200 rounded-md p-3 w-20 placeholder:text-gray-400"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Postal or ZIP code"
                        bind:value={postalCode}
                        class="border-2 border-gray-200 rounded-md p-3 w-1/2 placeholder:text-gray-400"
                    />
                </form>

                <!-- Summary -->
                <div class="text-base">
                {#if loading}
                    <div>Loading order summaries...</div>
                {:else if error}
                    <div class="text-red-600">{error}</div>
                {:else if orderSummaries.length === 0}
                    <div>No pending orders found.</div>
                {:else}
                    <div class="mb-8">
                        <div class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-700"><circle cx="14" cy="14" r="12"/><path d="M9 14l3 3 5-5"/></svg>
                            Order Summary
                        </div>
                        {#each orderSummaries as order}
                            <div class="border rounded-2xl p-6 bg-blue-50 mb-6 shadow-sm flex flex-col gap-2 relative group order-summary-card">
                                <div class="flex justify-between items-center mb-2">
                                    <div class="font-semibold text-lg text-blue-900">{order.test_name}</div>
                                    <button
                                        class="ml-2 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition"
                                        on:click={() => removeOrderSummaryItem(order.id)}
                                        aria-label="Remove order"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                                <div class="flex flex-wrap gap-6 text-gray-700 text-base">
                                    <div>
                                        <span class="font-medium">Price/sample:</span>
                                        <span class="ml-1 text-blue-700 font-semibold">₹{order.test_price}</span>
                                    </div>
                                    <div>
                                        <span class="font-medium">Quantity:</span>
                                        <span class="ml-1">{order.number_of_samples}</span>
                                    </div>
                                    <div>
                                        <span class="font-medium">Total:</span>
                                        <span class="ml-1 text-pink-700 font-bold">₹{order.total_price}</span>
                                    </div>
                                </div>
                                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                                    <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">Pending</span>
                                </div>
                            </div>
                        {/each}
                        <div class="flex justify-between items-center font-bold text-xl mt-6 border-t pt-6">
                            <span class="text-gray-700">Final Total</span>
                            <span class="text-blue-700">₹{grandTotal}</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-end font-bold text-lg mt-4">
                        <span>Billed Now</span>
                    </div>
                    <div class="text-gray-500 text-sm mt-4">
                        All sales are charged in USD and all sales are final. You will be charged $60.00 USD immediately. You will be charged $60.00 USD yearly thereafter while the subscription is active.
                    </div>
                {/if}
                </div>

                <!-- Order Summary Section -->
                
            </div>
        </div>
    </div>
</div>

<style>
/* Add these styles for improved UI */
.order-summary-card {
    transition: box-shadow 0.2s;
}
.order-summary-card:hover {
    box-shadow: 0 4px 16px rgba(44, 62, 80, 0.08);
}
</style>

