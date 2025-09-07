<script>
    let email = "";

    function subscribe() {
        if (email) {
            alert(`Subscribed with ${email}`);
            email = "";
        }
    }
</script>

<footer class="footer">
    <div class="footer-container">
        <!-- Company Info -->
        <div class="footer-section">
            <h2 class="footer-logo">APP NAME</h2>
            <p>Connecting researchers and labs for seamless sample delivery and accurate test results.</p>
            
            <!-- Social Media Icons -->
            <div class="social-icons">
                <a href="#" target="_blank" aria-label="Facebook">
                    <img src="/assets/social/facebook.svg" alt="Facebook">
                </a>
                <a href="#" target="_blank" aria-label="Twitter">
                    <img src="/assets/social/twitter.svg" alt="Twitter">
                </a>
                <a href="#" target="_blank" aria-label="LinkedIn">
                    <img src="/assets/social/linkedin.svg" alt="LinkedIn">
                </a>
                <a href="#" target="_blank" aria-label="Instagram">
                    <img src="/assets/social/instagram.svg" alt="Instagram">
                </a>
            </div>
            Vectors and icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </div>

        <!-- Services -->
        <div class="footer-section">
            <h3>Services</h3>
            <ul>
                <li><a href="#">Chemical Testing</a></li>
                <li><a href="#">Material Analysis</a></li>
                <li><a href="#">Soil & Water Testing</a></li>
                <li><a href="#">Microbiology Testing</a></li>
            </ul>
        </div>

        <!-- Newsletter -->
        <div class="footer-section">
            <h3>Newsletter</h3>
            <p>Subscribe to stay updated on our latest research services.</p>
            <div class="newsletter">
                <input type="email" bind:value={email} placeholder="Enter your email">
                <button on:click={subscribe}>Subscribe</button>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <p>&copy; 2024 APP NAME. All Rights Reserved.</p>
    </div>
</footer>

<style>
    /* 🌟 Footer Styling */
.footer {
    background: #174698;
    color: #333;
    padding-top: 300px; /* Increased to accommodate the overlapping card */
    position: relative;
    z-index: 1;
    text-align: center;
    border-radius: 30px 30px 0 0;
    box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.1);
    margin-top: -30px;
    /* Remove these lines: */
    /* position: fixed; */
    /* left: 0; */
    /* bottom: 0; */
    /* width: 100vw; */
    /* z-index: 100; */
}
.footer {
    background: #F8F9FA;
    color: #333;
    padding: 50px 0;    
    text-align: center;
    border-radius: 30px 30px 0 0;
    box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.1);
    margin-top: 250px;

}


    .footer-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .footer-section {
        flex: 1;
        min-width: 250px;
        margin-bottom: 20px;
    }

    .footer-logo {
        font-size: 24px;
        font-weight: bold;
        color: #333;
    }

    .footer-section h3 {
        margin-bottom: 15px;
        font-size: 18px;
        color: #555;
    }

    .footer-section p, 
    .footer-section ul {
        font-size: 14px;
        color: #666;
    }

    .footer-section ul {
        list-style: none;
        padding: 0;
    }

    .footer-section ul li {
        margin-bottom: 8px;
    }

    .footer-section ul li a {
        text-decoration: none;
        color: #666;
        transition: color 0.3s ease-in-out;
    }

    .footer-section ul li a:hover {
        color: #000;
    }

    /* 🌟 Social Media Icons */
    .social-icons {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 10px;
    }

    .social-icons a {
        display: inline-block;
        width: 30px;
        height: 30px;
        transition: transform 0.2s;
    }

    .social-icons a img {
        width: 100%;
        height: 100%;
    }

    .social-icons a:hover {
        transform: scale(1.1);
    }

    /* 🌟 Newsletter */
    .newsletter {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }

    .newsletter input {
        padding: 10px;
        width: 70%;
        border-radius: 10px;
        border: 1px solid #ccc;
        outline: none;
        background: #fff;
    }

    .newsletter button {
        padding: 10px 15px;
        margin-left: 5px;
        background: #333;
        color: #fff;
        border: none;
        cursor: pointer;
        border-radius: 10px;
        font-weight: bold;
        transition: background 0.3s;
    }

    .newsletter button:hover {
        background: #555;
    }

    /* 🌟 Footer Bottom */
    .footer-bottom {
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid #E0E0E0;
        font-size: 12px;
        color: #777;
    }

    /* 🌟 Responsive */
    @media (max-width: 768px) {
        .footer-container {
            flex-direction: column;
            align-items: center;
        }

        .newsletter {
            flex-direction: column;
        }

        .newsletter input {
            width: 100%;
            margin-bottom: 10px;
        }

        .social-icons {
            gap: 10px;
        }
    }
</style>
