// Continegra IT & Multimedia Business - JavaScript

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Typewriter Effect
class TypewriterEffect {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.delayBetweenWords = options.delayBetweenWords || 2000;
        this.currentWordIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.currentText = currentWord.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = currentWord.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentText === currentWord) {
            typeSpeed = this.delayBetweenWords;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Particle Background Effect
class ParticleBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.mousePosition = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`
            });
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy *= -1;
            }

            // Mouse interaction
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.01;
                particle.vy += dy * force * 0.01;
            }
        });
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw connections
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.5;
                    this.ctx.strokeStyle = '#00f5ff';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            });
        });
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.service-card, .benefit-card, .portfolio-item').forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Contact Form Handler
class ContactForm {
    constructor(formElement) {
        this.form = formElement;
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name') || document.getElementById('name').value,
            email: formData.get('email') || document.getElementById('email').value,
            service: formData.get('service') || document.getElementById('service').value,
            message: formData.get('message') || document.getElementById('message').value
        };

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await this.simulateSubmission(data);
            
            // Show success message
            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.form.reset();
        } catch (error) {
            // Show error message
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateSubmission(data) {
        return new Promise((resolve) => {
            // Simulate API call delay
            setTimeout(() => {
                console.log('Form submitted with data:', data);
                resolve();
            }, 1000);
        });
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Chatbot System
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [
            {
                type: 'bot',
                content: "Hello! I'm here to help you with information about our IT and multimedia services. How can I assist you today?",
                suggestions: [
                    "Tell me about your services",
                    "What are your rates?",
                    "How can I contact you?",
                    "Do you work remotely?"
                ]
            }
        ];
        this.init();
    }

    init() {
        this.bindEvents();
        this.createSuggestions();
    }

    bindEvents() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const send = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        if (toggle) {
            toggle.addEventListener('click', () => this.toggleChat());
        }
        
        if (close) {
            close.addEventListener('click', () => this.closeChat());
        }
        
        if (send) {
            send.addEventListener('click', () => this.sendMessage());
        }
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    toggleChat() {
        const widget = document.getElementById('chatbotWidget');
        if (widget) {
            this.isOpen = !this.isOpen;
            widget.style.display = this.isOpen ? 'flex' : 'none';
        }
    }

    closeChat() {
        const widget = document.getElementById('chatbotWidget');
        if (widget) {
            this.isOpen = false;
            widget.style.display = 'none';
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage('user', message);
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const response = this.getBotResponse(message);
                this.addMessage('bot', response.content, response.suggestions);
            }, 1000);
        }
    }

    addMessage(type, content, suggestions = []) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);

        // Add suggestions for bot messages
        if (type === 'bot' && suggestions.length > 0) {
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'suggestions mt-2';
            
            suggestions.forEach(suggestion => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline-primary btn-sm me-2 mb-2';
                btn.textContent = suggestion;
                btn.onclick = () => {
                    document.getElementById('chatbotInput').value = suggestion;
                    this.sendMessage();
                };
                suggestionsDiv.appendChild(btn);
            });
            
            messagesContainer.appendChild(suggestionsDiv);
        }

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('service') || message.includes('what do you do')) {
            return {
                content: "We offer 4 main service areas: 1) Multimedia Design (logos, videos, animations), 2) Cybersecurity Services (malware removal, penetration testing), 3) Programming & Development (websites, apps, POS systems), and 4) Hardware Support (repairs, upgrades, network setup). Which area interests you most?",
                suggestions: ["Multimedia Design", "Cybersecurity", "Development", "Hardware Support"]
            };
        }
        
        if (message.includes('rate') || message.includes('price') || message.includes('cost')) {
            return {
                content: "Our rates are competitive and vary by project complexity. We offer flexible pricing for different budgets. Would you like to discuss your specific project for a custom quote?",
                suggestions: ["Get a quote", "Tell me about packages", "Contact information"]
            };
        }
        
        if (message.includes('contact') || message.includes('reach') || message.includes('call')) {
            return {
                content: "You can reach us at: Email: molisentshihlele@gmail.com, Phone: +26650805067, or via WhatsApp. We're available 24/7 for online support!",
                suggestions: ["Send email", "Call now", "WhatsApp chat", "More info"]
            };
        }
        
        if (message.includes('remote') || message.includes('location') || message.includes('where')) {
            return {
                content: "Yes! We provide both remote and on-site services across Africa. Most of our work can be done remotely, but we also offer on-site visits when needed for hardware support or complex setups.",
                suggestions: ["Remote services", "On-site availability", "Service areas"]
            };
        }

        if (message.includes('multimedia') || message.includes('design') || message.includes('video')) {
            return {
                content: "Our Multimedia Design services include: Logo & Brand Design, 2D/3D Animations, Video Editing, Voice Editing & Sound Cleanup, Motion Graphics, and UI/UX Design. We use professional tools like Photoshop, After Effects, Premiere Pro, and Blender.",
                suggestions: ["Logo design", "Video editing", "Animation services", "Get quote"]
            };
        }

        if (message.includes('cyber') || message.includes('security') || message.includes('hack')) {
            return {
                content: "Our Cybersecurity services include: Malware Detection & Removal, Penetration Testing, Ethical Hacking, Network & Firewall Setup, Security Training, and System Hardening. We help protect your digital assets comprehensively.",
                suggestions: ["Security assessment", "Malware removal", "Network setup", "Learn more"]
            };
        }

        if (message.includes('development') || message.includes('website') || message.includes('app')) {
            return {
                content: "We develop custom websites, Android apps, POS systems, web applications with dashboards, and provide API integrations. We also handle CMS setup (WordPress, Joomla) and ongoing maintenance.",
                suggestions: ["Website development", "Mobile apps", "POS systems", "Get started"]
            };
        }

        if (message.includes('hardware') || message.includes('repair') || message.includes('computer')) {
            return {
                content: "Our Hardware Support includes: Computer & laptop repairs, RAM/SSD upgrades, virus removal, OS reinstallation, printer setup, network installation, and driver/BIOS configuration. We handle both diagnostics and repairs.",
                suggestions: ["Computer repair", "Upgrades", "Network setup", "Schedule service"]
            };
        }
        
        // Default response
        return {
            content: "I'd be happy to help you learn more about our services! We specialize in Multimedia Design, Cybersecurity, Development, and Hardware Support. What specific area would you like to know more about?",
            suggestions: ["View all services", "Contact us", "Get a quote", "Learn more"]
        };
    }

    createSuggestions() {
        // Add initial suggestions to the welcome message
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer && this.messages[0].suggestions) {
            setTimeout(() => {
                const suggestionsDiv = document.createElement('div');
                suggestionsDiv.className = 'suggestions mt-2';
                
                this.messages[0].suggestions.forEach(suggestion => {
                    const btn = document.createElement('button');
                    btn.className = 'btn btn-outline-primary btn-sm me-2 mb-2';
                    btn.textContent = suggestion;
                    btn.onclick = () => {
                        document.getElementById('chatbotInput').value = suggestion;
                        this.sendMessage();
                    };
                    suggestionsDiv.appendChild(btn);
                });
                
                messagesContainer.appendChild(suggestionsDiv);
            }, 500);
        }
    }
}

// Navbar Scroll Effect
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        if (this.navbar) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('navbar-scrolled');
        } else {
            this.navbar.classList.remove('navbar-scrolled');
        }
    }
}

// Floating Elements Animation
class FloatingElements {
    constructor() {
        this.elements = document.querySelectorAll('.floating-element');
        this.init();
    }

    init() {
        this.elements.forEach((element, index) => {
            this.animateElement(element, index);
        });
    }

    animateElement(element, index) {
        const animation = element.animate([
            { transform: 'translateY(0px) rotate(0deg)' },
            { transform: 'translateY(-20px) rotate(5deg)' },
            { transform: 'translateY(0px) rotate(0deg)' }
        ], {
            duration: 3000 + (index * 500),
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        // Add mouse interaction
        element.addEventListener('mouseenter', () => {
            animation.pause();
            element.style.transform = 'scale(1.1) rotate(10deg)';
        });

        element.addEventListener('mouseleave', () => {
            animation.play();
            element.style.transform = '';
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core systems
    new ThemeManager();
    new SmoothScroll();
    new AnimationObserver();
    new NavbarScroll();
    new FloatingElements();
    new Chatbot();

    // Initialize typewriter effect
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        new TypewriterEffect(typewriterElement, [
            'IT & Multimedia Solutions',
            'Cybersecurity Services',
            'Development Projects',
            'Hardware Support'
        ]);
    }

    // Initialize contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        new ContactForm(contactForm);
    }

    // Add particle canvas to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const canvas = document.createElement('canvas');
        canvas.id = 'particleCanvas';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        heroSection.appendChild(canvas);
        new ParticleBackground(canvas);
    }

    // Initialize stats section hover effects
    document.querySelectorAll('.stat-item').forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            // Add hover class for enhanced effects
            item.classList.add('stat-active');
            
            // Create floating particles effect
            createFloatingParticles(item);
        });

        item.addEventListener('mouseleave', () => {
            item.classList.remove('stat-active');
        });
    });

    // Add scroll-to-top functionality
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTop.className = 'btn btn-primary position-fixed';
    scrollToTop.style.cssText = `
        bottom: 200px;
        right: 20px;
        z-index: 1000;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(scrollToTop);

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTop.style.opacity = '1';
            scrollToTop.style.visibility = 'visible';
        } else {
            scrollToTop.style.opacity = '0';
            scrollToTop.style.visibility = 'hidden';
        }
    });

    // Add CSS for navbar scroll effect
    const style = document.createElement('style');
    style.textContent = `
        .navbar-scrolled {
            background: rgba(0, 0, 0, 0.95) !important;
            backdrop-filter: blur(20px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .suggestions button {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
        }
    `;
    document.head.appendChild(style);

    // Initialize AOS-like animations for elements
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
    document.querySelectorAll('.service-card, .benefit-card, .portfolio-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    console.log('Continegra website initialized successfully!');
});

