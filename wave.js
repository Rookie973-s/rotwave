// ---- CAROUSEL LOGIC ----
let currentSlide = 0;
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = document.que// ---- CAROUSEL LOGIC ----
let currentSlide = 0;
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = document.querySelectorAll('.carousel-slide').length;

function updateCarousel() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function moveCarousel(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

// Auto-advance carousel every 5 seconds
setInterval(() => {
  moveCarousel(1);
}, 5000);

// --- TAB SWITCHING (FIXED for both user click and programmatic calls) ---
function switchTab(tabName, event) { // Pass 'event' explicitly if available
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  
  // Determine which button to activate
  let clickedButton = null; 
  if (event && event.target && event.target.classList.contains('tab-btn')) {
    clickedButton = event.target;
  } else {
    // Fallback for programmatic calls (like from the shared link logic)
    clickedButton = document.querySelector(`.tab-btn[onclick*="switchTab('${tabName}')"]`);
  }
  
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");
  
  if (clickedButton) {
    clickedButton.classList.add("active");
  }

  // Ensure scroll to top happens for the new tab
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- SMALL TOAST (for copy success) ----
function showCopiedToast() {
  let toast = document.createElement('div');
  toast.innerText = '✅ Link copied!';
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = '#222';
  toast.style.color = '#fff';
  toast.style.padding = '10px 15px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  toast.style.fontSize = '14px';
  toast.style.zIndex = '1000';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ---- HEADER HIDE/SHOW ----
let lastScroll = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScroll = currentScroll;
});

// Optional: hide header briefly when clicking a tab or article
document.querySelectorAll(".tab-btn, .article-card").forEach(el => {
  el.addEventListener("click", () => {
    header.classList.add("hide");
    setTimeout(() => header.classList.remove("hide"), 1200);
  });
});

// ---- SEARCH LOGIC ----
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    runSearch(q);
  });
}

function runSearch(query) {
  const activeTab = document.querySelector('.tab-content.active');
  if (!activeTab) return;

  const tabId = activeTab.id;
  let items = [];

  if (tabId === 'news') {
    items = Array.from(activeTab.querySelectorAll('.article-card'));
    items.forEach(item => {
      const titleEl = item.querySelector('.article-title');
      const title = titleEl ? titleEl.innerText.toLowerCase() : '';
      item.style.display = title.includes(query) ? '' : 'none';
    });
  } else if (tabId === 'comics') {
    items = Array.from(activeTab.querySelectorAll('.comic-card'));
    items.forEach(item => {
      const titleEl = item.querySelector('.comic-title');
      const title = titleEl ? titleEl.innerText.toLowerCase() : '';
      item.style.display = title.includes(query) ? '' : 'none';
    });
  } else if (tabId === 'reviews') {
    items = Array.from(activeTab.querySelectorAll('.review-card'));
    items.forEach(item => {
      const titleEl = item.querySelector('.review-title');
      const title = titleEl ? titleEl.innerText.toLowerCase() : '';
      item.style.display = title.includes(query) ? '' : 'none';
    });
  }
}
// --- THEME TOGGLE LOGIC (UPDATED FOR SVG SWAP) ---
const themeToggle = document.getElementById('themeToggle');

// SVG content for the icons
const sunIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon sun-icon">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`;

const moonIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon moon-icon">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`;

