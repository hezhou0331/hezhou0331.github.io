# Jiangyu Liu Academic Homepage

This repository contains a minimal academic personal website for GitHub Pages.

## Edit Content

Most homepage content lives in `data/profile.json`:

- `profile`: name, role, university, location, avatar, email, and social links
- `aboutMe`: short biography paragraphs
- `researchInterests`: research topics shown under About Me
- `campusExperienceLines`: academic and campus activities
- `awards`: dated award entries and descriptions (certificate metadata is retained but not displayed)
- `sections`: Publications, Projects, and Experience, matched to page sections by `id`

The page uses a white academic layout with a sticky navigation bar, a profile sidebar,
and responsive content lists. Edit `index.html` when changing section order or headings.
Keep the short biography fallback and description in `index.html` in sync with the JSON.

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
