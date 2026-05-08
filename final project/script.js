var header = document.querySelector("header");
var cartKey = "spec-zone-cart";

window.addEventListener("scroll", function () {
  if (window.scrollY > 40) {
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
});

function getCart() {
  var cart = localStorage.getItem(cartKey);

  if (cart == null) {
    return [];
  }

  try {
    cart = JSON.parse(cart);
  } catch (error) {
    cart = [];
  }

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].quantity == null) {
      cart[i].quantity = cart[i].qty || 1;
    }

    if (cart[i].details == null) {
      cart[i].details = "Spec Zone product";
    }

    if (cart[i].image == null) {
      cart[i].image = "assets/logo-header.png";
    }
  }

  return cart;
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  var cart = getCart();
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    total = total + cart[i].quantity;
  }

  var counters = document.querySelectorAll(".cart-count");
  for (var c = 0; c < counters.length; c++) {
    counters[c].textContent = total;
  }
}

function getPriceNumber(priceText) {
  return Number(priceText.replace("EGP", "").replaceAll(",", "").trim());
}

function addProductToCart(productCard) {
  var name = productCard.querySelector("h3").textContent;
  var details = productCard.querySelector("p").textContent;
  var price = getPriceNumber(productCard.querySelector("strong").textContent);
  var image = productCard.querySelector("img").src;
  var cart = getCart();
  var found = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].quantity = cart[i].quantity + 1;
      found = true;
    }
  }

  if (found === false) {
    cart.push({
      name: name,
      details: details,
      price: price,
      image: image,
      quantity: 1
    });
  }

  saveCart(cart);
}

function setupAddToCartButtons() {
  var buttons = document.querySelectorAll(".add-to-cart");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (event) {
      event.preventDefault();

      var productCard = this.closest(".product");
      addProductToCart(productCard);

      this.textContent = "Added";
      this.classList.add("added");

      var button = this;
      setTimeout(function () {
        button.textContent = "Add to Cart";
        button.classList.remove("added");
      }, 900);
    });
  }
}

function renderCart() {
  var cartBox = document.getElementById("cart-items");
  var countBox = document.getElementById("summary-count");
  var totalBox = document.getElementById("summary-total");

  if (cartBox == null) {
    return;
  }

  var cart = getCart();
  var totalPrice = 0;
  var totalCount = 0;

  if (cart.length === 0) {
    cartBox.innerHTML = '<div class="empty-cart"><h2>Your Cart is Empty</h2><p>Start shopping and your products will appear here.</p><a class="button" href="laptops.html">Shop Products</a></div>';
    countBox.textContent = "0";
    totalBox.textContent = "EGP 0";
    return;
  }

  cartBox.innerHTML = "";

  for (var i = 0; i < cart.length; i++) {
    totalPrice = totalPrice + cart[i].price * cart[i].quantity;
    totalCount = totalCount + cart[i].quantity;

    cartBox.innerHTML +=
      '<div class="cart-item">' +
        '<img src="' + cart[i].image + '" alt="' + cart[i].name + '">' +
        '<div class="cart-details">' +
          '<h3>' + cart[i].name + '</h3>' +
          '<p>' + cart[i].details + '</p>' +
          '<strong>EGP ' + cart[i].price.toLocaleString() + '</strong>' +
        '</div>' +
        '<div class="cart-controls">' +
          '<button class="qty-btn" data-action="minus" data-name="' + cart[i].name + '">-</button>' +
          '<span>' + cart[i].quantity + '</span>' +
          '<button class="qty-btn" data-action="plus" data-name="' + cart[i].name + '">+</button>' +
          '<button class="remove-btn" data-action="remove" data-name="' + cart[i].name + '">Remove</button>' +
        '</div>' +
      '</div>';
  }

  countBox.textContent = totalCount;
  totalBox.textContent = "EGP " + totalPrice.toLocaleString();
}

function changeCartItem(name, action) {
  var cart = getCart();
  var newCart = [];

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      if (action === "plus") {
        cart[i].quantity = cart[i].quantity + 1;
      }

      if (action === "minus") {
        cart[i].quantity = cart[i].quantity - 1;
      }

      if (action !== "remove" && cart[i].quantity > 0) {
        newCart.push(cart[i]);
      }
    } else {
      newCart.push(cart[i]);
    }
  }

  saveCart(newCart);
  renderCart();
}

function setupCartPage() {
  document.addEventListener("click", function (event) {
    var action = event.target.getAttribute("data-action");
    var name = event.target.getAttribute("data-name");

    if (action != null && name != null) {
      changeCartItem(name, action);
    }
  });

  var clearBtn = document.getElementById("clear-cart");
  if (clearBtn != null) {
    clearBtn.addEventListener("click", function () {
      localStorage.removeItem(cartKey);
      updateCartCount();
      renderCart();
    });
  }

  var checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn != null) {
    checkoutBtn.addEventListener("click", function () {
      if (getCart().length === 0) {
        alert("Your cart is empty.");
      } else {
        alert("Order sent successfully. Spec Zone will contact you soon.");
      }
    });
  }
}

function setupForms() {
  var forms = document.querySelectorAll("form");

  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Done successfully.");
    });
  }
}

function setupProductFilter() {
  var searchInput = document.getElementById("product-search");
  var categoryFilter = document.getElementById("category-filter");
  var products = document.querySelectorAll(".product");

  if (searchInput == null || categoryFilter == null) {
    return;
  }

  function filterProducts() {
    var searchText = searchInput.value.toLowerCase();
    var category = categoryFilter.value;

    for (var i = 0; i < products.length; i++) {
      var productText = products[i].textContent.toLowerCase();
      var productCategory = products[i].getAttribute("data-category");
      var matchesSearch = productText.indexOf(searchText) !== -1;
      var matchesCategory = category === "all" || productCategory === category;

      if (matchesSearch && matchesCategory) {
        products[i].classList.remove("hidden-product");
      } else {
        products[i].classList.add("hidden-product");
      }
    }
  }

  searchInput.addEventListener("keyup", filterProducts);
  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
}

function setupProductHover() {
  var products = document.querySelectorAll(".product");

  for (var i = 0; i < products.length; i++) {
    products[i].addEventListener("mouseenter", function () {
      this.classList.add("product-hover");
    });

    products[i].addEventListener("mouseleave", function () {
      this.classList.remove("product-hover");
    });
  }
}

function setupActiveLink() {
  var pageName = window.location.pathname.split("/").pop();
  if (pageName === "") {
    pageName = "index.html";
  }

  var links = document.querySelectorAll("nav a");

  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute("href") === pageName) {
      links[i].classList.add("active-link");
    }
  }
}

setupActiveLink();
setupProductFilter();
setupProductHover();
setupAddToCartButtons();
setupCartPage();
setupForms();
updateCartCount();
renderCart();
