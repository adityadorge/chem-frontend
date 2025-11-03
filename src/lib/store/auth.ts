// src/lib/stores/auth.ts

import { writable } from 'svelte/store';

// Define the user interface (TS)
interface User {
  id: number;
  email: string;
  name: string;
  access_token: string;
  refresh_token: string;
}

// Define the store for user info
export const user = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);

// Function to set user info in local storage and update the store
export function setUser(newUser: User): void {
    user.set(newUser);
    isAuthenticated.set(true);
    localStorage.setItem('user', JSON.stringify(newUser));    
}


// Function to clear user info from local storage and update the store
export function clearUser(): void {
    user.set(null);
    isAuthenticated.set(false);
    localStorage.removeItem('user');
}

export function loadUser(): void {
  if (typeof window === 'undefined') return; // Prevent SSR errors

  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      user.set(parsed);
      isAuthenticated.set(true);
    } catch {
      localStorage.removeItem('user'); // corrupted data
    }
  }
}

export const currentOrderId = writable<string | null>(
  typeof window !== 'undefined' ? localStorage.getItem("current_order_id") : null
);

if (typeof window !== 'undefined') {
  currentOrderId.subscribe((value) => {
    if (value) localStorage.setItem("current_order_id", value);
    else localStorage.removeItem("current_order_id");
  });
}