// ============================================================
// LOADER - Premium Animation
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    const percent = document.getElementById('loaderPercent');

    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 12 + 3;
        if (width > 100) width = 100;
        progress.style.width = width + '%';
        if (percent) percent.textContent = Math.round(width) + '%';
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 400);
        }
    }, 120);
});

// ============================================================
// CURSOR SPOTLIGHT - Interactive Glow
// ============================================================
const spotlight = document.getElementById('cursorSpotlight');
const customCursor = document.getElementById('customCursor');

if (spotlight) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        spotlight.style.left = x + 'px';
        spotlight.style.top = y + 'px';
    });
}

// Custom cursor (only on hover devices)
if (customCursor && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });

    // Add hover effect on interactive elements
    document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .btn-download, .project-card, .skill-card, .value-card, .cert-card, .edu-card, .social-btn, .nav-cta').forEach(el => {
        el.addEventListener('mouseenter', () => {
            customCursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            customCursor.classList.remove('hover');
        });
    });
}

// ============================================================
// NAV - Scroll Effects (PERMANENTLY VISIBLE - no hide)
// ============================================================
const nav = document.getElementById('siteNav');
const progressBar = document.getElementById('navProgress');
let lastScroll = 0;

if (nav) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Update progress bar
        if (progressBar) {
            progressBar.style.width = (docHeight > 0 ? (currentScroll / docHeight) * 100 : 0) + '%';
        }

        // Add scrolled class for styling
        if (currentScroll > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active section highlighting
        updateActiveNavLink(currentScroll);

        lastScroll = currentScroll;
    }, { passive: true });
}

// ============================================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================================
function updateActiveNavLink(scrollY) {
    const sections = ['hero', 'experience', 'projects', 'education', 'certifications', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

    let currentSection = 'hero';
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            const offset = 120;
            const top = section.offsetTop - offset;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                currentSection = id;
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// ============================================================
// TYPING EFFECT - Premium
// ============================================================
const typingElement = document.getElementById('typingText');
if (typingElement) {
    const roles = [
        'Aspiring Machine Learning Engineer',
        'Full-Stack Developer',
        'AI/ML Enthusiast',
        'Open Source Contributor'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing effect after a delay
    setTimeout(typeEffect, 1000);
}

// ============================================================
// LIVE IST CLOCK
// ============================================================
function updateClock() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);

    const hours = String(istTime.getUTCHours()).padStart(2, '0');
    const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(istTime.getUTCSeconds()).padStart(2, '0');

    const timeStr = `IST · ${hours}:${minutes}:${seconds}`;

    const navClock = document.getElementById('navClock');
    const footerClock = document.getElementById('footerClock');
    if (navClock) navClock.textContent = timeStr;
    if (footerClock) footerClock.textContent = timeStr;
}

updateClock();
setInterval(updateClock, 1000);

// ============================================================
// MARQUEE PAUSE ON HOVER
// ============================================================
const marqueeTrack = document.getElementById('marqueeTrack');

if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
    });

    marqueeTrack.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
    });
}

// ============================================================
// SMOOTH SCROLL - Premium (with offset for fixed nav)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ============================================================
// MOBILE NAV TOGGLE
// ============================================================
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close nav on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================================
// SCROLL REVEAL ANIMATIONS - GSAP Style
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // If it's a stat counter, trigger counting
            if (entry.target.classList.contains('stat') && entry.target.dataset.count) {
                animateCounter(entry.target);
            }
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all reveal elements
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .stat').forEach(el => {
    if (el) {
        revealObserver.observe(el);
    }
});

// ============================================================
// ANIMATE COUNTERS - Premium Number Animation
// ============================================================
function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    if (!target || element.dataset.animated) return;

    element.dataset.animated = 'true';
    const numberEl = element.querySelector('.stat-number');
    if (!numberEl) return;

    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let step = 0;

    const interval = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
            current = target;
            clearInterval(interval);
        }
        if (target >= 100) {
            numberEl.textContent = Math.round(current) + '+';
        } else {
            numberEl.textContent = Math.round(current);
        }
    }, duration / steps);
}

// ============================================================
// CONTACT FORM HANDLING
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('formSuccess');
    const contactForm = document.getElementById('contactForm');

    if (submitBtn && contactForm) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const subject = document.getElementById('contactSubject');
            const message = document.getElementById('contactMessage');

            const fields = [name, email, subject, message];
            let isValid = true;

            // Clear previous errors
            fields.forEach(field => {
                field.classList.remove('error');
                const errorMsg = field.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.classList.remove('show');
            });

            // Validate all fields
            fields.forEach(field => {
                const errorMsg = field.parentElement.querySelector('.error-message');
                if (!field.value.trim()) {
                    field.classList.add('error');
                    if (errorMsg) errorMsg.classList.add('show');
                    isValid = false;
                }
            });

            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value && !emailPattern.test(email.value)) {
                email.classList.add('error');
                const errorMsg = email.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.textContent = 'Please enter a valid email address';
                    errorMsg.classList.add('show');
                }
                isValid = false;
            }

            if (!isValid) return;

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate sending (replace with actual API call)
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                successMsg.classList.add('show');

                // Reset form
                fields.forEach(field => field.value = '');

                // Hide success after 5 seconds
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 5000);
            }, 1500);
        });
    }
});

// ============================================================
// COPY TO CLIPBOARD
// ============================================================
document.querySelectorAll('.contact-card[data-copy]').forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        const text = this.dataset.copy;
        const feedback = this.querySelector('.copy-feedback');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                feedback.classList.add('show');
                setTimeout(() => feedback.classList.remove('show'), 2000);
            }).catch(() => {
                fallbackCopy(text, feedback);
            });
        } else {
            fallbackCopy(text, feedback);
        }
    });
});

// Fallback copy function
function fallbackCopy(text, feedback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
}

// ============================================================
// KEYBOARD ACCESSIBILITY
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const toggle = document.getElementById('navToggle');
        if (navLinks) navLinks.classList.remove('active');
        if (toggle) toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============================================================
// PERFORMANCE: Lazy Load Images
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.loading = 'eager';
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
});

// ============================================================
// CONSOLE LOG - Professional Branding
// ============================================================
console.log('%c🔥 Sake Nikhitha · Portfolio', 'font-size: 20px; font-weight: bold; color: #ff4d30;');
console.log('%c📧 sakenikhitha102@gmail.com', 'font-size: 14px; color: #6b5f55;');
console.log('%c🔗 linkedin.com/in/nikhitha-sake', 'font-size: 14px; color: #6b5f55;');
console.log('%c🐙 github.com/fabpot-glitch', 'font-size: 14px; color: #6b5f55;');
console.log('%c✨ Built with ❤️ using HTML, CSS & JavaScript', 'font-size: 12px; color: #999;');