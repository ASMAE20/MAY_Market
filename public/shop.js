const categories = document.querySelectorAll('.sub-categories li');
const productsContainer = document.getElementById('products-container');

window.onload = () => {
  products.forEach((product, index) => {
    renderProduct(product, index);
  });
};

categories.forEach((category) => {
  category.addEventListener('click', (event) => {
    productsContainer.innerHTML = '';
    const cat = event.target.textContent;
    const products = filterProducts(cat);

    products.forEach((product, index) => {
      renderProduct(product, index);
    });
  });
});

function filterProducts(category) {
  return products.filter((product) => product.category === category);
}

function renderProduct(product, index) {
  const productElement = document.createElement('div');
  productElement.classList.add('product');
  productElement.style.animationDelay = `${index * 200}ms`;

  productElement.innerHTML = `
    <h1 class="product-title">${
      product.name.substr(0, 25) + (product.name.length > 25 ? '...' : '')
    }</h1>
    <img
      src="${product.image}"
      alt="product image"
      class="product-img"
    />
    ${
      product.discount ? `<div class="discount">${product.discount}%</div>` : ''
    }
    
    <div class="price-info">
      <div class="prices">
        ${
          product.discount
            ? `
        <div class="discounted-price">
          ${(product.price - product.price * (product.discount / 100)).toFixed(
            2
          )} <span class="small">MAD</span>
        </div>
        <div class="original-price">
          ${product.price.toFixed(2)} <span class="small">MAD</span>
        </div>
        `
            : `<div>${product.price.toFixed(
                2
              )} <span class="small">MAD</span></div>`
        }
      </div>
      <div class="add-to-cart" onclick="addCartClicked(event)">
        <i class="fa fa-bag-shopping"></i>
      </div>
    </div>
    <div class="stock ${product.inStock ? 'in' : 'out'}">${
    product.inStock ? 'In Stock' : 'Out Of Stock'
  }</div>
  `;

  productsContainer.appendChild(productElement);
}

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  var removeCartButtons = document.getElementsByClassName('cart-remove');
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener('click', removeCartItem);
  }
  var quantityInputs = document.getElementsByClassName('cart-quantity');
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
  }
}
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updatetotal();
}
function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updatetotal();
}
function addCartClicked(event) {
  var button = event.target;

  var product = button.parentElement.parentElement.parentElement;
  var title = product.querySelector('.product-title').textContent;
  var priceElement = product.querySelector('.discounted-price');
  var price;
  if (priceElement) {
    price = priceElement.textContent;
  } else {
    price = product.querySelector('.original-price').textContent;
  }
  var productImg = product.querySelector('.product-img').src;

  addProductToCart(title, price, productImg);
  updatetotal();
}
function addProductToCart(title, price, productImg) {
  var cartShopBox = document.createElement('div');
  cartShopBox.classList.add('cart-box');
  var cartItems = document.getElementsByClassName('cart-content')[0];
  var cartItemsNames = cartItems.getElementsByClassName('cart-product-title');

  var cartBoxContent = ` <img
    src="${productImg}"
    alt=""
    class="cart-img"
    />
    <div class="detail-box">
    <div class="cart-product-title">${title}</div>
    <div class="cart-price">${price}</div>
    <input type="number" value="1" class="cart-quantity" />
    </div>
    <i class="fa-solid fa-trash cart-remove"></i>`;
  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox);
  cartShopBox
    .getElementsByClassName('cart-remove')[0]
    .addEventListener('click', removeCartItem);
  cartShopBox
    .getElementsByClassName('cart-quantity')[0]
    .addEventListener('change', quantityChanged);
}

function updatetotal() {
  var cartContent = document.getElementsByClassName('cart-content')[0];
  var cartBoxes = cartContent.getElementsByClassName('cart-box');
  var total = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName('cart-price')[0];
    var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
    var price = parseFloat(priceElement.innerText.replace('MAD', ''));
    var quantity = quantityElement.value;
    total = total + price * quantity;
    total = Math.round(total * 100) / 100;
    document.querySelectorAll('.total-price').textContent = total + 'MAD';
  }
}
