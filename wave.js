// ---- CAROUSEL LOGIC ----
let currentSlide = 0;
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = document.querySelectorAll('.carousel-slide').length;

function updateCarousel() {
  if (!track) return;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function moveCarousel(direction) {
  if (totalSlides === 0) return;
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

// --- TAB SWITCHING ---
function switchTab(tabName, event) {
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  
  let clickedButton = null; 
  if (event && event.target && event.target.classList.contains('tab-btn')) {
    clickedButton = event.target;
  } else {
    clickedButton = document.querySelector(`.tab-btn[onclick*="switchTab('${tabName}')"]`);
  }
  
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  const targetTab = document.getElementById(tabName);
  if (targetTab) targetTab.classList.add("active");
  
  if (clickedButton) {
    clickedButton.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- MENU LOGIC ----
function toggleMenu() {
    const menu = document.getElementById('menuDrawer');
    if (!menu) return;
    const isVisible = menu.classList.toggle('active');
    
    const menuToggleBtn = document.getElementById('menuToggle');
    if (isVisible) {
        const firstFocusable = menu.querySelector('#menuCloseBtn, a'); 
        if (firstFocusable) firstFocusable.focus();
    } else if (menuToggleBtn) {
        menuToggleBtn.focus();
    }
}

// ---- SEARCH LOGIC ----
function toggleSearchDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');
    
    const isVisible = searchDropdown.classList.toggle('active');
    
    if (isVisible) {
        searchInput.focus();
    } else {
        searchInput.value = '';
        runSearch('');
        searchInput.blur();
    }
}

function runSearch(query) {
  const activeTab = document.querySelector('.tab-content.active');
  if (!activeTab) return;
  
  const tabId = activeTab.id;
  let items = [];
  
  // Mapping tab IDs to their card classes
  const cardClasses = {
    'news': '.article-card',
    'comics': '.comic-card',
    'reviews': '.review-card'
  };
  
  const titleClasses = {
    'news': '.article-title',
    'comics': '.comic-title',
    'reviews': '.review-title'
  };
  
  if (cardClasses[tabId]) {
      items = Array.from(activeTab.querySelectorAll(cardClasses[tabId]));
      items.forEach(item => {
        const titleEl = item.querySelector(titleClasses[tabId]);
        const title = titleEl ? titleEl.innerText.toLowerCase() : '';
        item.style.display = title.includes(query) ? '' : 'none';
      });
  }
}

const searchInput = document.getElementById('searchInput'); 
if (searchInput) {
  searchInput.addEventListener('input', function () {
    runSearch(this.value.trim().toLowerCase());
  });
}

// ---- TOAST & HEADER ----
function showCopiedToast() {
  showToast('✅ Link copied!');
}

let lastScroll = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (document.getElementById('menuDrawer')?.classList.contains('active') ||
      document.getElementById('searchDropdown')?.classList.contains('active')) {
      return;
  }
  
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScroll = currentScroll;
});

// --- THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('themeToggle');
const sunIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon sun-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const moonIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon moon-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

if (themeToggle) {
    function applyTheme(isLight) {
        document.body.classList.toggle('light-mode', isLight);
        themeToggle.innerHTML = isLight ? moonIconSVG : sunIconSVG; 
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme) {
        applyTheme(savedTheme === 'light');
    } else {
        applyTheme(prefersLight); 
    }

    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-mode');
        applyTheme(!isLight);
        localStorage.setItem('theme', !isLight ? 'light' : 'dark');
    });
}

// ---- DOM READY ----
document.addEventListener("DOMContentLoaded", function() {
  
  // NEW Article Modal Logic
  // We replace the old "expand-in-place" logic with the modal logic.
  document.querySelectorAll("#news .read-more-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Keep this to prevent card click
      const article = btn.closest('.article-card');
      const contentId = article ? article.getAttribute('data-id') : null;
      
      if (contentId) {
        openArticleModal(contentId);
      } else {
        // Fallback for articles without data-id
        const title = article.querySelector('.article-title').innerText;
        const imageSrc = article.querySelector('.article-image').src;
        const fullContentHTML = article.querySelector('.article-full').innerHTML;
        populateAndShowModal(title, imageSrc, fullContentHTML);
      }
    });
  });

  const input = document.getElementById('searchInput');
  if (input && input.value.trim() !== '') {
    document.getElementById('searchDropdown')?.classList.add('active');
    runSearch(input.value.trim().toLowerCase());
  }

  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const card = button.closest('.article-card, .review-card');
      if (!card) return;
      
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
      switchTab(targetTabName);

      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        if (target.classList.contains('article-card')) {
          // Check if it's an article-card (not a review-card) to expand
          // But now we use modal, so let's open modal instead
           const contentId = target.getAttribute('data-id');
           if (contentId) {
                openArticleModal(contentId);
           }
        }
        target.style.boxShadow = "0 0 15px #ff9800"; 
        setTimeout(() => (target.style.boxShadow = ""), 2000);
      }, 1000);
    }
  }
  
  // Initialize comments logic
  initializeCommentCounts();

  // NEW: Add listeners for modal close buttons
  const modalOverlay = document.getElementById('article-modal-overlay');
  const modalCloseBtn = document.getElementById('article-modal-close-btn');

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      // Close if background is clicked
      if (e.target === modalOverlay) {
        closeArticleModal();
      }
    });
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeArticleModal);
  }

});

