export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// Global fetch patch to bypass ngrok warning and normalize URLs
if (typeof window !== "undefined") {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let urlStr = typeof input === "string" ? input : input.toString();
    const isAbsolute = /^https?:\/\//i.test(urlStr);
    const isNgrok = (isAbsolute ? new URL(urlStr) : new URL(API_URL + "/")).host.includes("ngrok-free.app");

    // If calling our API base without trailing slash, add it for DRF
    try {
      const u = new URL(urlStr, isAbsolute ? undefined : API_URL + "/");
      const isApiHost = u.origin === API_URL || u.origin === new URL(API_URL).origin;
      const noExt = !/\.[a-z0-9]+$/i.test(u.pathname);
      if (isApiHost && !u.pathname.endsWith("/") && noExt) {
        u.pathname += "/";
      }
      // Add ngrok bypass (use only query param to avoid CORS preflight)
      if (u.host.includes("ngrok-free.app")) {
        // REMOVE header injection to prevent preflight failure
        // const headers = new Headers(init?.headers || {});
        // headers.set("ngrok-skip-browser-warning", "true");
        // init = { ...init, headers };
        if (!u.searchParams.has("ngrok-skip-browser-warning")) {
          u.searchParams.set("ngrok-skip-browser-warning", "true");
        }
      }
      urlStr = u.toString();
    } catch {
      // ignore URL parse errors; fall back to original urlStr
    }

    return originalFetch(urlStr, init);
  };
}

interface UserData {
  full_name: string;
  email: string;
  password: string;
}

interface Credentials {
  email: string;
  password: string;
}

export async function registerUser(userData: UserData) {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });
  return response.json();
}

export async function loginUser(credentials: Credentials) {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function getProtectedData(access_token: string) {
  return fetch(`${API_URL}/protected`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    credentials: "include",
  });
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");
  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refresh_token }),
  });
  const data = await response.json();
  if (data.access) localStorage.setItem("access_token", data.access);
  return data;
}

export async function sendOTP(email: string) {
  const res = await fetch(`${API_URL}/auth/send-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyOTP(userData: UserData, otp: string) {
  const res = await fetch(`${API_URL}/auth/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userData, otp }),
  });
  const data = await res.json();
  return { status: res.status, ...data };
}

export async function sendPasswordResetEmail(email: string) {
  const res = await fetch(`${API_URL}/auth/send-password-reset-link/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function sendInvoiceEmail(emailData: {
  to: string;
  cc?: string;
  subject: string;
  message: string;
  invoiceId: string;
  invoiceData: any;
}) {
  const res = await fetch(`${API_URL}/api/send-invoice-email/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emailData),
  });
  return res.json();
}