if (themeToggle) {
    // 1. Function to apply the selected theme
    function applyTheme(isLight) {
        document.body.classList.toggle('light-mode', isLight);
        
        // **NEW:** Swap the SVG based on the theme state
        themeToggle.innerHTML = isLight ? moonIconSVG : sunIconSVG; 
        
        // Update the button's aria-label for accessibility
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }

    // 2. Load saved preference or check system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    // Set initial theme
    // Default to dark mode (your site's apparent default) unless system prefers light, or saved theme dictates otherwise
    if (savedTheme) {
        applyTheme(savedTheme === 'light');
    } else {
        // Apply system preference on first visit
        applyTheme(prefersLight); 
    }

    // 3. Event listener for the click
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-mode');
        // Toggle the theme
        applyTheme(!isLight);
        // Save the new preference
        localStorage.setItem('theme', !isLight ? 'light' : 'dark');
    });
}
// --- END THEME TOGGLE LOGIC ---
// ---- DOM READY: MAIN FUNCTIONALITY ----
document.addEventListener("DOMContentLoaded", function() {
  
  // 1. Expand / collapse handling for news articles (FIXED)
  document.querySelectorAll(".article-card").forEach(article => {
    // Use the event listener here to reliably capture the click event (e)
    article.addEventListener("click", (e) => {
      // Check if the click target is the share button or inside it
      const isShareButton = e.target.closest('.share-btn');
      if (!isShareButton) {
         article.classList.toggle("expanded");
      }
    });
  });

  // 2. Run a search on load if input has text
  const input = document.getElementById('searchInput');
  if (input && input.value.trim() !== '') {
    runSearch(input.value.trim().toLowerCase());
  }

  // 3. SHARE BUTTON FEATURE (Applied to both Articles and Reviews)
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // crucial: prevents article from expanding/collapsing

      // Find the nearest parent card with a data-id attribute
      const card = button.closest('.article-card, .review-card');
      if (!card) return;

      // Get the title and generate ID/URL
      let title = card.querySelector('.article-title, .review-title')?.innerText.trim() || 'Content';
      const articleId = card.getAttribute('data-id') || button.getAttribute('data-id') || title.replace(/\s+/g, '-').toLowerCase();
      
      const shareText = `Check out this content on ROTWAVE: ${title}`;
      const articleUrl = `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(articleId)}`;

      if (navigator.share) {
        navigator.share({
          title,
          text: shareText,
          url: articleUrl
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(articleUrl).then(() => {
          showCopiedToast();
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
      }
    });
  });

  // 4. SCROLL TO SHARED ARTICLE / REVIEW (FIXED SCROLLING AFTER TAB SWITCH)
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("article");
  
  if (articleId) {
    const target = document.querySelector(`[data-id="${articleId}"]`);
    
    if (target) {
      let targetTabName;
      if (target.closest('#reviews')) {
        targetTabName = 'reviews';
      } else if (target.closest('#comics')) {
        targetTabName = 'comics';
      } else {
        targetTabName = 'news';
      }

      // 1. Switch the tab to make the content visible
      switchTab(targetTabName);

      // 2. Wait longer (1000ms) for the tab switch, animation, and scroll-to-top 
      // to fully complete before attempting the specific element scroll.
      setTimeout(() => {
        // Now scroll to the target element
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Only expand if it's an article-card
        if (target.classList.contains('article-card')) {
          target.classList.add("expanded"); 
        }

        // Temporary highlight
        target.style.boxShadow = "0 0 15px #ff9800"; 
        setTimeout(() => (target.style.boxShadow = ""), 2000);
      }, 1000); // 1 second delay
    }
  }
});
// ---- END ----rySelectorAll('.carousel-slide').length;

function updateCarousel() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function moveCarousel(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

// Auto-advance carousel every 5 seconds
setInterval(() => {
  moveCarousel(1);
}, 5000);

// --- TAB SWITCHING (FIXED for both user click and programmatic calls) ---
function switchTab(tabName, event) { // Pass 'event' explicitly if available
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  
  // Determine which button to activate
  let clickedButton = null; 
  if (event && event.target && event.target.classList.contains('tab-btn')) {
    clickedButton = event.target;
  } else {
    // Fallback for programmatic calls (like from the shared link logic)
    clickedButton = document.querySelector(`.tab-btn[onclick*="switchTab('${tabName}')"]`);
  }
  
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");
  
  if (clickedButton) {
    clickedButton.classList.add("active");
  }

  // Ensure scroll to top happens for the new tab
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- SMALL TOAST (for copy success) ----
function showCopiedToast() {
  let toast = document.createElement('div');
  toast.innerText = '✅ Link copied!';
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = '#222';
  toast.style.color = '#fff';
  toast.style.padding = '10px 15px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  toast.style.fontSize = '14px';
  toast.style.zIndex = '1000';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ---- HEADER HIDE/SHOW ----
let lastScroll = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScroll = currentScroll;
});

// Optional: hide header briefly when clicking a tab or article
document.querySelectorAll(".tab-btn, .article-card").forEach(el => {
  el.addEventListener("click", () => {
    header.classList.add("hide");
    setTimeout(() => header.classList.remove("hide"), 1200);
  });
});

// ---- SEARCH LOGIC ----
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    runSearch(q);
  });
}

