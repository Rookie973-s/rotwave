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
  document.getElementById(tabName).classList.add("active");
  
  if (clickedButton) {
    clickedButton.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- MENU LOGIC ----
function toggleMenu() {
    const menu = document.getElementById('menuDrawer');
    const isVisible = menu.classList.toggle('active');
    
    const menuToggleBtn = document.getElementById('menuToggle');
    if (isVisible) {
        const firstFocusable = menu.querySelector('#menuCloseBtn, a'); 
        if (firstFocusable) {
            firstFocusable.focus();
        }
    } else {
        menuToggleBtn.focus();
    }
}

// ---- SEARCH TOGGLE LOGIC ----
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

// ---- TOAST NOTIFICATION ----
function showCopiedToast() {
  let toast = document.createElement('div');
  toast.innerText = '✅ Link copied!';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #222;
    color: #fff;
    padding: 10px 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    font-size: 14px;
    z-index: 1000;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ---- HEADER HIDE/SHOW ----
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

// ---- DOM READY: MAIN FUNCTIONALITY ----
document.addEventListener("DOMContentLoaded", function() {
  
  // 1. Read More button handling
  document.querySelectorAll(".read-more-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const article = btn.closest('.article-card');
      if (article) {
        article.classList.toggle("expanded");
        btn.textContent = article.classList.contains('expanded') ? 'Read Less' : 'Read More';
      }
    });
  });

  // 2. Run search if input has value
  const input = document.getElementById('searchInput');
  if (input && input.value.trim() !== '') {
    document.getElementById('searchDropdown')?.classList.add('active');
    runSearch(input.value.trim().toLowerCase());
  }

  // 3. Share button feature
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

  // 4. Scroll to shared article/review
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
          target.classList.add("expanded"); 
        }

        target.style.boxShadow = "0 0 15px #ff9800"; 
        setTimeout(() => (target.style.boxShadow = ""), 2000);
      }, 1000);
    }
  }
});

// ---- LENS LOGIC ----
const bladeCount = 8;
const bladesContainer = document.getElementById('blades');
const centerCircle = document.getElementById('center');
const fstopDisplay = document.getElementById('fstop');

if (bladesContainer && centerCircle && fstopDisplay) {
    for (let i = 0; i < bladeCount; i++) {
        const blade = document.createElement('div');
        blade.className = 'blade';
        blade.innerHTML = '<div class="blade-inner"></div>';
        blade.style.transform = `rotate(${(360 / bladeCount) * i}deg)`;
        bladesContainer.appendChild(blade);
    }

    const blades = document.querySelectorAll('.blade');
    let lastScrollY = window.scrollY;
    let rotation = 0;

    const fStops = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

    function updateAperture() {
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
        fstopDisplay.textContent = `f/${fStops[fstopIndex]}`;
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
}

// =================================================================
// 💬 ===== COMMENT SECTION LOGIC (FIXED) =====
// =================================================================

const API_URL = "https://wave-backend-umi8.onrender.com";

// Current user state
let currentUser = null;

// -----------------------------------------------------------------
// 💡 Helper Functions
// -----------------------------------------------------------------

/**
 * Parse JWT token
 */
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

/**
 * Show toast notification
 */
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

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Check if user is signed in
 */
function isUserSignedIn() {
    return currentUser !== null;
}

/**
 * Get current user email
 */
function getCurrentUserEmail() {
    return currentUser;
}

// -----------------------------------------------------------------
// 👤 User/Form State Functions
// -----------------------------------------------------------------

/**
 * Prompt Google Sign-In
 */
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

/**
 * Handle Google Sign-In
 */
function handleGoogleSignIn(response) {
    const user = parseJwt(response.credential);
    if (!user) {
        showToast('❌ Error signing in');
        return;
    }
    
    currentUser = user.email;
    localStorage.setItem("googleUser", JSON.stringify(user));
    updateAllCommentForms();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    
    showToast(`✅ Signed in as ${user.email}`);
}

/**
 * Logout function
 */
function logout() {
    currentUser = null;
    localStorage.removeItem("googleUser");
    updateAllCommentForms();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    showToast('✅ Logged out successfully');
}

/**
 * Restore user on page load
 */
document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("googleUser");
    if (saved) {
        try {
            const user = JSON.parse(saved);
            currentUser = user.email;
            
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
        } catch (e) {
            console.error('Error parsing saved user:', e);
        }
    }
    updateAllCommentForms();
    initializeCommentCounts();
});