// --- LENS ANIMATION ---
const bladeCount = 8;
const bladesContainer = document.getElementById('blades');
const centerCircle = document.getElementById('center');
const fstopDisplay = document.getElementById('fstop');
const fStops = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

if (bladesContainer) {
    for (let i = 0; i < bladeCount; i++) {
        const blade = document.createElement('div');
        blade.className = 'blade';
        blade.innerHTML = '<div class="blade-inner"></div>';
        blade.style.transform = `rotate(${(360 / bladeCount) * i}deg)`;
        bladesContainer.appendChild(blade);
    }
}

const blades = document.querySelectorAll('.blade');
let lastScrollY = window.scrollY;
let rotation = 0;

function updateAperture() {
    if (!centerCircle) return;
    
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = window.scrollY / maxScroll;
    
    const scrollDelta = window.scrollY - lastScrollY;
    rotation += scrollDelta * 0.1;
    lastScrollY = window.scrollY;
    
    const openPercent = scrollPercent;
    const minSize = 4; 
    const maxSize = 44; 
    
    const currentSize = minSize + (maxSize - minSize) * openPercent;
    
    centerCircle.style.width = currentSize + 'px';
    centerCircle.style.height = currentSize + 'px';
    
    const bladeAngle = 25 - (openPercent * 20); 
    
    blades.forEach((blade, index) => {
        const baseRotation = (360 / bladeCount) * index;
        const totalRotation = baseRotation + rotation;
        blade.style.transform = `rotate(${totalRotation}deg) translateX(${-bladeAngle}%)`;
    });
    
    const fstopIndex = Math.floor((1 - openPercent) * (fStops.length - 1));
    if (fstopDisplay) fstopDisplay.textContent = `f/${fStops[fstopIndex] || 22}`;
}

updateAperture();

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateAperture();
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener('resize', updateAperture);

