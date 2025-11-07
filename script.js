// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isAnimating = false;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize statistics counter
    initStatisticsCounter();
    
    // Initialize cart functionality
    updateCartDisplay();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize intersection observer for animations
    initIntersectionObserver();
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        menuBtn.classList.remove('fa-bars');
        menuBtn.classList.add('fa-times');
        
        // Animate menu items
        const menuItems = mobileMenu.querySelectorAll('a');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
                item.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 50);
            }, index * 100);
        });
    } else {
        mobileMenu.classList.add('hidden');
        menuBtn.classList.remove('fa-times');
        menuBtn.classList.add('fa-bars');
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Statistics Counter Animation
function initStatisticsCounter() {
    const counters = document.querySelectorAll('[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target.querySelector('[data-count]'));
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter.closest('.stat-item'));
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.category-card, .product-card, .stat-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Intersection Observer for general animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'animated');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Cart Functionality
function addToCart(productName) {
    if (isAnimating) return;
    
    isAnimating = true;
    
    // Find product details (in a real app, this would come from a database)
    const products = {
        'زيت أركان': { price: 2500, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100&h=100&fit=crop' },
        'عسل جبلي': { price: 1800, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=100&h=100&fit=crop' },
        'صابون الغار': { price: 450, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop' }
    };
    
    const product = products[productName];
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Show success notification
    showNotification(`${productName} تم إضافة المنتج إلى السلة`, 'success');
    
    // Animate button
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    button.style.background = '#059669';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.background = '#10b981';
        isAnimating = false;
    }, 200);
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        
        // Animate cart count
        if (totalItems > 0) {
            cartCount.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                cartCount.style.animation = 'pulse 2s infinite';
            }, 500);
        }
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`تم إزالة المنتج من السلة`, 'info');
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`تم تفريغ السلة`, 'info');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-semibold transform translate-x-full transition-all duration-300`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500');
            notification.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
            break;
        case 'error':
            notification.classList.add('bg-red-500');
            notification.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500');
            notification.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>${message}`;
            break;
        default:
            notification.classList.add('bg-blue-500');
            notification.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${message}`;
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Click to remove
    notification.addEventListener('click', () => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Product Filter (for shop page)
function filterProducts(category) {
    const products = document.querySelectorAll('.product-item');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeInUp 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

// Search Functionality
function searchProducts(query) {
    const products = document.querySelectorAll('.product-item');
    const searchTerm = query.toLowerCase();
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        const productDescription = product.querySelector('.product-description').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            product.style.display = 'block';
            product.style.animation = 'fadeInUp 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        // Remove existing error styling
        input.classList.remove('border-red-500', 'border-green-500');
        
        // Check if field is empty
        if (!value) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            // Additional validation based on input type
            if (input.type === 'email' && !isValidEmail(value)) {
                input.classList.add('border-red-500');
                isValid = false;
            } else if (input.type === 'tel' && !isValidPhone(value)) {
                input.classList.add('border-red-500');
                isValid = false;
            } else {
                input.classList.add('border-green-500');
            }
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Contact Form Submission
function submitContactForm(event) {
    event.preventDefault();
    
    if (validateForm('contactForm')) {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>جاري الإرسال...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            event.target.reset();
            
            // Remove validation styling
            const inputs = event.target.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.classList.remove('border-green-500', 'border-red-500');
            });
        }, 2000);
    } else {
        showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
    }
}

// Newsletter Subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (isValidEmail(email)) {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Simulate subscription
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showNotification('تم الاشتراك في النشرة البريدية بنجاح!', 'success');
            event.target.reset();
        }, 1500);
    } else {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
        emailInput.classList.add('border-red-500');
    }
}

// Lazy Loading Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance Optimization
function optimizePerformance() {
    // Debounced scroll handler
    const debouncedScrollHandler = debounce(() => {
        // Handle scroll events
    }, 100);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Throttled resize handler
    const throttledResizeHandler = throttle(() => {
        // Handle resize events
    }, 250);
    
    window.addEventListener('resize', throttledResizeHandler);
}

// Initialize performance optimization
optimizePerformance();

// Error Handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    showNotification('عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.', 'error');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access
window.toggleMobileMenu = toggleMobileMenu;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.filterProducts = filterProducts;
window.searchProducts = searchProducts;
window.submitContactForm = submitContactForm;
window.subscribeNewsletter = subscribeNewsletter;
window.validateForm = validateForm;