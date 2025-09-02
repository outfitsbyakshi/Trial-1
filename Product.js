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
// swipe image
const track = document.querySelector('.carousel-track');
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let index = 0;
const images = track.querySelectorAll('img');

// Set width dynamically
function updateCarousel() {
  const width = images[0].clientWidth;
  track.style.transform = `translateX(${-index * width}px)`;
}
window.addEventListener('resize', updateCarousel);
updateCarousel();

// Button navigation
document.querySelector('.next').addEventListener('click', () => {
  if (index < images.length - 1) index++;
  updateCarousel();
});
document.querySelector('.prev').addEventListener('click', () => {
  if (index > 0) index--;
  updateCarousel();
});

// Touch/swipe navigation
track.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

track.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50 && index < images.length - 1) {
    index++; // swipe left → next
  } else if (endX - startX > 50 && index > 0) {
    index--; // swipe right → prev
  }
  updateCarousel();
});
// File: Product.js (carousel logic)
// Limited ends (no infinite loop)
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.querySelectorAll(".slide"));
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");

  let index = 0;
  let isDragging = false;
  let startX = 0, deltaX = 0;
  const threshold = 50; // min drag distance

  const goTo = (i, withTransition = true) => {
    // clamp index between 0 and slides.length - 1
    index = Math.max(0, Math.min(i, slides.length - 1));
    track.style.transition = withTransition ? "transform 0.35s ease-in-out" : "none";
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  };

  // Button controls
  nextBtn?.addEventListener("click", () => goTo(index + 1));
  prevBtn?.addEventListener("click", () => goTo(index - 1));

  // --- Swipe controls ---
  const onStart = (x) => {
    isDragging = true;
    startX = x;
    deltaX = 0;
    track.style.transition = "none"; 
  };

  const onMove = (x) => {
    if (!isDragging) return;
    deltaX = x - startX;
    const percent = (deltaX / carousel.clientWidth) * 100;
    track.style.transform = `translate3d(calc(${-index * 100}% + ${-percent}%), 0, 0)`;
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    if (deltaX < -threshold && index < slides.length - 1) {
      goTo(index + 1);
    } else if (deltaX > threshold && index > 0) {
      goTo(index - 1);
    } else {
      goTo(index); // snap back
    }
  };

  // Touch
  track.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX), { passive: true });
  track.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", onEnd);

  // Mouse (desktop drag)
  track.addEventListener("mousedown", (e) => onStart(e.clientX));
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onEnd);

  // Keep correct position on resize
  window.addEventListener("resize", () => goTo(index, false));

  // Init
  goTo(0, false);
});