const apertureContainer = document.querySelector('.aperture-container');
if (apertureContainer) {
    apertureContainer.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =================================================================
// 📰 ===== NEW Article Modal Functions =====
// =================================================================

// --- FIX ---
// The variables for the modal are now declared *inside* the functions
// that use them (populateAndShowModal and closeArticleModal).
// This ensures the script doesn't try to find them before they exist.

/**
 * Finds the article card by its data-id and opens the modal with its content.
 * @param {string} contentId The 'data-id' of the article-card
 */
function openArticleModal(contentId) {
  const articleCard = document.querySelector(`.article-card[data-id="${contentId}"]`);
  if (!articleCard) {
    console.error("Could not find article with ID:", contentId);
    return;
  }

  // Grab content from the clicked card
  const title = articleCard.querySelector('.article-title').innerText;
  const imageSrc = articleCard.querySelector('.article-image').src;
  const fullContentHTML = articleCard.querySelector('.article-full').innerHTML;

  populateAndShowModal(title, imageSrc, fullContentHTML);
}

/**
 * Populates the modal with content and makes it visible.
 * @param {string} title - The article title
 * @param {string} imageSrc - The URL for the article image
 *_@param {string} fullContentHTML - The inner HTML of the .article-full div
 */
function populateAndShowModal(title, imageSrc, fullContentHTML) {
  // --- FIX: Select elements *inside* the function ---
  const articleModalOverlay = document.getElementById('article-modal-overlay');
  const modalTitle = document.getElementById('article-modal-title');
  const modalImage = document.getElementById('article-modal-image');
  const modalFullText = document.getElementById('article-modal-full-text');
  // --- END FIX ---

  if (!articleModalOverlay || !modalTitle || !modalImage || !modalFullText) {
      console.error("Modal elements not found. Check your HTML.");
      return;
  }

  // Populate the modal
  modalTitle.innerText = title;
  modalImage.src = imageSrc;
  modalImage.alt = title + " image";
  modalFullText.innerHTML = fullContentHTML;

  // Show the modal
  articleModalOverlay.classList.add('visible');
  
  // Prevent background scrolling
  document.body.style.overflow = 'hidden';
}

/**
 * Hides the article modal and restores background scrolling.
 */
function closeArticleModal() {
  // --- FIX: Select element *inside* the function ---
  const articleModalOverlay = document.getElementById('article-modal-overlay');
  // --- END FIX ---

  if (!articleModalOverlay) return;
  
  articleModalOverlay.classList.remove('visible');
  
  // Allow background scrolling again
  document.body.style.overflow = '';

  // Optional: Reset content after fade-out to prevent flash
  setTimeout(() => {
    // Also select these here to reset them
    const modalTitle = document.getElementById('article-modal-title');
    const modalImage = document.getElementById('article-modal-image');
    const modalFullText = document.getElementById('article-modal-full-text');

    if (modalTitle) modalTitle.innerText = "Article Title";
    if (modalImage) modalImage.src = "";
    if (modalFullText) modalFullText.innerHTML = "";
  }, 300); // Match transition duration
}


// =================================================================
// 💬 ===== COMMENT SECTION LOGIC (Frontend) =====
// =================================================================

const API_URL = "https://wave-backend-umi8.onrender.com";
const API_BASE_PATH = "/comments"; 

let currentUser = null;

function parseJwt(token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

function showToast(message) {
    let toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #222;
        color: #fff;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0'; 
        toast.style.transition = 'opacity 0.3s ease'; 
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) logoutBtn.style.display = isUserSignedIn() ? 'inline-block' : 'none';

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isUserSignedIn() {
    return currentUser !== null;
}

function getCurrentUserEmail() {
    return currentUser;
}

// ---------------- GOOGLE SIGN-IN ----------------
function promptSignIn() {
    if (typeof google === 'undefined' || !google.accounts) {
        showToast('⚠️ Google Sign-In not loaded yet. Please refresh the page.');
        return;
    }
    
    google.accounts.id.initialize({
        client_id: '1045306694039-u5nahpbm784drnrro1o1nvr25r91l40r.apps.googleusercontent.com',
        callback: handleGoogleSignIn
    });
    
    google.accounts.id.prompt();
}

function handleGoogleSignIn(response) {
  try {
    const user = parseJwt(response.credential);
    if (user) {
        currentUser = user.email;
        localStorage.setItem("googleUser", JSON.stringify(user));
        updateAllCommentForms();
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.style.display = 'flex';
        
        showToast(`✅ Signed in as ${user.email}`);
    }
  } catch (error) {
    console.error('Sign-in error:', error);
    showToast('❌ Sign-in failed. Please try again.');
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem("googleUser");
  updateAllCommentForms();
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.style.display = 'none';
  
  showToast('👋 Signed out successfully');
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("googleUser");
  if (saved) {
    try {
      const user = JSON.parse(saved);
      currentUser = user.email;
      
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) logoutBtn.style.display = 'flex';
    } catch (error) {
      localStorage.removeItem("googleUser");
    }
  }
  updateAllCommentForms();
});

function updateAllCommentForms() {
    document.querySelectorAll('.comment-input').forEach(input => {
        if (isUserSignedIn()) {
            input.disabled = false;
            input.placeholder = `Comment as ${getCurrentUserEmail()}...`;
        } else {
            input.disabled = true;
            input.placeholder = 'Sign in to post a comment...';
            input.value = '';
        }
    });
    
    document.querySelectorAll('.sign-in-prompt-btn').forEach(btn => {
        btn.style.display = isUserSignedIn() ? 'none' : 'block';
    });
    
    document.querySelectorAll('.submit-comment-btn').forEach(btn => {
        btn.style.display = isUserSignedIn() ? 'block' : 'none';
    });
}

function toggleCommentSection(indicator) {
    const contentId = indicator.querySelector('.comment-count').getAttribute('data-content-id');
    const threadSection = document.querySelector(`.full-comment-thread[data-content-id="${contentId}"]`);
    
    if (threadSection) {
        const isOpening = !threadSection.classList.contains('open');
        threadSection.classList.toggle('open');
        indicator.classList.toggle('active');
        
        if (isOpening) {
            renderComments(contentId);
        }
    }
}

function updateCommentCount(contentId, count) {
    const countElement = document.querySelector(`.comment-count[data-content-id="${contentId}"]`);
    if (countElement) {
        countElement.textContent = count || 0;
    }
}

async function initializeCommentCounts() {
    document.querySelectorAll('.comment-count').forEach(async (countElement) => {
        const contentId = countElement.getAttribute('data-content-id');
        if (!contentId) return;
        
        try {
            const res = await fetch(`${API_URL}${API_BASE_PATH}/${contentId}`);
            if (res.ok) {
                const comments = await res.json();
                updateCommentCount(contentId, comments.length);
            }
        } catch (err) {
            console.error(`Error loading comment count for ${contentId}:`, err);
        }
    });
}

async function renderComments(contentId) {
    const list = document.getElementById("comments-list-" + contentId);
    if (!list) return;
    
    list.innerHTML = "<p>Loading comments...</p>";

    try {
        const res = await fetch(`${API_URL}${API_BASE_PATH}/${contentId}`); 
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const comments = await res.json();

        list.innerHTML = "";
        if (comments.length === 0) {
            list.innerHTML = '<div class="comments-empty">No comments yet. Be the first to comment!</div>';
        } else {
            comments.forEach(comment => {
                const div = document.createElement("div");
                div.classList.add("comment-item");
                
                const isOwner = isUserSignedIn() && getCurrentUserEmail() === comment.email;
                
                div.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-user-email">${escapeHtml(comment.email || "Guest")}</span>
                        <span class="comment-date">${new Date(comment.date).toLocaleString()}</span>
                    </div>
                    <div class="comment-body">${escapeHtml(comment.text)}</div>
                    <div class="comment-actions">
                        <button class="reply-btn" onclick="toggleReplyForm('${contentId}', '${comment._id}')">Reply</button>
                        ${isOwner ? `<button class="delete-btn" onclick="deleteComment('${contentId}', '${comment._id}')">Delete</button>` : ''}
                    </div>
                    <div class="reply-form-container" id="reply-form-${comment._id}">
                        <textarea class="reply-input" placeholder="Write a reply..." rows="2"></textarea>
                        <div class="reply-form-actions">
                            <button class="cancel-reply-btn" onclick="toggleReplyForm('${contentId}', '${comment._id}')">Cancel</button>
                            <button class="submit-reply-btn" onclick="submitReply('${contentId}', '${comment._id}')">Post Reply</button>
                        </div>
                    </div>
                    <div class="replies-container" id="replies-${comment._id}"></div>
                `;
                list.appendChild(div);
                
                if (comment.replies && comment.replies.length > 0) {
                    renderReplies(comment._id, comment.replies);
                }
            });
        }
        
        updateCommentCount(contentId, comments.length);

    } catch (err) {
        console.error('Error loading comments:', err);
        list.innerHTML = `<p class="error">Error loading comments: ${err.message}</p>`;
    }
}

function renderReplies(parentCommentId, replies = []) {
    const container = document.getElementById(`replies-${parentCommentId}`);
    if (!container) return;

    container.innerHTML = ''; 

    if (replies.length === 0) return;

    replies.forEach(reply => {
        const div = document.createElement('div');
        div.classList.add('reply-item');

        div.innerHTML = `
            <div class="reply-header">
                <span class="reply-user-email">${escapeHtml(reply.email || 'Guest')}</span>
                <span class="reply-date">${new Date(reply.date).toLocaleString()}</span>
            </div>
            <div class="reply-body">${escapeHtml(reply.text)}</div>
        `;

        container.appendChild(div);
    });
}

async function submitComment(contentId) {
    if (!isUserSignedIn()) {
        showToast('⚠️ Please sign in with Google first.');
        return;
    }
    
    const textarea = document.querySelector(
        `.full-comment-thread[data-content-id="${contentId}"] .comment-input`
    );
    
    if (!textarea) return;
    
    const text = textarea.value.trim();
    if (!text) {
        showToast('⚠️ Please write a comment');
        return;
    }

    const email = getCurrentUserEmail();

    try {
        const res = await fetch(`${API_URL}${API_BASE_PATH}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, email, text })
        });

        // FIX: Better error handling to read the JSON message from server
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        textarea.value = "";
        renderComments(contentId);
        showToast('✅ Comment posted!');
    } catch (err) {
        console.error('Error submitting comment:', err);
        showToast("Error: " + err.message);
    }
}

