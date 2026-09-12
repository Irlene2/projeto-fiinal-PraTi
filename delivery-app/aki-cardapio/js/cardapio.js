const CART_STORAGE_KEY = "akiLanchesCart";

const state = {
  selectedProduct: null,
  selectedQuantity: 1,
  cart: loadCart()
};

const elements = {
  menuContent: document.getElementById("menuContent"),
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  resultMessage: document.getElementById("resultMessage"),
  emptyState: document.getElementById("emptyState"),

  productModal: document.getElementById("productModal"),
  modalClose: document.getElementById("modalClose"),
  cancelProduct: document.getElementById("cancelProduct"),
  addProductToCart: document.getElementById("addProductToCart"),
  modalProductName: document.getElementById("modalProductName"),
  modalProductCategory: document.getElementById("modalProductCategory"),
  modalProductDescription: document.getElementById("modalProductDescription"),
  modalProductPrice: document.getElementById("modalProductPrice"),
  modalProductImage: document.getElementById("modalProductImage"),
  modalTotal: document.getElementById("modalTotal"),
  decreaseQuantity: document.getElementById("decreaseQuantity"),
  increaseQuantity: document.getElementById("increaseQuantity"),
  quantityValue: document.getElementById("quantityValue"),
  productObservation: document.getElementById("productObservation"),

  cartModal: document.getElementById("cartModal"),
  openCartTop: document.getElementById("openCartTop"),
  openFloatingCart: document.getElementById("openFloatingCart"),
  closeCartModal: document.getElementById("closeCartModal"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  finishOrder: document.getElementById("finishOrder"),

  topCartCount: document.getElementById("topCartCount"),
  sidebarCartCount: document.getElementById("sidebarCartCount"),
  floatingCartCount: document.getElementById("floatingCartCount"),
  floatingCartTotal: document.getElementById("floatingCartTotal"),

  toast: document.getElementById("toast"),
  themeToggle: document.getElementById("themeToggle"),
  themeIcon: document.getElementById("themeIcon"),
  sidebar: document.getElementById("sidebar"),
  openSidebar: document.getElementById("openSidebar"),
  mobileOverlay: document.getElementById("mobileOverlay")
};

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
}

function formatPrice(value) {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getAllProducts() {
  return MENU_CATEGORIES.flatMap(category =>
    category.items.map(item => ({
      ...item,
      categoryId: category.id,
      categoryTitle: category.title
    }))
  );
}

function renderMenu() {
  const searchTerm = elements.searchInput.value.trim().toLowerCase();
  const selectedCategory = elements.categoryFilter.value;

  let totalVisibleItems = 0;

  const html = MENU_CATEGORIES
    .filter(category => {
      return selectedCategory === "todos" || selectedCategory === category.id;
    })
    .map(category => {
      const filteredItems = category.items.filter(item => {
        const searchableText = `${item.name} ${item.description} ${category.title}`.toLowerCase();
        return searchableText.includes(searchTerm);
      });

      if (filteredItems.length === 0) {
        return "";
      }

      totalVisibleItems += filteredItems.length;

      return `
        <section class="menu-category">
          <div class="category-heading">
            <div>
              <h2>${category.title}</h2>
              <p>${category.description}</p>
            </div>
            <span class="category-count">${filteredItems.length} item(ns)</span>
          </div>

          <div class="product-grid">
            ${filteredItems.map(item => createProductCard(item, category)).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  elements.menuContent.innerHTML = html;
  elements.emptyState.classList.toggle("hidden", totalVisibleItems > 0);
  elements.resultMessage.textContent = searchTerm || selectedCategory !== "todos"
    ? `${totalVisibleItems} item(ns) encontrado(s).`
    : "Clique em um item para ver detalhes e adicionar ao carrinho.";

  bindProductCards();
}

function createProductCard(item, category) {
  return `
    <article
      class="product-card"
      tabindex="0"
      role="button"
      data-product-id="${item.id}"
      aria-label="Selecionar ${item.name}"
    >
      <div class="product-card__image">
        <span class="material-symbols-outlined">${item.icon}</span>
      </div>

      <div class="product-card__body">
        <span class="product-card__category">${category.title}</span>
        <h3 class="product-card__title">${item.name}</h3>
        <p class="product-card__description">${item.description}</p>

        <div class="product-card__bottom">
          <strong class="product-card__price">R$ ${formatPrice(item.price)}</strong>
          <button
            class="product-card__add"
            type="button"
            data-product-id="${item.id}"
            aria-label="Adicionar ${item.name}"
          >
            <span class="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function bindProductCards() {
  document.querySelectorAll(".product-card").forEach(card => {
    const productId = card.dataset.productId;

    card.addEventListener("click", event => {
      if (event.target.closest(".product-card__add")) {
        event.stopPropagation();
      }
      openProductModal(productId);
    });

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProductModal(productId);
      }
    });
  });

  document.querySelectorAll(".product-card__add").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      openProductModal(button.dataset.productId);
    });
  });
}

function openProductModal(productId) {
  const product = getAllProducts().find(item => item.id === productId);

  if (!product) {
    showToast("Não foi possível carregar este item.");
    return;
  }

  state.selectedProduct = product;
  state.selectedQuantity = 1;

  elements.modalProductName.textContent = product.name;
  elements.modalProductCategory.textContent = product.categoryTitle;
  elements.modalProductDescription.textContent = product.description;
  elements.modalProductPrice.textContent = formatPrice(product.price);
  elements.modalProductImage.innerHTML = `<span class="material-symbols-outlined">${product.icon}</span>`;
  elements.productObservation.value = "";
  updateQuantityDisplay();

  elements.productModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  elements.productModal.classList.add("hidden");
  document.body.style.overflow = "";
  state.selectedProduct = null;
}

