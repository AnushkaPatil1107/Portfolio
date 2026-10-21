# PLAYER.ONE — Cyberpunk RPG Portfolio

A responsive portfolio frontend built with **HTML, CSS, and vanilla JavaScript**. No frameworks, build tools, or backend are required.

## Run locally

1. Extract the project folder.
2. Open `index.html` in a browser.
3. For the best local-development experience, use VS Code with the Live Server extension.

The Google Fonts used for the display/body typefaces load over the internet. The layout and functionality still work if those fonts are unavailable.

## Included interactions

- Skippable animated boot screen
- Responsive desktop/mobile navigation
- Animated full-screen section transitions
- Home, Profile, Skills, Projects, Achievements, Gallery, and Contact panels
- Clickable skill-tree inspector
- Project category filters and detail modal
- Gallery category filters and preview modal
- Safe allow-listed terminal commands (`help`, `home`, `profile`, `skills`, `projects`, `achievements`, `gallery`, `contact`, `clear`, `exit`)
- Contact form validation and `mailto:` handoff (not a server-side form)
- Copy email feedback
- Optional synthesized interface sound toggle
- Reduced-motion support and keyboard Escape handling

## Important: personalize before publishing

Search for placeholder text such as `YOUR NAME HERE`, `your.email@example.com`, `your-username`, and `SAMPLE`.

1. Update the profile, education, interests, and career objective in `index.html`.
2. Update `skillData` in `script.js` with your actual skills and descriptions.
3. The Missions panel is populated with the 13 repository URLs supplied for this portfolio. Each repository card opens its matching GitHub URL in a new tab. Update descriptions or technology labels if you want to add more detail.
4. Achievement cards are presented as academic/coursework archive items; replace or supplement them only with verified achievements.
5. Replace gallery placeholder panels with your own photos or project screenshots.
6. Change the `recipient` email in `script.js` and the contact details in `index.html`.
8. Replace generic GitHub/LinkedIn URLs with your real profiles.

The skill tree's labels and example technologies are illustrative. Do not claim a proficiency level or achievement unless it is accurate.

## Suggested project structure

```text
player-one-portfolio/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    └── (add your photos, certificates, project screenshots, and resume here)
```

## Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload the project files, keeping `index.html` at the repository root.
3. Open the repository's **Settings → Pages**.
4. Select deployment from the `main` branch and `/ (root)`.
5. Save, wait for the deployment, then test the published URL on desktop and mobile.

## Viva talking points

- Semantic HTML separates the portfolio into accessible sections.
- CSS variables centralize the neon palette and responsive design.
- CSS Grid and Flexbox adapt the interface across screen sizes.
- JavaScript event listeners control navigation, filters, modals, the skill inspector, and terminal.
- `prefers-reduced-motion` respects users who prefer less animation.
- The terminal uses an explicit command map; it does not execute arbitrary input.
- The contact form uses `mailto:` and therefore does not send data to a server.


### Arcade-style sector transitions
Navigation between sections uses a game-inspired sector deployment effect with a clipped screen reveal, brief glitch movement, scanline flash, and reduced-motion accessibility support.


## Visitor analytics and public session counter (Vercel)

- **Private dashboard:** this site includes the Vercel Web Analytics script for page views and aggregated visitor locations (country and, where available, region/city). After deploying, open the Vercel project → **Analytics** and enable Web Analytics. Data starts after it is enabled and the updated site is deployed. See https://vercel.com/docs/analytics/using-web-analytics.
- **Public counter:** the footer shows aggregate portfolio sessions. The `/api/visits` Vercel Function increments the counter once per browser session and reads the total from Upstash Redis. Raw IP addresses are never returned to the public counter.
- **Private owner log:** `/api/visits` stores the timestamp, request IP, and Vercel-provided approximate country/region/city headers for each counted browser session. `/api/visitor-log` returns up to 200 recent entries only when the caller supplies the owner secret in an Authorization header. The log is capped at 500 entries in Redis. The `visitor-log.html` page prompts for the secret and does not save it in browser storage. The page itself is not secret; access control is enforced by the API.
- **Analytics dashboard:** enable Vercel Web Analytics in the Vercel project to see page views and aggregated locations. It is separate from the raw-IP log.

### Configure analytics and the private log before deploying

1. Create an Upstash Redis database at https://console.upstash.com/ (or use an existing one).
2. In the database REST API section, copy the REST URL and REST token.
3. In Vercel, open your project → **Settings → Environment Variables** and add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for Production (and Preview if desired). Never put the token in frontend JavaScript or commit it to GitHub.
4. Add `VISITOR_LOG_SECRET` as another Vercel environment variable. Generate a long, random secret (at least 32 random bytes), keep it private, and do not commit it to GitHub. This secret protects the owner-only log endpoint.
5. Redeploy the project. The footer counter will show the aggregate count once the Redis variables are configured; without them it displays “LIVE AFTER SETUP”.
6. After deployment, open `https://YOUR-DOMAIN/visitor-log.html`, enter the `VISITOR_LOG_SECRET`, and load the log. Use HTTPS and do not share the secret or the log page while authenticated.
7. Enable Vercel Web Analytics under the project’s **Analytics** tab for page views and aggregated locations.

The public counter is an aggregate and can be inflated by repeated visits or automated traffic; it is not a unique-person count. IP addresses and approximate location are personal data in many jurisdictions. Before publishing, make sure the collection is lawful for your use, disclose it in a privacy notice, limit access, and delete records when no longer needed. The log stores only the 500 most recent session records; it is not a complete person-level visitor history.
