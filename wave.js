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
function toggleMenu() {
    const menu = document.getElementById('menuDrawer');
    const isVisible = menu.classList.toggle('active');
    
    // Accessibility focus management
    const menuToggleBtn = document.getElementById('menuToggle');
    if (isVisible) {
        // Find first link in the menu and focus it
        menu.querySelector('a').focus(); 
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
  
  // 1. Expand / collapse handling for news articles
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
       // --- COMMENT SECTION & THREADING LOGIC ---

// In-memory storage for comments (simulating a database)
const commentsDatabase = {};

// Current user state (simulating authentication)
let currentUser = null;

// Check if user is signed in
function isUserSignedIn() {
    return currentUser !== null;
}

// Get current user email
function getCurrentUserEmail() {
    return currentUser;
}

// Simulate sign-in (for demo purposes)
function promptSignIn() {
    const email = prompt("Enter your email to sign in (demo):");
    if (email && email.includes('@')) {
        currentUser = email;
        updateAllCommentForms();
        showToast('✅ Signed in successfully!');
    } else if (email) {
        alert('Please enter a valid email address');
    }
}

// Simulate sign-out
function signOut() {
    currentUser = null;
    updateAllCommentForms();
    showToast('👋 Signed out');
}

// Update all comment forms based on sign-in state
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

// Toggle comment section visibility
function toggleCommentSection(indicator) {
    const contentId = indicator.querySelector('.comment-count').getAttribute('data-content-id');
    const threadSection = document.querySelector(`.full-comment-thread[data-content-id="${contentId}"]`);
    
    if (threadSection) {
        const isOpening = !threadSection.classList.contains('open');
        threadSection.classList.toggle('open');
        indicator.classList.toggle('active');
        
        if (isOpening) {
            loadComments(contentId);
        }
    }
}

// Load and display comments
function loadComments(contentId) {
    const listElement = document.getElementById(`comments-list-${contentId}`);
    
    if (!commentsDatabase[contentId] || commentsDatabase[contentId].length === 0) {
        listElement.innerHTML = '<div class="comments-empty">No comments yet. Be the first to comment!</div>';
        return;
    }
    
    listElement.innerHTML = '';
    commentsDatabase[contentId].forEach(comment => {
        listElement.appendChild(createCommentElement(comment, contentId));
    });
}

// Create comment element
function createCommentElement(comment, contentId) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    commentDiv.setAttribute('data-comment-id', comment.id);
    
    const isOwner = isUserSignedIn() && getCurrentUserEmail() === comment.userEmail;
    
    commentDiv.innerHTML = `
        <div class="comment-header">
            <span class="comment-user-email">${comment.userEmail}</span>
            <span class="comment-date">${comment.date}</span>
        </div>
        <div class="comment-body">${escapeHtml(comment.text)}</div>
        <div class="comment-actions">
            <button class="reply-btn" onclick="showReplyForm('${comment.id}', '${contentId}')">Reply</button>
            ${isOwner ? `<button class="delete-btn" onclick="deleteComment('${contentId}', '${comment.id}')">Delete</button>` : ''}
        </div>
        <div class="reply-form-container" id="reply-form-${comment.id}">
            <textarea class="reply-input" id="reply-input-${comment.id}" placeholder="${isUserSignedIn() ? 'Write a reply...' : 'Sign in to reply...'}" rows="2" ${!isUserSignedIn() ? 'disabled' : ''}></textarea>
            <div class="reply-form-actions">
                ${!isUserSignedIn() ? 
                    `<button class="sign-in-prompt-btn" onclick="promptSignIn()">Sign In to Reply</button>` :
                    `<button class="submit-reply-btn" onclick="submitReply('${contentId}', '${comment.id}')">Post Reply</button>
                     <button class="cancel-reply-btn" onclick="hideReplyForm('${comment.id}')">Cancel</button>`
                }
            </div>
        </div>
        <div class="replies-container" id="replies-${comment.id}"></div>
    `;
    
    // Add replies if they exist
    if (comment.replies && comment.replies.length > 0) {
        const repliesContainer = commentDiv.querySelector(`#replies-${comment.id}`);
        comment.replies.forEach(reply => {
            repliesContainer.appendChild(createReplyElement(reply, contentId, comment.id));
        });
    }
    
    return commentDiv;
}

// Create reply element
function createReplyElement(reply, contentId, parentId) {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'reply-item';
    replyDiv.setAttribute('data-reply-id', reply.id);
    
    const isOwner = isUserSignedIn() && getCurrentUserEmail() === reply.userEmail;
    
    replyDiv.innerHTML = `
        <div class="comment-header">
            <span class="comment-user-email">${reply.userEmail}</span>
            <span class="comment-date">${reply.date}</span>
        </div>
        <div class="comment-body">${escapeHtml(reply.text)}</div>
        <div class="comment-actions">
            ${isOwner ? `<button class="delete-btn" onclick="deleteReply('${contentId}', '${parentId}', '${reply.id}')">Delete</button>` : ''}
        </div>
    `;
    
    return replyDiv;
}

// Submit new comment
function submitComment(contentId) {
    if (!isUserSignedIn()) {
        promptSignIn();
        return;
    }
    
    const input = document.querySelector(`.full-comment-thread[data-content-id="${contentId}"] .comment-input`);
    const text = input.value.trim();
    
    if (!text) {
        showToast('⚠️ Please write a comment');
        return;
    }
    
    if (!commentsDatabase[contentId]) {
        commentsDatabase[contentId] = [];
    }
    
    const comment = {
        id: 'comment-' + Date.now(),
        userEmail: getCurrentUserEmail(),
        text: text,
        date: getTimeAgo(new Date()),
        timestamp: new Date(),
        replies: []
    };
    
    commentsDatabase[contentId].push(comment);
    input.value = '';
    
    loadComments(contentId);
    updateCommentCount(contentId);
    showToast('✅ Comment posted!');
}

// Show reply form
function showReplyForm(commentId, contentId) {
    if (!isUserSignedIn()) {
        promptSignIn();
        return;
    }
    
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (replyForm) {
        replyForm.classList.toggle('active');
        if (replyForm.classList.contains('active')) {
            document.getElementById(`reply-input-${commentId}`).focus();
        }
    }
}

// Hide reply form
function hideReplyForm(commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (replyForm) {
        replyForm.classList.remove('active');
        document.getElementById(`reply-input-${commentId}`).value = '';
    }
}

// Submit reply
function submitReply(contentId, parentCommentId) {
    if (!isUserSignedIn()) {
        promptSignIn();
        return;
    }
    
    const input = document.getElementById(`reply-input-${parentCommentId}`);
    const text = input.value.trim();
    
    if (!text) {
        showToast('⚠️ Please write a reply');
        return;
    }
    
    const parentComment = commentsDatabase[contentId].find(c => c.id === parentCommentId);
    if (!parentComment) return;
    
    const reply = {
        id: 'reply-' + Date.now(),
        userEmail: getCurrentUserEmail(),
        text: text,
        date: getTimeAgo(new Date()),
        timestamp: new Date()
    };
    
    if (!parentComment.replies) {
        parentComment.replies = [];
    }
    
    parentComment.replies.push(reply);
    input.value = '';
    hideReplyForm(parentCommentId);
    
    loadComments(contentId);
    updateCommentCount(contentId);
    showToast('✅ Reply posted!');
}

// Delete comment
function deleteComment(contentId, commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    
    const index = commentsDatabase[contentId].findIndex(c => c.id === commentId);
    if (index !== -1) {
        commentsDatabase[contentId].splice(index, 1);
        loadComments(contentId);
        updateCommentCount(contentId);
        showToast('🗑️ Comment deleted');
    }
}

// Delete reply
function deleteReply(contentId, parentCommentId, replyId) {
    if (!confirm('Are you sure you want to delete this reply?')) {
        return;
    }
    
    const parentComment = commentsDatabase[contentId].find(c => c.id === parentCommentId);
    if (parentComment && parentComment.replies) {
        const index = parentComment.replies.findIndex(r => r.id === replyId);
        if (index !== -1) {
            parentComment.replies.splice(index, 1);
            loadComments(contentId);
            updateCommentCount(contentId);
            showToast('🗑️ Reply deleted');
        }
    }
}

// Update comment count display
function updateCommentCount(contentId) {
    const countElement = document.querySelector(`.comment-count[data-content-id="${contentId}"]`);
    if (countElement && commentsDatabase[contentId]) {
        let total = commentsDatabase[contentId].length;
        commentsDatabase[contentId].forEach(comment => {
            if (comment.replies) {
                total += comment.replies.length;
            }
        });
        countElement.textContent = total;
    }
}

// Helper: Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    return date.toLocaleDateString();
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper: Show toast notification
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
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Initialize comment counts on page load
function initializeCommentCounts() {
    document.querySelectorAll('.comment-count').forEach(countElement => {
        const contentId = countElement.getAttribute('data-content-id');
        updateCommentCount(contentId);
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCommentCounts();
    updateAllCommentForms();
});
const API_URL = "https://wave-backend-umi8.onrender.com"; // your backend server

// Load and display comments from MongoDB
async function renderComments(contentId) {
  const list = document.getElementById("comments-list-" + contentId);
  list.innerHTML = "<p>Loading comments...</p>";

  try {
    const res = await fetch(`${API_URL}/${contentId}`);
    const comments = await res.json();

    list.innerHTML = "";
    if (comments.length === 0) {
      list.innerHTML = "<p>No comments yet.</p>";
    } else {
      comments.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("comment-item");
        div.innerHTML = `
          <div class="comment-header">
            <span class="comment-user-email">${c.email || "Guest"}</span>
            <span class="comment-date">${new Date(c.date).toLocaleString()}</span>
          </div>
          <div class="comment-body">${c.text}</div>
        `;
        list.appendChild(div);
      });
    }

  } catch (err) {
    list.innerHTML = `<p class="error">Error loading comments: ${err.message}</p>`;
  }
}

// Add a new comment
async function submitComment(contentId) {
  const textarea = document.querySelector(
    `.full-comment-thread[data-content-id="${contentId}"] .comment-input`
  );
  const text = textarea.value.trim();
  if (!text) return;

  const email = localStorage.getItem("currentUser") || "Guest";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, email, text })
    });

    if (!res.ok) throw new Error("Failed to save comment");

    textarea.value = "";
    renderComments(contentId); // refresh comment list
  } catch (err) {
    alert("Error submitting comment: " + err.message);
  }
}

// Toggle comment section (open/close)
function toggleCommentSection(btn) {
  const article = btn.closest(".article-card");
  const thread = article.querySelector(".full-comment-thread");
  thread.classList.toggle("open");
  const id = article.dataset.id;
  renderComments(id);
}

// ---- END ----
