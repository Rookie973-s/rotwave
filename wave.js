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

    // Expand / collapse handling for news articles
    document.addEventListener("DOMContentLoaded", function() {
      document.querySelectorAll(".article-card").forEach(article => {
        article.addEventListener("click", () => {
          article.classList.toggle("expanded");
        });
      });

      // Run a search on load if the input has text (keeps behavior consistent)
      const input = document.getElementById('searchInput');
      if (input && input.value.trim() !== '') {
        runSearch(input.value.trim().toLowerCase());
      }
    });

    // Header hide/show on scroll and click
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

    // ---- SEARCH LOGIC (ADDED) ----
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      runSearch(q);
    });

    function runSearch(query) {
      // determine the active tab
      const activeTab = document.querySelector('.tab-content.active');
      if (!activeTab) return;

      const tabId = activeTab.id;

      // For each tab, pick the item selector and title extractor.
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
    // ---- end search logic ----