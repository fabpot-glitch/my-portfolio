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
                // Dispatch event for cinematic letterbox
                document.dispatchEvent(new Event('site:loaded'));
            }, 400);
        }
    }, 120);
});

// ============================================================
// CINEMATIC 3D LAYER
// Letterbox intro, mouse-parallax hero, 3D tilt cards,
// scroll-driven dolly/rotate reveals. Pure enhancement —
// does not touch any existing behavior in script.js.
// ============================================================
(function() {
    'use strict';

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isCoarsePointer = !window.matchMedia('(hover: hover)').matches;

    /* ========== Letterbox cinematic intro ========== */
    function openLetterbox() {
        var top = document.getElementById('letterboxTop');
        var bottom = document.getElementById('letterboxBottom');
        if (!top || !bottom) return;
        requestAnimationFrame(function() {
            setTimeout(function() {
                top.classList.add('collapsed');
                bottom.classList.add('collapsed');
            }, 650);
        });
    }
    document.addEventListener('site:loaded', openLetterbox);
    // Fallback in case loader event never fires (e.g. script order issue)
    window.addEventListener('load', function() {
        setTimeout(openLetterbox, 1800);
    });

    if (prefersReduced) return; // skip all motion-heavy 3D below

    /* ========== Assign cinematic reveal classes to section blocks ========== */
    var dollySections = [
        { sel: '.value-header', cls: 'cine-reveal' },
        { sel: '.skills-header', cls: 'cine-reveal' },
        { sel: '.exp-header', cls: 'cine-reveal-left' },
        { sel: '.projects-header', cls: 'cine-reveal' },
        { sel: '.github-showcase-content', cls: 'cine-reveal' },
        { sel: '.achievements-header', cls: 'cine-reveal' },
        { sel: '.certifications-header', cls: 'cine-reveal' },
        { sel: '.education-header', cls: 'cine-reveal' },
        { sel: '.contact-header', cls: 'cine-reveal' },
        { sel: '.contact-left', cls: 'cine-reveal-left' },
        { sel: '.contact-right', cls: 'cine-reveal-right' }
    ];

    var dollyObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                dollyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

    dollySections.forEach(function(s) {
        document.querySelectorAll(s.sel).forEach(function(el) {
            el.classList.add(s.cls);
            dollyObserver.observe(el);
        });
    });

    /* ========== 3D tilt on hover (project cards, skill cards, value cards, etc.) ========== */
    if (!isCoarsePointer) {
        var tiltCards = document.querySelectorAll('.tilt-card, .tilt-card-deep');

        tiltCards.forEach(function(card) {
            var maxTilt = card.classList.contains('tilt-card-deep') ? 10 : 7;
            var lift = card.classList.contains('tilt-card-deep') ? 10 : 6;
            var raf = null;

            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width;
                var y = (e.clientY - rect.top) / rect.height;
                var rotateY = (x - 0.5) * maxTilt * 2;
                var rotateX = (0.5 - y) * maxTilt * 2;

                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(function() {
                    card.style.transform =
                        'perspective(1200px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(' + lift + 'px)';
                });
            });

            card.addEventListener('mouseleave', function() {
                if (raf) cancelAnimationFrame(raf);
                card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    /* ========== Hero mouse-parallax (portrait + floating badges) ========== */
    var heroVisual = document.querySelector('.hero-visual');
    var portraitWrapper = document.querySelector('.portrait-wrapper');
    var hero = document.getElementById('hero');

    if (heroVisual && portraitWrapper && hero && !isCoarsePointer) {
        var heroRaf = null;
        hero.addEventListener('mousemove', function(e) {
            var rect = hero.getBoundingClientRect();
            var px = (e.clientX - rect.left) / rect.width - 0.5;
            var py = (e.clientY - rect.top) / rect.height - 0.5;

            if (heroRaf) cancelAnimationFrame(heroRaf);
            heroRaf = requestAnimationFrame(function() {
                heroVisual.style.transform =
                    'rotateY(' + (px * 10) + 'deg) rotateX(' + (-py * 8) + 'deg)';
                portraitWrapper.style.transform =
                    'translate(' + (px * -14) + 'px, ' + (py * -10) + 'px)';

                document.querySelectorAll('.floating-badge').forEach(function(badge) {
                    var depth = parseFloat(badge.getAttribute('data-depth')) || 0.06;
                    var bx = px * 60 * depth * 10;
                    var by = py * 60 * depth * 10;
                    var z = badge.classList.contains('badge-1') ? 70 :
                        badge.classList.contains('badge-2') ? 55 : 85;
                    badge.style.transform =
                        'translate(' + bx + 'px, ' + by + 'px) translateZ(' + z + 'px)';
                });
            });
        });

        hero.addEventListener('mouseleave', function() {
            if (heroRaf) cancelAnimationFrame(heroRaf);
            heroVisual.style.transform = 'rotateY(0deg) rotateX(0deg)';
            portraitWrapper.style.transform = 'translate(0px, 0px)';
            document.querySelectorAll('.floating-badge').forEach(function(badge) {
                badge.style.transform = '';
            });
        });
    }

    /* ========== Scroll-linked cinematic dolly on hero (subtle zoom-out feel) ========== */
    var heroStage = document.querySelector('.hero-stage');
    if (heroStage) {
        var ticking = false;
        window.addEventListener('scroll', function() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function() {
                var y = window.scrollY;
                var heroHeight = hero ? hero.offsetHeight : 800;
                var progress = Math.min(y / heroHeight, 1);
                var scale = 1 - progress * 0.06;
                var translateZ = -progress * 120;
                var opacity = 1 - progress * 0.5;
                heroStage.style.transform = 'translateZ(' + translateZ + 'px) scale(' + scale + ')';
                heroStage.style.opacity = Math.max(opacity, 0.35);
                ticking = false;
            });
        }, { passive: true });
    }

    /* ========== Section depth-parallax: GitHub showcase + contact wrapper subtle float ========== */
    var floatEls = document.querySelectorAll('.github-showcase-content, .contact-wrapper');
    floatEls.forEach(function(el) {
        if (isCoarsePointer) return;
        var raf2 = null;
        el.addEventListener('mousemove', function(e) {
            var rect = el.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            if (raf2) cancelAnimationFrame(raf2);
            raf2 = requestAnimationFrame(function() {
                el.style.transform = 'rotateX(' + (-y * 2.4) + 'deg) rotateY(' + (x * 2.4) + 'deg)';
            });
        });
        el.addEventListener('mouseleave', function() {
            if (raf2) cancelAnimationFrame(raf2);
            el.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });

    /* ========== Create Letterbox Elements if they don't exist ========== */
    function createLetterboxElements() {
        if (!document.getElementById('letterboxTop')) {
            const top = document.createElement('div');
            top.id = 'letterboxTop';
            top.className = 'letterbox letterbox-top';
            document.body.prepend(top);
        }
        if (!document.getElementById('letterboxBottom')) {
            const bottom = document.createElement('div');
            bottom.id = 'letterboxBottom';
            bottom.className = 'letterbox letterbox-bottom';
            document.body.appendChild(bottom);
        }
    }

    // Add letterbox styles if they don't exist
    function addLetterboxStyles() {
        if (!document.getElementById('letterboxStyles')) {
            const style = document.createElement('style');
            style.id = 'letterboxStyles';
            style.textContent = `
                .letterbox {
                    position: fixed;
                    left: 0;
                    right: 0;
                    height: 10vh;
                    background: #0a0808;
                    z-index: 9999;
                    transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
                    pointer-events: none;
                }
                .letterbox-top {
                    top: 0;
                    transform: translateY(0);
                }
                .letterbox-bottom {
                    bottom: 0;
                    transform: translateY(0);
                }
                .letterbox-top.collapsed {
                    transform: translateY(-100%);
                }
                .letterbox-bottom.collapsed {
                    transform: translateY(100%);
                }
                /* Cinematic reveal animations */
                .cine-reveal {
                    opacity: 0;
                    transform: translateY(40px) scale(0.98);
                    transition: opacity 0.9s cubic-bezier(0.23, 1, 0.32, 1),
                                transform 0.9s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .cine-reveal.visible {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                .cine-reveal-left {
                    opacity: 0;
                    transform: translateX(-50px) scale(0.97);
                    transition: opacity 0.9s cubic-bezier(0.23, 1, 0.32, 1),
                                transform 0.9s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .cine-reveal-left.visible {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
                .cine-reveal-right {
                    opacity: 0;
                    transform: translateX(50px) scale(0.97);
                    transition: opacity 0.9s cubic-bezier(0.23, 1, 0.32, 1),
                                transform 0.9s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .cine-reveal-right.visible {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
                /* Hero stage for dolly effect */
                .hero-stage {
                    transition: opacity 0.1s linear;
                    will-change: transform, opacity;
                }
                @media (max-width: 768px) {
                    .letterbox {
                        height: 5vh;
                    }
                    .cine-reveal {
                        transform: translateY(25px) scale(0.98);
                    }
                    .cine-reveal.visible {
                        transform: translateY(0) scale(1);
                    }
                    .cine-reveal-left {
                        transform: translateX(-30px) scale(0.97);
                    }
                    .cine-reveal-left.visible {
                        transform: translateX(0) scale(1);
                    }
                    .cine-reveal-right {
                        transform: translateX(30px) scale(0.97);
                    }
                    .cine-reveal-right.visible {
                        transform: translateX(0) scale(1);
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .letterbox {
                        transition: none;
                    }
                    .letterbox-top.collapsed,
                    .letterbox-bottom.collapsed {
                        display: none;
                    }
                    .cine-reveal,
                    .cine-reveal-left,
                    .cine-reveal-right {
                        opacity: 1 !important;
                        transform: none !important;
                        transition: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize letterbox elements and styles
    if (!prefersReduced) {
        createLetterboxElements();
        addLetterboxStyles();
    }

})();

// ============================================================
// CINEMATIC 3D STARFIELD BACKGROUND
// Canvas-based depth-parallax stars + floating geometric
// shapes (triangles, rings, diamonds). Mouse + scroll driven.
// Requires: <canvas id="cinematicBg"></canvas> right after <body>
// ============================================================
(function() {
    'use strict';

    function init() {
        var canvas = document.getElementById('cinematicBg');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var width, height, stars = [], shapes = [];
        var mouseX = 0.5, mouseY = 0.5, scrollY = 0;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Starfield: depth-layered points
        var STAR_COUNT = window.innerWidth < 768 ? 90 : 180;
        for (var i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * 0.8 + 0.2, // depth factor (parallax strength)
                r: Math.random() * 1.4 + 0.3,
                tw: Math.random() * Math.PI * 2 // twinkle phase
            });
        }

        // Floating geometric shapes (triangles, rings, diamonds)
        var SHAPE_COUNT = window.innerWidth < 768 ? 4 : 8;
        var shapeTypes = ['triangle', 'ring', 'diamond'];
        for (var s = 0; s < SHAPE_COUNT; s++) {
            shapes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 26 + 14,
                z: Math.random() * 0.6 + 0.3,
                rot: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.004,
                type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: Math.random() * 0.0008 + 0.0004
            });
        }

        function drawShape(sh, t) {
            var floatY = Math.sin(t * sh.floatSpeed + sh.floatPhase) * 18;
            var px = sh.x + (mouseX - 0.5) * 40 * sh.z + (scrollY * 0.05 * sh.z);
            var py = sh.y + (mouseY - 0.5) * 40 * sh.z + floatY;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(sh.rot);
            ctx.strokeStyle = 'rgba(255, 77, 48, ' + (0.25 * sh.z) + ')';
            ctx.lineWidth = 1.2;

            if (sh.type === 'triangle') {
                ctx.beginPath();
                for (var i = 0; i < 3; i++) {
                    var a = (Math.PI * 2 / 3) * i - Math.PI / 2;
                    var px2 = Math.cos(a) * sh.size, py2 = Math.sin(a) * sh.size;
                    if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
                }
                ctx.closePath();
                ctx.stroke();
            } else if (sh.type === 'ring') {
                ctx.beginPath();
                ctx.arc(0, 0, sh.size * 0.5, 0, Math.PI * 2);
                ctx.stroke();
            } else if (sh.type === 'diamond') {
                ctx.beginPath();
                ctx.moveTo(0, -sh.size * 0.5);
                ctx.lineTo(sh.size * 0.5, 0);
                ctx.lineTo(0, sh.size * 0.5);
                ctx.lineTo(-sh.size * 0.5, 0);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();

            sh.rot += sh.rotSpeed;
        }

        function animate(t) {
            ctx.clearRect(0, 0, width, height);

            // Stars with twinkle + subtle parallax
            for (var i = 0; i < stars.length; i++) {
                var st = stars[i];
                var twinkle = 0.5 + 0.5 * Math.sin(t * 0.0015 + st.tw);
                var px = st.x + (mouseX - 0.5) * 60 * st.z + (scrollY * 0.08 * st.z);
                var py = st.y + (mouseY - 0.5) * 60 * st.z;

                // wrap vertically with scroll for infinite feel
                var wrappedY = ((py % height) + height) % height;

                ctx.beginPath();
                ctx.arc(px, wrappedY, st.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 244, 230, ' + (0.15 + twinkle * 0.55) + ')';
                ctx.fill();
            }

            // Floating geometric shapes
            for (var j = 0; j < shapes.length; j++) {
                drawShape(shapes[j], t);
            }

            if (!prefersReduced) requestAnimationFrame(animate);
        }

        if (!prefersReduced) {
            requestAnimationFrame(animate);

            document.addEventListener('mousemove', function(e) {
                mouseX = e.clientX / width;
                mouseY = e.clientY / height;
            });

            window.addEventListener('scroll', function() {
                scrollY = window.scrollY;
            }, { passive: true });
        } else {
            // Static single frame for reduced-motion users
            animate(0);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

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
    // now.getTime() is an absolute UTC epoch timestamp already,
    // so we only need to add the IST offset (UTC+5:30) — no
    // local-timezone correction should be layered on top of it.
    const now = new Date();
    const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffsetMs);

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
console.log('%c🎬 Sake Nikhitha · Cinematic Portfolio', 'font-size: 20px; font-weight: bold; color: #ff4d30;');
console.log('%c📧 sakenikhitha102@gmail.com', 'font-size: 14px; color: #6b5f55;');
console.log('%c🔗 linkedin.com/in/nikhitha-sake', 'font-size: 14px; color: #6b5f55;');
console.log('%c🐙 github.com/fabpot-glitch', 'font-size: 14px; color: #6b5f55;');
console.log('%c✨ Built with ❤️ · HTML · CSS · JavaScript · Cinematic 3D', 'font-size: 12px; color: #999;');