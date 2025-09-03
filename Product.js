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
function toggleSubmenu() {
  document.getElementById("submenu").classList.toggle("active");
}
  //product card with carousel 
function moveSlide(button, direction) {
  const carousel = button.closest('.carousel');
  const track = carousel.querySelector('.carousel-track');
  const images = track.querySelectorAll('img');
  
  let index = parseInt(track.getAttribute('data-index')) || 0;
  index = (index + direction + images.length) % images.length;
  
  track.setAttribute('data-index', index);
  track.style.transform = `translateX(-${index * 100}%)`;
}
document.addEventListener("DOMContentLoaded", function() {
  const track = document.querySelector(".single-product .carousel-track");
  const slides = Array.from(track.children);
  const prevButton = document.querySelector(".single-product .carousel-button.prev");
  const nextButton = document.querySelector(".single-product .carousel-button.next");

  let currentIndex = 0;

  function updateSlide() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
  });

  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide();
  });

  updateSlide(); // initialize
});
    function openCart() {
      document.getElementById("cartPanel").classList.add("active");
    }
    function closeCart() {
      document.getElementById("cartPanel").classList.remove("active");
    }
// Save cart
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // 🔔 notify other pages
  window.dispatchEvent(new Event("storage"));
}

// Load cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Add product
function addToCart(product) {
  let cart = getCart();
  let existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart);
}

// Remove product (by index)
function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart?.(); // only runs if renderCart() exists on that page
}

// Update badge
function updateCartCount() {
  let cart = getCart();
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    let count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    if (count > 0) {
      cartCountElement.textContent = count;
      cartCountElement.style.display = "inline-block";
    } else {
      cartCountElement.style.display = "none";
    }
  }
}

// ✅ Listen for updates across pages
window.addEventListener("storage", function (event) {
  if (event.key === "cart" || event.type === "storage") {
    updateCartCount();
  }
});

// Run on page load
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
 // Load header.html dynamically
    fetch("Header.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("header").innerHTML = data;
      });
// swipe image
    class Carousel {
      constructor(root) {
        this.root = root;
        this.viewport = root.querySelector('[data-carousel-viewport]');
        this.track = root.querySelector('[data-carousel-track]');
        this.slides = Array.from(this.track.children);
        this.prevBtn = root.querySelector('[data-carousel-prev]');
        this.nextBtn = root.querySelector('[data-carousel-next]');
        this.dotsWrap = root.querySelector('[data-carousel-dots]');

        this.index = 0;
        this.slideWidth = 0;

        this.onResize = this.onResize.bind(this);
        this.onKey = this.onKey.bind(this);

        this.init();
      }

      init() {
        if (!this.slides.length) return;
        this.createDots();
        this.bind();
        this.measure();
        this.update(false);
      }

      bind() {
        this.prevBtn?.addEventListener('click', () => this.go(-1));
        this.nextBtn?.addEventListener('click', () => this.go(1));
        this.root.addEventListener('keydown', this.onKey);
        window.addEventListener('resize', this.onResize);

        // Pointer/Touch swipe
        let startX = 0, deltaX = 0, dragging = false;
        const start = (x) => { dragging = true; startX = x; this.track.style.transition = 'none'; };
        const move = (x) => { if (!dragging) return; deltaX = x - startX; this.translate(-this.index * this.slideWidth + deltaX); };
        const end = () => {
          if (!dragging) return; dragging = false; this.track.style.transition = 'transform .35s ease';
          const threshold = Math.max(40, this.slideWidth * 0.15); // why: avoid accidental swipes on small screens
          if (Math.abs(deltaX) > threshold) this.go(deltaX > 0 ? -1 : 1); else this.update();
          deltaX = 0;
        };

        this.viewport.addEventListener('touchstart', (e) => start(e.touches[0].clientX), { passive: true });
        this.viewport.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: true });
        this.viewport.addEventListener('touchend', end);

        this.viewport.addEventListener('mousedown', (e) => start(e.clientX));
        window.addEventListener('mousemove', (e) => move(e.clientX));
        window.addEventListener('mouseup', end);
      }

      onResize() { this.measure(); this.update(false); }

      onKey(e) {
        if (e.key === 'ArrowLeft') this.go(-1);
        if (e.key === 'ArrowRight') this.go(1);
      }

      measure() {
        this.slideWidth = this.viewport.clientWidth;
        this.slides.forEach((s) => (s.style.minWidth = this.slideWidth + 'px'));
      }

      createDots() {
        this.dots = this.slides.map((_, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', `Go to slide ${i + 1}`);
          b.addEventListener('click', () => { this.index = i; this.update(); });
          this.dotsWrap.appendChild(b);
          return b;
        });
      }

      go(step) { this.index = Math.max(0, Math.min(this.slides.length - 1, this.index + step)); this.update(); }

      update(animate = true) {
        this.track.style.transition = animate ? 'transform .35s ease' : 'none';
        this.translate(-this.index * this.slideWidth);
        this.prevBtn.disabled = this.index === 0;
        this.nextBtn.disabled = this.index === this.slides.length - 1;
        this.dots.forEach((d, i) => d.setAttribute('aria-current', i === this.index ? 'true' : 'false'));
      }

      translate(px) { this.track.style.transform = `translateX(${px}px)`; }
    }

    // Auto-init all carousels on the page
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[data-carousel]').forEach((el) => new Carousel(el));
    });
     // Load footer.html dynamically
    fetch("Footer.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      });
    
