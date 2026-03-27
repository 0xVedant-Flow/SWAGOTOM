document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen Removal
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader-wrapper');
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    startHeroAnimations();
                }, 500);
            }
        }, 1500); 
    });

    // 2. Advanced Custom Cursor with Trailing
    const cursor = document.querySelector('.cursor');
    const glow = document.querySelector('.cursor-glow');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        // Core cursor (smooth follow)
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Glow tail (slower follow)
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, .service-card, .portfolio-item').forEach(link => {
        link.addEventListener('mouseenter', () => {
            glow.style.width = '120px';
            glow.style.height = '120px';
            glow.style.background = 'rgba(168, 85, 247, 0.2)';
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        link.addEventListener('mouseleave', () => {
            glow.style.width = '60px';
            glow.style.height = '60px';
            glow.style.background = 'rgba(168, 85, 247, 0.3)';
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // 3. Magnetic Buttons Effect
    const magneticBtns = document.querySelectorAll('.btn, .logo');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // 4. Text Scramble Effect Class
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="scrambled">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    const startHeroAnimations = () => {
        const headline = document.querySelector('.hero h1');
        if (headline) {
            const fx = new TextScramble(headline);
            fx.setText(headline.innerText);
        }
    };

    // 5. Navbar Scrolled State
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 6. Smooth Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Remove observer only if no repeat animation needed
                // revealObserver.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 7. Before/After Slider
    const sliderHandle = document.getElementById('slider-handle');
    const afterImg = document.getElementById('after-img');
    const sliderContainer = document.querySelector('.slider-container');

    if (sliderContainer) {
        sliderContainer.addEventListener('mousemove', (e) => {
            const rect = sliderContainer.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let percent = (x / rect.width) * 100;
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            sliderHandle.style.left = percent + '%';
            afterImg.style.width = percent + '%';
        });
    }

    // 8. Testimonials Carousel
    const track = document.getElementById('carousel-track');
    if (track) {
        let index = 0;
        const totalCards = document.querySelectorAll('.testimonial-card').length;
        setInterval(() => {
            index = (index + 1) % totalCards;
            track.style.transform = `translateX(-${index * 100}%)`;
        }, 6000);
    }

    // 9. Tilt Effect for Cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (rect.height / 2 - y) / 15;
            const rotateY = (x - rect.width / 2) / 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
});
