(() => {
  const button = document.getElementById("mobileMenu");
  const sidebar = document.getElementById("sidebar");
  if (!button || !sidebar) return;

  button.addEventListener("click", () => sidebar.classList.toggle("open"));

  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      sidebar.classList.remove("open");
    });
  });
})();