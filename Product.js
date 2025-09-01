  // Show toast function
  function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.display = "block";

    // hide after 3s
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }

// Add to Cart - auto pulls product info
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    let product = this.closest('.product');
    let name = product.getAttribute('data-name');
    let price = parseFloat(product.getAttribute('data-price'));
    let image = product.getAttribute('data-image');
    let size = document.getElementById("size").value;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price, image, size });
    localStorage.setItem('cart', JSON.stringify(cart));
    // ✅ Listen for cart updates triggered from Cart.html
window.addEventListener("storage", function (event) {
  if (event.key === "cart" || event.type === "storage") {
    updateCartCount();
  }
});

    // ✅ update badge
    updateCartCount();

    // ✅ if we're already on cart.html (via iframe), re-render instantly
    try {
      let cartFrame = document.querySelector(".cart-frame");
      if (cartFrame && cartFrame.contentWindow.renderCart) {
        cartFrame.contentWindow.renderCart();
      }
    } catch (e) {
      console.warn("Cart iframe not accessible yet:", e);
    }

    // ✅ notify other open tabs/pages
    window.dispatchEvent(new StorageEvent("storage", { key: "cart" }));

    // show toast
    showToast(name + ' added to cart!');
  });
});

  // Buy Now - goes to checkout.html
  document.querySelectorAll('.buy-now').forEach(button => {
    button.addEventListener('click', function() {
      let product = this.closest('.product');
      let name = product.getAttribute('data-name');
      let price = parseFloat(product.getAttribute('data-price'));
      let image = product.getAttribute('data-image');
      let size = document.getElementById("size").value;

      // Save the single product to localStorage for checkout
      let checkoutItem = [{ name, price, image, size }];
      localStorage.setItem('checkoutItem', JSON.stringify(checkoutItem));

      // Mark checkout type
      localStorage.setItem('checkoutType', 'buynow');

      // Redirect to checkout page
      window.location.href = "BuyNow.html";
    });
  });

  // Update cart badge
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const badge = document.getElementById("cart-count");
    if (badge) {
      if (cart.length > 0) {
        badge.style.display = "inline-block";
        badge.textContent = cart.length;
      } else {
        badge.style.display = "none";
      }
    }
  }

  // Cart panel open/close
  function openCart() {
    document.getElementById("cartPanel").classList.add("active");
  }
  function closeCart() {
    document.getElementById("cartPanel").classList.remove("active");
  }

  // Load badge count on page load
  document.addEventListener("DOMContentLoaded", updateCartCount);
    // hamburger
      function openSidebar() {
      document.getElementById("mySidebar").style.width = "250px";
    }

    function closeSidebar() {
      document.getElementById("mySidebar").style.width = "0";
    }
    // Target all items that have submenu
document.querySelectorAll('.has-submenu').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('open-submenu');
  });
});
// Toggle submenu inside sidebar
document.querySelectorAll('.has-submenu > a').forEach(menu => {
  menu.addEventListener('click', (e) => {
    e.preventDefault(); // stop link navigation
    menu.parentElement.classList.toggle('open');
  });
});
