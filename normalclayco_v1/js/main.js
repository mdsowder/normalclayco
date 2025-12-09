// ---------- CART STORAGE HELPERS ----------

function getCart() {
  try {
    const raw = localStorage.getItem("ncc-cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem("ncc-cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cartCountEl = document.getElementById("cartCount");
  if (!cartCountEl) return;
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = count;
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  setCart(cart);
  updateCartCount();
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  setCart(cart);
  updateCartCount();
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    const filtered = cart.filter((i) => i.id !== productId);
    setCart(filtered);
  } else {
    setCart(cart);
  }
  updateCartCount();
}

// ---------- TOAST & CART SETUP ----------

function setupCart() {
  const toastEl = document.getElementById("toast");
  const toastMessageEl = document.getElementById("toastMessage");

  function showToast(message) {
    if (!toastEl || !toastMessageEl) return;
    toastMessageEl.textContent = message;
    toastEl.classList.add("visible");
    setTimeout(() => toastEl.classList.remove("visible"), 2000);
  }

  // delegate "add to basket" + quantity controls
  document.body.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add-to-cart]");
    if (addBtn && Array.isArray(products)) {
      const productId = addBtn.getAttribute("data-product-id");
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      addToCart(productId);
      showToast(`${product.name} tucked into your basket.`);
      return;
    }

    const incBtn = e.target.closest("[data-qty-plus]");
    if (incBtn && Array.isArray(products)) {
      const id = incBtn.getAttribute("data-qty-plus");
      changeQty(id, +1);
      renderBasket(document.getElementById("basketContainer"));
      showToast("Updated your basket.");
      return;
    }

    const decBtn = e.target.closest("[data-qty-minus]");
    if (decBtn && Array.isArray(products)) {
      const id = decBtn.getAttribute("data-qty-minus");
      changeQty(id, -1);
      renderBasket(document.getElementById("basketContainer"));
      showToast("Updated your basket.");
      return;
    }

    const rmBtn = e.target.closest("[data-remove-from-cart]");
    if (rmBtn && Array.isArray(products)) {
      const id = rmBtn.getAttribute("data-remove-from-cart");
      removeFromCart(id);
      renderBasket(document.getElementById("basketContainer"));
      showToast("Removed from basket.");
      return;
    }
  });

  updateCartCount();
}

// ---------- PRODUCT GRID ----------

function renderProductGrid(container) {
  if (!container || !Array.isArray(products)) return;

  container.innerHTML = "";
  products.forEach((p) => {
    const article = document.createElement("article");
    article.className = "product-card";
    const availability =
      p.stock > 1 ? `In stock · ${p.stock} available` : "Low stock · 1 left";

    article.innerHTML = `
        <div class="product-media">
          <img src="${p.image}" alt="${p.name}" class="product-photo" />
        </div>
        <div class="product-body">
          <span class="product-name">${p.name}</span>
          <span class="product-price">$${p.price}</span>
          <p class="product-meta">${p.blurb}</p>
          <span class="badge-availability">${availability}</span>
          <div class="product-actions">
            <button class="btn"
                    style="padding:0.4rem 0.9rem;"
                    data-add-to-cart
                    data-product-id="${p.id}">
              Add to basket
            </button>
            <a class="btn-ghost" href="product.html?id=${encodeURIComponent(
              p.id
            )}">
              Details
            </a>
          </div>
        </div>
      `;
    container.appendChild(article);
  });
}

// ---------- PRODUCT DETAIL ----------

function renderProductDetail() {
  if (!Array.isArray(products)) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = products.find((p) => p.id === id);

  const titleEl = document.getElementById("productTitle");
  const imageEl = document.getElementById("productImage");
  const priceEl = document.getElementById("productPrice");
  const blurbEl = document.getElementById("productBlurb");
  const sizeEl = document.getElementById("productSize");
  const careEl = document.getElementById("productCare");
  const detailsEl = document.getElementById("productDetails");
  const availabilityEl = document.getElementById("productAvailability");
  const addBtn = document.getElementById("productAddButton");

  if (!product) {
    if (titleEl) titleEl.textContent = "That piece has wandered off.";
    if (blurbEl) {
      blurbEl.textContent =
        "It looks like this listing isn’t available anymore. Feel free to peek at the rest of the shop.";
    }
    return;
  }

  if (titleEl) titleEl.textContent = product.name;
  document.title = `${product.name} – Normal Clay Co.`;
  if (imageEl) {
    imageEl.src = product.image;
    imageEl.alt = product.name;
  }
  if (priceEl) priceEl.textContent = `$${product.price}`;
  if (blurbEl) blurbEl.textContent = product.blurb;
  if (sizeEl) sizeEl.textContent = product.size;
  if (careEl) careEl.textContent = product.care;
  if (detailsEl) detailsEl.textContent = product.details;
  if (availabilityEl) {
    availabilityEl.textContent =
      product.stock > 1
        ? `In stock · ${product.stock} available`
        : "Low stock · 1 left";
  }
  if (addBtn) {
    addBtn.setAttribute("data-add-to-cart", "true");
    addBtn.setAttribute("data-product-id", product.id);
  }
}

// ---------- BASKET PAGE RENDER ----------

function renderBasket(container) {
  if (!container || !Array.isArray(products)) return;

  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
        <p style="margin-bottom:0.75rem;">
          Your basket is currently empty. That’s okay — sometimes looking is enough.
        </p>
        <a href="shop.html" class="btn btn-primary">Browse the current batch</a>
      `;
    return;
  }

  let total = 0;

  const rows = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return "";
      const lineTotal = product.price * item.qty;
      total += lineTotal;
      return `
          <div class="basket-row">
            <div class="basket-main">
              <div class="basket-thumb">
                <img src="${product.image}" alt="${product.name}" />
              </div>
              <div>
                <div class="product-name" style="margin-bottom:0.2rem;">${
                  product.name
                }</div>
                <div style="font-size:0.85rem; color:#60675c;">$${
                  product.price
                } each</div>
                <div class="basket-qty-controls">
                  <button type="button" data-qty-minus="${
                    product.id
                  }">–</button>
                  <span>${item.qty}</span>
                  <button type="button" data-qty-plus="${product.id}">+</button>
                  <button type="button" data-remove-from-cart="${
                    product.id
                  }" class="basket-remove">
                    remove
                  </button>
                </div>
              </div>
            </div>
            <div class="basket-line-total">$${lineTotal.toFixed(2)}</div>
          </div>
        `;
    })
    .join("");

  container.innerHTML = `
      <div class="basket-list">
        ${rows}
      </div>
      <div class="basket-summary">
        <div class="basket-summary-row">
          <span>Estimated total</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <p class="basket-note">
          This doesn’t include shipping yet. Real checkout will plug in here once payments are set up.
        </p>
        <a href="shop.html" class="btn btn-secondary">Keep browsing</a>
      </div>
    `;
}

// ---------- FOOTER YEAR ----------

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setupCart();
  setYear();
});
