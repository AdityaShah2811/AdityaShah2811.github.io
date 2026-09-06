// ============================================================================
// PORTFOLIO RENDERER
// Reads portfolioData from ./data.js and fills the empty containers in
// index.html. Edit data.js to change content — you shouldn't need to touch
// this file or index.html.
// ============================================================================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// THEME
// The initial value is set by the inline script in index.html <head> so there
// is no flash. This only handles switching afterwards. Flipping one attribute
// on <html> repaints from CSS variables — no re-render, no second stylesheet.
// ---------------------------------------------------------------------------
const THEME_KEY = 'portfolio-theme';
const THEME_COLORS = { light: '#1e293b', dark: '#0b1220' };
const themeToggle = document.getElementById('theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, persist) {
    const root = document.documentElement;

    // Suppress transitions for the swap, otherwise every card, button and
    // border animates its colour at once and the flip stutters.
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', theme);

    if (themeMeta) themeMeta.setAttribute('content', THEME_COLORS[theme]);
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }

    if (persist) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (err) {
            // Private browsing — the theme still applies for this page view.
        }
    }

    // Release the suppression once the new palette has actually painted.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => root.classList.remove('theme-switching'));
    });
}

// Sync the label and meta colour with whatever the head script decided.
applyTheme(document.documentElement.getAttribute('data-theme') || 'light', false);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
    });
}

// Follow the OS, but only while the visitor hasn't made an explicit choice.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try {
        saved = localStorage.getItem(THEME_KEY);
    } catch (err) { /* ignore */ }
    if (!saved) applyTheme(e.matches ? 'dark' : 'light', false);
});

// ---------------------------------------------------------------------------
// REVEAL-ON-SCROLL
// Registered first, against the static <section> elements that always exist in
// index.html. CSS hides sections at opacity: 0 until they get .visible, so if
// this ran last a single error above it would leave the whole page blank.
// ---------------------------------------------------------------------------
const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// ---------------------------------------------------------------------------
// ERROR ISOLATION
// One bad key in data.js should cost you one section, not the entire page.
// ---------------------------------------------------------------------------
function safeRender(label, fn) {
    try {
        fn();
    } catch (err) {
        console.error(`[portfolio] Could not render "${label}" — check data.js for a missing or misspelled key.`, err);
    }
}

if (typeof portfolioData === 'undefined') {
    console.error('[portfolio] data.js did not load, or it has a syntax error. Nothing will render.');
}

// ---------------------------------------------------------------------------
// ICONS
// ---------------------------------------------------------------------------
const svgIcons = {
    github: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    kaggle: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.238-.036.27l-6.555 6.344 6.836 8.507c.095.118.116.211.075.282z"/></svg>',
    email: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>'
};

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
safeRender('hero', () => {
    document.getElementById('hero-name').textContent = portfolioData.personal.name;
    document.getElementById('hero-title').textContent = portfolioData.personal.title;
    document.getElementById('hero-tagline').textContent = portfolioData.personal.tagline;

    const profilePhoto = document.getElementById('profile-photo');
    profilePhoto.src = portfolioData.personal.photo;
    profilePhoto.onerror = function () {
        this.style.display = 'none';
        const initials = portfolioData.personal.name.split(' ').map(n => n[0]).join('');
        const fallback = document.createElement('div');
        fallback.className = 'profile-photo profile-fallback';
        fallback.textContent = initials;
        this.parentNode.insertBefore(fallback, this);
    };

    document.getElementById('resume-download').href = portfolioData.personal.resumeURL;
    document.getElementById('resume-download-btn').href = portfolioData.personal.resumeURL;
});

// ---------------------------------------------------------------------------
// SOCIAL ICONS (hero + footer)
// ---------------------------------------------------------------------------
safeRender('social icons', () => {
    const socialIconsHTML = `
        ${portfolioData.social.github && portfolioData.social.github !== '#' ? `<a href="${portfolioData.social.github}" class="social-icon" target="_blank" rel="noopener" title="GitHub" aria-label="GitHub">${svgIcons.github}</a>` : ''}
        ${portfolioData.social.linkedin && portfolioData.social.linkedin !== '#' ? `<a href="${portfolioData.social.linkedin}" class="social-icon" target="_blank" rel="noopener" title="LinkedIn" aria-label="LinkedIn">${svgIcons.linkedin}</a>` : ''}
        ${portfolioData.social.kaggle && portfolioData.social.kaggle !== '#' ? `<a href="${portfolioData.social.kaggle}" class="social-icon" target="_blank" rel="noopener" title="Kaggle" aria-label="Kaggle">${svgIcons.kaggle}</a>` : ''}
        ${portfolioData.social.email ? `<a href="${portfolioData.social.email}" class="social-icon" title="Email" aria-label="Email">${svgIcons.email}</a>` : ''}
    `;
    document.getElementById('hero-social').innerHTML = socialIconsHTML;
    document.getElementById('footer-social').innerHTML = socialIconsHTML;
});

