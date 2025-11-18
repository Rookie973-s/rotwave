// ===== ENHANCED MENU WITH BACKDROP =====

// Create and add backdrop element
const menuBackdrop = document.createElement('div');
menuBackdrop.className = 'menu-backdrop';
menuBackdrop.id = 'menuBackdrop';
document.body.appendChild(menuBackdrop);

function toggleMenu() {
    const menu = document.getElementById('menuDrawer');
    const backdrop = document.getElementById('menuBackdrop');
    if (!menu || !backdrop) return;
    
    const isVisible = menu.classList.toggle('active');
    backdrop.classList.toggle('active');
    
    // Update user profile display
    updateMenuUserProfile();
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isVisible ? 'hidden' : '';
    
    const menuToggleBtn = document.getElementById('menuToggle');
    if (isVisible) {
        const firstFocusable = menu.querySelector('#menuCloseBtn, a'); 
        if (firstFocusable) firstFocusable.focus();
    } else if (menuToggleBtn) {
        menuToggleBtn.focus();
    }
}

// Close menu when clicking backdrop
menuBackdrop.addEventListener('click', toggleMenu);

// Update menu user profile section
function updateMenuUserProfile() {
    let profileSection = document.querySelector('.menu-user-profile');
    
    if (!profileSection) {
        // Create profile section if it doesn't exist
        profileSection = document.createElement('div');
        profileSection.className = 'menu-user-profile';
        profileSection.innerHTML = `
            <div class="menu-user-avatar"></div>
            <div class="menu-user-info">
                <div class="menu-user-email"></div>
                <div class="menu-user-status">Signed In</div>
            </div>
        `;
        
        const menu = document.getElementById('menuDrawer');
        if (menu) {
            menu.insertBefore(profileSection, menu.firstChild);
        }
    }
    
    if (isUserSignedIn()) {
        const email = getCurrentUserEmail();
        const avatar = profileSection.querySelector('.menu-user-avatar');
        const emailEl = profileSection.querySelector('.menu-user-email');
        
        if (avatar && emailEl) {
            avatar.textContent = email.charAt(0).toUpperCase();
            emailEl.textContent = email;
            profileSection.classList.add('active');
        }
    } else {
        profileSection.classList.remove('active');
    }
}

// ===== MAIN INITIALIZATION =====

document.addEventListener("DOMContentLoaded", function() {
    // --- Initialize New Visual Features ---
    initParallaxCarousel();
    initArticleAnimations();
    initProgressiveImageLoading();
    initReadingTimeCalculator();
    initRippleEffect();
    
    // --- Initialize Review Features ---
    initializeReviewExpansion();
    initializeReadingProgress();
    
    // --- Search Initialization ---
    const input = document.getElementById('searchInput');
    if (input && input.value.trim() !== '') {
        document.getElementById('searchDropdown')?.classList.add('active');
        runSearch(input.value.trim().toLowerCase());
    }

    // --- Enhanced Share Button Initialization ---
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        // Remove any existing listeners (clean slate) and add enhanced version
        button.replaceWith(button.cloneNode(true));
    });
    
    // Re-select buttons after replacement and add listener
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            enhancedShare(button);
        });
    });

    // --- URL Parameter Handling ---
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
                // Add highlight animation
                target.style.animation = 'highlight 2s ease';
                
                if (target.classList.contains('article-card')) {
                    const contentId = target.getAttribute('data-id');
                    if (contentId) {
                        openArticleModal(contentId);
                    }
                }
            }, 1000);
        }
    }
    
    // --- Comments & Auth ---
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
    initializeCommentCounts();
    
    // --- Read More Buttons ---
    document.querySelectorAll("#news .read-more-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const article = btn.closest('.article-card');
            const contentId = article ? article.getAttribute('data-id') : null;
            
            if (contentId) {
                openArticleModal(contentId);
            } else {
                const title = article.querySelector('.article-title').innerText;
                const imageSrc = article.querySelector('.article-image').src;
                const fullContentHTML = article.querySelector('.article-full').innerHTML;
                populateAndShowModal(title, imageSrc, fullContentHTML);
            }
        });
    });

    // --- Modal Close Handlers ---
    const modalOverlay = document.getElementById('article-modal-overlay');
    const modalCloseBtn = document.getElementById('article-modal-close-btn');

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeArticleModal();
            }
        });
    }
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeArticleModal);
    }
});

// ===== NEW VISUAL FEATURES =====

