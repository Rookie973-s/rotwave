// ---- CAROUSEL LOGIC ----
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

// ---- TAB SWITCHING ----
function switchTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");
  event.target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- DOM READY ----
document.addEventListener("DOMContentLoaded", function() {
  // Expand / collapse handling for news articles
  document.querySelectorAll(".article-card").forEach(article => {
    article.addEventListener("click", () => {
      article.classList.toggle("expanded");
    });
  });

  // Run a search on load if input has text
  const input = document.getElementById('searchInput');
  if (input && input.value.trim() !== '') {
    runSearch(input.value.trim().toLowerCase());
  }

  // ---- SHARE BUTTON FEATURE ----
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent expand
      const articleCard = button.closest('.article-card');
      if (!articleCard) return;

      const title = articleCard.querySelector('.article-title')?.innerText.trim() || 'Article';
      const articleId = articleCard.getAttribute('data-id') || title.replace(/\s+/g, '-').toLowerCase();
      const articleUrl = `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(articleId)}`;

      if (navigator.share) {
        navigator.share({
          title,
          text: `Check out this article on ROTWAVE: ${title}`,
          url: articleUrl
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(articleUrl).then(() => {
          showCopiedToast();
        });
      }
    });
  });
});

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

// ---- END ----
// ---- SCROLL TO SHARED ARTICLE ----
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("article");
  
  if (articleId) {
    const target = document.querySelector(`[data-id="${articleId}"]`);
    if (target) {
      // Wait a bit for layout to render fully
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("expanded"); // Optional: open it if it's collapsible
        target.style.boxShadow = "0 0 15px #ff9800"; // temporary highlight
        setTimeout(() => (target.style.boxShadow = ""), 2000);
      }, 800);
    }
  }
});
