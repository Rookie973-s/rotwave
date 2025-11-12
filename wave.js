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
    clickedButton = document.querySelector(`.tab-btn[data-tab='${tabName}']`);
  }

  // Handle button activation
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  if (clickedButton) {
    clickedButton.classList.add("active");
  } else {
    // Activate the button matching the tabName if the click event wasn't used
    const fallbackButton = document.querySelector(`.tab-btn[data-tab='${tabName}']`);
    if (fallbackButton) fallbackButton.classList.add('active');
  }

  // Activate the content
  const content = document.getElementById(tabName);
  if (content) {
    content.classList.add("active");
  }
}

// Initial tab load (default to the first one)
window.addEventListener('load', () => {
  const defaultTab = document.querySelector('.tab-btn.active');
  if (defaultTab) {
    switchTab(defaultTab.getAttribute('data-tab'));
  } else {
    // Fallback to the very first tab if no 'active' class is set
    const firstTab = document.querySelector('.tab-btn');
    if (firstTab) switchTab(firstTab.getAttribute('data-tab'));
  }
});


// ---- DARK MODE LOGIC ----
function toggleDarkMode() {
  document.body.classList.toggle('light-mode');
  // Save preference to localStorage
  const isLightMode = document.body.classList.contains('light-mode');
  localStorage.setItem('darkModePreference', isLightMode ? 'light' : 'dark');
}

// Load dark mode preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const preference = localStorage.getItem('darkModePreference');
    if (preference === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }

    // Initialize the carousel
    if (track) updateCarousel();
});

// Attach event listener for the toggle button
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', toggleDarkMode);
}


// ---- TOAST NOTIFICATION UTILITY ----
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000); // Hide after 3 seconds
    }
}

// =================================================================
// 🔑 --- AUTH HELPER FUNCTIONS (FIXED) ---
// =================================================================

/**
 * Parses a JWT token to extract the payload data.
 * FIX: This function was missing and caused the ReferenceError.
 * @param {string} token - The JWT token string.
 * @returns {object|null} The decoded payload object or null if decoding fails.
 */
function parseJwt(token) {
    try {
        // Get the payload part (the second part)
        const base64Url = token.split('.')[1];
        // Replace non-url-safe characters and decode
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Decode base64 and parse JSON
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Failed to parse JWT:', e);
        return null;
    }
}


// ---- AUTH & USER STATE MANAGEMENT ----
let currentUser = null; // Stores decoded user data

function isUserSignedIn() {
    return currentUser !== null;
}

function getCurrentUserEmail() {
    return currentUser ? currentUser.email : null;
}

function getCurrentUserName() {
    return currentUser ? currentUser.name : 'Anonymous';
}

function getCurrentUserPic() {
     // Fallback if picture is not available
    return currentUser ? currentUser.picture : 'https://placehold.co/40x40/555/fff?text=U';
}

/**
 * Updates the UI based on the user's sign-in status.
 */
function updateAuthUI() {
    const signInButton = document.getElementById('g_id_signin');
    const userProfileDiv = document.getElementById('userProfile');
    const signOutButton = document.getElementById('signOutButton');
    const commentInput = document.getElementById('comment-input');
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (currentUser) {
        // User is signed in
        if (signInButton) signInButton.style.display = 'none';
        if (userProfileDiv) {
            userProfileDiv.style.display = 'flex';
            const profilePic = userProfileDiv.querySelector('img');
            if (profilePic) {
                profilePic.src = getCurrentUserPic();
                profilePic.alt = getCurrentUserName();
            }
            if(userNameDisplay) userNameDisplay.textContent = getCurrentUserName();
        }
        if (signOutButton) signOutButton.style.display = 'block';
        if (commentInput) commentInput.placeholder = `Add a comment as ${getCurrentUserName()}...`;
    } else {
        // User is signed out
        if (signInButton) signInButton.style.display = 'block';
        if (userProfileDiv) userProfileDiv.style.display = 'none';
        if (signOutButton) signOutButton.style.display = 'none';
        if (commentInput) commentInput.placeholder = 'Please sign in to comment';
        if (userNameDisplay) userNameDisplay.textContent = '';
    }
}

