# Pre-flight tests

Run these before every deploy. They load the real `index.html` in an iframe and
assert against the rendered DOM, so they catch what a visitor would actually hit
— not just what the source looks like.

No dependencies, no build step, no `npm install`.

## Running them

The suite uses `fetch()` to check that assets exist, so it needs a local server —
opening the file directly with `file://` will not work.

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/tests/tests.html>.

Green banner = safe to deploy. Red = fix it first.

> Keep the tab in the foreground while it runs. Browsers suspend
> `IntersectionObserver` and `requestAnimationFrame` in background tabs, and the
> scroll-reveal check needs them. It reports SKIP rather than FAIL if it detects
> the page isn't being painted.

## What it covers

| Group | Checks |
|---|---|
| **Data** | Required keys, well-formed email and URLs, skill levels in range, unique project titles, no leftover template values |
| **Render** | Every container in `index.html` gets filled, and counts match `data.js` |
| **Links** | No dead `#` links, `rel="noopener"` on every `target="_blank"`, all in-page anchors resolve |
| **Assets** | Profile photo, project images, favicon, social card, resume PDF, 404, robots, sitemap all return 200 |
| **SEO** | Title and meta description lengths, canonical, raster social image, JSON-LD parses and matches `data.js` |
| **A11y** | Contrast ≥ 4.5:1 in *both* themes, alt text, one `h1`, focus styles, skip link, no nested `<p>`, Escape closes the mobile menu |
| **Theme** | Toggle exists, no flash, light and dark define the same tokens, no empty variables, footer stays dark |
| **Responsive** | No horizontal overflow at 375 / 768 / 1280px, anchors clear the fixed navbar |
| **Behaviour** | Counter survives a rate-limited GitHub API, `.no-js` fallback, reveal contract, progress bars match their data |

## Adding a test

```js
test('Group', 'what it should do', () => {
    assert(condition, 'Message shown when it fails');
});
```

`doc`, `win` and `data` are the site's document, window and `portfolioData`.
Async tests work — just return a promise. Call `skip('reason')` for checks that
can't run in the current environment.

## Known failure

`resume PDF is present` fails until you add `resume/Aditya_Shah_DS_Resume.pdf`.
That is deliberate: the site degrades to a "Request Resume" mailto so nobody hits
a 404, but the test keeps reminding you the download is still missing.
