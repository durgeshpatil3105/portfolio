// ============================================
// Data Analyst Portfolio - Complete JavaScript
// ============================================

// Global Variables
let particles = [];
const canvas = document.getElementById('bgCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// ============================================
// ANIMATED BACKGROUND
// ============================================
function initCanvas() {
    if (!canvas || !ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create data visualization particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            hue: Math.random() * 60 + 200 // Cyan-blue data theme
        });
    }
}

function animateBackground() {
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        // Update position with bounce
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Connect nearby particles (data connections)
        particles.forEach(other => {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.save();
                ctx.globalAlpha = (100 - distance) / 100 * 0.1;
                ctx.strokeStyle = `hsl(${particle.hue}, 70%, 60%)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
                ctx.restore();
            }
        });
    });
    
    requestAnimationFrame(animateBackground);
}

// ============================================
// NAVBAR FUNCTIONALITY
// ============================================
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else if (navbar) {
        navbar.classList.remove('scrolled');
    }
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ============================================
// SKILLS ANIMATION
// ============================================
function animateSkills() {
    const skillCards = document.querySelectorAll('.skill-card[data-skill]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCard = entry.target;
                const progress = skillCard.querySelector('.skill-progress');
                const skillLevel = skillCard.getAttribute('data-skill');
                
                // Animate progress bar
                progress.style.width = '0%';
                setTimeout(() => {
                    progress.style.width = skillLevel + '%';
                }, 300);
            }
        });
    }, { threshold: 0.5 });
    
    skillCards.forEach(card => observer.observe(card));
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'animate-slide-up');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll('.fade-in, .project-card, .glass-card, .analysis-card, .skill-card, .step, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// GITHUB API INTEGRATION
// ============================================
async function fetchGitHubProjects() {
    const githubGrid = document.getElementById('githubProjects');
    if (!githubGrid) return;
    
    try {
        // Replace with your GitHub username
        const username = 'your-github-username'; 
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) throw new Error('GitHub API rate limit or invalid username');
        
        const repos = await response.json();
        githubGrid.innerHTML = '';
        
        repos.slice(0, 6).forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'github-repo fade-in';
            repoCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
                <div class="repo-stats">
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    <span><i class="fas fa-eye"></i> ${repo.watchers_count}</span>
                </div>
                <div class="repo-links">
                    <a href="${repo.html_url}" target="_blank" rel="noopener">
                        <i class="fab fa-github"></i> View Repo
                    </a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>` : ''}
                </div>
            `;
            githubGrid.appendChild(repoCard);
        });
    } catch (error) {
        console.error('GitHub API Error:', error);
        githubGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Could not load GitHub projects</p>
                <p><small>Update your GitHub username in script.js</small></p>
            </div>
        `;
    }
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset form
            form.reset();
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = '🎉 Message sent successfully! I\'ll reply within 24 hours.';
            form.parentNode.insertBefore(successMsg, form.nextSibling);
            
            setTimeout(() => successMsg.remove(), 5000);
        }, 1500);
    });
}

// ============================================
// PROJECT PAGE ENHANCEMENTS
// ============================================
function initProjectPage() {
    // KPI Cards Animation
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Animate numbers in KPI cards
    const kpiNumbers = document.querySelectorAll('.kpi-value');
    kpiNumbers.forEach(num => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                }
            });
        });
        observer.observe(num);
    });
    
    // Process steps animation
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.1}s`;
    });
}

function animateNumber(element) {
    const target = parseFloat(element.textContent.replace(/[^\d.]/g, ''));
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = element.dataset.original || element.textContent;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 30);
}

// ============================================
// WINDOW EVENT HANDLERS
// ============================================
function handleResize() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

// ============================================
// MAIN INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio loaded successfully!');
    
    // Core initializations
    initCanvas();
    initSmoothScrolling();
    initMobileNav();
    initScrollAnimations();
    initContactForm();
    animateSkills();
    
    // Page-specific features
    if (document.getElementById('githubProjects')) {
        fetchGitHubProjects();
    }
    
    if (document.querySelector('.project-hero')) {
        initProjectPage();
    }
    
    // Store original KPI values for animation
    document.querySelectorAll('.kpi-value').forEach(el => {
        el.dataset.original = el.textContent;
    });
});

// Global event listeners
window.addEventListener('scroll', handleNavbarScroll);
window.addEventListener('resize', handleResize);
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ============================================
// DYNAMIC CSS INJECTION (FOR BROWSER COMPATIBILITY)
// ============================================
function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile Menu Animation */
        .hamburger.active .bar:nth-child(1) { 
            transform: rotate(-45deg) translate(-5px, 6px); 
        }
        .hamburger.active .bar:nth-child(2) { 
            opacity: 0; 
        }
        .hamburger.active .bar:nth-child(3) { 
            transform: rotate(45deg) translate(-5px, -6px); 
        }
        
        /* Mobile Nav Menu */
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                left: -100%;
                top: 70px;
                flex-direction: column;
                background: rgba(15, 15, 35, 0.98);
                width: 100%;
                text-align: center;
                transition: left 0.3s ease;
                padding: 2rem 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .nav-menu.active {
                left: 0 !important;
            }
        }
        
        /* Success Message */
        .success-message {
            background: rgba(40, 167, 69, 0.2);
            border: 1px solid rgba(40, 167, 69, 0.5);
            color: #28a745;
            padding: 1rem 2rem;
            border-radius: 10px;
            margin-top: 1rem;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Loading Animation */
        .loading i.fa-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Page Load Animation */
        body.loaded .animate-slide-up {
            animation-play-state: running;
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
injectDynamicStyles();

// ============================================
// ERROR HANDLING & PERFORMANCE
// ============================================
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

console.log('✅ Portfolio JavaScript loaded successfully!');
console.log('🎨 Features: Animated background, GitHub API, Scroll animations, Mobile nav, Contact form');