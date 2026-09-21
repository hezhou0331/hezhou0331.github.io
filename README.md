# Jiangyu Liu Academic Homepage

This repository contains a minimal academic personal website for GitHub Pages.

## Edit Content

Homepage content lives in `data/profile.en.json` (English) and `data/profile.json` (Chinese).
Keep factual updates, dates, grades, and entry order consistent across both files.
First-time visitors see English. The EN / 中文 controls switch all page content and
remember the selection locally. `?lang=en` and `?lang=zh` override the saved choice
and can be used to share a particular language version. Navigation labels and page
metadata are translated in `static/js/profile.js`.

- `profile`: name, role, university, location, avatar, email, and social links
- `aboutMe`: short biography paragraphs
- `researchInterests`: research topics shown under About Me
- `campusExperienceLines`: academic and campus activities
- `awards`: dated award entries and descriptions (certificate metadata is retained but not displayed)
- `sections`: Publications, Projects, and Experience, matched to page sections by `id`

The page uses a white academic layout with a sticky navigation bar, a profile sidebar,
and responsive content lists. Edit `index.html` when changing section order or headings.
Keep the English biography fallback and description in `index.html` in sync with the English JSON.

The avatar is served from `static/profile.jpg`. Replace that file to update the photo.

## Local Preview

Serve the folder with any static server (opening the file directly will block JSON loading):

```bash
npx serve .
```

There is no build step.

## Deploy to GitHub Pages

Push changes to the `main` branch of `hezhou0331.github.io`. The included GitHub Actions workflow publishes the static site to:

```text
https://hezhou0331.github.io/
```

In GitHub repository settings, make sure Pages is configured to deploy from **GitHub Actions**.

## Tech Choice

This site uses plain HTML, CSS, and JavaScript. It keeps deployment simple for `hezhou0331.github.io` while preserving easy JSON-based content editing.