/**
 * Update all comment forms
 */
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

// -----------------------------------------------------------------
// 📢 Display and Initialization
// -----------------------------------------------------------------

/**
 * Toggle comment section
 */
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

/**
 * Update comment count
 */
function updateCommentCount(contentId, count) {
    const countElement = document.querySelector(`.comment-count[data-content-id="${contentId}"]`);
    if (countElement) {
        countElement.textContent = count || 0;
    }
}

/**
 * Initialize comment counts
 */
async function initializeCommentCounts() {
    document.querySelectorAll('.comment-count').forEach(async (countElement) => {
        const contentId = countElement.getAttribute('data-content-id');
        if (!contentId) {
            console.error('Comment count element missing data-content-id');
            return;
        }
        
        try {
            // FIX: Use correct API path without /comments prefix
            const res = await fetch(`${API_URL}/${contentId}`);
            if (res.ok) {
                const comments = await res.json();
                updateCommentCount(contentId, comments.length);
            }
        } catch (err) {
            console.error(`Error loading comment count for ${contentId}:`, err);
        }
    });
}

// -----------------------------------------------------------------
// 🌐 API Interaction Functions
// -----------------------------------------------------------------

/**
 * Render comments
 */
async function renderComments(contentId) {
    const list = document.getElementById("comments-list-" + contentId);
    if (!list) {
        console.error(`Comments list not found for: comments-list-${contentId}`);
        return;
    }
    
    list.innerHTML = "<p>Loading comments...</p>";

    try {
        // FIX: Use correct API path without /comments prefix
        const res = await fetch(`${API_URL}/${contentId}`);
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

/**
 * Render replies
 */
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

/**
 * Submit comment
 */
async function submitComment(contentId) {
    if (!isUserSignedIn()) {
        showToast('⚠️ Please sign in with Google first.');
        return;
    }
    
    const textarea = document.querySelector(
        `.full-comment-thread[data-content-id="${contentId}"] .comment-input`
    );
    
    if (!textarea) {
        console.error(`Textarea not found for contentId: ${contentId}`);
        return;
    }
    
    const text = textarea.value.trim();
    if (!text) {
        showToast('⚠️ Please write a comment');
        return;
    }

    const email = getCurrentUserEmail();

    try {
        // FIX: Use correct API path without /comments prefix
        const res = await fetch(`${API_URL}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, email, text })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        textarea.value = "";
        renderComments(contentId);
        showToast('✅ Comment posted!');
    } catch (err) {
        console.error('Error submitting comment:', err);
        showToast("Error submitting comment: " + err.message);
    }
}

/**
 * Delete comment
 */
async function deleteComment(contentId, commentId) {
    if (!isUserSignedIn()) {
        showToast('⚠️ Please sign in first.');
        return;
    }
    
    try {
        // FIX: Use correct API path without /comments prefix
        const res = await fetch(`${API_URL}/${commentId}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        renderComments(contentId);
        showToast('🗑️ Comment deleted');
    } catch (err) {
        console.error('Error deleting comment:', err);
        showToast("Error deleting comment: " + err.message);
    }
}

/**
 * Toggle reply form
 */
function toggleReplyForm(contentId, commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (replyForm) {
        replyForm.classList.toggle("active");
    } else {
        console.warn(`Reply form not found for comment: ${commentId}`);
    }
}

/**
 * Submit reply
 */
async function submitReply(contentId, commentId) {
    if (!isUserSignedIn()) {
        showToast('⚠️ Please sign in with Google first.');
        return;
    }

    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (!replyForm) {
        console.error(`Reply form not found for comment: ${commentId}`);
        return;
    }

    const textarea = replyForm.querySelector(".reply-input");
    const text = textarea.value.trim();
    if (!text) {
        showToast("⚠️ Please write a reply");
        return;
    }

    const email = getCurrentUserEmail();

    try {
        // FIX: Use correct API path without /comments prefix
        const res = await fetch(`${API_URL}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, parentCommentId: commentId, email, text }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        textarea.value = "";
        replyForm.classList.remove("active");
        renderComments(contentId);
        showToast("✅ Reply posted!");
    } catch (err) {
        console.error("Error submitting reply:", err);
        showToast("Error submitting reply: " + err.message);
    }
}
