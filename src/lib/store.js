import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

let persistedUser = null;

if (browser) {
	try {
		const stored = localStorage.getItem('user');
		persistedUser = stored ? JSON.parse(stored) : null;
	} catch (e) {
		console.error('Failed to parse localStorage user', e);
		localStorage.removeItem('user');
	}
}

export const user = writable(persistedUser);

if (browser) {
	user.subscribe((value) => {
		if (value) {
			localStorage.setItem('user', JSON.stringify(value));
		} else {
			localStorage.removeItem('user');
		}
	});
}

// Derived store to track auth status
export const isAuthenticated = derived(user, ($user) => !!$user?.access_token);