// ---------------------------------------------------------------------------
// ABOUT
// ---------------------------------------------------------------------------
safeRender('about', () => {
    const bioData = portfolioData.about.bio;
    document.getElementById('about-bio').innerHTML = Array.isArray(bioData)
        ? bioData.map(p => `<p>${p}</p>`).join('')
        : `<p>${bioData}</p>`;
    document.getElementById('fact-location').textContent = portfolioData.about.quickFacts.location;
    document.getElementById('fact-education').textContent = portfolioData.about.quickFacts.education;
    document.getElementById('fact-status').textContent = portfolioData.about.quickFacts.status;
    document.getElementById('fact-availability').textContent = portfolioData.about.quickFacts.availability;
});

// ---------------------------------------------------------------------------
// SKILLS
// ---------------------------------------------------------------------------
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

safeRender('skills', () => {
    renderSkills(portfolioData.skills.languages, 'skills-languages');
    renderSkills(portfolioData.skills.dataAnalysis, 'skills-dataanalysis');
    renderSkills(portfolioData.skills.dataEngineering, 'skills-dataengineering');
    renderSkills(portfolioData.skills.tools, 'skills-tools');
});

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------
safeRender('projects', () => {
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
                ${(project.github && project.github !== '#') || project.demo ? `<div class="project-links">
                    ${project.github && project.github !== '#' ? `<a href="${project.github}" class="btn-small btn-github" target="_blank" rel="noopener">View Code</a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" class="btn-small btn-demo" target="_blank" rel="noopener">Live Demo</a>` : ''}
                </div>` : ''}
            </div>
        </div>
    `).join('');
});

// ---------------------------------------------------------------------------
// EXPERIENCE
// ---------------------------------------------------------------------------
safeRender('experience', () => {
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
});

// ---------------------------------------------------------------------------
// EDUCATION + CERTIFICATIONS
// ---------------------------------------------------------------------------
safeRender('education', () => {
    document.getElementById('education-list').innerHTML = portfolioData.education.map(edu => `
        <div class="education-item">
            <h4>${edu.degree}</h4>
            <div class="education-institution">${edu.institution}</div>
            <div class="education-meta">${edu.location} | ${edu.year}</div>
            ${edu.gpa ? `<div class="education-meta">GPA: ${edu.gpa}</div>` : ''}
        </div>
    `).join('');

    document.getElementById('certifications-list').innerHTML = portfolioData.certifications
        .map(cert => `<li>${cert}</li>`).join('');
});

// ---------------------------------------------------------------------------
// CONTACT + FOOTER
// ---------------------------------------------------------------------------
safeRender('contact', () => {
    document.getElementById('contact-location').textContent = portfolioData.personal.location;
    document.getElementById('contact-linkedin').href = portfolioData.social.linkedin;
    document.getElementById('contact-github').href = portfolioData.social.github;
    document.getElementById('contact-email').href = portfolioData.social.email;
    document.getElementById('contact-email').textContent = portfolioData.personal.email;
    document.getElementById('email-btn').href = portfolioData.social.email;
    document.getElementById('github-profile-link').href = portfolioData.social.github;

    // Calendly - direct link (no popup widget, avoids freezing)
    const calendlyBtn = document.getElementById('calendly-btn');
    if (portfolioData.personal.calendlyURL && portfolioData.personal.calendlyURL !== 'https://calendly.com/PLACEHOLDER/15min') {
        calendlyBtn.href = portfolioData.personal.calendlyURL;
        calendlyBtn.target = '_blank';
        calendlyBtn.rel = 'noopener';
    } else {
        calendlyBtn.href = portfolioData.social.email;
    }
});

safeRender('footer', () => {
    document.getElementById('footer-copyright').textContent = portfolioData.footer.copyright;
});

// ---------------------------------------------------------------------------
// RESUME AVAILABILITY
// "Download Resume" is the first thing most recruiters click. If the PDF isn't
// actually in resume/, hand them a mailto instead of a 404. Drop the file in
// and this check silently stops firing.
// ---------------------------------------------------------------------------
async function verifyResumeLink() {
    const url = portfolioData.personal.resumeURL;
    const heroBtn = document.getElementById('resume-download');
    const sectionBtn = document.getElementById('resume-download-btn');
    const sectionCopy = document.querySelector('#resume .resume-content p');

    function fallBackToEmail() {
        const mailto = portfolioData.social.email || `mailto:${portfolioData.personal.email}`;
        if (heroBtn) {
            heroBtn.href = mailto;
            heroBtn.textContent = 'Request Resume';
        }
        if (sectionBtn) {
            sectionBtn.href = mailto;
            sectionBtn.textContent = '📧 Request Resume';
        }
        if (sectionCopy) {
            sectionCopy.textContent = 'My full resume is available on request — email me and I\'ll send it straight over.';
        }
        console.warn(`[portfolio] Resume not found at "${url}". Buttons now point to email. Add the PDF to restore the download.`);
    }

    if (!url) {
        fallBackToEmail();
        return;
    }

    try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!res.ok) fallBackToEmail();
    } catch (err) {
        // fetch() throws when the page is opened over file:// — we genuinely
        // can't tell whether the file exists, so leave the links untouched.
    }
}

