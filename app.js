const products = [
  {
    name: "Adidas Shoes",
    price: 160,
    id: 1,
    quantity: 1,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Redbull Energy Drink",
    price: 12,
    id: 2,
    quantity: 1,
    variants: ["Regular", "Sugar Free"],
  },
  {
    name: "Umbrella",
    price: 50,
    id: 3,
    quantity: 1,
    sizes: ["Small", "Medium", "Large"],
  },
  {
    name: "Cat Food",
    price: 100,
    id: 4,
    quantity: 1,
    variants: ["Chicken", "Fish", "Beef"],
  },
  {
    name: "T Shirt",
    price: 30,
    id: 5,
    quantity: 1,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Book",
    price: 10,
    id: 6,
    quantity: 1,
    variants: ["Fiction", "Non-Fiction", "Comics"],
  },
];

const productsHTML = products.map(
  (product) => `<div class="product-card">
        <h2 class="product-name">${product.name}</h2>
        ${product.sizes ? `<select class="product-size">
            <option value="">Select Size</option>
            ${product.sizes
        .map((size) => `<option value="${size}">${size}</option>`)
        .join("")}
        </select>` : ""}
        ${product.variants ? `<select class="product-variant">
            <option value="">Select Variant</option>
            ${product.variants
        .map((variant) => `<option value="${variant}">${variant}</option>`)
        .join("")}
        </select>` : ""}
        <strong>$${product.price}</strong>
        <button class="product-btn" data-id="${product.id}">Add to Cart</button>
    </div>`
);
const result = document.querySelector(".result");
result.innerHTML = productsHTML.join("");


let cart = [];

function updateCart() {
  const cartHTML = cart.map(
    (item) => `<div class="cart-item">
            <h3>${item.name} (${item.selectedSize ? `<span>${item.selectedSize}</span>` : ""}${item.selectedVariant ? `<span>${item.selectedVariant}</span>` : ""})</h3>
            <div class="cart-detail"><div class="mid">
                <button onclick="decrItem('${item.cartId}')">-</button>
                <p>${item.quantity}</p>
                <button onclick="incrItem('${item.cartId}')">+</button>
            </div>
            <p>$${item.price}</p>
            <button onclick="deleteItem('${item.cartId}')" class="cart-product">D</button></div>
           </div>`
  );

  const cartItems = document.querySelector(".cart-items");
  cartItems.innerHTML = cartHTML.join("");
}

function addToCart(products, id, size, variant) {
  const product = products.find((product) => product.id === id);
  if (!product) return;

  if (product.sizes && (!size || size === "")) {
    alert("Please select a size before adding to cart.");
    return;
  }
  if (product.variants && (!variant || variant === "")) {
    alert("Please select a variant before adding to cart.");
    return;
  }

  const cartItem = {
    ...product,
    quantity: 1,
    selectedSize: size || null,
    selectedVariant: variant || null,
  };

  cartItem.cartId = `${cartItem.id}-${cartItem.selectedSize || ""}-${cartItem.selectedVariant || ""}`;

  const existingIndex = cart.findIndex((item) => item.cartId === cartItem.cartId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.unshift(cartItem);
  }

  updateCart();
  getTotal(cart);
}

function attachAddToCartHandlers() {
  const buttons = document.querySelectorAll(".product-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const id = parseInt(btn.dataset.id, 10);
      const card = btn.closest(".product-card");
      const sizeSelect = card ? card.querySelector('.product-size') : null;
      const variantSelect = card ? card.querySelector('.product-variant') : null;
      const size = sizeSelect ? sizeSelect.value : null;
      const variant = variantSelect ? variantSelect.value : null;

      addToCart(products, id, size, variant);
    });
  });
}

attachAddToCartHandlers();

function getTotal(cart) {
  let { totalItem, cartTotal } = cart.reduce(
    (total, cartItem) => {
      total.cartTotal += cartItem.price * cartItem.quantity;
      total.totalItem += cartItem.quantity;
      return total;
    },
    { totalItem: 0, cartTotal: 0 }
  );
  const totalItemsHTML = document.querySelector(".noOfItems");
  totalItemsHTML.innerHTML = `${totalItem} items`;
  const totalAmountHTML = document.querySelector(".total");
  totalAmountHTML.innerHTML = `$${cartTotal}`;
}

function incrItem(cartId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i] && cart[i].cartId == cartId) {
      cart[i].quantity += 1;
      break;
    }
  }
  updateCart();
  getTotal(cart);
}

function decrItem(cartId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].cartId == cartId && cart[i].quantity > 1) {
      cart[i].quantity -= 1;
      break;
    } else if (cart[i].cartId == cartId && cart[i].quantity == 1) {
      cart.splice(i, 1);
      break;
    }
  }
  updateCart();
  getTotal(cart);
}


function deleteItem(cartId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].cartId === cartId) {
      cart.splice(i, 1);
      break;
    }
  }
  updateCart();
  getTotal(cart);
}

function getCartPayload() {
  return cart.map(({ id, name, price, quantity, selectedSize, selectedVariant }) => ({
    id,
    name,
    price,
    quantity,
    selectedSize: selectedSize || null,
    selectedVariant: selectedVariant || null,
  }));
}

const buyBtn = document.querySelector('.buy-btn');
if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    if (!cart.length) {
      alert('Cart is empty');
      return;
    }
    const payload = getCartPayload();
    alert("Cart Payload: " + JSON.stringify(payload, null, 2));
  });
}
