function toggleMenu(){
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".menu-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

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