function runSearch(query) {
  const activeTab = document.querySelector('.tab-content.active');
  if (!activeTab) return;

  const tabId = activeTab.id;
  let items = [];

  if (tabId === 'news') {
    items = Array.from(activeTab.querySelectorAll('.article-card'));
    items.forEach(item => {
      const titleEl = item.querySelector('.article-title');
      const title = titleEl ? titleEl.innerText.toLowerCase() : '';
      item.style.display = title.includes(query) ? '' : 'none';
    });
  } else if (tabId === 'comics') {
    items = Array.from(activeTab.querySelectorAll('.comic-card'));
    items.forEach(item => {
      const titleEl = item.querySelector('.comic-title');
      const title = titleEl ? titleEl.innerText.toLowerCase() : '';
      item.style.display = title.includes(query) ? '' : 'none';
    });
  } else if (tabId === 'reviews') {
    items = Array.from(activeTab.querySelectorAll('.review-card'));
    items.forEach(item => {
      const titleEl = item.querySelector('.review-title');
      const title = titleEl ? titleEl.innerText.toLowerCase() : '';
      item.style.display = title.includes(query) ? '' : 'none';
    });
  }
}
// --- THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    // 1. Function to apply the selected theme
    function applyTheme(isLight) {
        document.body.classList.toggle('light-mode', isLight);
        themeToggle.innerHTML = isLight ? '<i class="theme-icon">☀️</i>' : '<i class="theme-icon">🌙</i>';
    }

    // 2. Load saved preference or check system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    // Set initial theme
    if (savedTheme) {
        applyTheme(savedTheme === 'light');
    } else {
        // Default to dark mode (your site's default) unless system prefers light
        applyTheme(prefersLight); 
    }

    // 3. Event listener for the click
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-mode');
        // Toggle the theme
        applyTheme(!isLight);
        // Save the new preference
        localStorage.setItem('theme', !isLight ? 'light' : 'dark');
    });
}
// --- END THEME TOGGLE LOGIC ---

// ---- DOM READY: MAIN FUNCTIONALITY ----
document.addEventListener("DOMContentLoaded", function() {
  
  // 1. Expand / collapse handling for news articles (FIXED)
  document.querySelectorAll(".article-card").forEach(article => {
    // Use the event listener here to reliably capture the click event (e)
    article.addEventListener("click", (e) => {
      // Check if the click target is the share button or inside it
      const isShareButton = e.target.closest('.share-btn');
      if (!isShareButton) {
         article.classList.toggle("expanded");
      }
    });
  });

  // 2. Run a search on load if input has text
  const input = document.getElementById('searchInput');
  if (input && input.value.trim() !== '') {
    runSearch(input.value.trim().toLowerCase());
  }

  // 3. SHARE BUTTON FEATURE (Applied to both Articles and Reviews)
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // crucial: prevents article from expanding/collapsing

      // Find the nearest parent card with a data-id attribute
      const card = button.closest('.article-card, .review-card');
      if (!card) return;

      // Get the title and generate ID/URL
      let title = card.querySelector('.article-title, .review-title')?.innerText.trim() || 'Content';
      const articleId = card.getAttribute('data-id') || button.getAttribute('data-id') || title.replace(/\s+/g, '-').toLowerCase();
      
      const shareText = `Check out this content on ROTWAVE: ${title}`;
      const articleUrl = `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(articleId)}`;

      if (navigator.share) {
        navigator.share({
          title,
          text: shareText,
          url: articleUrl
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(articleUrl).then(() => {
          showCopiedToast();
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
      }
    });
  });

  // 4. SCROLL TO SHARED ARTICLE / REVIEW (FIXED SCROLLING AFTER TAB SWITCH)
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("article");
  
  if (articleId) {
    const target = document.querySelector(`[data-id="${articleId}"]`);
    
    if (target) {
      let targetTabName;
      if (target.closest('#reviews')) {
        targetTabName = 'reviews';
      } else if (target.closest('#comics')) {
        targetTabName = 'comics';
      } else {
        targetTabName = 'news';
      }

      // 1. Switch the tab to make the content visible
      switchTab(targetTabName);

      // 2. Wait longer (1000ms) for the tab switch, animation, and scroll-to-top 
      // to fully complete before attempting the specific element scroll.
      setTimeout(() => {
        // Now scroll to the target element
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Only expand if it's an article-card
        if (target.classList.contains('article-card')) {
          target.classList.add("expanded"); 
        }

        // Temporary highlight
        target.style.boxShadow = "0 0 15px #ff9800"; 
        setTimeout(() => (target.style.boxShadow = ""), 2000);
      }, 1000); // 1 second delay
    }
  }
});
// ---- END ----

