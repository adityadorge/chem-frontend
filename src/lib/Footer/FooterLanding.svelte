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
		<div class="footer-section company">
			<h2 class="footer-logo">APP NAME</h2>
			<p class="tagline">Empowering science. Connecting researchers to advanced labs with hassle-free logistics and trusted results.</p>

			<div class="social-icons">
				<a href="#" target="_blank" aria-label="Facebook">
					<img src="/assets/social/facebook.svg" alt="Facebook" />
				</a>
				<a href="#" target="_blank" aria-label="Twitter">
					<img src="/assets/social/twitter.svg" alt="Twitter" />
				</a>
				<a href="#" target="_blank" aria-label="LinkedIn">
					<img src="/assets/social/linkedin.svg" alt="LinkedIn" />
				</a>
				<a href="#" target="_blank" aria-label="Instagram">
					<img src="/assets/social/instagram.svg" alt="Instagram" />
				</a>
			</div>
			<p class="credit">Icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a></p>
		</div>

		<!-- Quick Links -->
		<div class="footer-section">
			<h3>Explore</h3>
			<ul>
				<li><a href="#">Home</a></li>
				<li><a href="#">About Us</a></li>
				<li><a href="#">Services</a></li>
				<li><a href="#">Contact</a></li>
			</ul>
		</div>

		<!-- Services -->
		<div class="footer-section">
			<h3>What We Offer</h3>
			<ul>
				<li><a href="#">Chemical Testing</a></li>
				<li><a href="#">Material Analysis</a></li>
				<li><a href="#">Soil & Water Testing</a></li>
				<li><a href="#">Microbiology Testing</a></li>
			</ul>
		</div>

		<!-- Newsletter -->
		<div class="footer-section">
			<h3>Stay in Touch</h3>
			<p>Subscribe to get the latest updates and research news delivered to your inbox.</p>
			<div class="newsletter">
				<input type="email" bind:value={email} placeholder="Enter your email" />
				<button on:click={subscribe}>Subscribe</button>
			</div>
		</div>
	</div>

	<div class="footer-bottom">
		<p>&copy; 2024 <strong>APP NAME</strong>. All rights reserved.</p>
	</div>
</footer>

<style>
.footer {
	background: #0c017b;
	color: #fff;
	padding-top: 300px;
	position: relative;
	z-index: 1;
	text-align: center;
	border-radius: 30px 30px 0 0;
	box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.1);
	margin-top: -30px;
	font-family: "Segoe UI", sans-serif;
}

.footer-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	max-width: 1200px;
	margin: 0 auto;
	padding: 40px 20px;
	text-align: left;
}

.footer-section {
	flex: 1;
	min-width: 240px;
	margin-bottom: 30px;
}

.footer-section.company {
	flex: 1.5;
	margin-right: 40px;
}

.footer-logo {
	font-size: 28px;
	font-weight: 800;
	color: #fff;
	margin-bottom: 12px;
	letter-spacing: 1px;
}

.tagline {
	font-size: 15px;
	color: #e0e0e0;
	margin-bottom: 16px;
	line-height: 1.6;
	max-width: 300px;
}

.footer-section h3 {
	font-size: 18px;
	color: #ffffff;
	margin-bottom: 15px;
	border-bottom: 2px solid #ffffff;
	display: inline-block;
	padding-bottom: 6px;
}

.footer-section ul {
	list-style: none;
	padding: 0;
}

.footer-section ul li {
	margin-bottom: 10px;
}

.footer-section ul li a {
	text-decoration: none;
	color: #f0f0f0;
	font-size: 15px;
	transition: all 0.3s ease;
}

.footer-section ul li a:hover {
	color: #fff;
	font-weight: 600;
}

.social-icons {
	display: flex;
	gap: 12px;
	justify-content: flex-start;
	margin-top: 10px;
}

.social-icons a {
	width: 34px;
	height: 34px;
	transition: transform 0.3s ease, filter 0.3s ease;
}

.social-icons a:hover {
	transform: scale(1.15);
	filter: brightness(1.2);
}

.social-icons img {
	width: 100%;
	height: 100%;
	border-radius: 6px;
}

.credit {
	margin-top: 12px;
	font-size: 12px;
	color: #cccccc;
}

.credit a {
	color: #cccccc;
	text-decoration: underline;
}

.newsletter {
	display: flex;
	gap: 10px;
	margin-top: 15px;
	flex-wrap: wrap;
}

.newsletter input {
	padding: 12px 16px;
	width: 70%;
	border-radius: 8px;
	border: none;
	background: #fff;
	color: #000;
	flex: 1;
	min-width: 200px;
	font-size: 14px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.newsletter button {
	padding: 12px 20px;
	background: #ffffff;
	color: #174698;
	font-weight: 700;
	border-radius: 8px;
	border: none;
	cursor: pointer;
	transition: background 0.3s ease, transform 0.2s ease;
	box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.newsletter button:hover {
	background: #e0e0e0;
	transform: translateY(-1px);
}

.footer-bottom {
	text-align: center;
	margin-top: 30px;
	padding: 12px 0;
	border-top: 1px solid #e0e0e0;
	font-size: 13px;
	color: #ccc;
}

/* Responsive */
@media (max-width: 768px) {
    .footer {
        padding-top: 160px;
        border-radius: 24px 24px 0 0;
        margin-top: -24px;
    }

    .footer-container {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 24px 16px;
        gap: 24px;
    }

    .footer-section {
        text-align: center;
        width: 100%;
        max-width: 520px;
        margin-bottom: 16px;
    }

    .footer-section.company {
        margin-right: 0;
    }

    .footer-logo {
        font-size: 24px;
    }

    .tagline {
        max-width: none;
        margin: 0 auto 14px;
        font-size: 14px;
        line-height: 1.6;
    }

    .footer-section h3 {
        font-size: 16px;
        margin-bottom: 12px;
    }

    .footer-section ul li a {
        font-size: 15px;
        line-height: 1.8;
    }

    .social-icons {
        justify-content: center;
        gap: 14px;
    }

    .social-icons a {
        width: 40px;
        height: 40px;
    }

    .newsletter {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .newsletter input {
        width: 100%;
        min-width: 0;
        font-size: 16px; /* prevents mobile zoom */
        padding: 12px 14px;
    }

    .newsletter button {
        width: 100%;
        margin-bottom: 0;
        font-size: 16px;
        padding: 12px 14px;
    }

    .footer-bottom {
        font-size: 12px;
        padding: 10px 0 calc(10px + env(safe-area-inset-bottom));
    }
}
</style>
