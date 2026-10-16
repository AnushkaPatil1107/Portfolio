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
