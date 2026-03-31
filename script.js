// ===== GOLD PARTICLE SYSTEM =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -Math.random() * 0.4 - 0.1;
        this.opacity = Math.random() * 0.4 + 0.05;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        this.growing = Math.random() > 0.5;
        this.life = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse repel
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            this.x += dx / dist * 0.5;
            this.y += dy / dist * 0.5;
        }

        if (this.growing) {
            this.opacity += this.fadeSpeed;
            if (this.opacity >= 0.5) this.growing = false;
        } else {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0) this.reset();
        }

        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
            this.reset();
            this.y = canvas.height + 10;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
        ctx.fill();

        // Glow
        if (this.size > 1.2) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity * 0.1})`;
            ctx.fill();
        }
    }
}

// Create particles
for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ===== HEADER SCROLL =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});
nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== PARALLAX =====
document.addEventListener('mousemove', (e) => {
    const cx = (e.clientX / window.innerWidth - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;

    document.querySelectorAll('[data-parallax]').forEach(el => {
        const strength = parseFloat(el.dataset.parallax) * 100;
        el.style.transform = `translate(${cx * strength}px, ${cy * strength}px)`;
    });
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(
    '.gallery__item, .process__step, .about__content, .about__image, .testimonials__item, .cta-section__inner, .contact__form, .contact__info, .timeline__item, .categories__item'
).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.textContent);
            let current = 0;
            const increment = target / 40;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current) + '+';
                }
            }, 40);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.about__stat-number').forEach(el => {
    counterObserver.observe(el);
});

// ===== FORM — SEND LEAD TO TELEGRAM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const instagram = document.getElementById('formInstagram').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    const lines = [
        `Новая заявка с сайта Kirinas Art`,
        ``,
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        instagram ? `Instagram: @${instagram.replace('@', '')}` : '',
        message ? `Сообщение: ${message}` : ''
    ].filter(Boolean).join('\n');

    // Open Telegram with pre-filled message
    window.open(`https://t.me/kirinas_artist?text=${encodeURIComponent(lines)}`, '_blank');

    const btn = e.target.querySelector('.contact__submit');
    btn.textContent = 'ЗАЯВКА ОТПРАВЛЕНА';
    btn.style.background = 'rgba(45, 90, 62, 0.8)';
    btn.style.borderColor = 'var(--gold)';
    setTimeout(() => {
        btn.textContent = 'ОТПРАВИТЬ ЗАЯВКУ';
        btn.style.background = '';
        btn.style.borderColor = '';
        e.target.reset();
    }, 3000);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
