<script>
    let billing = "yearly";
    let cardholder = "";
    let cardNumber = "";
    let expiration = "";
    let cvv = "";
    let postalCode = "";
</script>

<div class="container">
    <div class="sidebar">
        <div>
            <div class="testimonial">
                Dribbble Pro is amazing, but don’t just take our word for it.
            </div>
            <div class="quote">
                “I recently moved to LA from Florida and I’ve had steady
                freelance work all thanks to Dribbble. Best investment I've made
                was becoming Pro.”
            </div>
            <div class="user">
                <img
                    src="https://cdn.dribbble.com/users/1/avatars/normal/1.png"
                    alt="User"
                />
                <div>
                    <div style="font-weight:bold;">Shane Waite</div>
                    <div style="color:#0d0dff;">Freelancer</div>
                </div>
            </div>
        </div>
        <div>
            <!-- Decorative shapes (SVG or images) can go here -->
        </div>
    </div>
    <div class="main">
        <div class="payment-box">
            <div class="title">Subscribe to Dribbble Pro</div>
            <div class="billing-toggle">
                <label
                    class="billing-option {billing === 'monthly'
                        ? 'selected'
                        : ''}"
                >
                    <input type="radio" bind:group={billing} value="monthly" />
                    <div>Bill monthly</div>
                    <div style="font-size:1.1rem;font-weight:bold;">
                        $12/month
                    </div>
                    <div style="font-size:0.9rem;color:#888;">
                        * approx. £10 GBP
                    </div>
                </label>
                <label
                    class="billing-option {billing === 'yearly'
                        ? 'selected'
                        : ''}"
                >
                    <input type="radio" bind:group={billing} value="yearly" />
                    <div>
                        Bill yearly
                        <span class="discount">-58%</span>
                    </div>
                    <div style="font-size:1.1rem;font-weight:bold;">
                        $5/month
                    </div>
                    <div style="font-size:0.9rem;color:#888;">
                        * approx. £4 GBP
                    </div>
                </label>
            </div>
            <div class="payment-details">Payment Details</div>
            <div class="payment-methods">
                <button class="pay-btn selected">PayPal</button>
                <button class="pay-btn gpay">G Pay</button>
            </div>
            <div style="margin: 8px 0; color: #888; font-size: 0.95rem;">
                or checkout using a credit card
            </div>
            <form class="credit-card-form">
                <input
                    type="text"
                    placeholder="Cardholder Name"
                    bind:value={cardholder}
                />
                <div class="row">
                    <input
                        type="text"
                        placeholder="Card Number"
                        maxlength="19"
                        bind:value={cardNumber}
                    />
                    <input
                        type="text"
                        placeholder="MM/YY"
                        maxlength="5"
                        bind:value={expiration}
                    />
                    <input
                        type="text"
                        placeholder="CVV"
                        maxlength="4"
                        bind:value={cvv}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Postal or ZIP code"
                    bind:value={postalCode}
                />
            </form>
            <div class="summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span
                        >$144.00<br /><span style="font-size:0.9rem;color:#888;"
                            >approx. £117 GBP</span
                        ></span
                    >
                </div>
                <div class="summary-row discount">
                    <span>Yearly plan discount</span>
                    <span
                        >-$84.00<br /><span style="font-size:0.9rem;color:#888;"
                            >approx. -£69 GBP</span
                        ></span
                    >
                </div>
                <div class="summary-row total">
                    <span>Billed Now</span>
                    <span
                        >USD $60.00<br /><span
                            style="font-size:0.9rem;color:#888;"
                            >approx. £49 GBP</span
                        ></span
                    >
                </div>
                <div class="note">
                    All sales are charged in USD and all sales are final. You
                    will be charged $60.00 USD immediately. You will be charged
                    $60.00 USD yearly thereafter while the subscription is
                    active.
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .container {
        display: flex;
        min-height: 100vh;
        gap: 48px; /* Added gap between sidebar and main */
    }
    .sidebar {
        width: 40%; /* Increased width */
        background: #f8eafd;
        padding: 64px 48px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 24px; /* More rounded corners */
    }
    .testimonial {
        color: #0d0dff;
        font-weight: bold;
        font-size: 2rem;
        margin-bottom: 24px;
    }
    .quote {
        font-size: 1.1rem;
        margin-bottom: 16px;
        color: #222;
    }
    .user {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
        color: #222;
    }
    .user img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #fff;
        border: 2px solid #ddd;
    }
    .main {
  width: 60%; /* Increased width */
  padding: 64px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.payment-box {
    width: 850px;
    min-height: 900px; /* Increased minimum height */
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
    .title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 32px;
    }
    .billing-toggle {
        display: flex;
        gap: 16px;
        margin-bottom: 32px;
    }
    .billing-option {
        flex: 1;
        border: 2px solid #eee;
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
        background: #fff;
    }
    .billing-option.selected {
        border-color: #0d0dff;
        background: #f4f8ff;
    }
    .billing-option input[type="radio"] {
        position: absolute;
        top: 16px;
        right: 16px;
        accent-color: #0d0dff;
    }
    .discount {
        color: #00bfae;
        font-weight: bold;
        font-size: 0.95rem;
        margin-left: 8px;
    }
    .payment-details {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 16px;
    }
    .payment-methods {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
    }
    .pay-btn {
        flex: 1;
        padding: 10px 0;
        border: none;
        border-radius: 6px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        background: #fff;
        color: #0d0dff;
        border: 2px solid #eee;
        transition: border 0.2s;
    }
    .pay-btn.selected,
    .pay-btn:hover {
        border-color: #0d0dff;
        background: #f4f8ff;
    }
    .pay-btn.gpay {
        background: #000;
        color: #fff;
        border: none;
    }
    .credit-card-form {
        margin-top: 16px;
        margin-bottom: 32px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .credit-card-form input {
        padding: 10px;
        border-radius: 6px;
        border: 2px solid #eee;
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
    }
    .row {
        display: flex;
        gap: 12px;
    }
    .summary {
        margin-top: 32px;
        font-size: 1.1rem;
    }
    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    .summary-row.discount {
        color: #e74c3c;
    }
    .summary-row.total {
        font-weight: bold;
        font-size: 1.2rem;
    }
    .note {
        margin-top: 16px;
        font-size: 0.95rem;
        color: #888;
    }

    @media (max-width: 900px) {
    .container {
        flex-direction: column;
        gap: 24px;
        min-height: unset;
    }
    .sidebar,
    .main {
        width: 100%;
        padding: 32px 16px;
        border-radius: 16px;
    }
    .payment-box {
        width: 100%;
        min-height: unset;
        padding: 24px;
    }
}

@media (max-width: 600px) {
    .sidebar,
    .main {
        padding: 16px 4px;
        border-radius: 8px;
    }
    .testimonial {
        font-size: 1.2rem;
        margin-bottom: 16px;
    }
    .title {
        font-size: 1.3rem;
        margin-bottom: 16px;
    }
    .billing-toggle {
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
    }
    .billing-option {
        padding: 10px;
        font-size: 0.95rem;
    }
    .payment-details {
        font-size: 1rem;
        margin-bottom: 8px;
    }
    .payment-methods {
        gap: 8px;
        margin-bottom: 8px;
    }
    .pay-btn {
        font-size: 1rem;
        padding: 8px 0;
    }
    .credit-card-form {
        gap: 8px;
        margin-bottom: 16px;
    }
    .row {
        gap: 8px;
    }
    .summary {
        margin-top: 16px;
        font-size: 1rem;
    }
    .summary-row.total {
        font-size: 1.05rem;
    }
    .note {
        font-size: 0.9rem;
        margin-top: 8px;
    }
}
</style>
