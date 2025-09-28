// Toast function - creates, styles, and shows toast messages
function showToast(message, duration = 3000) {
  // Remove existing toast if present
  const existingToast = document.getElementById("custom-toast");
  if (existingToast) existingToast.remove();

  // Create toast element
  const toast = document.createElement("div");
  toast.id = "custom-toast";
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "rgba(0,0,0,0.85)";
  toast.style.color = "#fff";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "4px";
  toast.style.zIndex = "9999";
  toast.style.fontSize = "16px";
  toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s";

  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = "1"), 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => { toast.remove(); }, 300);
  }, duration);
}

// Cart functions
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  window.dispatchEvent(new Event("storage")); // notify other pages
}

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

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  if (typeof renderCart === "function") renderCart();
}

function updateCartCount() {
  let cart = getCart();
  const badge = document.getElementById("cart-count");
  if (badge) {
    let count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}

// Listen for cart updates across tabs
window.addEventListener("storage", function (event) {
  if (event.key === "cart" || event.type === "storage") {
    updateCartCount();
  }
});

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
  updateCartCount();

  // Add to Cart - pulls product info
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      let productEl = this.closest('.product');
      let name = productEl.getAttribute('data-name');
      let price = parseFloat(productEl.getAttribute('data-price'));
      let image = productEl.getAttribute('data-image');
      let size = document.getElementById("size")?.value || "";

      let product = {
        id: name + size, // Assuming unique name+size combo
        name, price, image, size
      };
      addToCart(product);

      // If we're already on cart.html (via iframe), re-render instantly
      try {
        let cartFrame = document.querySelector(".cart-frame");
        if (cartFrame?.contentWindow?.renderCart) {
          cartFrame.contentWindow.renderCart();
        }
      } catch (e) {
        console.warn("Cart iframe not accessible yet:", e);
      }

      // Notify other open tabs/pages
      window.dispatchEvent(new StorageEvent("storage", { key: "cart" }));

      // Show toast
      showToast(name + ' added to cart!');
    });
  });

  // Buy Now - goes to checkout.html
  document.querySelectorAll('.buy-now').forEach(button => {
    button.addEventListener('click', function() {
      let productEl = this.closest('.product');
      let name = productEl.getAttribute('data-name');
      let price = parseFloat(productEl.getAttribute('data-price'));
      let image = productEl.getAttribute('data-image');
      let size = document.getElementById("size")?.value || "";

      let checkoutItem = [{ name, price, image, size }];
      localStorage.setItem('checkoutItem', JSON.stringify(checkoutItem));
      localStorage.setItem('checkoutType', 'buynow');
      window.location.href = "BuyNow.html";
    });
  });

  // Hamburger sidebar
  document.querySelectorAll('.has-submenu').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('open-submenu');
    });
  });

  document.querySelectorAll('.has-submenu > a').forEach(menu => {
    menu.addEventListener('click', (e) => {
      e.preventDefault();
      menu.parentElement.classList.toggle('open');
    });
  });

  // Header and footer load
  fetch("Header.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    updateCartCount(); // <-- update badge after header loads
  });

  fetch("Footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });

  // Auto-init all carousels on the page
  document.querySelectorAll('[data-carousel]').forEach((el) => new Carousel(el));
});

// Cart panel open/close
function openCart() {
  document.getElementById("cartPanel")?.classList.add("active");
}
function closeCart() {
  document.getElementById("cartPanel")?.classList.remove("active");
}

// Hamburger sidebar open/close
function openSidebar() {
  document.getElementById("mySidebar").style.width = "250px";
}
function closeSidebar() {
  document.getElementById("mySidebar").style.width = "0";
}

// Toggle submenu inside sidebar
function toggleSubmenu() {
  document.getElementById("submenu").classList.toggle("active");
}

// Carousel - swipe image and buttons
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
      const threshold = Math.max(40, this.slideWidth * 0.15);
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

  go(step) {
    this.index = Math.max(0, Math.min(this.slides.length - 1, this.index + step));
    this.update();
  }

  update(animate = true) {
    this.track.style.transition = animate ? 'transform .35s ease' : 'none';
    this.translate(-this.index * this.slideWidth);
    this.prevBtn.disabled = this.index === 0;
    this.nextBtn.disabled = this.index === this.slides.length - 1;
    this.dots.forEach((d, i) => d.setAttribute('aria-current', i === this.index ? 'true' : 'false'));
  }

  translate(px) { this.track.style.transform = `translateX(${px}px)`; }
                            }
