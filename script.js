document.addEventListener("DOMContentLoaded", () => {
    const cart = [];
    const cartItemsContainer = document.getElementById("cart-items");
    const totalItemsElement = document.getElementById("total-items");
    const paniervide = document.getElementById("paniervide");
    const cartTotalElement = document.getElementById("cart-total");
    const emptyCartMessage = document.getElementById("empty-cart-message");
    const orderTotal = document.querySelector(".order-total");
    const confirmOrderButton = document.querySelector(".confirm-order");
    const panier = document.querySelector(".Panier");
  
    if (!cartItemsContainer) console.error('Element "cart-items" is missing.');
    if (!totalItemsElement) console.error('Element "total-items" is missing.');
    if (!cartTotalElement) console.error('Element "cart-total" is missing.');
    if (!emptyCartMessage) console.error('Element "empty-cart-message" is missing.');
    if (!orderTotal) console.error('Element "order-total" is missing.');
    if (!confirmOrderButton) console.error('Element "confirm-order" is missing.');
    if (!panier) console.error('Element "Panier" is missing.');
  
    document.querySelectorAll(".btnAdd").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = parseFloat(button.dataset.productPrice);
  
        addToCart(productId, productName, productPrice);
  
        const productInCart = cart.find((item) => item.id === productId);
        if (productInCart.quantity === 1) {
          updateQuantityButton(button, productId, productName, productPrice);
        } else {
          updateQuantityDisplay(productId, productInCart.quantity);
        }
      });
    });
  
    function createAddToCartButton(productId, productName, productPrice) {
      const button = document.createElement("button");
      button.className = "btnAdd";
      button.dataset.productId = productId;
      button.dataset.productName = productName;
      button.dataset.productPrice = productPrice;
  
      const icon = document.createElement("img");
      icon.className = "svg";
      icon.src = "/assets/images/icon-add-to-cart.svg";
      icon.alt = "Add to Cart Icon";
  
      const buttonText = document.createTextNode(" Add to Cart");
  
      button.appendChild(icon);
      button.appendChild(buttonText);
  
      button.addEventListener("click", () => {
        addToCart(productId, productName, productPrice);
        updateQuantityButton(button, productId, productName, productPrice);
      });
  
      return button;
    }
  
    function updateQuantityButton(button, productId, productName, productPrice) {
      const quantityContainer = document.createElement("div");
      quantityContainer.className = "btnQuantity";
      quantityContainer.dataset.productId = productId;
  
      const btnMinus = document.createElement("button");
      btnMinus.className = "btnMinus";
      btnMinus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" viewBox="0 0 10 2">
                              <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z"/>
                            </svg>`;
  
      const quantitySpan = document.createElement("span");
      quantitySpan.className = "quantity";
      quantitySpan.textContent = "1";
  
      const btnPlus = document.createElement("button");
      btnPlus.className = "btnPlus";
      btnPlus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
                             <path fill="currentColor" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
                           </svg>`;
  
      quantityContainer.appendChild(btnMinus);
      quantityContainer.appendChild(quantitySpan);
      quantityContainer.appendChild(btnPlus);
  
      button.parentElement.replaceChild(quantityContainer, button);
  
      btnPlus.addEventListener("click", () => {
        addToCart(productId, productName, productPrice);
        const productInCart = cart.find((item) => item.id === productId);
        quantitySpan.textContent = productInCart.quantity;
        updateCartDisplay();
      });
  
      btnMinus.addEventListener("click", () => {
        removeFromCart(productId);
        const productInCart = cart.find((item) => item.id === productId);
        if (productInCart) {
          quantitySpan.textContent = productInCart.quantity;
        } else {
          if (quantityContainer.parentElement) {
            const newButton = createAddToCartButton(productId, productName, productPrice);
            quantityContainer.parentElement.replaceChild(newButton, quantityContainer);
          }
        }
        updateCartDisplay();
      });
    }
  
    function addToCart(productId, productName, productPrice) {
      const existingProduct = cart.find((item) => item.id === productId);
  
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          quantity: 1,
        });
      }
  
      updateCartDisplay();
    }
  
    function removeFromCart(productId) {
      const existingProduct = cart.find((item) => item.id === productId);
  
      if (existingProduct) {
        existingProduct.quantity--;
        if (existingProduct.quantity <= 0) {
          const productIndex = cart.findIndex((item) => item.id === productId);
          cart.splice(productIndex, 1);
        }
      }
  
      updateCartDisplay();
    }
  
    function updateCartDisplay() {
      cartItemsContainer.innerHTML = "";
  
      let total = 0;
      let totalItems = 0;
  
      cart.forEach((item) => {
        const li = document.createElement("li");
  
        const itemName = document.createElement("span");
        itemName.className = "item-name";
        itemName.textContent = `${item.name}`;
  
        const itemQuantity = document.createElement("span");
        itemQuantity.className = "item-quantity";
        itemQuantity.innerHTML = `<br>${item.quantity}x`;
  
        const itemTotalPrice = document.createElement("span");
        itemTotalPrice.className = "totalprice";
        
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.innerHTML = "&times;";
        deleteButton.addEventListener("click", () => {
          removeAllFromCart(item.id);
          const button = document.querySelector(`.btnQuantity[data-product-id="${item.id}"]`);
          if (button && button.parentElement) {
            const newButton = createAddToCartButton(item.id, item.name, item.price);
            button.parentElement.replaceChild(newButton, button);
          }
        });
  
        const itemPrice = document.createElement("span");
        itemPrice.className = "items-price";
        itemPrice.innerHTML = `<br> @$${item.price}`;
        itemTotalPrice.innerHTML = ` $${(item.price * item.quantity).toFixed(2)}`;
  
        li.appendChild(itemName);
        li.appendChild(itemQuantity);
        li.appendChild(itemPrice);
        li.appendChild(itemTotalPrice);
        li.appendChild(deleteButton);
  
        cartItemsContainer.appendChild(li);
  
        total += item.price * item.quantity;
        totalItems += item.quantity;
      });
  
      function removeAllFromCart(productId) {
        const productIndex = cart.findIndex((item) => item.id === productId);
        if (productIndex !== -1) {
          cart.splice(productIndex, 1);
        }
        updateCartDisplay();
      }
  
      totalItemsElement.textContent = `${totalItems}`;
      cartTotalElement.textContent = `$${total.toFixed(2)}`;
  
      if (emptyCartMessage && orderTotal && confirmOrderButton && panier) {
        if (totalItems > 0) {
          emptyCartMessage.style.display = "none";
          orderTotal.style.display = "flex";
          confirmOrderButton.style.display = "block";
          panier.classList.remove("empty");
          paniervide.style.display = "none";
        } else {
          emptyCartMessage.style.display = "block";
          orderTotal.style.display = "none";
          confirmOrderButton.style.display = "none";
          panier.classList.add("empty");
          paniervide.style.display = "flex";
        }
      } else {
        console.error("Un ou plusieurs éléments requis sont manquants dans le DOM.");
      }
    }
  });
  