(() => {
  const key = "delivery-theme";
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-theme-toggle]");

  const saved = localStorage.getItem(key);
  if (saved === "dark") root.setAttribute("data-theme", "dark");

  function updateIcons() {
    const dark = root.getAttribute("data-theme") === "dark";
    buttons.forEach(btn => btn.textContent = dark ? "☀️" : "🌙");
  }

  buttons.forEach(btn => btn.addEventListener("click", () => {
    const dark = root.getAttribute("data-theme") === "dark";
    if (dark) {
      root.removeAttribute("data-theme");
      localStorage.setItem(key, "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem(key, "dark");
    }
    updateIcons();
  }));

  updateIcons();
})();