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
    import {
        User,
        House,
        LayoutGrid,
        FlaskConical,
        PackageOpen,
        NotebookPen,
        AtSign,
        MessageCircleCode,
        BadgeIndianRupee,
        ShoppingCart,
        ShieldUser,
        Settings

    } from "lucide-svelte";

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
    $: if (typeof window !== "undefined" && dashboardScriptsLoaded) {
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
</script>

<svelte:head>
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
    <div id="sidebar">
        <div class="sidebar-wrapper active">
            <div class="sidebar-header position-relative">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="logo">
                        <a href="/dashboard"
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
                        <!-- Theme toggle icons and switch -->
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
                    <li class="sidebar-item">
                        <a href="/" class="sidebar-link">
                            <House />
                            <span>Home</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="/dashboard" class="sidebar-link">
                            <LayoutGrid />
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="/dashboard/profile" class="sidebar-link">
                            <User />
                            <span>Profile</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="/dashboard/test-page" class="sidebar-link">
                            <FlaskConical />
                            <span>Test Page</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="/dashboard/order-detail" class="sidebar-link">
                            <PackageOpen />
                            <span>Order Detail</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a
                            href="/dashboard/report-generation"
                            class="sidebar-link"
                        >
                            <NotebookPen />
                            <span>Report Generation</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a
                            href="/dashboard/application-chat.html"
                            class="sidebar-link"
                        >
                            <MessageCircleCode />
                            <span>Email Application</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="/dashboard/invoice" class="sidebar-link">
                            <BadgeIndianRupee />
                            <span>Invoice</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a
                            href="/dashboard/application-checkout.html"
                            class="sidebar-link"
                        >
                            <ShoppingCart />
                            <span>Checkout Page</span>
                        </a>
                    </li>
                    <li class="sidebar-item has-sub">
                        <a href="#" class="sidebar-link">
                            <ShieldUser />
                            <span>Authentication</span>
                        </a>
                        <ul class="submenu">
                            <li class="submenu-item">
                                <a
                                    href="/dashboard/auth/login"
                                    class="sidebar-link">Login</a
                                >
                            </li>
                            <li class="submenu-item">
                                <a
                                    href="/dashboard/auth/register"
                                    class="sidebar-link">Register</a
                                >
                            </li>
                            <li class="submenu-item">
                                <a
                                    href="/dashboard/auth/forgot"
                                    class="sidebar-link">Forgot Password</a
                                >
                            </li>
                            <li class="submenu-item">
                                <a
                                    href="/dashboard/auth/2fa"
                                    class="sidebar-link"
                                    >Two-Factor Authentication</a
                                >
                            </li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a href="#" class="sidebar-link">
                            <Settings />
                            <span>Settings</span>
                        </a>
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
        <slot />
    </div>
</div>
