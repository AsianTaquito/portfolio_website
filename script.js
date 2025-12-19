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

// GitHub contributions calendar 
async function fetchContributionsJson() {
    const url = `./contributions.json?t=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`contributions.json ${response.status}`);
    return await response.json();
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function monthLabel(monthIndex) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
}

function buildContributionSvg(calendar) {
    const weeks = calendar?.weeks;
    if (!Array.isArray(weeks) || weeks.length === 0) return null;

    const cell = 11;
    const gap = 2;
    const padLeft = 28;
    const padTop = 18;
    const cols = weeks.length;
    const width = padLeft + cols * (cell + gap) + 2;
    const height = padTop + 7 * (cell + gap) + 2;

    const monthLabels = [];
    let lastMonth = null;
    for (let w = 0; w < weeks.length; w++) {
        const firstDay = weeks[w]?.contributionDays?.[0]?.date;
        if (!firstDay) continue;
        const m = new Date(firstDay).getUTCMonth();
        if (m !== lastMonth) {
            monthLabels.push({
                x: padLeft + w * (cell + gap),
                label: monthLabel(m)
            });
            lastMonth = m;
        }
    }

    let svg = '';
    svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="GitHub contribution calendar">`;
    svg += `<rect width="100%" height="100%" fill="transparent"/>`;

    svg += `<g font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="10" fill="rgba(255,255,255,0.75)">`;
    for (const m of monthLabels) {
        svg += `<text x="${m.x}" y="11">${m.label}</text>`;
    }
    svg += `</g>`;

    svg += `<g>`;
    for (let w = 0; w < weeks.length; w++) {
        const days = weeks[w]?.contributionDays || [];
        for (let d = 0; d < days.length; d++) {
            const day = days[d];
            const x = padLeft + w * (cell + gap);
            const y = padTop + d * (cell + gap);
            const fill = day.color || 'rgba(255,255,255,0.08)';
            const title = `${day.contributionCount} contributions on ${day.date}`;
            svg += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" ry="2" fill="${escapeXml(fill)}">`;
            svg += `<title>${escapeXml(title)}</title>`;
            svg += `</rect>`;
        }
    }
    svg += `</g>`;
    svg += `</svg>`;
    return svg;
}

function buildMessageSvg(message) {
    const width = 820;
    const height = 140;
    const msg = escapeXml(message);

    return (
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${msg}">` +
        `<rect width="100%" height="100%" fill="transparent"/>` +
        `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"` +
        ` font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="16" fill="rgba(255,255,255,0.75)">` +
        `${msg}` +
        `</text>` +
        `</svg>`
    );
}

function setCalendarImage(imgEl, svgString) {
    imgEl.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

(async function initGitHubCalendar() {
    const link = document.querySelector('.github-calendar-link');
    if (!link) return;

    
    let img = link.querySelector('.github-calendar-img');
    if (!img) {
        img = document.createElement('img');
        img.className = 'github-calendar-img';
        img.alt = 'GitHub contribution chart';
        img.loading = 'lazy';
        link.appendChild(img);
    }

    setCalendarImage(img, buildMessageSvg('Loading GitHub activity…'));

    try {
        const payload = await fetchContributionsJson();
        const calendar = payload.calendar || payload.contributionCalendar || payload;
        const svg = buildContributionSvg(calendar);

        if (!svg) {
            setCalendarImage(img, buildMessageSvg('No contributions data yet.'));
            return;
        }

        setCalendarImage(img, svg);
        if (payload?.user) {
            img.alt = `GitHub contribution chart for ${payload.user}`;
        }
    } catch (_error) {
        setCalendarImage(img, buildMessageSvg('GitHub activity unavailable.'));
    }
})();




