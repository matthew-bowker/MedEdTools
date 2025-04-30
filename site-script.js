document.addEventListener('DOMContentLoaded', function() {
    // Initialize site functionality
    initNavigation();
    initTestimonialSlider();
});

// Mobile Navigation
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close navigation when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.site-navbar')) {
            navLinks.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile navigation if open
                    navLinks.classList.remove('active');
                    
                    // Scroll to element
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for fixed header
                        behavior: 'smooth'
                    });
                    
                    // Update URL without causing page jump
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
    
    // Active link handling based on scroll position
    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
    updateActiveNavLink(); // Initial call
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.testimonial-button.prev');
    const nextButton = document.querySelector('.testimonial-button.next');
    
    // Skip if no testimonials
    if (testimonials.length <= 1) return;
    
    let currentIndex = 0;
    
    // Hide all testimonials except first one
    testimonials.forEach((testimonial, index) => {
        if (index !== 0) {
            testimonial.style.display = 'none';
        }
    });
    
    // Next testimonial function
    function showNextTestimonial() {
        testimonials[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % testimonials.length;
        testimonials[currentIndex].style.display = 'block';
        fadeIn(testimonials[currentIndex]);
    }
    
    // Previous testimonial function
    function showPrevTestimonial() {
        testimonials[currentIndex].style.display = 'none';
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        testimonials[currentIndex].style.display = 'block';
        fadeIn(testimonials[currentIndex]);
    }
    
    // Attach event listeners to buttons
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', showPrevTestimonial);
        nextButton.addEventListener('click', showNextTestimonial);
    }
    
    // Auto-rotate testimonials every 6 seconds
    let testimonialInterval = setInterval(showNextTestimonial, 6000);
    
    // Pause auto-rotation when hovering over testimonials
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(showNextTestimonial, 6000);
        });
    }
}

// Helper function to animate fade in
function fadeIn(element) {
    element.style.opacity = 0;
    let opacity = 0;
    const timer = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = opacity;
        opacity += 0.1;
    }, 30);
}

// Helper function to debounce scroll events
function debounce(func, delay) {
    let timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    // Get current scroll position
    const scrollPosition = window.scrollY + 100; // Add offset to account for navbar height
    
    // Get all sections that have an ID defined
    const sections = document.querySelectorAll('section[id]');
    
    // Loop through sections to find the one currently in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Check if the current section is visible in the viewport
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to the corresponding link
            const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
    
    // Special case for the top of the page (home)
    if (scrollPosition < 200) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        const homeLink = document.querySelector('.nav-links a[href="index.html"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}