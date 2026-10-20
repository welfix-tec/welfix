# Welfix website

Static site for GitHub Pages (welfix-tec.github.io/welfix). No build step: upload these files as they are.

## Pages
- index.html: Home, with the interactive "where does your business slow down?" section and the project logo carousel
- platforms.html: Fleet Guard, MyRequest, Cura Menu, Gym QR Login, Riza Space (with live previews), plus Eagle View, Washly, Veloce, Nuvio, Dili-Zone
- services.html: Services, pricing table, FAQ
- about.html: Story, principles, founder
- contact.html: Three-step project brief (sends to your Formspree form mvgwgepj)
- "our services.html", "About us.html", "contact us.html": redirects, so old links still work

## How to publish
1. In the welfix-tec/welfix repository, delete the old index.html, "our services.html", "About us.html", "contact us.html".
2. Upload everything in this folder (including the assets folder) to the root of the repository.
3. Commit. GitHub Pages updates in about a minute.

## Things to add yourself (no code changes needed)
- Project logos: drop them in assets/img/logos/ using the file names in the README.txt there.
- Founder photo: save it as assets/img/gylain.jpg.
- Prices are in services.html (pricing table) and assets/js/main.js (quick answers).
