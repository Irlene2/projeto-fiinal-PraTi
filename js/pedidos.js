(() => {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const cartCount = Number(document.getElementById("cartCount")?.textContent || 0);

    if (cartCount === 0) {
      alert("Adicione pelo menos um produto ao carrinho.");
      return;
    }

    alert("Pedido confirmado com sucesso! 🎉");
    form.reset();
  });
})();