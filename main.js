// Populate Hero Section
document.getElementById('hero-name').textContent = portfolioData.personal.name;
document.getElementById('hero-title').textContent = portfolioData.personal.title;
document.getElementById('hero-tagline').textContent = portfolioData.personal.tagline;
document.getElementById('profile-photo').src = portfolioData.personal.photo;
document.getElementById('resume-download').href = portfolioData.personal.resumeURL;
document.getElementById('resume-download-btn').href = portfolioData.personal.resumeURL;

// Social Icons
const socialIconsHTML = `
    ${portfolioData.social.github ? `<a href="${portfolioData.social.github}" class="social-icon" target="_blank" title="GitHub">G</a>` : ''}
    ${portfolioData.social.linkedin ? `<a href="${portfolioData.social.linkedin}" class="social-icon" target="_blank" title="LinkedIn">L</a>` : ''}
    ${portfolioData.social.kaggle ? `<a href="${portfolioData.social.kaggle}" class="social-icon" target="_blank" title="Kaggle">K</a>` : ''}
    ${portfolioData.social.email ? `<a href="${portfolioData.social.email}" class="social-icon" title="Email">@</a>` : ''}
`;
document.getElementById('hero-social').innerHTML = socialIconsHTML;
document.getElementById('footer-social').innerHTML = socialIconsHTML;

// Populate About Section
document.getElementById('about-bio').textContent = portfolioData.about.bio;
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
        <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy" decoding="async">
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
