# Jiangyu Liu Academic Homepage

This repository contains a minimal academic personal website for GitHub Pages.

## Edit Content

Most homepage content lives in `data/profile.json`:

- `profile`: name, role, university, location, avatar, email, and social links
- `aboutMe`: short biography paragraphs
- `researchInterests`: tags shown under About Me
- `awards`: selected awards shown as cards
- `sections`: placeholder sections such as Publications, Projects, and Experience

The avatar is served from `static/profile.jpg`. Replace that file to update the photo.

## Local Preview

Open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

There is no build step.

## Deploy to GitHub Pages

Push changes to the `main` branch of `hezhou0331.github.io`. The included GitHub Actions workflow builds the Hugo site and deploys it to:

```text
https://hezhou0331.github.io/
```

In GitHub repository settings, make sure Pages is configured to deploy from **GitHub Actions**.

## Tech Choice

This site uses plain HTML, CSS, and JavaScript. It keeps deployment simple for `hezhou0331.github.io` while preserving easy JSON-based content editing.
