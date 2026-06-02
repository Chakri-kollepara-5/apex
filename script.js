/* ==========================================
   Apex Edits Premium Javascript Interactivity
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY >= 50) {
            header.classList.add('scroll-active');
        } else {
            header.classList.remove('scroll-active');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial run on load

    // --- Responsive Mobile Navigation ---
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            // Toggle hamburger icon between bars and close icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('show-menu')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('show-menu');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    });

    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active-link');
                } else {
                    navLink.classList.remove('active-link');
                }
            }
        });
    };
    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // --- Stats Counter Animation ---
    const statNums = document.querySelectorAll('.stat-num');
    let animatedStats = false;

    const animateStats = () => {
        statNums.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            // Adjust step increment for larger numbers like 1000 to keep duration smooth
            const increment = target > 500 ? Math.ceil(target / 100) : 1;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = current;
                }
            }, stepTime);
        });
    };

    // Observer for statistics counting trigger
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animateStats();
                    animatedStats = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }

    // --- Fade-in Transition Scroll Observer ---
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                fadeObserver.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // --- Video Lightbox Modal logic ---
    const videoCards = document.querySelectorAll('.portfolio-card');
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    const modalClose = document.getElementById('modal-close');

    if (videoCards.length > 0 && videoModal && videoIframe && modalClose) {
        videoCards.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.getAttribute('data-video-id');
                if (videoId) {
                    // Embed link with autoplay enabled
                    const embedUrl = `https://drive.google.com/file/d/${videoId}/preview?autoplay=1`;
                    videoIframe.src = embedUrl;
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Stop page scroll
                }
            });
        });

        const closeVideoModal = () => {
            videoModal.classList.remove('active');
            videoIframe.src = '';
            document.body.style.overflow = ''; // Restore scroll
        };

        modalClose.addEventListener('click', closeVideoModal);
        
        // Close modal when clicking outside content box
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // --- Image Zoom Lightbox Modal logic ---
    const zoomableImages = document.querySelectorAll('.review-image-container');
    const imageModal = document.getElementById('image-modal');
    const modalImgDisplay = document.getElementById('modal-img-display');
    const modalImgCaption = document.getElementById('modal-img-caption');
    const imageModalClose = document.getElementById('image-modal-close');

    if (zoomableImages.length > 0 && imageModal && modalImgDisplay && imageModalClose) {
        zoomableImages.forEach(container => {
            container.addEventListener('click', () => {
                const img = container.querySelector('.review-img');
                const clientName = container.closest('.review-card').querySelector('.review-client').textContent;
                const reviewTag = container.closest('.review-card').querySelector('.review-tag').textContent;
                
                if (img) {
                    modalImgDisplay.src = img.src;
                    modalImgCaption.textContent = `${clientName} — ${reviewTag} (Click image to Zoom In/Out)`;
                    imageModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Reset image styling zoom state
                    modalImgDisplay.style.transform = 'scale(1)';
                    modalImgDisplay.style.cursor = 'zoom-in';
                }
            });
        });

        // Click on image inside modal to zoom in/out
        modalImgDisplay.addEventListener('click', () => {
            const currentScale = modalImgDisplay.style.transform;
            if (currentScale === 'scale(1.8)') {
                modalImgDisplay.style.transform = 'scale(1)';
                modalImgDisplay.style.cursor = 'zoom-in';
            } else {
                modalImgDisplay.style.transform = 'scale(1.8)';
                modalImgDisplay.style.cursor = 'zoom-out';
            }
        });

        const closeImageModal = () => {
            imageModal.classList.remove('active');
            modalImgDisplay.src = '';
            document.body.style.overflow = '';
        };

        imageModalClose.addEventListener('click', closeImageModal);
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
});
