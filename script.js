// ===== LOADER =====
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');

    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 15 + 5;
        if (width > 100) width = 100;
        progress.style.width = width + '%';
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 400);
        }
    }, 150);
});

// ===== CURSOR SPOTLIGHT =====
const spotlight = document.getElementById('cursorSpotlight');

if (spotlight) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        spotlight.style.left = x + 'px';
        spotlight.style.top = y + 'px';
    });
}

// ===== NAV SCROLL =====
const nav = document.getElementById('siteNav');
let lastScroll = 0;

if (nav) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
}

// ===== MOBILE NAV TOGGLE =====
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== LIVE IST CLOCK =====
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

// ===== MARQUEE PAUSE =====
const marqueeTrack = document.getElementById('marqueeTrack');

if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
    });

    marqueeTrack.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
    });
}

// ===== SMOOTH SCROLL =====
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

// ===== CONTACT FORM HANDLING (UPDATED) =====
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

// ===== COPY TO CLIPBOARD =====
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

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.skill-card, .achievement-card, .project-card, .timeline-card, .edu-card, .cert-card, .contact-card, .social-btn, .contact-right, .value-card').forEach(el => {
    if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    }
});

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        if (toggle) {
            toggle.classList.remove('active');
        }
    }
});

// ===== CONSOLE LOG =====
console.log('🔥 Sake Nikhitha · Portfolio loaded successfully!');
console.log('📧 sakenikhitha102@gmail.com');
console.log('🔗 linkedin.com/in/nikhitha-sake');
console.log('🐙 github.com/fabpot-glitch');