function initTheme() {
  const theme = localStorage.getItem('theme');
  if (theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}

// Expose to window
window.initTheme = initTheme;