async function deleteComment(contentId, commentId) {
    try {
        const res = await fetch(`${API_URL}${API_BASE_PATH}/${commentId}`, {
            method: "DELETE"
        });

        // FIX: Better error handling
        if (!res.ok) {
             const errorData = await res.json().catch(() => ({}));
             throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        renderComments(contentId);
        showToast('🗑️ Comment deleted');
    } catch (err) {
        console.error('Error deleting comment:', err);
        showToast("Error: " + err.message);
    }
}

function toggleReplyForm(contentId, commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (replyForm) {
        replyForm.classList.toggle("active");
    }
}

async function submitReply(contentId, commentId) {
   if (!isUserSignedIn()) {
    showToast('⚠️ Please sign in with Google first.');
    return;
   }

    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (!replyForm) return;

    const textarea = replyForm.querySelector(".reply-input");
    const text = textarea.value.trim();
    if (!text) {
        showToast("⚠️ Please write a reply");
        return;
    }

    const email = getCurrentUserEmail();

    try {
        const res = await fetch(`${API_URL}${API_BASE_PATH}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, parentCommentId: commentId, email, text }),
        });

        // FIX: Better error handling
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        textarea.value = "";
        replyForm.classList.remove("active");
        renderComments(contentId);
        showToast("✅ Reply posted!");
    } catch (err) {
        console.error("Error submitting reply:", err);
        showToast("Error: " + err.message);
    }
}
