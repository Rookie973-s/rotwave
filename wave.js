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

// ---- NEW: MENU LOGIC ----
// ---- NEW: MENU LOGIC ----
function toggleMenu() {
    const menu = document.getElementById('menuDrawer');
    const isVisible = menu.classList.toggle('active');
    
    // Accessibility focus management
    const menuToggleBtn = document.getElementById('menuToggle');
    if (isVisible) {
        // Find the new Close button or the first link and focus it
        const firstFocusable = menu.querySelector('#menuCloseBtn, a'); 
        if (firstFocusable) {
            firstFocusable.focus();
        }
    } else {
        // Return focus to the toggle button
        menuToggleBtn.focus();
    }
}

// ---- NEW: SEARCH ICON TOGGLE LOGIC (Replaces the inline search bar) ----
function toggleSearchDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');
    
    // Toggle the visibility
    const isVisible = searchDropdown.classList.toggle('active');
    
    // If shown, focus the input; otherwise, clear and blur it
    if (isVisible) {
        searchInput.focus();
    } else {
        searchInput.value = ''; // Clear the input when hiding
        runSearch('');         // Clear results
        searchInput.blur();
    }
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
  // Do not hide if the menu or search dropdown is open
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
  
  // 1. Expand / collapse handling for news articles - now handled by read-more button only
  document.querySelectorAll(".read-more-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const article = btn.closest('.article-card');
      if (article) {
        article.classList.toggle("expanded");
        // Update button text
        btn.textContent = article.classList.contains('expanded') ? 'Read Less' : 'Read More';
      }
    });
  });

  // 2. Run a search on load if input has text (only relevant if page loads with a query)
  const input = document.getElementById('searchInput');
  if (input && input.value.trim() !== '') {
    // Ensure the dropdown is active if there is a search query
    document.getElementById('searchDropdown')?.classList.add('active');
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
//Lens Logic
 const bladeCount = 8;
        const bladesContainer = document.getElementById('blades');
        const centerCircle = document.getElementById('center');
        const fstopDisplay = document.getElementById('fstop');
        
        // Create aperture blades
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

        // F-stop values for display
        const fStops = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

        function updateAperture() {
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = window.scrollY / maxScroll;
            
            // Calculate rotation based on scroll direction
            const scrollDelta = window.scrollY - lastScrollY;
            rotation += scrollDelta * 0.1;
            lastScrollY = window.scrollY;
            
            // Aperture opens when scrolling down (0 to 100%)
            const openPercent = scrollPercent;
            
            // Min and max aperture size
            const minSize = 4; // Smallest opening (f/22)
            const maxSize = 44; // Largest opening (f/1.4)
            
            // Calculate current aperture size (inverted: scroll down = open = large)
            const currentSize = minSize + (maxSize - minSize) * openPercent;
            
            // Update center circle
            centerCircle.style.width = currentSize + 'px';
            centerCircle.style.height = currentSize + 'px';
            
            // Calculate blade angle (more closed = more angled inward)
            const bladeAngle = 25 - (openPercent * 20); // From 25deg (closed) to 5deg (open)
            
            // Update each blade
            blades.forEach((blade, index) => {
                const baseRotation = (360 / bladeCount) * index;
                const totalRotation = baseRotation + rotation;
                blade.style.transform = `rotate(${totalRotation}deg) translateX(${-bladeAngle}%)`;
            });
            
            // Update f-stop display (inverted: more open = lower f-stop number)
            const fstopIndex = Math.floor((1 - openPercent) * (fStops.length - 1));
            fstopDisplay.textContent = `f/${fStops[fstopIndex]}`;
        }

        // Initialize
        updateAperture();

        // Update on scroll with throttling for performance
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

        // Handle window resize
        window.addEventListener('resize', updateAperture);

        // Click aperture to scroll to top
        const apertureContainer = document.querySelector('.aperture-container');
        apertureContainer.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
      // =================================================================
// 💬 ===== COMMENT SECTION LOGIC (Frontend) =====
// =================================================================

const API_URL = "https://wave-backend-umi8.onrender.com";

// Current user state
let currentUser = null;

// -----------------------------------------------------------------
// 💡 Helper Functions
// -----------------------------------------------------------------

/**
 * Displays a small toast notification with a message.
 * @param {string} message - The message to display.
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
    
    // Set up removal animation
    setTimeout(() => {
        // Assuming 'fadeOut' is a defined CSS animation
        toast.style.animation = 'fadeOut 0.3s ease'; 
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

/**
 * Escapes HTML content to prevent Cross-Site Scripting (XSS).
 * @param {string} text - The string to escape.
 * @returns {string} The HTML-safe string.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Checks if a user is currently simulated as signed in.
 * @returns {boolean} True if currentUser is set, false otherwise.
 */
function isUserSignedIn() {
    return currentUser !== null;
}

/**
 * Gets the email of the current signed-in user.
 * @returns {string|null} The current user's email.
 */
function getCurrentUserEmail() {
    return currentUser;
}

// -----------------------------------------------------------------
// 👤 User/Form State Functions
// -----------------------------------------------------------------

/**
 * Simulates a sign-in process and saves the user email.
 */
function promptSignIn() {
    const email = prompt("Enter your email to sign in (demo):");
    if (email && email.includes('@')) {
        currentUser = email;
        localStorage.setItem("currentUser", email);
        updateAllCommentForms();
        showToast('✅ Signed in successfully!');
    } else if (email) {
        alert('Please enter a valid email address');
    }
}

/**
 * Updates the disabled status and visibility of all comment inputs/buttons
 * based on the current sign-in state.
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
// 🔄 Display and Initialization
// -----------------------------------------------------------------

/**
 * Toggles the visibility of a specific comment section thread.
 * @param {HTMLElement} indicator - The comment count/toggle button element.
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
 * Updates the visible comment count on the indicator element.
 * @param {string} contentId - The ID of the content item.
 * @param {number} count - The new comment count.
 */
function updateCommentCount(contentId, count) {
    const countElement = document.querySelector(`.comment-count[data-content-id="${contentId}"]`);
    if (countElement) {
        countElement.textContent = count || 0;
    }
}

/**
 * Initializes comment counts for all content items and restores user session on page load.
 */
async function initializeCommentCounts() {
    // Restore user session
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
        currentUser = savedUser;
    }
    
    // Fetch and update comment count for every element
    document.querySelectorAll('.comment-count').forEach(async (countElement) => {
        const contentId = countElement.getAttribute('data-content-id');
        if (!contentId) {
            console.error('Comment count element missing data-content-id');
            return;
        }
        
        try {
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
 * Loads and displays comments from the API for a specific content ID.
 * @param {string} contentId - The ID of the content item.
 */
async function renderComments(contentId) {
    const list = document.getElementById("comments-list-" + contentId);
    if (!list) {
        console.error(`Comments list not found for: comments-list-${contentId}`);
        return;
    }
    
    list.innerHTML = "<p>Loading comments...</p>";

    try {
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
                
                // Render replies if they exist
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
 * Submits a new comment to the backend API.
 * @param {string} contentId - The ID of the content item.
 */
async function submitComment(contentId) {
    if (!isUserSignedIn()) {
        promptSignIn();
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
        const res = await fetch(API_URL, {
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
 * Sends a request to the API to delete a specific comment.
 * @param {string} contentId - The ID of the content item (used for re-rendering).
 * @param {string} commentId - The MongoDB ID of the comment to delete.
 */
async function deleteComment(contentId, commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    
    try {
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
 * Toggles the reply form visibility for a specific comment.
 * @param {string} contentId - The parent content item ID.
 * @param {string} commentId - The ID of the comment to reply to.
 */
function toggleReplyForm(contentId, commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (replyForm) {
        replyForm.classList.toggle("active");
    } else {
        console.warn(`Reply form not found for comment: ${commentId}`);
    }
}
// ---- END ----
