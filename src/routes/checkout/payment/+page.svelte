<script>
    let billing = "yearly";
    let cardholder = "";
    let cardNumber = "";
    let expiration = "";
    let cvv = "";
    let postalCode = "";
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
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-800">Subtotal</span>
                        <span class="text-right">$144.00<br /><span class="text-sm text-gray-500">approx. £117 GBP</span></span>
                    </div>
                    <div class="flex justify-between mb-2 text-red-600">
                        <span>Yearly plan discount</span>
                        <span class="text-right">-$84.00<br /><span class="text-sm text-gray-500">approx. -£69 GBP</span></span>
                    </div>
                    <div class="flex justify-between items-end font-bold text-lg mt-4">
                        <span>Billed Now</span>
                        <span class="text-right">USD $60.00<br /><span class="text-sm text-gray-500">approx. £49 GBP</span></span>
                    </div>
                    <div class="text-gray-500 text-sm mt-4">
                        All sales are charged in USD and all sales are final. You will be charged $60.00 USD immediately. You will be charged $60.00 USD yearly thereafter while the subscription is active.
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