// Floating particles function
function createFloatingParticles(element) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00f5ff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-up 2s ease-out forwards;
        `;
        
        element.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentElement) {
                particle.remove();
            }
        }, 2000);
    }
}

// Add floating particle animation to CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float-up {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.5);
        }
    }
    
    .stat-active .stat-number {
        animation: pulse-glow 1s ease-in-out infinite alternate;
    }
    
    @keyframes pulse-glow {
        0% {
            text-shadow: 0 0 5px rgba(0, 245, 255, 0.5);
        }
        100% {
            text-shadow: 0 0 20px rgba(0, 245, 255, 0.9), 0 0 30px rgba(255, 0, 255, 0.5);
        }
    }
    
    .service-card:hover {
        transform: translateY(-10px) rotateX(5deg) rotateY(2deg);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    }
    
    .benefit-card:hover {
        transform: translateY(-8px) rotateX(3deg);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    .benefit-card:hover .benefit-bg-pattern {
        animation: rotate-glow 3s linear infinite;
    }
    
    @keyframes rotate-glow {
        0% {
            transform: rotate(0deg);
            box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
        }
        100% {
            transform: rotate(360deg);
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
        }
    }
`;
document.head.appendChild(particleStyle);

// Add some utility functions
window.continegra = {
    scrollToSection: (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerOffset = 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    },
    
    openWhatsApp: () => {
        window.open('https://wa.me/26650805067', '_blank');
    },
    
    sendEmail: () => {
        window.location.href = 'mailto:molisentshihlele@gmail.com';
    },
    
    createParticleExplosion: (x, y) => {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: linear-gradient(45deg, #00f5ff, #ff00ff);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x}px;
                top: ${y}px;
                animation: explode-${i} 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }
};