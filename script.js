function toggleMenu(){
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".menu-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

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



function updateArrowVisibility(){
    const container = document.getElementById('project-container');
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if(container.scrollLeft <= 0){
        leftArrow.style.visibility = 'hidden';
        leftArrow.style.pointerEvents = 'none';
    } else{
        leftArrow.style.visibility = 'visible';
        leftArrow.style.pointerEvents = 'auto';
    }

    if(container.scrollLeft < maxScrollLeft - 1){
        rightArrow.style.visibility = 'visible';
        rightArrow.style.pointerEvents = 'auto';
    } else{
        rightArrow.style.visibility = 'hidden';
        rightArrow.style.pointerEvents = 'none';
    }
}

function scrollCarousel(direction) {
    const container = document.getElementById('project-container');
    const card = container.querySelector('.project');
    if (!card) return;
    const style = window.getComputedStyle(card);
    const gap = parseInt(style.marginRight) || 16; // fallback gap if not set
    const scrollAmount = card.offsetWidth + gap;
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateArrowVisibility();
    const container = document.getElementById('project-container');
    container.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', updateArrowVisibility);
});