function updateQuantityDisplay() {
  elements.quantityValue.textContent = state.selectedQuantity;
  elements.modalTotal.textContent = formatPrice(
    state.selectedProduct.price * state.selectedQuantity
  );
}

function addSelectedProductToCart() {
  if (!state.selectedProduct) {
    return;
  }

  const observation = elements.productObservation.value.trim();

  const existingItem = state.cart.find(item =>
    item.productId === state.selectedProduct.id &&
    item.observation === observation
  );

  if (existingItem) {
    existingItem.quantity += state.selectedQuantity;
  } else {
    state.cart.push({
      cartId: `${state.selectedProduct.id}-${Date.now()}`,
      productId: state.selectedProduct.id,
      name: state.selectedProduct.name,
      category: state.selectedProduct.categoryTitle,
      price: state.selectedProduct.price,
      quantity: state.selectedQuantity,
      observation
    });
  }

  saveCart();
  updateCartIndicators();
  closeProductModal();
  showToast("Item adicionado ao carrinho!");
}

function getCartQuantity() {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartIndicators() {
  const quantity = getCartQuantity();
  const total = getCartTotal();

  elements.topCartCount.textContent = quantity;
  elements.sidebarCartCount.textContent = quantity;
  elements.floatingCartCount.textContent = quantity;
  elements.floatingCartTotal.textContent = formatPrice(total);
}

function openCartModal() {
  renderCart();
  elements.cartModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCartModal() {
  elements.cartModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderCart() {
  if (state.cart.length === 0) {
    elements.cartItems.innerHTML = `
      <div class="cart-empty">
        <span class="material-symbols-outlined">shopping_cart</span>
        <strong>Seu carrinho está vazio.</strong>
        <p>Adicione algum item do cardápio para continuar.</p>
      </div>
    `;
    elements.cartTotal.textContent = "0,00";
    elements.finishOrder.disabled = true;
    elements.finishOrder.style.opacity = ".55";
    elements.finishOrder.style.cursor = "not-allowed";
    return;
  }

  elements.finishOrder.disabled = false;
  elements.finishOrder.style.opacity = "1";
  elements.finishOrder.style.cursor = "pointer";

  elements.cartItems.innerHTML = state.cart.map(item => `
    <article class="cart-item">
      <div>
        <h3>${item.name}</h3>
        <p>${item.category}</p>
        ${item.observation ? `<p><strong>Obs.:</strong> ${item.observation}</p>` : ""}
      </div>

      <strong class="cart-item-price">R$ ${formatPrice(item.price * item.quantity)}</strong>

      <div class="cart-item-footer">
        <span class="cart-item-quantity">Quantidade: ${item.quantity}</span>
        <button class="remove-item" type="button" data-cart-id="${item.cartId}">
          Remover
        </button>
      </div>
    </article>
  `).join("");

  elements.cartTotal.textContent = formatPrice(getCartTotal());

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      state.cart = state.cart.filter(item => item.cartId !== button.dataset.cartId);
      saveCart();
      updateCartIndicators();
      renderCart();
      showToast("Item removido do carrinho.");
    });
  });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");

  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 2800);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("akiLanchesTheme", isDark ? "dark" : "light");
  elements.themeIcon.textContent = isDark ? "light_mode" : "dark_mode";
  elements.themeToggle.querySelector("span:last-child").textContent = isDark
    ? "Modo claro"
    : "Modo escuro";
}

function loadTheme() {
  const savedTheme = localStorage.getItem("akiLanchesTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    elements.themeIcon.textContent = "light_mode";
    elements.themeToggle.querySelector("span:last-child").textContent = "Modo claro";
  }
}

function closeSidebar() {
  elements.sidebar.classList.remove("open");
  elements.mobileOverlay.classList.add("hidden");
}

function openSidebar() {
  elements.sidebar.classList.add("open");
  elements.mobileOverlay.classList.remove("hidden");
}

elements.searchInput.addEventListener("input", renderMenu);
elements.categoryFilter.addEventListener("change", renderMenu);

elements.modalClose.addEventListener("click", closeProductModal);
elements.cancelProduct.addEventListener("click", closeProductModal);
elements.addProductToCart.addEventListener("click", addSelectedProductToCart);

elements.decreaseQuantity.addEventListener("click", () => {
  if (state.selectedQuantity > 1) {
    state.selectedQuantity--;
    updateQuantityDisplay();
  }
});

elements.increaseQuantity.addEventListener("click", () => {
  if (state.selectedQuantity < 20) {
    state.selectedQuantity++;
    updateQuantityDisplay();
  }
});

elements.openCartTop.addEventListener("click", openCartModal);
elements.openFloatingCart.addEventListener("click", openCartModal);
elements.closeCartModal.addEventListener("click", closeCartModal);

elements.finishOrder.addEventListener("click", () => {
  if (state.cart.length === 0) {
    showToast("Adicione itens antes de continuar.");
    return;
  }

  showToast("Carrinho pronto! Integre esta ação à tela de checkout.");
});

elements.themeToggle.addEventListener("click", toggleTheme);
elements.openSidebar.addEventListener("click", openSidebar);
elements.mobileOverlay.addEventListener("click", closeSidebar);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeProductModal();
    closeCartModal();
    closeSidebar();
  }
});

loadTheme();
renderMenu();
updateCartIndicators();