// Parallax effect for carousel
function initParallaxCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    carousel.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = carousel.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        const activeSlide = carousel.querySelector('.carousel-slide:not([style*="translateX"])');
        if (activeSlide) {
            const img = activeSlide.querySelector('.carousel-image');
            if (img) {
                const moveX = (x - 0.5) * 20;
                const moveY = (y - 0.5) * 20;
                img.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
            }
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        const activeSlide = carousel.querySelector('.carousel-slide:not([style*="translateX"])');
        if (activeSlide) {
            const img = activeSlide.querySelector('.carousel-image');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
        }
    });
}

// Staggered animation for article cards on scroll
function initArticleAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.article-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Progressive image loading with blur effect
function initProgressiveImageLoading() {
    const images = document.querySelectorAll('.article-image, .carousel-image');
    
    images.forEach(img => {
        // Create a low-quality placeholder
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            filter: blur(20px);
            transition: opacity 0.5s ease;
            z-index: 1;
        `;
        
        const parent = img.parentElement;
        if (parent) {
            parent.style.position = 'relative';
            parent.insertBefore(placeholder, img);
            
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            if (img.complete) {
                img.style.opacity = '1';
                placeholder.style.opacity = '0';
                setTimeout(() => placeholder.remove(), 500);
            } else {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                    placeholder.style.opacity = '0';
                    setTimeout(() => placeholder.remove(), 500);
                });
            }
        }
    });
}

// Calculate and update reading time for articles
function initReadingTimeCalculator() {
    document.querySelectorAll('.article-card').forEach(card => {
        const fullContent = card.querySelector('.article-full');
        if (!fullContent) return;
        
        // Get text content and calculate reading time
        const text = fullContent.textContent || fullContent.innerText;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min
        
        // Update or create reading time badge
        let timeBadge = card.querySelector('.article-reading-time');
        if (timeBadge) {
            // Look for text node within SVG structure
            const timeText = timeBadge.childNodes[timeBadge.childNodes.length - 1]; 
            if (timeText) {
                 timeBadge.innerHTML = timeBadge.innerHTML.replace(/\d+ min read/, `${readingTime} min read`);
                 // If replace didn't work (empty text), append it
                 if(!timeBadge.innerText.includes('min read')) {
                     timeBadge.innerHTML += ` ${readingTime} min read`;
                 }
            }
        }
    });
}

// Ripple effect for buttons
function initRippleEffect() {
    // Add CSS animation for ripple
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes rippleEffect {
                to { transform: scale(4); opacity: 0; }
            }
            @keyframes highlight {
                0%, 100% { box-shadow: 0 0 0 rgba(255, 107, 53, 0); }
                50% { box-shadow: 0 0 30px rgba(255, 107, 53, 0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    const buttons = document.querySelectorAll('.read-more-btn, .share-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
            `;
            
            // Ensure button has relative positioning
            if(getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== ENHANCED SHARE FUNCTIONALITY =====

function enhancedShare(button) {
    const card = button.closest('.article-card, .review-card');
    if (!card) return;
    
    const title = card.querySelector('.article-title, .review-title')?.innerText || 'Check this out!';
    const articleId = card.getAttribute('data-id');
    const url = `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(articleId)}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `${title} - Read on ROTWAVE Studios`,
            url: url
        }).catch(err => {
            if (err.name !== 'AbortError') {
                fallbackShare(url, title);
            }
        });
    } else {
        fallbackShare(url, title);
    }
}

function fallbackShare(url, title) {
    // Create a temporary modal for sharing options
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: #1a1a1a;
        padding: 2rem;
        border-radius: 16px;
        max-width: 400px;
        width: 90%;
        border: 1px solid #333;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    content.innerHTML = `
        <h3 style="margin: 0 0 1rem 0; color: #fff; font-size: 1.2rem;">Share Article</h3>
        <input type="text" value="${url}" readonly style="
            width: 100%;
            padding: 0.8rem;
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 8px;
            color: #e0e0e0;
            margin-bottom: 1rem;
            font-family: monospace;
        ">
        <div style="display: flex; gap: 0.8rem; justify-content: flex-end;">
            <button class="share-cancel-btn" style="
                padding: 0.6rem 1.2rem;
                background: #333;
                border: none;
                border-radius: 8px;
                color: #e0e0e0;
                cursor: pointer;
                font-weight: 600;
            ">Cancel</button>
            <button class="share-copy-btn" style="
                padding: 0.6rem 1.2rem;
                background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                font-weight: 600;
            ">Copy Link</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Event listeners for the modal
    const cancelBtn = content.querySelector('.share-cancel-btn');
    const copyBtn = content.querySelector('.share-copy-btn');
    
    cancelBtn.onclick = () => modal.remove();
    
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(url).then(() => {
            showEnhancedToast('✅ Link copied!', 'success');
            modal.remove();
        }).catch(() => {
             showEnhancedToast('❌ Failed to copy', 'error');
        });
    };
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Select the URL text
    const input = content.querySelector('input');
    input.select();
}

// ===== REVIEWS - EXPAND/COLLAPSE =====

function initializeReviewExpansion() {
    document.querySelectorAll('.review-body').forEach(reviewBody => {
        // Check if content is longer than collapsed height
        if (reviewBody.scrollHeight > 300) {
            reviewBody.classList.add('collapsed');
            
            // Create expand button
            const expandBtn = document.createElement('button');
            expandBtn.className = 'review-expand-btn';
            expandBtn.innerHTML = `
                <span>Read Full Review</span>
                <span class="review-expand-icon">▼</span>
            `;
            
            expandBtn.addEventListener('click', () => {
                reviewBody.classList.toggle('collapsed');
                reviewBody.classList.toggle('expanded');
                
                if (reviewBody.classList.contains('expanded')) {
                    expandBtn.querySelector('span:first-child').textContent = 'Show Less';
                } else {
                    expandBtn.querySelector('span:first-child').textContent = 'Read Full Review';
                }
            });
            
            reviewBody.appendChild(expandBtn);
        }
    });
}

function initializeReadingProgress() {
    document.querySelectorAll('.review-card').forEach(card => {
        const reviewBody = card.querySelector('.review-body');
        if (!reviewBody) return;
        
        // Create progress indicator
        const progressContainer = document.createElement('div');
        progressContainer.className = 'review-progress';
        progressContainer.innerHTML = '<div class="review-progress-bar"></div>';
        
        card.insertBefore(progressContainer, card.firstChild);
        
        const progressBar = progressContainer.querySelector('.review-progress-bar');
        
        // Update progress on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateReadingProgress(card, reviewBody, progressBar);
                    window.addEventListener('scroll', () => updateReadingProgress(card, reviewBody, progressBar));
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
}

function updateReadingProgress(card, reviewBody, progressBar) {
    const cardRect = card.getBoundingClientRect();
    const cardTop = cardRect.top;
    const cardHeight = cardRect.height;
    const windowHeight = window.innerHeight;
    
    if (cardTop < windowHeight && cardTop + cardHeight > 0) {
        const visibleHeight = Math.min(cardHeight, windowHeight - Math.max(cardTop, 0));
        const progress = (visibleHeight / cardHeight) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';
    }
}

// ===== ENHANCED TOAST NOTIFICATIONS =====

function showEnhancedToast(message, type = 'info') {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span style="font-size: 1.2rem;">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function showToast(message) {
    showEnhancedToast(message, 'info');
}

// ===== CAROUSEL LOGIC =====
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

setInterval(() => {
    moveCarousel(1);
}, 5000);

// Enhanced carousel with keyboard navigation
document.addEventListener('keydown', (e) => {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    if (e.key === 'ArrowLeft') {
        moveCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        moveCarousel(1);
    }
});

// ===== TAB SWITCHING =====
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

// ===== SEARCH LOGIC =====
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

const searchInputEl = document.getElementById('searchInput'); 
if (searchInputEl) {
    searchInputEl.addEventListener('input', function () {
        runSearch(this.value.trim().toLowerCase());
    });
}

// ===== HEADER HIDE ON SCROLL =====
function showCopiedToast() {
    showEnhancedToast('✅ Link copied!', 'success');
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

// ===== THEME TOGGLE LOGIC =====
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

// ===== LENS ANIMATION =====
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

// ===== ARTICLE MODAL FUNCTIONS =====
function openArticleModal(contentId) {
    const articleCard = document.querySelector(`.article-card[data-id="${contentId}"]`);
    if (!articleCard) {
        console.error("Could not find article with ID:", contentId);
        return;
    }

    const title = articleCard.querySelector('.article-title').innerText;
    const imageSrc = articleCard.querySelector('.article-image').src;
    const fullContentHTML = articleCard.querySelector('.article-full').innerHTML;

    populateAndShowModal(title, imageSrc, fullContentHTML);
}

function populateAndShowModal(title, imageSrc, fullContentHTML) {
    const articleModalOverlay = document.getElementById('article-modal-overlay');
    const modalTitle = document.getElementById('article-modal-title');
    const modalImage = document.getElementById('article-modal-image');
    const modalFullText = document.getElementById('article-modal-full-text');

    if (!articleModalOverlay || !modalTitle || !modalImage || !modalFullText) {
        console.error("Modal elements not found. Check your HTML.");
        return;
    }

    modalTitle.innerText = title;
    modalImage.src = imageSrc;
    modalImage.alt = title + " image";
    modalFullText.innerHTML = fullContentHTML;

    articleModalOverlay.style.display = 'flex';
    void articleModalOverlay.offsetWidth;
    
    requestAnimationFrame(() => {
        articleModalOverlay.classList.add('visible');
    });
    
    document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
    const articleModalOverlay = document.getElementById('article-modal-overlay');

    if (!articleModalOverlay) return;
    
    articleModalOverlay.classList.remove('visible');
    document.body.style.overflow = '';

    setTimeout(() => {
        articleModalOverlay.style.display = 'none';
        
        const modalTitle = document.getElementById('article-modal-title');
        const modalImage = document.getElementById('article-modal-image');
        const modalFullText = document.getElementById('article-modal-full-text');

        if (modalTitle) modalTitle.innerText = "Article Title";
        if (modalImage) modalImage.src = "";
        if (modalFullText) modalFullText.innerHTML = "";
    }, 400);
}

// ===== COMMENT SECTION LOGIC =====
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
}

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

function promptSignIn() {
    if (typeof google === 'undefined' || !google.accounts) {
        showEnhancedToast('⚠️ Google Sign-In not loaded yet. Please refresh the page.', 'warning');
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
            updateMenuUserProfile();
            
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.style.display = 'flex';
            
            showEnhancedToast(`✅ Signed in as ${user.email}`, 'success');
        }
    } catch (error) {
        console.error('Sign-in error:', error);
        showEnhancedToast('❌ Sign-in failed. Please try again.', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem("googleUser");
    updateAllCommentForms();
    updateMenuUserProfile();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    showEnhancedToast('👋 Signed out successfully', 'info');
}

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
        showEnhancedToast('⚠️ Please sign in with Google first.', 'warning');
        return;
    }
    
    const textarea = document.querySelector(
        `.full-comment-thread[data-content-id="${contentId}"] .comment-input`
    );
    
    if (!textarea) return;
    
    const text = textarea.value.trim();
    if (!text) {
        showEnhancedToast('⚠️ Please write a comment', 'warning');
        return;
    }

    const email = getCurrentUserEmail();

    try {
        const res = await fetch(`${API_URL}${API_BASE_PATH}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, email, text })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        textarea.value = "";
        renderComments(contentId);
        showEnhancedToast('✅ Comment posted!', 'success');
    } catch (err) {
        console.error('Error submitting comment:', err);
        showEnhancedToast("Error: " + err.message, 'error');
    }
}

async function deleteComment(contentId, commentId) {
    try {
        const res = await fetch(`${API_URL}${API_BASE_PATH}/${commentId}`, {
            method: "DELETE"
        });

        if (!res.ok) {
             const errorData = await res.json().catch(() => ({}));
             throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        renderComments(contentId);
        showEnhancedToast('🗑️ Comment deleted', 'success');
    } catch (err) {
        console.error('Error deleting comment:', err);
        showEnhancedToast("Error: " + err.message, 'error');
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
    showEnhancedToast('⚠️ Please sign in with Google first.', 'warning');
    return;
   }

    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (!replyForm) return;

    const textarea = replyForm.querySelector(".reply-input");
    const text = textarea.value.trim();
    if (!text) {
        showEnhancedToast("⚠️ Please write a reply", 'warning');
        return;
    }

    const email = getCurrentUserEmail();

    try {
        const res = await fetch(`${API_URL}${API_BASE_PATH}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, parentCommentId: commentId, email, text }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        textarea.value = "";
        replyForm.classList.remove("active");
        renderComments(contentId);
        showEnhancedToast("✅ Reply posted!", 'success');
    } catch (err) {
        console.error("Error submitting reply:", err);
        showEnhancedToast("Error: " + err.message, 'error');
    }
}
