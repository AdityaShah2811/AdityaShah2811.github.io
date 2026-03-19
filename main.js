// Populate Hero Section
document.getElementById('hero-name').textContent = portfolioData.personal.name;
document.getElementById('hero-title').textContent = portfolioData.personal.title;
document.getElementById('hero-tagline').textContent = portfolioData.personal.tagline;
const profilePhoto = document.getElementById('profile-photo');
profilePhoto.src = portfolioData.personal.photo;
profilePhoto.onerror = function() {
    this.style.display = 'none';
    const initials = portfolioData.personal.name.split(' ').map(n => n[0]).join('');
    const fallback = document.createElement('div');
    fallback.className = 'profile-photo profile-fallback';
    fallback.textContent = initials;
    this.parentNode.insertBefore(fallback, this);
};
document.getElementById('resume-download').href = portfolioData.personal.resumeURL;
document.getElementById('resume-download-btn').href = portfolioData.personal.resumeURL;

// Social Icons
// SVG Icons
const svgIcons = {
    github: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    kaggle: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.238-.036.27l-6.555 6.344 6.836 8.507c.095.118.116.211.075.282z"/></svg>',
    email: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>'
};

const socialIconsHTML = `
    ${portfolioData.social.github && portfolioData.social.github !== '#' ? `<a href="${portfolioData.social.github}" class="social-icon" target="_blank" title="GitHub" aria-label="GitHub">${svgIcons.github}</a>` : ''}
    ${portfolioData.social.linkedin && portfolioData.social.linkedin !== '#' ? `<a href="${portfolioData.social.linkedin}" class="social-icon" target="_blank" title="LinkedIn" aria-label="LinkedIn">${svgIcons.linkedin}</a>` : ''}
    ${portfolioData.social.kaggle && portfolioData.social.kaggle !== '#' ? `<a href="${portfolioData.social.kaggle}" class="social-icon" target="_blank" title="Kaggle" aria-label="Kaggle">${svgIcons.kaggle}</a>` : ''}
    ${portfolioData.social.email ? `<a href="${portfolioData.social.email}" class="social-icon" title="Email" aria-label="Email">${svgIcons.email}</a>` : ''}
`;
document.getElementById('hero-social').innerHTML = socialIconsHTML;
document.getElementById('footer-social').innerHTML = socialIconsHTML;

// Populate About Section
const bioData = portfolioData.about.bio;
document.getElementById('about-bio').innerHTML = Array.isArray(bioData)
    ? bioData.map(p => `<p>${p}</p>`).join('')
    : `<p>${bioData}</p>`;
document.getElementById('fact-location').textContent = portfolioData.about.quickFacts.location;
document.getElementById('fact-education').textContent = portfolioData.about.quickFacts.education;
document.getElementById('fact-status').textContent = portfolioData.about.quickFacts.status;
document.getElementById('fact-availability').textContent = portfolioData.about.quickFacts.availability;

// Populate Skills Section with Progress Bars
function renderSkills(skills, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = skills.map(skill => `
        <div class="skill-item">
            <div class="skill-header">
                <span class="skill-name">
                    ${skill.name}
                    ${skill.badge ? `<span class="skill-badge">${skill.badge}</span>` : ''}
                </span>
                <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" data-level="${skill.level}"></div>
            </div>
        </div>
    `).join('');
}

renderSkills(portfolioData.skills.languages, 'skills-languages');
renderSkills(portfolioData.skills.dataAnalysis, 'skills-dataanalysis');
renderSkills(portfolioData.skills.dataEngineering, 'skills-dataengineering');
renderSkills(portfolioData.skills.tools, 'skills-tools');

// Populate Projects Section
document.getElementById('projects-grid').innerHTML = portfolioData.projects.map(project => `
    <div class="project-card">
        ${project.status === 'coming-soon' ? '<div class="project-status-badge">Coming Soon</div>' : ''}
        ${project.status === 'complete' ? '<div class="project-status-badge complete">Complete</div>' : ''}
        ${project.status === 'placeholder' ? '<div class="project-status-badge placeholder">Placeholder</div>' : ''}
        <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy" decoding="async" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'project-image project-image-fallback\\'><span>'+this.alt+'</span></div>')">
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tech.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.github && project.github !== '#' ? `<a href="${project.github}" class="btn-small btn-github" target="_blank">View Code</a>` : ''}
                ${project.demo ? `<a href="${project.demo}" class="btn-small btn-demo" target="_blank">Live Demo</a>` : ''}
            </div>
        </div>
    </div>
`).join('');

