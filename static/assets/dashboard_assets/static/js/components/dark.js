const THEME_KEY = "theme";

function setTheme(theme, persist = false) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  if (persist) {
    localStorage.setItem(THEME_KEY, theme);
  }
}

function initTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    setTheme(storedTheme);
  } else if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) =>
      setTheme(e.matches ? "dark" : "light", true)
    );
    setTheme(mediaQuery.matches ? "dark" : "light", true);
  }

  // Attach event listener to the toggle
  const toggler = document.getElementById("toggle-dark");
  const theme = localStorage.getItem(THEME_KEY);
  if (toggler) {
    toggler.checked = theme === "dark";
    // Remove previous listener if any
    toggler.removeEventListener("input", toggler._themeListener || (() => {}));
    toggler._themeListener = function (e) {
      setTheme(e.target.checked ? "dark" : "light", true);
    };
    toggler.addEventListener("input", toggler._themeListener);
  }
}

window.setTheme = setTheme;
window.initTheme = initTheme;