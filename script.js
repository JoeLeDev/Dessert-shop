document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalItemsElement = document.getElementById('total-items');
    const paniervide = document.getElementById('paniervide');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const orderTotal = document.querySelector('.order-total');
    const confirmOrderButton = document.querySelector('.confirm-order');
    const panier = document.querySelector('.Panier');
    
  
    // Vérifications pour diagnostiquer quel élément est manquant
    if (!cartItemsContainer) console.error('Element "cart-items" is missing.');
    if (!totalItemsElement) console.error('Element "total-items" is missing.');
    if (!cartTotalElement) console.error('Element "cart-total" is missing.');
    if (!emptyCartMessage) console.error('Element "empty-cart-message" is missing.');
    if (!orderTotal) console.error('Element "order-total" is missing.');
    if (!confirmOrderButton) console.error('Element "confirm-order" is missing.');
    if (!panier) console.error('Element "Panier" is missing.');
  
    document.querySelectorAll('.btnAdd').forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = parseFloat(button.dataset.productPrice);
  
        // Ajouter le produit au panier
        addToCart(productId, productName, productPrice);
  
        // Changer l'état du bouton pour afficher la quantité si c'est la première fois
        const productInCart = cart.find(item => item.id === productId);
        if (productInCart.quantity === 1) {
          createQuantityControls(button, productId, productName, productPrice);
        } else {
          updateQuantityDisplay(productId, productInCart.quantity);
        }
      });
    });
  
    function createQuantityControls(button, productId, productName, productPrice) {
      const quantityContainer = document.createElement('div');
      quantityContainer.className = 'btnQuantity';
      quantityContainer.dataset.productId = productId;
      quantityContainer.dataset.productName = productName;
      quantityContainer.dataset.productPrice = productPrice;
  
      const btnMinus = document.createElement('button');
      btnMinus.className = 'btnMinus';
      btnMinus.textContent = '-';
  
      const quantitySpan = document.createElement('span');
      quantitySpan.className = 'quantity';
      quantitySpan.textContent = '1';
  
      const btnPlus = document.createElement('button');
      btnPlus.className = 'btnPlus';
      btnPlus.textContent = '+';
  
      quantityContainer.appendChild(btnMinus);
      quantityContainer.appendChild(quantitySpan);
      quantityContainer.appendChild(btnPlus);
  
      button.parentElement.replaceChild(quantityContainer, button);
  
      btnPlus.addEventListener('click', () => {
        addToCart(productId, productName, productPrice);
        const productInCart = cart.find(item => item.id === productId);
        quantitySpan.textContent = productInCart.quantity;
        updateCartDisplay();
      });
  
      btnMinus.addEventListener('click', () => {
        removeFromCart(productId);
        const productInCart = cart.find(item => item.id === productId);
        if (productInCart) {
          quantitySpan.textContent = productInCart.quantity;
        } else {
            if (quantityContainer.parentElement) {
                quantityContainer.parentElement.replaceChild(button, quantityContainer);
                button.textContent = ''; // Clear text content
                
                const icon = document.createElement('img');
                icon.className = 'svg';
                icon.src = '/assets/images/icon-add-to-cart.svg';
                icon.alt = 'Add to Cart Icon';
      
                const buttonText = document.createTextNode(' Add to Cart');
      
                button.appendChild(icon);
                button.appendChild(buttonText);
      
                button.classList.remove('btnQuantity');
                button.classList.add('btnAdd');
              }
        }
        updateCartDisplay();
      });
    }
  
    function addToCart(productId, productName, productPrice) {
      const existingProduct = cart.find(item => item.id === productId);
  
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          quantity: 1
        });
      }
  
      updateCartDisplay();
    }
  
    function removeFromCart(productId) {
      const existingProduct = cart.find(item => item.id === productId);
  
      if (existingProduct) {
        existingProduct.quantity--;
        if (existingProduct.quantity <= 0) {
          const productIndex = cart.findIndex(item => item.id === productId);
          cart.splice(productIndex, 1);
        }
      }
  
      updateCartDisplay();
    }
  
    function updateCartDisplay() {
      cartItemsContainer.innerHTML = '';
  
      let total = 0;
      let totalItems = 0;
  
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        cartItemsContainer.appendChild(li);
  
        total += item.price * item.quantity;
        totalItems += item.quantity;
      });
  
      totalItemsElement.textContent = `${totalItems}`;
      cartTotalElement.textContent = `$${total.toFixed(2)}`;
  
      // Vérifiez que les éléments existent avant de manipuler leurs styles
      if (emptyCartMessage && orderTotal && confirmOrderButton && panier) {
        if (totalItems > 0) {
          emptyCartMessage.style.display = 'none';
          orderTotal.style.display = 'flex';
          confirmOrderButton.style.display = 'block';
          panier.classList.remove('empty');
          paniervide.style.display ='none';
        } else {
          emptyCartMessage.style.display = 'block';
          orderTotal.style.display = 'none';
          confirmOrderButton.style.display = 'none';
          panier.classList.add('empty');
          paniervide.style.display ='flex';
        }
      } else {
        console.error('Un ou plusieurs éléments requis sont manquants dans le DOM.');
      }
    }
  });
  