// Populate Experience Section
document.getElementById('experience-timeline').innerHTML = portfolioData.experience.map(exp => `
    <div class="timeline-item">
        <div class="timeline-content">
            <h3>${exp.title}</h3>
            <div class="timeline-company">${exp.company}</div>
            <div class="timeline-meta">${exp.duration} | ${exp.location}</div>
            <ul>
                ${exp.points.map(point => `<li>${point}</li>`).join('')}
            </ul>
        </div>
    </div>
`).join('');

// Populate Education Section
document.getElementById('education-list').innerHTML = portfolioData.education.map(edu => `
    <div class="education-item">
        <h4>${edu.degree}</h4>
        <div class="education-institution">${edu.institution}</div>
        <div class="education-meta">${edu.location} | ${edu.year}</div>
        ${edu.gpa ? `<div class="education-meta">GPA: ${edu.gpa}</div>` : ''}
    </div>
`).join('');

// Populate Certifications
document.getElementById('certifications-list').innerHTML = portfolioData.certifications
    .map(cert => `<li>${cert}</li>`).join('');

// Populate Contact Section
document.getElementById('contact-location').textContent = portfolioData.personal.location;
document.getElementById('contact-linkedin').href = portfolioData.social.linkedin;
document.getElementById('contact-github').href = portfolioData.social.github;
document.getElementById('contact-email').href = portfolioData.social.email;
document.getElementById('contact-email').textContent = portfolioData.personal.email;
document.getElementById('email-btn').href = portfolioData.social.email;

// Populate Footer
document.getElementById('footer-copyright').textContent = portfolioData.footer.copyright;

// GitHub Profile Link
document.getElementById('github-profile-link').href = portfolioData.social.github;

// Calendly Integration - Check if URL is set up
const calendlyBtn = document.getElementById('calendly-btn');
if (portfolioData.personal.calendlyURL && portfolioData.personal.calendlyURL !== 'https://calendly.com/PLACEHOLDER/15min') {
    calendlyBtn.onclick = function(e) {
        e.preventDefault();
        openCalendlyPopup();
    };
} else {
    calendlyBtn.href = portfolioData.social.email;
}

// Calendly Popup Function
function openCalendlyPopup() {
    if (portfolioData.personal.calendlyURL === 'https://calendly.com/PLACEHOLDER/15min') {
        alert('Calendly scheduling coming soon!\n\nFor now, please email me at: ' + portfolioData.personal.email);
        return false;
    }

    if (typeof Calendly !== 'undefined') {
        Calendly.initPopupWidget({
            url: portfolioData.personal.calendlyURL
        });
    } else {
        alert('Calendly is loading. Please try again in a moment.');
    }
    return false;
}

// Fetch GitHub Stats
async function fetchGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${portfolioData.personal.githubUsername}`);
        const data = await response.json();

        animateCounter('repo-count', data.public_repos);

        const reposResponse = await fetch(`https://api.github.com/users/${portfolioData.personal.githubUsername}/repos?per_page=100`);
        const repos = await reposResponse.json();
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

        animateCounter('stars-count', totalStars);

        const languages = {};
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        const topLanguages = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([lang]) => lang);

        document.getElementById('languages').textContent = topLanguages.join(', ') || 'Various';
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        document.getElementById('repo-count').textContent = '--';
        document.getElementById('stars-count').textContent = '--';
        document.getElementById('languages').textContent = 'Python, JS, Java';
    }
}

// Animate Counter
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    const duration = 1000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

fetchGitHubStats();

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Animated Progress Bars on Scroll
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = bar.getAttribute('data-level') + '%';
            progressObserver.unobserve(bar);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.progress-bar').forEach(bar => progressObserver.observe(bar));

// Scroll Animation for Sections
const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Back to Top Button + Navbar scroll effects
const backToTop = document.getElementById('back-to-top');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.remove('hidden');
    } else {
        backToTop.classList.add('hidden');
    }

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Mobile hamburger toggle
const navToggle = document.getElementById('nav-toggle');
const navLinksContainer = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
    });
});
