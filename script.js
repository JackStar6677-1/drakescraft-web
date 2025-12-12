document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navbar ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // --- Store Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const storeCards = document.querySelectorAll('.store-card');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                // Get Filter Category
                const category = btn.getAttribute('data-category');

                // Filter Cards
                storeCards.forEach(card => {
                    if (card.classList.contains(`category-${category}`)) {
                        card.style.display = 'flex'; // Use flex to maintain layout
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Trigger click on first tab to set initial state
        tabBtns[0].click();
    }

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = 0;
            }

            // Auto close others
            faqQuestions.forEach(other => {
                if (other !== question && other.classList.contains('active')) {
                    other.classList.remove('active');
                    other.nextElementSibling.style.maxHeight = 0;
                }
            });
        });
    });

    // --- Navbar Scroll Spy ---
    const sections = document.querySelectorAll('section, header');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

});

// --- Copy IP Function ---
function copyIp(ip) {
    navigator.clipboard.writeText(ip).then(() => {
        showToast(`¡IP copiada! ${ip}`);
    }).catch(err => {
        console.error('Error al copiar: ', err);
        // Fallback or alert
        alert('Copia la IP manualmente: ' + ip);
    });
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.textContent = message;

    // Style it via JS (or improved with a class in CSS)
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#10B981',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
        zIndex: '9999',
        fontSize: '1rem',
        fontWeight: '500',
        opacity: '0',
        transition: 'opacity 0.3s'
    });

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/* =========================================
   SCROLL-DRIVEN DRAGON ANIMATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const dragonTrajectory = document.querySelector('.dragon-trajectory');
    if (!dragonTrajectory) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return;
    }

    let ticking = false;

    function updateDragonPosition() {
        // Calculate scroll progress (0 to 1)
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        let scrollProgress = 0;
        if (docHeight > 0) {
            scrollProgress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
        }

        // --- Calculate Trajectory ---
        // X Position: From -20vw (left) to 110vw (right)
        const startX = -20;
        const endX = 110;
        const currentX = startX + (scrollProgress * (endX - startX));

        // Y Position: Sine wave
        const baseY = 15;
        const waveAmplitude = 15; // +/- 15vh
        const currentY = baseY + (Math.sin(scrollProgress * Math.PI * 2) * waveAmplitude);

        // Apply Transform
        dragonTrajectory.style.transform = `translate3d(${currentX}vw, ${currentY}vh, 0)`;

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateDragonPosition);
            ticking = true;
        }
    });

    // Initial update
    updateDragonPosition();
});

/* =========================================
       NEXT LEVEL VISUALS & SOUNDS
       ========================================= */

// --- Scroll Reveal (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Optional: Keep observing for re-entry? Let's just do once for now.
            }
        });
    }, observerOptions);

    // Elements to reveal
    const revealElements = document.querySelectorAll('.feature-card, .store-card, .join-card, .section-title, .section-desc, .community-grid');
    revealElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
});

// --- Sound System ---
document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.getElementById('sound-toggle');
    const hoverSound = document.getElementById('sfx-hover');
    const clickSound = document.getElementById('sfx-click');
    const soundIcon = document.querySelector('.sound-icon');

    // Check Preference
    let soundEnabled = localStorage.getItem('uiSoundsEnabled') === 'true';
    updateSoundUI();

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('uiSoundsEnabled', soundEnabled);
            updateSoundUI();

            // Feedback click
            if (soundEnabled) playSound(clickSound);
        });
    }

    function updateSoundUI() {
        if (soundToggle) {
            if (soundEnabled) {
                soundToggle.classList.remove('muted');
                soundIcon.textContent = '🔊';
            } else {
                soundToggle.classList.add('muted');
                soundIcon.textContent = '🔇';
            }
        }
    }

    function playSound(audio) {
        if (!soundEnabled || !audio) return;
        // Reset and play
        audio.currentTime = 0;
        audio.volume = 0.3; // Low volume
        audio.play().catch(e => { }); // Catch autoplay errors
    }

    // Attach to interactions
    const interactiveElements = document.querySelectorAll('button, a, .store-card, .feature-card, .faq-question');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => playSound(hoverSound));
        el.addEventListener('click', () => playSound(clickSound));
    });
});

// --- Particle Background System ---
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Resize
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Slow float
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            // Colors: Cyan (#06b6d4), Magenta (#d946ef), Gold (#eab308)
            const colors = ['rgba(6,182,212,', 'rgba(217,70,239,', 'rgba(234,179,8,'];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            this.size = Math.random() * 2 + 0.5;
            this.life = Math.random() * 100;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.wobble = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wobble
            this.wobble += 0.05;
            this.x += Math.sin(this.wobble) * 0.1;

            // Parallax Scroll influence (subtle)
            // We use global window.scrollY but mapped to small movement
            // Ideally we'd pass a delta, but let's just let them float freely for now
            // and add scroll offset in draw or simple check?
            // Actually, for "floating depth", we can shift them slightly based on scroll
            // inside draw(): x - scrollY * factor

            // Wrap around
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
        }

        draw(scrollY) {
            ctx.beginPath();
            // Parallax Y shift
            const parallaxY = this.y - (scrollY * (this.size * 0.1));

            // Modulo to keep drawing within view if parallax shifts too far? 
            // Simpler: Just draw at x,y. The container is fixed so scroll doesn't move canvas.
            // But we want visual parallax. 
            // Let's just use the fixed position x,y for simple floating.

            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.colorBase + this.alpha + ')';
            ctx.fill();
        }
    }

    // Init Particles
    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Scroll Offset for Parallax
        // Since canvas is fixed, we can simulate movement
        const scrollY = window.scrollY;

        particles.forEach(p => {
            p.update();
            // Optional: Modify p.y slightly by scroll for visual flair without complex wrapping
            // p.draw() handles standard drawing

            ctx.beginPath();
            // Simple parallax: move faster particles more
            const py = p.y - (scrollY * 0.05 * p.size);
            // Simple wrap visually for y
            let finalY = py % height;
            if (finalY < 0) finalY += height;

            ctx.arc(p.x, finalY, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.colorBase + p.alpha + ')';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
});
