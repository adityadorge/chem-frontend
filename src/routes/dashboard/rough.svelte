<script lang="ts" context="module">
    declare global {
        interface Window {
            initTheme?: () => void;
            initDashboard?: () => void;
        }
    }
</script>

<script lang="ts">
    import { onMount, tick } from "svelte";
    import Test_Page from "./test-page/+page.svelte";
    import Report_Generation from "./report-generation/+page.svelte";
    import Profile from "$lib/Dashboard_Component/Profile/Profile.svelte";
    import { ReceiptIndianRupee } from "lucide-svelte";
    import Auth_Login from "$lib/Dashboard_Component/Authentication/Auth_Login/Auth_Login.svelte";
    import Auth_Register from "$lib/Dashboard_Component/Authentication/Auth_Register/Auth_Register.svelte";
    import Auth_Forgot_Password from "./auth/forgot/+page.svelte";
    import TwoFactorAuthentication from"$lib/Dashboard_Component/Authentication/TwoFactorAuthentication/TwoFactorAuthentication.svelte";
    import Order_Detail from "./order-detail/+page.svelte";

    let currentPage = "dashboard";
    let currentSubmenu = "";
    let dashboardScriptsLoaded = false;

    function loadScriptOnce(src: string): Promise<void> {
        if (document.querySelector(`script[src="${src}"]`)) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.body.appendChild(script);
        });
    }

    // Load dashboard scripts once on mount
    onMount(async () => {
        if (typeof window === "undefined") return;
        try {
            await loadScriptOnce(
                "/assets/dashboard_assets/static/js/components/dark.js",
            );
            await loadScriptOnce(
                "/assets/dashboard_assets/extensions/perfect-scrollbar/perfect-scrollbar.min.js",
            );
            await loadScriptOnce("/assets/dashboard_assets/compiled/js/app.js");
            await loadScriptOnce(
                "/assets/dashboard_assets/extensions/apexcharts/apexcharts.min.js",
            );
            await loadScriptOnce(
                "/assets/dashboard_assets/static/js/pages/dashboard.js",
            );
            await loadScriptOnce(
                "/assets/dashboard_assets/static/js/initTheme.js",
            );
            dashboardScriptsLoaded = true;
            await tick();
            window.initTheme?.();
            window.initDashboard?.();
        } catch (e) {
            console.error("Error loading dashboard scripts:", e);
        }
    });

    // Re-initialize dashboard charts/widgets when switching to dashboard
    $: if (
        typeof window !== "undefined" &&
        currentPage === "dashboard" &&
        dashboardScriptsLoaded
    ) {
        tick().then(() => {
            window.initDashboard?.();
        });
    }

    function setTheme(theme: "dark" | "light") {
        document.body.classList.toggle("dark-theme", theme === "dark");
        document.documentElement.setAttribute("data-bs-theme", theme);
        localStorage.setItem("theme", theme);
    }

    function getTheme(): "dark" | "light" {
        return (localStorage.getItem("theme") as "dark" | null) || "light";
    }

    function handleThemeToggle(e: Event) {
        const checked = (e.target as HTMLInputElement).checked;
        setTheme(checked ? "dark" : "light");
    }

    onMount(() => {
        if (typeof window === "undefined") return;
        setTheme(getTheme());
        const toggle = document.getElementById(
            "toggle-dark",
        ) as HTMLInputElement;
        if (toggle) {
            toggle.checked = getTheme() === "dark";
            toggle.addEventListener("change", handleThemeToggle);
        }
    });

    function goTo(page: string, submenu: string = "") {
        currentPage = page;
        currentSubmenu = submenu;
    }
</script>

<svelte:head>
    <!-- ✅ Only keep styles and meta -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dashboard - Mazer Admin Dashboard</title>

    <link
        rel="shortcut icon"
        href="/assets/dashboard_assets/compiled/svg/favicon.svg"
        type="image/x-icon"
    />
    <link
        rel="shortcut icon"
        href="data:image/png;base64,..."
        type="image/png"
    />

    <!-- ✅ Keep only CSS files -->
    <link
        rel="stylesheet"
        href="/assets/dashboard_assets/compiled/css/app.css"
    />
    <link
        rel="stylesheet"
        href="/assets/dashboard_assets/compiled/css/app-dark.css"
    />
    <link
        rel="stylesheet"
        href="/assets/dashboard_assets/compiled/css/iconly.css"
    />