safeRender('resume check', () => { verifyResumeLink(); });

// ---------------------------------------------------------------------------
// GITHUB STATS
// The unauthenticated API allows 60 requests/hour per IP and this page spends
// two per load, so results are cached in localStorage for an hour.
// ---------------------------------------------------------------------------
const GITHUB_CACHE_KEY = 'portfolio-github-stats-v1';
const GITHUB_CACHE_TTL = 60 * 60 * 1000; // 1 hour

function readGitHubCache() {
    try {
        const raw = localStorage.getItem(GITHUB_CACHE_KEY);
        if (!raw) return null;
        const cached = JSON.parse(raw);
        if (!cached || Date.now() - cached.ts > GITHUB_CACHE_TTL) return null;
        return cached.data;
    } catch (err) {
        return null;
    }
}

function writeGitHubCache(data) {
    try {
        localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch (err) {
        // Private browsing or a full quota — caching is optional, carry on.
    }
}

function applyGitHubStats(stats) {
    animateCounter('repo-count', stats.repos);
    animateCounter('stars-count', stats.stars);
    document.getElementById('languages').textContent = stats.languages.join(', ') || 'Various';
}

async function fetchGitHubStats() {
    const cached = readGitHubCache();
    if (cached) {
        applyGitHubStats(cached);
        return;
    }

    const user = portfolioData.personal.githubUsername;

    try {
        const response = await fetch(`https://api.github.com/users/${user}`);
        if (!response.ok) throw new Error(`GitHub user request failed: ${response.status}`);
        const data = await response.json();

        const reposResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`);
        if (!reposResponse.ok) throw new Error(`GitHub repos request failed: ${reposResponse.status}`);
        const repos = await reposResponse.json();
        if (!Array.isArray(repos)) throw new Error('Unexpected repos payload');

        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

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

        // Everything resolved cleanly — only now touch the DOM, so a failure
        // partway through can't leave half-written numbers on the page.
        const stats = { repos: data.public_repos, stars: totalStars, languages: topLanguages };
        writeGitHubCache(stats);
        applyGitHubStats(stats);
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        document.getElementById('repo-count').textContent = '--';
        document.getElementById('stars-count').textContent = '--';
        document.getElementById('languages').textContent = 'See profile';
    }
}

// Counts up to a target. Guards against non-numeric input: an unguarded NaN
// target makes `current >= target` permanently false, which leaves an interval
// running forever writing "NaN" into the page.
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const value = Number(target);
    if (!Number.isFinite(value)) {
        element.textContent = '--';
        return;
    }

    if (reduceMotion || value <= 0) {
        element.textContent = String(value);
        return;
    }

    const duration = 1000;
    const increment = value / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
            element.textContent = value;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

safeRender('github stats', () => { fetchGitHubStats(); });

// ---------------------------------------------------------------------------
// SMOOTH SCROLL
// ---------------------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        }
    });
});

// ---------------------------------------------------------------------------
// PROGRESS BARS + PROJECT CARD ANIMATIONS
// ---------------------------------------------------------------------------
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

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.project-card');
            cards.forEach((card, i) => {
                setTimeout(() => card.classList.add('animate-in'), reduceMotion ? 0 : i * 120);
            });
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const projectsGrid = document.getElementById('projects-grid');
if (projectsGrid) cardObserver.observe(projectsGrid);

// ---------------------------------------------------------------------------
// BACK TO TOP + NAVBAR SCROLL STATE
// ---------------------------------------------------------------------------
const backToTop = document.getElementById('back-to-top');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateScrollState() {
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
}

// Reading offsetTop forces a synchronous layout, so this is throttled to one
// run per frame rather than once per scroll event.
let scrollQueued = false;
window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
        updateScrollState();
        scrollQueued = false;
    });
}, { passive: true });

updateScrollState();

// ---------------------------------------------------------------------------
// MOBILE NAV
// ---------------------------------------------------------------------------
const navToggle = document.getElementById('nav-toggle');
const navLinksContainer = document.getElementById('nav-links');

function setNavOpen(isOpen) {
    navToggle.classList.toggle('open', isOpen);
    navLinksContainer.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
}

navToggle.addEventListener('click', () => {
    setNavOpen(!navToggle.classList.contains('open'));
});

navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setNavOpen(false));
});

// Escape closes the menu and hands focus back to the button, so keyboard users
// aren't left tabbing behind an open overlay.
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.classList.contains('open')) {
        setNavOpen(false);
        navToggle.focus();
    }
});

// Tapping outside the open menu closes it.
document.addEventListener('click', (e) => {
    if (!navToggle.classList.contains('open')) return;
    if (navToggle.contains(e.target) || navLinksContainer.contains(e.target)) return;
    setNavOpen(false);
});
