function toggleMenu(){
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".menu-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Dynamic Section Loading
let lastScrollY = window.pageYOffset;
const sections = document.querySelectorAll('#about, #experience, #projects, #contact');

// Add dynamic-section class to all sections
sections.forEach(section => {
    section.classList.add('dynamic-section');
});

// Intersection Observer for scroll-based animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.35]
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const currentScrollY = window.pageYOffset;
        const scrollingDown = currentScrollY > lastScrollY;
        
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            entry.target.classList.remove('hiding-up', 'hiding-down');
            entry.target.classList.add('visible');
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
            if (entry.target.classList.contains('visible')) {
                entry.target.classList.remove('visible');
                if (scrollingDown) {
                    entry.target.classList.add('hiding-up');
                } else {
                    entry.target.classList.add('hiding-down');
                }
            }
        }
        
        lastScrollY = currentScrollY;
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Track scroll direction
window.addEventListener('scroll', () => {
    lastScrollY = window.pageYOffset;
});

// Handle nav link clicks with animation
const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#' || targetId === './#contact') return;
        
        const targetSection = document.querySelector(targetId);
        if (targetSection && targetSection.classList.contains('dynamic-section')) {
            // Trigger animation
            targetSection.classList.remove('hiding-up', 'hiding-down');
            targetSection.classList.add('visible');
        }
    });
});

// Page scroll button 
const scrollButton = document.getElementById('scrollButton');
// Function to check scroll position and update button
function updateButton() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
            
    // Calculate how close we are to the bottom
    const nearBottom = scrollTop + windowHeight >= documentHeight - 200;
    
    if (nearBottom) {
        scrollButton.classList.add('up-mode');
    } else {
        scrollButton.classList.remove('up-mode');
        }
    }

// Function to handle button click
function buttonClick() {
    const isUpMode = scrollButton.classList.contains('up-mode');        
    if (isUpMode) {// Scroll to top
        window.scrollTo({top: 0, behavior: 'smooth'});
    } else{// Scroll to next section
        //gather sections
        const sections = ['#about', '#experience', '#projects', '#contact']
        const currentScroll = window.pageYOffset;

        //find next section to scroll to
        for(let i=0; i < sections.length; i++){
            const section = document.querySelector(sections[i]);
            if(section){
                const sectionTop = section.offsetTop;
                if(sectionTop > currentScroll + 100){
                    window.scrollTo({top: sectionTop, behavior: 'smooth'});
                    break;
                }
            }
        }

    }
}
// Event listeners
window.addEventListener('scroll', updateButton);
// Initial check
 updateButton();






