const API_URL = "http://127.0.0.1:8000";

interface UserData {
  full_name: string;
  email: string;
  password: string;
  // phone?: string;
  // address?: string;
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
  const result = await response.json();
  return result;
}

export async function getProtectedData(access_token: string) {
  const response = await fetch(`${API_URL}/protected`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    credentials: "include",
  });
  return response;
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refresh_token }),
  });

  const data = await response.json();
  if (data.access) {
    localStorage.setItem("access_token", data.access);
  }
  return data;
}

export async function sendOTP(email: string) {
  const res = await fetch("http://localhost:8000/auth/send-otp/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  console.log(res);
  return await res.json();
}

// verifyOtp.ts
export async function verifyOTP(userData: UserData, otp: string) {
  const res = await fetch("http://localhost:8000/auth/verify-otp/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userData, otp }),
  });

  const data = await res.json();
  return { status: res.status, ...data };
}

// password reset link

export async function sendPasswordResetEmail(email: string) {
  const res = await fetch(
    "http://localhost:8000/auth/send-password-reset-link/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );
  return res.json();
}

// Invoice email sending
export async function sendInvoiceEmail(emailData: {
  to: string;
  cc?: string;
  subject: string;
  message: string;
  invoiceId: string;
  invoiceData: any;
}) {
  const res = await fetch("http://localhost:8000/api/send-invoice-email/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emailData),
  });
  return res.json();
}
