(() => {
  let cart = [];
  const count = document.getElementById("cartCount");
  const items = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("cartTotal");

  if (!items) return;

  const money = value => value.toLocaleString("pt-BR", {style:"currency", currency:"BRL"});

  function render() {
    if (!cart.length) {
      items.innerHTML = `<div class="empty-cart"><span>🛒</span><p>Seu carrinho está vazio.</p><small>Adicione produtos para começar.</small></div>`;
    } else {
      items.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <span>${item.name} x${item.quantity}</span>
          <strong>${money(item.price * item.quantity)}</strong>
          <button class="btn-small" data-remove="${index}">Remover</button>
        </div>`).join("");
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const fee = cart.length ? 5 : 0;
    if (count) count.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (subtotalEl) subtotalEl.textContent = money(subtotal);
    if (totalEl) totalEl.textContent = money(subtotal + fee);
  }

  document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".shop-product");
      const name = card.dataset.name;
      const price = Number(button.dataset.price);
      const existing = cart.find(item => item.name === name);
      if (existing) existing.quantity++;
      else cart.push({name, price, quantity:1});
      render();
    });
  });

  items.addEventListener("click", event => {
    const btn = event.target.closest("[data-remove]");
    if (!btn) return;
    cart.splice(Number(btn.dataset.remove), 1);
    render();
  });

  const search = document.getElementById("searchProduct");
  if (search) {
    search.addEventListener("input", () => {
      const value = search.value.toLowerCase().trim();
      document.querySelectorAll(".shop-product").forEach(card => {
        card.hidden = !card.dataset.name.toLowerCase().includes(value);
      });
    });
  }

  render();
})();