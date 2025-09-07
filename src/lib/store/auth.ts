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

// Function to load user info from local storage on app initialization
export function loadUser(): void {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
        user.set(JSON.parse(storedUser));
        isAuthenticated.set(true);
    }
}