/**
 * Callback function provided to Google Sign-In button.
 * @param {object} response - The response object from Google.
 */
function handleGoogleSignIn(response) {
    if (response.credential) {
        // This line is where the ReferenceError was occurring
        const decodedToken = parseJwt(response.credential); 
        if (decodedToken) {
            currentUser = decodedToken;
            localStorage.setItem('wave_auth_token', response.credential);
            updateAuthUI();
            showToast(`Welcome, ${getCurrentUserName()}!`);
            // Re-render comments if a section is open, to enable commenting/replying
            document.querySelectorAll('.full-comment-thread.open').forEach(thread => {
                const contentId = thread.getAttribute('data-content-id');
                if (contentId) renderComments(contentId);
            });
        }
    }
}

/**
 * Signs the user out locally.
 */
function signOutUser() {
    currentUser = null;
    localStorage.removeItem('wave_auth_token');
    
    updateAuthUI();
    showToast('You have been signed out.');
    // Re-render to disable input fields
    document.querySelectorAll('.full-comment-thread.open').forEach(thread => {
        const contentId = thread.getAttribute('data-content-id');
        if (contentId) renderComments(contentId);
    });
}

// Attach sign-out listener
const signOutBtn = document.getElementById('signOutButton');
if (signOutBtn) {
    signOutBtn.addEventListener('click', signOutUser);
}

// Check for existing token on load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('wave_auth_token');
    if (token) {
        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) { // Check if token is still valid
            currentUser = decodedToken;
        } else {
            localStorage.removeItem('wave_auth_token'); // Token expired
        }
    }
    // Update UI immediately on load, regardless of auth status
    updateAuthUI();
});

// Make the sign-in handler globally accessible for the Google client script
window.handleGoogleSignIn = handleGoogleSignIn;


// ---- API SETUP ----
const API_URL = 'https://wave-backend-umi8.onrender.com';

// =================================================================
// 💬 --- COMMENT & REPLY RENDERING/LOGIC ---
// =================================================================

/**
 * Creates the HTML for a single reply item.
 * @param {object} reply - The reply data object.
 * @param {string} contentId - The ID of the content.
 * @param {string} parentCommentId - The ID of the parent comment.
 * @returns {string} The HTML string for the reply.
 */
