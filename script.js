/* ==========================================================================
   Apex Agency Premium Javascript Platform Suite (SaaS Functions)
   ========================================================================== */

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
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // --- Video Lightbox Modal & Hover Previews logic ---
    const videoCards = document.querySelectorAll('.portfolio-card');
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    const modalClose = document.getElementById('modal-close');

    const isMobile = () => window.innerWidth <= 768;

    if (videoCards.length > 0) {
        // Sync poster visibility with video play/pause/stop events
        videoCards.forEach(card => {
            const video = card.querySelector('.portfolio-video');
            const poster = card.querySelector('.portfolio-poster');
            
            if (video && poster) {
                video.addEventListener('play', () => {
                    poster.style.opacity = '0';
                    video.style.opacity = '1';
                });
                
                const showPoster = () => {
                    poster.style.opacity = '1';
                    video.style.opacity = '0';
                };
                
                video.addEventListener('pause', showPoster);
                video.addEventListener('ended', showPoster);
            }
        });

        // Desktop hover play / pause
        videoCards.forEach(card => {
            const video = card.querySelector('.portfolio-video');
            
            if (video) {
                card.addEventListener('mouseenter', () => {
                    if (!isMobile()) {
                        video.play().catch(err => {
                            console.log('Desktop video hover play blocked:', err);
                        });
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    if (!isMobile()) {
                        video.pause();
                        video.currentTime = 0;
                    }
                });
            }
        });

        // Mobile Auto-play Previews when they enter the center of the viewport
        const mobileVideoObserver = new IntersectionObserver((entries) => {
            if (!isMobile()) return;
            
            entries.forEach(entry => {
                const video = entry.target.querySelector('.portfolio-video');
                if (video) {
                    if (entry.isIntersecting) {
                        video.play().catch(err => {
                            console.log('Mobile video autoplay blocked:', err);
                        });
                    } else {
                        video.pause();
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-15% 0px -15% 0px'
        });

        videoCards.forEach(card => {
            mobileVideoObserver.observe(card);
        });

        // Lightbox Popup triggers on card click
        if (videoModal && videoIframe && modalClose) {
            const modalRotate = document.getElementById('modal-rotate');
            let currentRotation = 0;

            videoCards.forEach(card => {
                card.addEventListener('click', () => {
                    const videoId = card.getAttribute('data-video-id');
                    
                    const bgVideo = card.querySelector('.portfolio-video');
                    if (bgVideo) bgVideo.pause();

                    if (videoId) {
                        currentRotation = 0;
                        const container = videoModal.querySelector('.iframe-container');
                        if (container) container.style.transform = '';

                        const embedUrl = `https://drive.google.com/file/d/${videoId}/preview?autoplay=1`;
                        videoIframe.src = embedUrl;
                        videoModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            if (modalRotate) {
                modalRotate.addEventListener('click', () => {
                    currentRotation = (currentRotation + 90) % 360;
                    const container = videoModal.querySelector('.iframe-container');
                    if (container) {
                        if (currentRotation === 90 || currentRotation === 270) {
                            container.style.transform = `rotate(${currentRotation}deg) scale(0.5625)`;
                        } else {
                            container.style.transform = `rotate(${currentRotation}deg) scale(1)`;
                        }
                    }
                });
            }

            const closeVideoModal = () => {
                videoModal.classList.remove('active');
                videoIframe.src = '';
                const container = videoModal.querySelector('.iframe-container');
                if (container) {
                    container.style.transform = '';
                }
                currentRotation = 0;
                document.body.style.overflow = '';
            };

            modalClose.addEventListener('click', closeVideoModal);
            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    closeVideoModal();
                }
            });
        }
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
                const clientName = container.closest('.review-card').querySelector('.review-client').textContent.trim();
                const reviewRole = container.closest('.review-card').querySelector('.review-role').textContent.trim();
                
                if (img) {
                    modalImgDisplay.src = img.src;
                    modalImgCaption.textContent = `${clientName} — ${reviewRole} (Click image to Zoom In/Out)`;
                    imageModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    modalImgDisplay.style.transform = 'scale(1)';
                    modalImgDisplay.style.cursor = 'zoom-in';
                }
            });
        });

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

    // ==========================================
    // --- Interactive SaaS Project Planner ---
    // ==========================================

    // --- 1. Pricing Calculator Logic ---
    const calcServices = document.querySelectorAll('.calc-service-item');
    const calcQtyInput = document.getElementById('calc-qty');
    const calcQtyVal = document.getElementById('calc-qty-val');
    const calcPrioritySelect = document.getElementById('calc-priority');
    const calcTotalVal = document.getElementById('calc-total');

    const calculateTotal = () => {
        let baseSum = 0;
        
        // Sum prices of all selected checkboxes
        calcServices.forEach(checkbox => {
            if (checkbox.checked) {
                baseSum += parseInt(checkbox.getAttribute('data-price'), 10);
            }
        });

        const quantity = parseInt(calcQtyInput.value, 10);
        const priorityMultiplier = parseFloat(calcPrioritySelect.value);

        // Compute total pricing formula
        const total = Math.round(baseSum * quantity * priorityMultiplier);
        
        // Display with basic animation / formatting
        if (calcTotalVal) {
            calcTotalVal.textContent = total.toLocaleString();
        }
    };

    if (calcServices.length > 0 && calcQtyInput && calcPrioritySelect && calcTotalVal) {
        // Event Listeners for Calculator
        calcServices.forEach(box => box.addEventListener('change', calculateTotal));
        
        calcQtyInput.addEventListener('input', (e) => {
            calcQtyVal.textContent = e.target.value;
            calculateTotal();
        });
        
        calcPrioritySelect.addEventListener('change', calculateTotal);
        
        // Run initial calculation
        calculateTotal();
    }

    // --- 2. Onboarding Lead Wizard Logic ---
    const wizardForm = document.getElementById('onboarding-form');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const progressIndicators = document.querySelectorAll('.step-indicator');
    const progressBar = document.getElementById('wizard-progress-bar');
    
    let activeStepNum = 1;

    const updateWizardUI = () => {
        // Toggle step element visibility classes
        wizardSteps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'), 10);
            if (stepNum === activeStepNum) {
                step.classList.add('active-step');
            } else {
                step.classList.remove('active-step');
            }
        });

        // Update indicators classes
        progressIndicators.forEach((ind, index) => {
            if (index + 1 <= activeStepNum) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });

        // Update progress bar width percentage
        if (progressBar) {
            const percentage = ((activeStepNum - 1) / (wizardSteps.length - 1)) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    };

    if (wizardForm) {
        const nextButtons = wizardForm.querySelectorAll('.btn-next');
        const prevButtons = wizardForm.querySelectorAll('.btn-prev');

        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Validation checklist on current step inputs
                const currentStepEl = wizardForm.querySelector(`.wizard-step[data-step="${activeStepNum}"]`);
                const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
                let valid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        valid = false;
                        input.style.borderColor = '#ef4444'; // Red error outline
                    } else {
                        input.style.borderColor = ''; // Clear outline
                    }
                });

                if (valid) {
                    activeStepNum++;
                    if (activeStepNum > wizardSteps.length) activeStepNum = wizardSteps.length;
                    updateWizardUI();
                }
            });
        });

        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                activeStepNum--;
                if (activeStepNum < 1) activeStepNum = 1;
                updateWizardUI();
            });
        });

        // Form Submit brief to WhatsApp Onboarding logic
        wizardForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract Briefing Selections
            const goal = wizardForm.querySelector('input[name="onboard-goal"]:checked').value;
            const budget = document.getElementById('onboard-budget').value;
            const description = document.getElementById('onboard-desc').value.trim() || 'No additional briefs provided.';
            const brand = document.getElementById('onboard-brand').value.trim();
            const contactName = document.getElementById('onboard-name').value.trim();
            const contactInfo = document.getElementById('onboard-email').value.trim();

            // Format Estimated Pricing if calculated
            const estimatedSum = calcTotalVal ? calcTotalVal.textContent : 'Calculated on brief';

            // Construct corporate brief template
            const message = `*APEX AGENCY ONBOARDING BRIEF*\n\n` +
                            `• *Brand Name:* ${brand}\n` +
                            `• *Contact Person:* ${contactName}\n` +
                            `• *Contact Info / LinkedIn:* ${contactInfo}\n\n` +
                            `• *Main Goal:* ${goal}\n` +
                            `• *Allocated Budget Range:* ${budget}\n` +
                            `• *Calculated Service Estimate:* $${estimatedSum} USD\n\n` +
                            `• *Creative Directives / Description:*\n"${description}"\n\n` +
                            `Please review this brief to initialize our digital marketing campaign!`;

            // URL Encode the message
            const encodedMessage = encodeURIComponent(message);
            const whatsAppUrl = `https://wa.me/917661970181?text=${encodedMessage}`;

            // Open WhatsApp tab
            window.open(whatsAppUrl, '_blank');
        });
    }

});
