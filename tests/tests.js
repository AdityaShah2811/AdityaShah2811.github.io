/* ============================================================================
   PORTFOLIO PRE-FLIGHT TESTS
   Zero dependencies. Loads the real index.html in an iframe and asserts against
   the actual rendered DOM — so these catch what a visitor would actually hit.

   Run: start a local server at the repo root, open /tests/tests.html
   ========================================================================== */

const SUITE = [];

// Blocking: a failure here stops the deploy.
function test(group, name, fn) { SUITE.push({ group, name, fn, blocking: true }); }

// Advisory: reported loudly but does not stop the deploy. For things that are
// genuinely worth fixing but shouldn't hold the site hostage.
function warn(group, name, fn) { SUITE.push({ group, name, fn, blocking: false }); }

// Thrown to mark a check as not-applicable in this environment rather than
// failing it — e.g. observers and rAF are suspended in a background tab.
class Skipped extends Error {}
function skip(reason) { throw new Skipped(reason); }

// True only when the browser is actually painting this page. IntersectionObserver
// and requestAnimationFrame do not run in a hidden or backgrounded tab.
function isBeingPainted() {
    return document.visibilityState === 'visible';
}

function assert(cond, msg) {
    if (!cond) throw new Error(msg || 'Assertion failed');
}
function assertEqual(actual, expected, msg) {
    if (actual !== expected) {
        throw new Error(`${msg || 'Mismatch'} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

// --- shared handles, populated by boot() -----------------------------------
let win, doc, data;

// --- colour helpers ---------------------------------------------------------
function parseColor(c) {
    const m = String(c).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(Number);
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
}
function luminance([r, g, b]) {
    const s = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}
function effectiveBackground(el) {
    let node = el;
    while (node && node !== doc.documentElement) {
        const cs = win.getComputedStyle(node);
        const bg = parseColor(cs.backgroundColor);
        if (bg && bg.a > 0.5) return bg.rgb;
        if (cs.backgroundImage && cs.backgroundImage !== 'none') {
            const stop = cs.backgroundImage.match(/rgb\([^)]+\)/);
            if (stop) return parseColor(stop[0]).rgb;
        }
        node = node.parentElement;
    }
    return [255, 255, 255];
}
function contrastRatio(el) {
    const fg = parseColor(win.getComputedStyle(el).color);
    if (!fg) return null;
    const L1 = luminance(fg.rgb);
    const L2 = luminance(effectiveBackground(el));
    const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
}

async function exists(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        return res.ok;
    } catch (err) {
        return false;
    }
}

// Resolve a path written in data.js (e.g. "./images/x.svg") against the site root
function siteURL(path) {
    return new URL(path, new URL('../', location.href)).href;
}

// Several components carry `transition: all 0.3s`, so reading computed colours
// straight after flipping data-theme returns the OLD palette mid-transition.
// .theme-switching kills every transition, making the swap observable at once.
function setTheme(theme) {
    const root = doc.documentElement;
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', theme);
    void root.offsetHeight; // force a synchronous style recalculation
}
function releaseTheme() {
    doc.documentElement.classList.remove('theme-switching');
}

/* ==========================================================================
   1. DATA INTEGRITY — catches typos in data.js before they reach the page
   ========================================================================== */

test('Data', 'portfolioData loaded', () => {
    assert(typeof data === 'object' && data !== null, 'data.js did not load or has a syntax error');
});

test('Data', 'required top-level sections exist', () => {
    ['personal', 'social', 'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'footer']
        .forEach(key => assert(key in data, `Missing "${key}" in portfolioData`));
});

test('Data', 'personal details are filled in', () => {
    ['name', 'title', 'tagline', 'photo', 'location', 'email', 'githubUsername']
        .forEach(k => assert(data.personal[k] && String(data.personal[k]).trim(), `personal.${k} is empty`));
});

test('Data', 'email address is well formed', () => {
    assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email), `Bad email: ${data.personal.email}`);
});

test('Data', 'no template values left', () => {
    // Case-sensitive on purpose: "placeholder.svg" and status "placeholder"
    // are legitimate, screaming-caps PLACEHOLDER is an unfilled template.
    const raw = JSON.stringify(data);
    assert(!/\bPLACEHOLDER\b/.test(raw), 'An unfilled PLACEHOLDER value is still in data.js');
    assert(!/YOUR[_ ]/i.test(raw), 'A "YOUR_..." template value is still in data.js');
    assert(!/example\.com/i.test(raw), 'An example.com URL is still in data.js');
});

test('Data', 'social links are real URLs (or intentionally disabled with #)', () => {
    Object.entries(data.social).forEach(([k, url]) => {
        if (url === '#') return;
        assert(/^(https?:\/\/|mailto:)/.test(url), `social.${k} is not a URL: ${url}`);
    });
});

test('Data', 'skill levels are 0-100 integers', () => {
    Object.entries(data.skills).forEach(([group, list]) => {
        list.forEach(s => {
            assert(Number.isInteger(s.level) && s.level >= 0 && s.level <= 100,
                `skills.${group} "${s.name}" has invalid level: ${s.level}`);
        });
    });
});

test('Data', 'every project has the required fields', () => {
    data.projects.forEach((p, i) => {
        ['title', 'description', 'image', 'tech', 'status']
            .forEach(k => assert(p[k], `projects[${i}] ("${p.title || '?'}") missing "${k}"`));
        assert(Array.isArray(p.tech) && p.tech.length, `projects[${i}] has no tech tags`);
    });
});

test('Data', 'project statuses are recognised values', () => {
    const valid = ['complete', 'coming-soon', 'placeholder'];
    data.projects.forEach(p => {
        assert(valid.includes(p.status), `"${p.title}" has unknown status "${p.status}" (renders no badge)`);
    });
});

test('Data', 'project titles are unique', () => {
    const titles = data.projects.map(p => p.title);
    assertEqual(new Set(titles).size, titles.length, 'Duplicate project titles');
});

test('Data', 'projects marked complete have a real repo link', () => {
    data.projects.filter(p => p.status === 'complete').forEach(p => {
        assert(p.github && p.github !== '#',
            `"${p.title}" is marked complete but has no GitHub link — the View Code button will not render`);
    });
});

test('Data', 'every experience entry has bullet points', () => {
    data.experience.forEach((e, i) => {
        ['title', 'company', 'duration'].forEach(k => assert(e[k], `experience[${i}] missing "${k}"`));
        assert(Array.isArray(e.points) && e.points.length, `experience[${i}] ("${e.title}") has no points`);
    });
});

test('Data', 'every education entry is complete', () => {
    data.education.forEach((e, i) => {
        ['degree', 'institution', 'year'].forEach(k => assert(e[k], `education[${i}] missing "${k}"`));
    });
});

/* ==========================================================================
   2. RENDERING — every container index.html declares must get filled
   ========================================================================== */

test('Render', 'hero is populated', () => {
    assertEqual(doc.getElementById('hero-name').textContent.trim(), data.personal.name, 'Hero name');
    assert(doc.getElementById('hero-title').textContent.trim(), 'Hero title is empty');
    assert(doc.getElementById('hero-tagline').textContent.trim(), 'Hero tagline is empty');
});

test('Render', 'about bio paragraphs rendered', () => {
    const expected = Array.isArray(data.about.bio) ? data.about.bio.length : 1;
    assertEqual(doc.querySelectorAll('#about-bio p').length, expected, 'Bio paragraph count');
});

test('Render', 'quick facts populated', () => {
    ['fact-location', 'fact-education', 'fact-status', 'fact-availability']
        .forEach(id => assert(doc.getElementById(id).textContent.trim(), `#${id} is empty`));
});

test('Render', 'every skill renders a bar', () => {
    const expected = Object.values(data.skills).reduce((n, list) => n + list.length, 0);
    assertEqual(doc.querySelectorAll('.skill-item').length, expected, 'Skill item count');
});

test('Render', 'project cards match the data', () => {
    assertEqual(doc.querySelectorAll('.project-card').length, data.projects.length, 'Project card count');
});

test('Render', 'experience and education render', () => {
    assertEqual(doc.querySelectorAll('.timeline-item').length, data.experience.length, 'Experience count');
    assertEqual(doc.querySelectorAll('.education-item').length, data.education.length, 'Education count');
    assertEqual(doc.querySelectorAll('.certifications-list li').length, data.certifications.length, 'Certification count');
});

test('Render', 'no container was left empty', () => {
    const containers = ['hero-social', 'footer-social', 'projects-grid', 'experience-timeline',
        'education-list', 'certifications-list', 'skills-languages', 'skills-dataanalysis',
        'skills-dataengineering', 'skills-tools'];
    containers.forEach(id => {
        const el = doc.getElementById(id);
        assert(el, `#${id} is missing from index.html`);
        assert(el.children.length > 0, `#${id} rendered empty — main.js likely threw before reaching it`);
    });
});

test('Render', 'footer copyright rendered', () => {
    assert(doc.getElementById('footer-copyright').textContent.trim(), 'Footer copyright is empty');
});

/* ==========================================================================
   3. LINKS
   ========================================================================== */

test('Links', 'no dead "#" links left in rendered content', () => {
    const dead = [...doc.querySelectorAll('main a[href="#"], footer a[href="#"]')]
        .map(a => a.textContent.trim() || a.getAttribute('aria-label') || a.outerHTML.slice(0, 60));
    assertEqual(dead.length, 0, `Dead links pointing at "#": ${dead.join(', ')}`);
});

test('Links', 'external links open safely', () => {
    const unsafe = [...doc.querySelectorAll('a[target="_blank"]')]
        .filter(a => !(a.getAttribute('rel') || '').includes('noopener'))
        .map(a => a.href);
    assertEqual(unsafe.length, 0, `target="_blank" without rel="noopener": ${unsafe.join(', ')}`);
});

test('Links', 'every in-page anchor has a matching section', () => {
    const broken = [...doc.querySelectorAll('a[href^="#"]')]
        .map(a => a.getAttribute('href'))
        .filter(h => h.length > 1 && !doc.querySelector(h));
    assertEqual(broken.length, 0, `Anchors with no target: ${broken.join(', ')}`);
});

test('Links', 'contact email link matches data.js', () => {
    const el = doc.getElementById('contact-email');
    assert(el.href.startsWith('mailto:'), 'Contact email is not a mailto link');
    assertEqual(el.textContent.trim(), data.personal.email, 'Contact email text');
});

/* ==========================================================================
   4. ASSETS — the checks that would have caught the missing resume PDF
   ========================================================================== */

test('Assets', 'profile photo resolves', async () => {
    assert(await exists(siteURL(data.personal.photo)), `Profile photo missing: ${data.personal.photo}`);
});

test('Assets', 'every project image resolves', async () => {
    for (const p of data.projects) {
        assert(await exists(siteURL(p.image)), `Missing project image for "${p.title}": ${p.image}`);
    }
});

test('Assets', 'favicon and social card exist', async () => {
    assert(await exists(siteURL('images/favicon.svg')), 'images/favicon.svg missing');
    assert(await exists(siteURL('images/og-card.jpg')), 'images/og-card.jpg missing — social previews will be blank');
});

// Advisory, not blocking: the site degrades to a "Request Resume" mailto, so a
// missing PDF is not a broken page — but it is a real conversion loss.
warn('Assets', 'resume PDF is present', async () => {
    assert(await exists(siteURL(data.personal.resumeURL)),
        `Resume not found at ${data.personal.resumeURL}. The site falls back to "Request Resume", but recruiters expect a download.`);
});

test('Assets', '404 page exists', async () => {
    assert(await exists(siteURL('404.html')), '404.html missing');
});

test('Assets', 'robots.txt and sitemap.xml exist', async () => {
    assert(await exists(siteURL('robots.txt')), 'robots.txt missing');
    assert(await exists(siteURL('sitemap.xml')), 'sitemap.xml missing');
});

/* ==========================================================================
   5. SEO & METADATA
   ========================================================================== */

test('SEO', 'title is present and a sensible length', () => {
    const t = doc.title;
    assert(t && t.length >= 10, 'Title too short');
    assert(t.length <= 65, `Title is ${t.length} chars — Google truncates past ~60`);
});

test('SEO', 'meta description is a sensible length', () => {
    const d = doc.querySelector('meta[name="description"]')?.content || '';
    assert(d.length >= 50, 'Meta description too short');
    assert(d.length <= 165, `Meta description is ${d.length} chars — truncated past ~160`);
});

test('SEO', 'canonical URL present', () => {
    assert(doc.querySelector('link[rel="canonical"]')?.href, 'No canonical link');
});

test('SEO', 'social preview image is a raster format', () => {
    const og = doc.querySelector('meta[property="og:image"]')?.content || '';
    assert(og, 'No og:image');
    assert(/\.(jpe?g|png)$/i.test(og), `og:image is "${og}" — LinkedIn, Twitter and Slack reject SVG previews`);
});

test('SEO', 'og:image declares its dimensions', () => {
    assert(doc.querySelector('meta[property="og:image:width"]'), 'Missing og:image:width');
    assert(doc.querySelector('meta[property="og:image:height"]'), 'Missing og:image:height');
});

test('SEO', 'JSON-LD structured data parses', () => {
    const script = doc.querySelector('script[type="application/ld+json"]');
    assert(script, 'No JSON-LD block');
    const parsed = JSON.parse(script.textContent);
    assertEqual(parsed['@type'], 'Person', 'JSON-LD @type');
    assertEqual(parsed.name, data.personal.name, 'JSON-LD name is out of sync with data.js');
    assertEqual(parsed.email, data.personal.email, 'JSON-LD email is out of sync with data.js');
});

/* ==========================================================================
   6. ACCESSIBILITY
   ========================================================================== */

test('A11y', 'page declares a language', () => {
    assert(doc.documentElement.getAttribute('lang'), 'No lang attribute on <html>');
});

test('A11y', 'exactly one h1', () => {
    assertEqual(doc.querySelectorAll('h1').length, 1, 'Should be exactly one <h1>');
});

test('A11y', 'every image has alt text', () => {
    const bad = [...doc.querySelectorAll('img')].filter(i => i.getAttribute('alt') === null).map(i => i.src);
    assertEqual(bad.length, 0, `Images without alt: ${bad.join(', ')}`);
});

test('A11y', 'every button has an accessible name', () => {
    const bad = [...doc.querySelectorAll('button')]
        .filter(b => !(b.getAttribute('aria-label') || b.textContent.trim()))
        .map(b => b.id || b.className);
    assertEqual(bad.length, 0, `Buttons with no accessible name: ${bad.join(', ')}`);
});

test('A11y', 'skip link is first focusable and targets main content', () => {
    const skip = doc.querySelector('.skip-link');
    assert(skip, 'No skip-to-content link');

    const target = skip.getAttribute('href');
    assert(doc.querySelector(target), `Skip link points at ${target}, which does not exist`);
    assertEqual(target, '#main', 'Skip link should land on <main>, not skip past the hero');

    const focusables = doc.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    assertEqual(focusables[0], skip, 'The skip link is not the first focusable element on the page');
});

test('A11y', 'a visible focus style is defined', () => {
    let rules = 0;
    for (const sheet of doc.styleSheets) {
        try {
            for (const rule of sheet.cssRules) {
                if (rule.selectorText && rule.selectorText.includes(':focus-visible')) rules++;
            }
        } catch (err) { /* cross-origin */ }
    }
    assert(rules > 0, 'No :focus-visible rule — keyboard users get the browser default, which is invisible on the dark navbar');
});

test('A11y', 'no invalid paragraph nesting', () => {
    const nested = [...doc.querySelectorAll('p p')].length;
    assertEqual(nested, 0, 'A <p> contains another <p> — invalid markup, browsers will silently restructure it');
});

test('A11y', 'Escape closes the mobile menu', () => {
    const toggle = doc.getElementById('nav-toggle');
    toggle.click();
    assertEqual(toggle.getAttribute('aria-expanded'), 'true', 'Menu did not open');

    doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assertEqual(toggle.getAttribute('aria-expanded'), 'false', 'Escape did not close the menu');
});

test('A11y', 'Escape returns focus to the menu button', () => {
    const toggle = doc.getElementById('nav-toggle');

    // Probe first: a background tab or a headless browser cannot hold focus
    // inside the frame, which would make this look like a site bug.
    win.focus();
    toggle.focus();
    if (doc.activeElement !== toggle) {
        skip('This browsing context cannot hold focus (background tab or headless)');
    }
    doc.body.focus();

    toggle.click();
    doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assertEqual(doc.activeElement, toggle, 'Focus was not returned to the menu button');
});

test('A11y', 'clicking outside closes the mobile menu', () => {
    const toggle = doc.getElementById('nav-toggle');
    toggle.click();
    assertEqual(toggle.getAttribute('aria-expanded'), 'true', 'Menu did not open');

    doc.getElementById('main').click();
    assertEqual(toggle.getAttribute('aria-expanded'), 'false', 'Outside click did not close the menu');
});

test('A11y', 'mobile nav toggle reports its state', () => {
    assert(doc.getElementById('nav-toggle').hasAttribute('aria-expanded'), 'nav-toggle missing aria-expanded');
});

test('A11y', 'reduced-motion support is declared', () => {
    let found = false;
    for (const sheet of doc.styleSheets) {
        try {
            for (const rule of sheet.cssRules) {
                if (rule.type === CSSRule.MEDIA_RULE && rule.conditionText.includes('reduced-motion')) found = true;
            }
        } catch (err) { /* cross-origin sheet (Google Fonts) */ }
    }
    assert(found, 'No prefers-reduced-motion block in the stylesheet');
});

// Text samples covering every surface the site uses
const CONTRAST_SAMPLES = {
    'body text': '.about-bio p',
    'section title': '.section-title',
    'quick facts heading': '.quick-facts h3',
    'skill name': '.skill-name',
    'skill percentage': '.skill-level',
    'skill badge': '.skill-badge',
    'project title': '.project-title',
    'project description': '.project-description',
    'tech tag': '.tag',
    'status badge': '.project-status-badge',
    'stat label': '.stat-label',
    'timeline company': '.timeline-company',
    'timeline meta': '.timeline-meta',
    'education institution': '.education-institution',
    'education meta': '.education-meta',
    'certification': '.certifications-list li',
    'resume copy': '.resume-content p',
    'resume stats': '.resume-stats',
    'contact subtitle': '.contact-subtitle',
    'contact link': '.contact-detail a',
    'nav link': '.nav-links a',
    'hero tagline': '#hero .tagline'
};

['light', 'dark'].forEach(theme => {
    test('A11y', `text meets WCAG AA (4.5:1) in ${theme} mode`, () => {
        const original = doc.documentElement.getAttribute('data-theme');
        setTheme(theme);
        try {
            const failures = [];
            for (const [label, sel] of Object.entries(CONTRAST_SAMPLES)) {
                const el = doc.querySelector(sel);
                if (!el) continue;
                const r = contrastRatio(el);
                if (r !== null && r < 4.5) failures.push(`${label} ${r.toFixed(2)}:1`);
            }
            assertEqual(failures.length, 0, `Below 4.5:1 — ${failures.join('; ')}`);
        } finally {
            setTheme(original);
            releaseTheme();
        }
    });
});

/* ==========================================================================
   7. THEMING
   ========================================================================== */

test('Theme', 'toggle button exists', () => {
    assert(doc.getElementById('theme-toggle'), 'No #theme-toggle in the navbar');
});

test('Theme', 'a theme is applied before paint', () => {
    const t = doc.documentElement.getAttribute('data-theme');
    assert(t === 'light' || t === 'dark', `data-theme is "${t}" — the inline head script did not run, expect a flash`);
});

test('Theme', 'light and dark define the same token set', () => {
    let lightTokens = null, darkTokens = null;
    const collect = rule => Array.from(rule.style).filter(p => p.startsWith('--')).sort();
    for (const sheet of doc.styleSheets) {
        try {
            for (const rule of sheet.cssRules) {
                if (rule.selectorText === ':root') lightTokens = collect(rule);
                if (rule.selectorText === '[data-theme="dark"]') darkTokens = collect(rule);
            }
        } catch (err) { /* cross-origin */ }
    }
    assert(lightTokens && darkTokens, 'Could not find :root and [data-theme="dark"] blocks');
    const missing = darkTokens.filter(t => !lightTokens.includes(t));
    assertEqual(missing.length, 0, `Dark theme defines tokens light does not: ${missing.join(', ')}`);
});

test('Theme', 'switching actually repaints surfaces', () => {
    const original = doc.documentElement.getAttribute('data-theme');
    try {
        setTheme('light');
        const lightBg = win.getComputedStyle(doc.body).backgroundColor;
        const lightText = win.getComputedStyle(doc.body).color;
        setTheme('dark');
        const darkBg = win.getComputedStyle(doc.body).backgroundColor;
        const darkText = win.getComputedStyle(doc.body).color;
        assert(lightBg !== darkBg, 'Body background did not change between themes');
        assert(lightText !== darkText, 'Body text colour did not change between themes');
    } finally {
        setTheme(original);
        releaseTheme();
    }
});

test('Theme', 'no CSS variable resolves to empty', () => {
    const original = doc.documentElement.getAttribute('data-theme');
    const unresolved = [];
    try {
        ['light', 'dark'].forEach(theme => {
            setTheme(theme);
            const cs = win.getComputedStyle(doc.documentElement);
            for (const sheet of doc.styleSheets) {
                try {
                    for (const rule of sheet.cssRules) {
                        if (rule.selectorText !== ':root') continue;
                        Array.from(rule.style).filter(p => p.startsWith('--')).forEach(token => {
                            if (!cs.getPropertyValue(token).trim()) unresolved.push(`${token} (${theme})`);
                        });
                    }
                } catch (err) { /* cross-origin */ }
            }
        });
        assertEqual(unresolved.length, 0, `Empty tokens: ${unresolved.join(', ')}`);
    } finally {
        setTheme(original);
        releaseTheme();
    }
});

test('Theme', 'footer stays dark in both themes', () => {
    // Regression guard: footer used to be var(--text-primary), which inverts.
    const original = doc.documentElement.getAttribute('data-theme');
    try {
        const readFooter = theme => {
            setTheme(theme);
            return luminance(parseColor(win.getComputedStyle(doc.querySelector('footer')).backgroundColor).rgb);
        };
        assert(readFooter('light') < 0.2, 'Footer is not dark in light mode');
        assert(readFooter('dark') < 0.2, 'Footer inverted to a light colour in dark mode');
    } finally {
        setTheme(original);
        releaseTheme();
    }
});

/* ==========================================================================
   8. RESPONSIVE
   ========================================================================== */

[[375, 'mobile'], [768, 'tablet'], [1280, 'desktop']].forEach(([width, label]) => {
    test('Responsive', `no horizontal overflow at ${width}px (${label})`, async () => {
        const frame = document.getElementById('site-frame');
        const previous = frame.style.width;
        frame.style.width = width + 'px';
        await new Promise(r => setTimeout(r, 250));
        const overflow = doc.documentElement.scrollWidth - doc.documentElement.clientWidth;
        frame.style.width = previous;
        await new Promise(r => setTimeout(r, 150));
        assert(overflow <= 1, `Page scrolls sideways by ${overflow}px at ${width}px wide`);
    });
});

test('Responsive', 'anchors clear the fixed navbar', () => {
    const pad = parseInt(win.getComputedStyle(doc.documentElement).scrollPaddingTop, 10);
    const navHeight = doc.getElementById('navbar').offsetHeight;
    assert(!Number.isNaN(pad) && pad >= navHeight,
        `scroll-padding-top is ${pad || 'unset'} but the navbar is ${navHeight}px — section titles will be hidden`);
});

/* ==========================================================================
   9. BEHAVIOUR
   ========================================================================== */

test('Behaviour', 'counter animation survives a failed GitHub response', async () => {
    // Rate-limited API returns no public_repos. An unguarded counter used to
    // spin a 16ms interval forever writing "NaN".
    const el = doc.getElementById('repo-count');
    const restore = el.textContent;
    win.animateCounter('repo-count', undefined);
    await new Promise(r => setTimeout(r, 400));
    const shown = el.textContent;
    el.textContent = restore;
    assert(!shown.includes('NaN'), `Counter rendered "${shown}" for a missing value`);
});

test('Behaviour', 'the .visible class actually reveals a section', () => {
    // The reveal contract itself, independent of observer timing: if this
    // breaks, no amount of scrolling will ever show the content.
    const sections = [...doc.querySelectorAll('section')];
    const restore = sections.map(s => s.classList.contains('visible'));
    try {
        sections.forEach(s => s.classList.add('visible'));
        const stillHidden = sections
            .filter(s => parseFloat(win.getComputedStyle(s).opacity) === 0)
            .map(s => s.id);
        assertEqual(stillHidden.length, 0, `.visible does not reveal: ${stillHidden.join(', ')}`);
    } finally {
        sections.forEach((s, i) => s.classList.toggle('visible', restore[i]));
    }
});

test('Behaviour', 'a no-JS fallback keeps content visible', () => {
    // If main.js never runs, .no-js must cancel the opacity:0 starting state,
    // otherwise a script failure renders a blank white page.
    let rule = null;
    for (const sheet of doc.styleSheets) {
        try {
            for (const r of sheet.cssRules) {
                if (r.selectorText && r.selectorText.includes('.no-js') && r.selectorText.includes('section')) rule = r;
            }
        } catch (err) { /* cross-origin */ }
    }
    assert(rule, 'No ".no-js section" rule — a script failure would leave the page blank');
    assertEqual(rule.style.opacity, '1', '.no-js section does not restore opacity');
});

test('Behaviour', 'scroll reveal fires for every section', () => {
    if (!isBeingPainted()) {
        skip('Tab is backgrounded — IntersectionObserver and rAF are suspended by the browser');
    }
    const hidden = [...doc.querySelectorAll('section')]
        .filter(s => parseFloat(win.getComputedStyle(s).opacity) === 0)
        .map(s => s.id);
    assertEqual(hidden.length, 0, `Sections stuck invisible: ${hidden.join(', ')}`);
});

test('Behaviour', 'progress bars reflect their data-level', () => {
    const mismatched = [...doc.querySelectorAll('.progress-bar')]
        .filter(b => b.style.width && b.style.width !== b.getAttribute('data-level') + '%')
        .map(b => b.getAttribute('data-level'));
    assertEqual(mismatched.length, 0, `Progress bars with wrong width: ${mismatched.join(', ')}`);
});

test('Behaviour', 'resume button degrades instead of 404ing', async () => {
    const present = await exists(siteURL(data.personal.resumeURL));
    const href = doc.getElementById('resume-download').getAttribute('href');
    if (present) {
        assert(href.includes('.pdf'), 'Resume exists but the button does not link to it');
    } else {
        assert(href.startsWith('mailto:'),
            'Resume is missing and the button still points at a dead PDF — visitors will hit a 404');
    }
});

/* ==========================================================================
   RUNNER
   ========================================================================== */

function boot() {
    return new Promise((resolve, reject) => {
        const frame = document.getElementById('site-frame');
        frame.addEventListener('load', async () => {
            win = frame.contentWindow;
            doc = frame.contentDocument;
            // `const portfolioData` is a lexical binding, so it never becomes a
            // property of window — it has to be read from inside the frame.
            try {
                data = win.eval('typeof portfolioData !== "undefined" ? portfolioData : undefined');
            } catch (err) {
                data = undefined;
            }
            // Let main.js finish its async work (GitHub fetch, resume HEAD check).
            await new Promise(r => setTimeout(r, 1200));

            // Wait for images, otherwise the page is still growing underneath us.
            await Promise.race([
                Promise.all([...doc.images].map(img => img.complete
                    ? null
                    : new Promise(r => { img.onload = img.onerror = r; }))),
                new Promise(r => setTimeout(r, 3000))
            ]);

            // Reveal every section so we test a rendered page, not one frozen at
            // opacity 0.
            //
            // The site sets `scroll-behavior: smooth`, which makes every
            // programmatic scroll animate — successive calls interrupt each
            // other and the page never actually reaches the target. Force
            // instant scrolling for the warm-up, then restore.
            // The frame's observers only fire while the frame is on-screen in
            // this page, so keep it in view for the warm-up.
            window.scrollTo(0, 0);

            const rootStyle = doc.documentElement.style;
            const previousBehavior = rootStyle.scrollBehavior;
            rootStyle.scrollBehavior = 'auto';

            for (const section of doc.querySelectorAll('section')) {
                section.scrollIntoView({ block: 'center', behavior: 'instant' });
                await new Promise(r => setTimeout(r, 80));
            }
            win.scrollTo({ top: 0, behavior: 'instant' });
            await new Promise(r => setTimeout(r, 400));

            rootStyle.scrollBehavior = previousBehavior;
            resolve();
        }, { once: true });
        frame.addEventListener('error', () => reject(new Error('Could not load index.html')), { once: true });
        frame.src = '../index.html';
    });
}

async function run() {
    const statusEl = document.getElementById('status');
    const tbody = document.getElementById('results');

    try {
        await boot();
    } catch (err) {
        statusEl.className = 'status fail';
        statusEl.textContent = 'Could not load the site: ' + err.message;
        return;
    }

    let passed = 0, failed = 0, skipped = 0, warned = 0;
    const report = [];

    for (const t of SUITE) {
        const row = document.createElement('tr');
        let state, detail = '';
        try {
            await t.fn();
            state = 'pass';
            passed++;
        } catch (err) {
            if (err instanceof Skipped) {
                state = 'skip';
                skipped++;
            } else if (t.blocking === false) {
                state = 'warn';
                warned++;
            } else {
                state = 'fail';
                failed++;
            }
            detail = err.message;
        }
        report.push({ group: t.group, name: t.name, state, detail });
        row.className = state;
        row.innerHTML = `
            <td class="group">${t.group}</td>
            <td class="name">${t.name}</td>
            <td class="state">${state.toUpperCase()}</td>
            <td class="detail">${detail.replace(/</g, '&lt;')}</td>`;
        tbody.appendChild(row);
    }

    const tail = [
        warned ? `${warned} warning${warned > 1 ? 's' : ''}` : null,
        skipped ? `${skipped} skipped` : null
    ].filter(Boolean).join(', ');

    statusEl.className = 'status ' + (failed ? 'fail' : warned ? 'warn' : 'pass');
    statusEl.textContent = failed
        ? `${failed} failing, ${passed} passing${tail ? ', ' + tail : ''} — not ready to deploy`
        : `${passed} checks passed${tail ? ', ' + tail : ''} — safe to deploy`;

    document.title = `${failed ? failed + ' FAILING' : 'PASS'} — Portfolio tests`;
    // Exposed so the headless CI runner can read results.
    window.__TEST_RESULTS__ = { passed, failed, skipped, warned, report };
}

document.addEventListener('DOMContentLoaded', run);
