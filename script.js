document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    const storeCards = document.querySelectorAll('.store-card');
    if (tabBtns.length > 0 && storeCards.length > 0) {
        tabBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                tabBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category');
                storeCards.forEach((card) => {
                    if (card.classList.contains(`category-${category}`)) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        tabBtns[0].click();
    }

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((question) => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            if (!answer || !answer.classList.contains('faq-answer')) return;

            const opening = !question.classList.contains('active');
            question.classList.toggle('active');
            question.setAttribute('aria-expanded', opening ? 'true' : 'false');

            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }

            faqQuestions.forEach((other) => {
                if (other === question) return;
                other.classList.remove('active');
                other.setAttribute('aria-expanded', 'false');
                const a = other.nextElementSibling;
                if (a && a.classList.contains('faq-answer')) a.style.maxHeight = '0';
            });
        });
    });

    const sections = document.querySelectorAll('section[id], header[id]');
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            const y = window.scrollY;
            sections.forEach((section) => {
                const id = section.getAttribute('id');
                if (!id) return;
                if (y >= section.offsetTop - 160) current = id;
            });

            navLinks.forEach((link) => {
                const href = link.getAttribute('href') || '';
                const hash = href.includes('#') ? href.split('#').pop() : '';
                link.classList.remove('active');
                if (current && hash === current) link.classList.add('active');
            });
        });
    }

    const revealElements = document.querySelectorAll(
        '.feature-card, .store-card, .join-card, .section-title, .section-desc, .community-grid, .connect-card, .prose-card'
    );
    if (revealElements.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        revealElements.forEach((el) => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    }

    const canvas = document.getElementById('particles-canvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let width;
    let height;
    const particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.init();
        }
        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            const colors = ['rgba(6,182,212,', 'rgba(217,70,239,', 'rgba(234,179,8,'];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            this.size = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.wobble = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.wobble += 0.05;
            this.x += Math.sin(this.wobble) * 0.1;
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
        }
    }

    for (let i = 0; i < 55; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const scrollY = window.scrollY;
        particles.forEach((p) => {
            p.update();
            const py = p.y - scrollY * 0.05 * p.size;
            let finalY = py % height;
            if (finalY < 0) finalY += height;
            ctx.beginPath();
            ctx.arc(p.x, finalY, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.colorBase + p.alpha + ')';
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
});

function copyIp(ip) {
    navigator.clipboard.writeText(ip).then(() => {
        showToast('Copiado: ' + ip);
    }).catch(() => {
        alert('Copia manualmente: ' + ip);
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
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
        transition: 'opacity 0.3s',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}