function createReplyHTML(reply, contentId, parentCommentId) {
    const isOwner = reply.email === getCurrentUserEmail();
    const formattedDate = new Date(reply.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return `
        <div class="reply-item" id="reply-${reply._id}">
            <div class="reply-header">
                <img src="${reply.userPic || 'https://placehold.co/40x40/555/fff?text=U'}" alt="${reply.userName}" class="user-pic">
                <div class="reply-meta">
                    <span class="reply-user-name">${reply.userName}</span>
                    <span class="reply-date">${formattedDate}</span>
                </div>
                <div class="reply-actions">
                    ${isOwner ? `<button class="delete-btn" onclick="deleteReply('${contentId}', '${parentCommentId}', '${reply._id}')">Delete</button>` : ''}
                    <button class="like-btn" onclick="toggleLike('${reply._id}', 'reply', '${contentId}')">
                        <svg class="like-icon ${reply.likes.includes(getCurrentUserEmail()) ? 'liked' : ''}" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        <span class="like-count">${reply.likes.length}</span>
                    </button>
                </div>
            </div>
            <p class="reply-text">${reply.text}</p>
        </div>
    `;
}

/**
 * Creates the HTML for a single comment thread.
 * @param {object} comment - The comment data object.
 * @param {string} contentId - The ID of the content.
 * @returns {string} The HTML string for the comment.
 */
function createCommentHTML(comment, contentId) {
    const isOwner = comment.email === getCurrentUserEmail();
    const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Generate replies HTML
    const repliesHTML = comment.replies.map(reply => createReplyHTML(reply, contentId, comment._id)).join('');

    // Determine the reply form state
    const replyFormActive = isUserSignedIn() ? 'active' : '';
    const replyPlaceholder = isUserSignedIn() ? `Reply as ${getCurrentUserName()}...` : 'Please sign in to reply';
    const isReplyEnabled = isUserSignedIn();
    const replyInputDisabled = isReplyEnabled ? '' : 'disabled';


    return `
        <div class="comment-item" id="comment-${comment._id}">
            <div class="comment-header">
                <img src="${comment.userPic || 'https://placehold.co/40x40/555/fff?text=U'}" alt="${comment.userName}" class="user-pic">
                <div class="comment-meta">
                    <span class="comment-user-name">${comment.userName}</span>
                    <span class="comment-date">${formattedDate}</span>
                </div>
                <div class="comment-actions">
                    ${isOwner ? `<button class="delete-btn" onclick="deleteComment('${contentId}', '${comment._id}')">Delete</button>` : ''}
                    <button class="like-btn" onclick="toggleLike('${comment._id}', 'comment', '${contentId}')">
                         <svg class="like-icon ${comment.likes.includes(getCurrentUserEmail()) ? 'liked' : ''}" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        <span class="like-count">${comment.likes.length}</span>
                    </button>
                    <button class="reply-btn" onclick="toggleReplyForm('${comment._id}', event)">Reply</button>
                </div>
            </div>
            <p class="comment-text">${comment.text}</p>
            
            <div class="replies-container">
                ${repliesHTML}
                
                <form id="reply-form-${comment._id}" class="reply-form" onsubmit="event.preventDefault(); submitReply('${contentId}', '${comment._id}')">
                    <textarea class="reply-input" placeholder="${replyPlaceholder}" rows="2" ${replyInputDisabled}></textarea>
                    <button type="submit" class="submit-reply-btn" ${replyInputDisabled}>Post Reply</button>
                </form>
            </div>
        </div>
    `;
}

/**
 * Renders the comments for a specific content ID.
 * @param {string} contentId - The unique ID of the content.
 */
async function renderComments(contentId) {
    const commentsList = document.getElementById(`comments-list-${contentId}`);
    const commentsSection = document.getElementById(`full-comment-thread-${contentId}`);
    const commentInput = document.getElementById('comment-input');
    
    if (!commentsList || !commentsSection || !commentInput) return;

    commentsList.innerHTML = '<div class="comments-loading">Loading comments...</div>';
    
    // Disable main comment input if user is not signed in
    const isEnabled = isUserSignedIn();
    commentInput.disabled = !isEnabled;
    commentInput.placeholder = isEnabled ? `Add a comment as ${getCurrentUserName()}...` : 'Please sign in to comment';
    
    try {
        // Fetch comments for the specific contentId
        const res = await fetch(`${API_URL}/${contentId}`); 

        if (!res.ok) {
             // 502 Bad Gateway is likely handled here now.
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const comments = await res.json();
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="comments-empty">Be the first to leave a comment!</div>';
            return;
        }

        const commentsHTML = comments.map(comment => createCommentHTML(comment, contentId)).join('');
        commentsList.innerHTML = commentsHTML;

    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = '<div class="comments-error">Error loading comments. Please try again later.</div>';
    }
}

/**
 * Toggles the visibility of the full comment section.
 * @param {string} contentId - The unique ID of the content.
 * @param {Event} event - The click event.
 */
function toggleCommentSection(contentId, event) {
    // Prevent the event from bubbling up and interfering with other logic
    if (event) event.stopPropagation();
    
    const thread = document.getElementById(`full-comment-thread-${contentId}`);
    if (!thread) return;

    // Close all other open threads
    document.querySelectorAll('.full-comment-thread.open').forEach(t => {
        if (t.id !== thread.id) {
            t.classList.remove('open');
        }
    });

    thread.classList.toggle('open');
    
    if (thread.classList.contains('open')) {
        renderComments(contentId);
    }
}

/**
 * Toggles the visibility of the reply form.
 * @param {string} commentId - The ID of the comment whose reply form to toggle.
 * @param {Event} event - The click event.
 */
function toggleReplyForm(commentId, event) {
    if (event) event.stopPropagation();
    
    if (!isUserSignedIn()) {
        showToast('🔒 Please sign in with Google to reply.');
        return;
    }

    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (replyForm) {
        replyForm.classList.toggle('active');
        // If opened, immediately focus the textarea
        if (replyForm.classList.contains('active')) {
            const textarea = replyForm.querySelector('.reply-input');
            if (textarea) textarea.focus();
        }
    }
}

/**
 * Submits the main comment.
 * @param {string} contentId - The ID of the content item.
 */
async function submitComment(contentId) {
    if (!isUserSignedIn()) {
        showToast('🔒 Please sign in with Google first.');
        return;
    }

    const textarea = document.getElementById('comment-input');
    const text = textarea.value.trim();
    if (!text) {
        showToast("⚠️ Please write a comment");
        return;
    }

    const email = getCurrentUserEmail();
    const userName = getCurrentUserName();
    const userPic = getCurrentUserPic();

    try {
        const res = await fetch(`${API_URL}/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, email, userName, userPic, text }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Clear the input field
        textarea.value = "";

        // Re-render comments so the new comment appears immediately
        renderComments(contentId);
        
        showToast("Comment posted successfully! 🎉");

    } catch (error) {
        console.error('Error submitting comment:', error);
        showToast(`❌ Failed to post comment: ${error.message}`);
    }
}

/**
 * Submits a reply to a parent comment.
 * @param {string} contentId - The ID of the content item.
 * @param {string} commentId - The ID of the parent comment being replied to.
 */
async function submitReply(contentId, commentId) {
   if (!isUserSignedIn()) {
    showToast('🔒 Please sign in with Google first.');
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
    const userName = getCurrentUserName();
    const userPic = getCurrentUserPic();


    try {
        const res = await fetch(`${API_URL}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, parentCommentId: commentId, email, userName, userPic, text }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Clear the input field and hide the form
        textarea.value = "";
        replyForm.classList.remove("active");

        // Re-render comments so the new reply appears immediately
        renderComments(contentId);

        showToast("Reply posted successfully! 💬");

    } catch (error) {
        console.error('Error submitting reply:', error);
        showToast(`❌ Failed to post reply: ${error.message}`);
    }
}

/**
 * Toggles a like on a comment or reply.
 * @param {string} itemId - The ID of the comment or reply.
 * @param {('comment'|'reply')} type - The type of item (comment or reply).
 * @param {string} contentId - The ID of the content.
 */
async function toggleLike(itemId, type, contentId) {
    if (!isUserSignedIn()) {
        showToast('🔒 Please sign in to like.');
        return;
    }
    
    const email = getCurrentUserEmail();

    try {
        const endpoint = type === 'comment' ? '/like-comment' : '/like-reply';
        const body = type === 'comment' 
            ? { commentId: itemId, email, contentId }
            : { replyId: itemId, email, contentId };

        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        // No need to wait for response content, just re-render to reflect the change
        renderComments(contentId);

    } catch (error) {
        console.error(`Error toggling like on ${type}:`, error);
        showToast(`❌ Failed to toggle like: ${error.message}`);
    }
}

/**
 * Deletes a comment.
 * @param {string} contentId - The ID of the content.
 * @param {string} commentId - The ID of the comment to delete.
 */
async function deleteComment(contentId, commentId) {
    if (!isUserSignedIn() || getCurrentUserEmail() !== document.querySelector(`#comment-${commentId} .comment-meta span`).previousElementSibling.textContent) {
        // Simplified check, the server must perform a robust authorization check
        showToast('🔒 Not authorized to delete this comment.');
        return;
    }
    
    // Instead of confirm(), use a simple log or modal if implemented
    if (!window.confirm('Are you sure you want to delete this comment?')) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/delete-comment`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId, contentId }), // Sending contentId for potential server-side logic
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        // Re-render comments to remove the deleted comment
        renderComments(contentId);

        showToast("Comment deleted successfully! 👋");

    } catch (error) {
        console.error('Error deleting comment:', error);
        showToast(`❌ Failed to delete comment: ${error.message}`);
    }
}

/**
 * Deletes a reply.
 * @param {string} contentId - The ID of the content.
 * @param {string} parentCommentId - The ID of the parent comment.
 * @param {string} replyId - The ID of the reply to delete.
 */
async function deleteReply(contentId, parentCommentId, replyId) {
    if (!isUserSignedIn() || getCurrentUserEmail() !== document.querySelector(`#reply-${replyId} .reply-meta span`).previousElementSibling.textContent) {
        // Simplified check, the server must perform a robust authorization check
        showToast('🔒 Not authorized to delete this reply.');
        return;
    }

    // Instead of confirm(), use a simple log or modal if implemented
    if (!window.confirm('Are you sure you want to delete this reply?')) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/delete-reply`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parentCommentId, replyId, contentId }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        // Re-render comments to reflect the deleted reply
        renderComments(contentId);

        showToast("Reply deleted successfully! 👋");

    } catch (error) {
        console.error('Error deleting reply:', error);
        showToast(`❌ Failed to delete reply: ${error.message}`);
    }
}


// ---- MENU LOGIC (Ensuring this is correct) ----

function toggleMenu() {
    const nav = document.getElementById('navMenu');
    nav.classList.toggle('active');
    const toggleButton = document.getElementById('menuToggle');
    // Simple state change for aria-expanded
    const isExpanded = nav.classList.contains('active');
    toggleButton.setAttribute('aria-expanded', isExpanded);
}

// Close menu if a link is clicked
document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.getElementById('navMenu');
        if (nav.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Close menu on outside click
document.addEventListener('click', function(event) {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    // Check if the click is outside the menu and the toggle button
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    if (navMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnToggle) {
        toggleMenu();
    }
});


// ---- APERTURE EFFECT LOGIC (Ensuring this is correct) ----
// (Assuming this is a purely decorative effect based on scroll position)

const apertureBlades = 6;
const bladesContainer = document.getElementById('blades');
const centerCircle = document.getElementById('center');
const fstopDisplay = document.getElementById('fstop');
const maxFStop = 16;
const minFStop = 1.4;

// Create blades
if (bladesContainer) {
    for (let i = 0; i < apertureBlades; i++) {
        const blade = document.createElement('div');
        blade.className = 'blade';
        // Distribute blades evenly around 360 degrees
        const rotation = (360 / apertureBlades) * i;
        blade.style.transform = `rotate(${rotation}deg)`;
        bladesContainer.appendChild(blade);
    }
}


function updateAperture() {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

    // Calculate a value between 0 (fully open) and 1 (fully closed)
    const normalizedValue = Math.min(1, Math.max(0, scrollPercent * 2)); // Scroll 50% to open, 50-100% to close

    // Map normalized value to scale (center circle size)
    const scale = 1 - (normalizedValue * 0.9); // Scale goes from 1 (open) down to 0.1 (closed)
    
    // Map normalized value to F-stop display
    // Logarithmic scale for F-stop (simplified for display)
    const fStopValue = minFStop * Math.pow((maxFStop / minFStop), normalizedValue);
    
    if (centerCircle) {
        centerCircle.style.transform = `scale(${scale})`;
    }
    if (fstopDisplay) {
        fstopDisplay.textContent = `f/${fStopValue.toFixed(1)}`;
    }
}

// Attach scroll listener
window.addEventListener('scroll', updateAperture);

// Initial update
window.addEventListener('load', updateAperture);