</svelte:head>

<div id="app">
    <!-- <button on:click={handleLogout} class="logout-button">Logout</button> -->
    <div id="sidebar">
        <div class="sidebar-wrapper active">
            <div class="sidebar-header position-relative">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="logo">
                        <a href="index.html"
                            ><img
                                src="/assets/dashboard_assets/compiled/svg/logo.svg"
                                alt="Logo"
                                srcset=""
                            /></a
                        >
                    </div>
                    <div
                        class="theme-toggle d-flex gap-2 align-items-center mt-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            aria-hidden="true"
                            role="img"
                            class="iconify iconify--system-uicons"
                            width="20"
                            height="20"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 21 21"
                        >
                            <g
                                fill="none"
                                fill-rule="evenodd"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M10.5 14.5c2.219 0 4-1.763 4-3.982a4.003 4.003 0 0 0-4-4.018c-2.219 0-4 1.781-4 4c0 2.219 1.781 4 4 4zM4.136 4.136L5.55 5.55m9.9 9.9l1.414 1.414M1.5 10.5h2m14 0h2M4.135 16.863L5.55 15.45m9.899-9.9l1.414-1.415M10.5 19.5v-2m0-14v-2"
                                    opacity=".3"
                                ></path>
                                <g transform="translate(-210 -1)">
                                    <path d="M220.5 2.5v2m6.5.5l-1.5 1.5"
                                    ></path>
                                    <circle cx="220.5" cy="11.5" r="4"></circle>
                                    <path
                                        d="m214 5l1.5 1.5m5 14v-2m6.5-.5l-1.5-1.5M214 18l1.5-1.5m-4-5h2m14 0h2"
                                    ></path>
                                </g>
                            </g>
                        </svg>
                        <div class="form-check form-switch fs-6">
                            <input
                                class="form-check-input me-0"
                                type="checkbox"
                                id="toggle-dark"
                                style="cursor: pointer"
                            />
                            <label class="form-check-label" for="toggle-dark"
                            ></label>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            aria-hidden="true"
                            role="img"
                            class="iconify iconify--mdi"
                            width="20"
                            height="20"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="m17.75 4.09l-2.53 1.94l.91 3.06l-2.63-1.81l-2.63 1.81l.91-3.06l-2.53-1.94L12.44 4l1.06-3m3.5 6.91l-1.64 1.25l.59 1.98l-1.7-1.17l-1.7 1.17l.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95l2.06.05m-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85c-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14c.4-.4.82-.76 1.27-1.08c.75-.53 1.93.36 1.85 1.19c-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82c-2.81 3.14-2.7 7.96.31 10.98c3.02 3.01 7.84 3.12 10.98.31Z"
                            >
                            </path>
                        </svg>
                    </div>
                    <div class="sidebar-toggler x">
                        <a href="#" class="sidebar-hide d-xl-none d-block"
                            ><i class="bi bi-x bi-middle"></i></a
                        >
                    </div>
                </div>
            </div>
            <div class="sidebar-menu">
                <ul class="menu">
                    <li class="sidebar-title">Menu</li>

                    <li
                        class="sidebar-item {currentPage === 'dashboard'
                            ? 'active'
                            : ''}"
                    >
                        <a
                            href="#"
                            class="sidebar-link"
                            on:click|preventDefault={() =>
                                (currentPage = "dashboard")}
                        >
                            <i class="bi bi-grid-fill"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>

                    <li
                        class="sidebar-item {currentPage === 'profile'
                            ? 'active'
                            : ''}"
                    >
                        <a
                            href="#"
                            class="sidebar-link"
                            on:click|preventDefault={() =>
                                (currentPage = "profile")}
                        >
                            <i class="bi bi-file-earmark-medical-fill"></i>
                            <span>Profile</span>
                        </a>
                    </li>
                    <!-- <li class="sidebar-title">Pages</li> -->
                    <li
                        class="sidebar-item {currentPage === 'form-layout'
                            ? 'active'
                            : ''}"
                    >
                        <a
                            href="#"
                            class="sidebar-link"
                            on:click|preventDefault={() =>
                                (currentPage = "form-layout")}
                        >
                            <i class="bi bi-file-earmark-medical-fill"></i>
                            <span>Test Page</span>
                        </a>
                    </li>

                    <li
                        class="sidebar-item {currentPage === 'order-detail'
                            ? 'active'
                            : ''}"
                    >
                        <a
                            href="#"
                            class="sidebar-link"
                            on:click|preventDefault={() =>
                                (currentPage = "order-detail")}
                        >
                            <i class="bi bi-file-earmark-medical-fill"></i>
                            <span>Order Detail</span>
                        </a>
                    </li>

                    <li
                        class="sidebar-item {currentPage === 'report-generation'
                            ? 'active'
                            : ''}"
                    >
                        <a
                            href="#"
                            class="sidebar-link"
                            on:click|preventDefault={() =>
                                (currentPage = "report-generation")}
                        >
                            <i class="bi bi-file-earmark-medical-fill"></i>
                            <span>Report Generation</span>
                        </a>
                    </li>

                    <li class="sidebar-item">
                        <a href="#" class="sidebar-link">
                            <i class="bi bi-envelope-fill"></i>
                            <span>Logistics</span>
                        </a>
                    </li>

                    <li class="sidebar-item">
                        <a href="#" class="sidebar-link">
                            <i class="bi bi-envelope-fill"></i>
                            <span>History</span>
                        </a>
                    </li>

                    <li class="sidebar-item">
                        <a href="application-email.html" class="sidebar-link">
                            <i class="bi bi-envelope-fill"></i>
                            <span>Email Application</span>
                        </a>
                    </li>

                    <li class="sidebar-item">
                        <a href="/invoice" class="sidebar-link">
                            <ReceiptIndianRupee />
                            <span>Invoice</span>
                        </a>
                    </li>

                    <li class="sidebar-item">
                        <a href="application-gallery.html" class="sidebar-link">
                            <i class="bi bi-image-fill"></i>
                            <span>Photo Gallery</span>
                        </a>
                    </li>

                    <li class="sidebar-item">
                        <a
                            href="application-checkout.html"
                            class="sidebar-link"
                        >
                            <i class="bi bi-basket-fill"></i>
                            <span>Checkout Page</span>
                        </a>
                    </li>

                    <li class="sidebar-item has-sub">
                        <a href="#" class="sidebar-link">
                            <i class="bi bi-person-badge-fill"></i>
                            <span>Authentication</span>
                        </a>

                        <ul class="submenu">
                            <li
                                class="submenu-item {currentSubmenu === 'login'
                                    ? 'active'
                                    : ''}"
                            >
                                <a
                                    href="#"
                                    class="submenu-link"
                                    on:click|preventDefault={() =>
                                        goTo("auth", "login")}
                                >
                                    Login
                                </a>
                            </li>
                            <li
                                class="submenu-item {currentSubmenu ===
                                'register'
                                    ? 'active'
                                    : ''}"
                            >
                                <a
                                    href="#"
                                    class="submenu-link"
                                    on:click|preventDefault={() =>
                                        goTo("auth", "register")}
                                >
                                    Register
                                </a>
                            </li>
                            <li
                                class="submenu-item {currentSubmenu === 'forgot'
                                    ? 'active'
                                    : ''}"
                            >
                                <a
                                    href="#"
                                    class="submenu-link"
                                    on:click|preventDefault={() =>
                                        goTo("auth", "forgot")}
                                >
                                    Forgot Password
                                </a>
                            </li>
                            <li
                                class="submenu-item {currentSubmenu === '2fa'
                                    ? 'active'
                                    : ''}"
                            >
                                <a
                                    href="#"
                                    class="submenu-link"
                                    on:click|preventDefault={() =>
                                        goTo("auth", "2fa")}
                                >
                                    Two-Factor Authentication
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li class="sidebar-item has-sub">
                        <a href="#" class="sidebar-link">
                            <i class="bi bi-x-octagon-fill"></i>
                            <span>Errors</span>
                        </a>

                        <ul class="submenu">
                            <li class="submenu-item">
                                <a href="error-403.html" class="submenu-link"
                                    >403</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a href="error-404.html" class="submenu-link"
                                    >404</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a href="error-500.html" class="submenu-link"
                                    >500</a
                                >
                            </li>
                        </ul>
                    </li>

                    <li class="sidebar-item">
                        <a href="#" class="sidebar-link">
                            <i class="bi bi-envelope-fill"></i>
                            <span>Settings</span>
                        </a>
                    </li>

                    <li class="sidebar-item has-sub">
                        <a href="#" class="sidebar-link">
                            <i class="bi bi-stack"></i>
                            <span>Components</span>
                        </a>

                        <ul class="submenu">
                            <li class="submenu-item">
                                <a
                                    href="component-accordion.html"
                                    class="submenu-link">Accordion</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-alert.html"
                                    class="submenu-link">Alert</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-badge.html"
                                    class="submenu-link">Badge</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-breadcrumb.html"
                                    class="submenu-link">Breadcrumb</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-button.html"
                                    class="submenu-link">Button</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-card.html"
                                    class="submenu-link">Card</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-carousel.html"
                                    class="submenu-link">Carousel</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-collapse.html"
                                    class="submenu-link">Collapse</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-dropdown.html"
                                    class="submenu-link">Dropdown</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-list-group.html"
                                    class="submenu-link">List Group</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-modal.html"
                                    class="submenu-link">Modal</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-navs.html"
                                    class="submenu-link">Navs</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-pagination.html"
                                    class="submenu-link">Pagination</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-progress.html"
                                    class="submenu-link">Progress</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-spinner.html"
                                    class="submenu-link">Spinner</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-toasts.html"
                                    class="submenu-link">Toasts</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="component-tooltip.html"
                                    class="submenu-link">Tooltip</a
                                >
                            </li>
                        </ul>
                    </li>

                    <li class="sidebar-item has-sub">
                        <a href="#" class="sidebar-link">
                            <i class="bi bi-collection-fill"></i>
                            <span>Extra Components</span>
                        </a>

                        <ul class="submenu">
                            <li class="submenu-item">
                                <a
                                    href="extra-component-avatar.html"
                                    class="submenu-link">Avatar</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="extra-component-divider.html"
                                    class="submenu-link">Divider</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="extra-component-date-picker.html"
                                    class="submenu-link">Date Picker</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="extra-component-sweetalert.html"
                                    class="submenu-link">Sweet Alert</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="extra-component-toastify.html"
                                    class="submenu-link">Toastify</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="extra-component-rating.html"
                                    class="submenu-link">Rating</a
                                >
                            </li>
                        </ul>
                    </li>

                    <li class="sidebar-item has-sub">
                        <a href="#" class="sidebar-link">
                            <i class="bi bi-grid-1x2-fill"></i>
                            <span>Layouts</span>
                        </a>

                        <ul class="submenu">
                            <li class="submenu-item">
                                <a
                                    href="layout-default.html"
                                    class="submenu-link">Default Layout</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="layout-vertical-1-column.html"
                                    class="submenu-link">1 Column</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="layout-vertical-navbar.html"
                                    class="submenu-link">Vertical Navbar</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a href="layout-rtl.html" class="submenu-link"
                                    >RTL Layout</a
                                >
                            </li>

                            <li class="submenu-item">
                                <a
                                    href="layout-horizontal.html"
                                    class="submenu-link">Horizontal Menu</a
                                >
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div id="main">
        <header class="mb-3">
            <a href="#" class="burger-btn d-block d-xl-none">
                <i class="bi bi-justify fs-3"></i>
            </a>
        </header>

        {#if currentPage === "dashboard"}
            <div class="page-heading">
                <h3>Profile Statistics</h3>
            </div>
            <div class="page-content">
                <section class="row">
                    <div class="col-12 col-lg-9">
                        <div class="row">
                            <div class="col-6 col-lg-3 col-md-6">
                                <div class="card">
                                    <div class="card-body px-4 py-4-5">
                                        <div class="row">
                                            <div
                                                class="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start"
                                            >
                                                <div
                                                    class="stats-icon purple mb-2"
                                                >
                                                    <i class="iconly-boldShow"
                                                    ></i>
                                                </div>
                                            </div>
                                            <div
                                                class="col-md-8 col-lg-12 col-xl-12 col-xxl-7"
                                            >
                                                <h6
                                                    class="text-muted font-semibold"
                                                >
                                                    Profile Views
                                                </h6>
                                                <h6 class="font-extrabold mb-0">
                                                    112.000
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 col-lg-3 col-md-6">
                                <div class="card">
                                    <div class="card-body px-4 py-4-5">
                                        <div class="row">
                                            <div
                                                class="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start"
                                            >
                                                <div
                                                    class="stats-icon blue mb-2"
                                                >
                                                    <i
                                                        class="iconly-boldProfile"
                                                    ></i>
                                                </div>
                                            </div>
                                            <div
                                                class="col-md-8 col-lg-12 col-xl-12 col-xxl-7"
                                            >
                                                <h6
                                                    class="text-muted font-semibold"
                                                >
                                                    Followers
                                                </h6>
                                                <h6 class="font-extrabold mb-0">
                                                    183.000
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 col-lg-3 col-md-6">
                                <div class="card">
                                    <div class="card-body px-4 py-4-5">
                                        <div class="row">
                                            <div
                                                class="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start"
                                            >
                                                <div
                                                    class="stats-icon green mb-2"
                                                >
                                                    <i
                                                        class="iconly-boldAdd-User"
                                                    ></i>
                                                </div>
                                            </div>
                                            <div
                                                class="col-md-8 col-lg-12 col-xl-12 col-xxl-7"
                                            >
                                                <h6
                                                    class="text-muted font-semibold"
                                                >
                                                    Following
                                                </h6>
                                                <h6 class="font-extrabold mb-0">
                                                    80.000
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 col-lg-3 col-md-6">
                                <div class="card">
                                    <div class="card-body px-4 py-4-5">
                                        <div class="row">
                                            <div
                                                class="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start"
                                            >
                                                <div
                                                    class="stats-icon red mb-2"
                                                >
                                                    <i
                                                        class="iconly-boldBookmark"
                                                    ></i>
                                                </div>
                                            </div>
                                            <div
                                                class="col-md-8 col-lg-12 col-xl-12 col-xxl-7"
                                            >
                                                <h6
                                                    class="text-muted font-semibold"
                                                >
                                                    Saved Post
                                                </h6>
                                                <h6 class="font-extrabold mb-0">
                                                    112
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4>Profile Visit</h4>
                                    </div>
                                    <div class="card-body">
                                        <div id="chart-profile-visit"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-xl-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h4>Profile Visit</h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-7">
                                                <div
                                                    class="d-flex align-items-center"
                                                >
                                                    <svg
                                                        class="bi text-primary"
                                                        width="32"
                                                        height="32"
                                                        fill="blue"
                                                        style="width:10px"
                                                    >
                                                        <use
                                                            xlink:href="/assets/dashboard_assets/static/images/bootstrap-icons.svg#circle-fill"
                                                        />
                                                    </svg>
                                                    <h5 class="mb-0 ms-3">
                                                        Europe
                                                    </h5>
                                                </div>
                                            </div>
                                            <div class="col-5">
                                                <h5 class="mb-0 text-end">
                                                    862
                                                </h5>
                                            </div>
                                            <div class="col-12">
                                                <div id="chart-europe"></div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-7">
                                                <div
                                                    class="d-flex align-items-center"
                                                >
                                                    <svg
                                                        class="bi text-success"
                                                        width="32"
                                                        height="32"
                                                        fill="blue"
                                                        style="width:10px"
                                                    >
                                                        <use
                                                            xlink:href="/assets/dashboard_assets/static/images/bootstrap-icons.svg#circle-fill"
                                                        />
                                                    </svg>
                                                    <h5 class="mb-0 ms-3">
                                                        America
                                                    </h5>
                                                </div>
                                            </div>
                                            <div class="col-5">
                                                <h5 class="mb-0 text-end">
                                                    375
                                                </h5>
                                            </div>
                                            <div class="col-12">
                                                <div id="chart-america"></div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-7">
                                                <div
                                                    class="d-flex align-items-center"
                                                >
                                                    <svg
                                                        class="bi text-danger"
                                                        width="32"
                                                        height="32"
                                                        fill="blue"
                                                        style="width:10px"
                                                    >
                                                        <use
                                                            xlink:href="/assets/dashboard_assets/static/images/bootstrap-icons.svg#circle-fill"
                                                        />
                                                    </svg>
                                                    <h5 class="mb-0 ms-3">
                                                        Indonesia
                                                    </h5>
                                                </div>
                                            </div>
                                            <div class="col-5">
                                                <h5 class="mb-0 text-end">
                                                    1025
                                                </h5>
                                            </div>
                                            <div class="col-12">
                                                <div id="chart-indonesia"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-xl-8">
                                <div class="card">
                                    <div class="card-header">
                                        <h4>Latest Comments</h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table
                                                class="table table-hover table-lg"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Comment</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td class="col-3">
                                                            <div
                                                                class="d-flex align-items-center"
                                                            >
                                                                <div
                                                                    class="avatar avatar-md"
                                                                >
                                                                    <img
                                                                        src="/assets/dashboard_assets/compiled/jpg/5.jpg"
                                                                    />
                                                                </div>
                                                                <p
                                                                    class="font-bold ms-3 mb-0"
                                                                >
                                                                    Si Cantik
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td class="col-auto">
                                                            <p class=" mb-0">
                                                                Congratulations
                                                                on your
                                                                graduation!
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="col-3">
                                                            <div
                                                                class="d-flex align-items-center"
                                                            >
                                                                <div
                                                                    class="avatar avatar-md"
                                                                >
                                                                    <img
                                                                        src="/assets/dashboard_assets/compiled/jpg/2.jpg"
                                                                    />
                                                                </div>
                                                                <p
                                                                    class="font-bold ms-3 mb-0"
                                                                >
                                                                    Si Ganteng
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td class="col-auto">
                                                            <p class=" mb-0">
                                                                Wow amazing
                                                                design! Can you
                                                                make another
                                                                tutorial for
                                                                this design?
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-3">
                        <div class="card">
                            <div class="card-body py-4 px-4">
                                <div class="d-flex align-items-center">
                                    <div class="avatar avatar-xl">
                                        <img
                                            src="/assets/dashboard_assets/compiled/jpg/1.jpg"
                                            alt="Face 1"
                                        />
                                    </div>
                                    <div class="ms-3 name">
                                        <h5 class="font-bold">John Duck</h5>
                                        <h6 class="text-muted mb-0">
                                            @johnducky
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <h4>Recent Messages</h4>
                            </div>
                            <div class="card-content pb-4">
                                <div class="recent-message d-flex px-4 py-3">
                                    <div class="avatar avatar-lg">
                                        <img
                                            src="/assets/dashboard_assets/compiled/jpg/4.jpg"
                                        />
                                    </div>
                                    <div class="name ms-4">
                                        <h5 class="mb-1">Hank Schrader</h5>
                                        <h6 class="text-muted mb-0">
                                            @johnducky
                                        </h6>
                                    </div>
                                </div>
                                <div class="recent-message d-flex px-4 py-3">
                                    <div class="avatar avatar-lg">
                                        <img
                                            src="/assets/dashboard_assets/compiled/jpg/5.jpg"
                                        />
                                    </div>
                                    <div class="name ms-4">
                                        <h5 class="mb-1">Dean Winchester</h5>
                                        <h6 class="text-muted mb-0">@imdean</h6>
                                    </div>
                                </div>
                                <div class="recent-message d-flex px-4 py-3">
                                    <div class="avatar avatar-lg">
                                        <img
                                            src="/assets/dashboard_assets/compiled/jpg/1.jpg"
                                        />
                                    </div>
                                    <div class="name ms-4">
                                        <h5 class="mb-1">John Dodol</h5>
                                        <h6 class="text-muted mb-0">
                                            @dodoljohn
                                        </h6>
                                    </div>
                                </div>
                                <div class="px-4">
                                    <button
                                        class="btn btn-block btn-xl btn-outline-primary font-bold mt-3"
                                        >Start Conversation</button
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <h4>Visitors Profile</h4>
                            </div>
                            <div class="card-body">
                                <div id="chart-visitors-profile"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <footer>
                <div class="footer clearfix mb-0 text-muted">
                    <div class="float-start">
                        <p>2023 &copy; Mazer</p>
                    </div>
                    <div class="float-end">
                        <p>
                            Crafted with <span class="text-danger"
                                ><i class="bi bi-heart-fill icon-mid"></i></span
                            >
                            by <a href="https://saugi.me">Saugi</a>
                        </p>
                    </div>
                </div>
            </footer>
        {:else if currentPage === "form-layout"}
            <Test_Page />
        {:else if currentPage === "report-generation"}
            <Report_Generation />
        {:else if currentPage === "profile"}
            <Profile />
        {:else if currentPage === "order-detail"}
            <Order_Detail />
        <!-- {:else if currentPage === "auth" && currentSubmenu === "login"}
            <Auth_Login /> -->
        {:else if currentPage === "auth" && currentSubmenu === "register"}
            <Auth_Register />
        {:else if currentPage === "auth" && currentSubmenu === "forgot"}
            <Auth_Forgot_Password />
        {:else if currentPage === "auth" && currentSubmenu === "2fa"}
            <TwoFactorAuthentication />
  {/if}
    </div>
</div>
