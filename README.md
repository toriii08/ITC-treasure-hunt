# Operation Langezijds — ITC PhD Day treasure hunt

A 30-minute chained geo-puzzle game for five crews of three, set in the real 1960 CORONA film-bucket recovery. This repository is the **website** that presents the game: story, flow, stages, materials, and a passcode-protected host area with the answers and runbook.

**Live site:** https://toriii08.github.io/ITC-treasure-hunt/
**Host area:** https://toriii08.github.io/ITC-treasure-hunt/host.html (ask the organisers for the passcode)

## What is in here

| Path | What it is |
|---|---|
| `index.html` | Public page: story, how it works, the five stages, timeline, rules, materials, sources |
| `host.html` + `assets/host.js` | Host area shell: asks for the passcode, decrypts the content in the browser |
| `assets/host.enc.json` | The host content (answers, bearings, cards, runbook), **encrypted** |
| `host_src/host_content.html` | Plaintext source of the host content. Git-ignored; regenerate it with the tool below |
| `assets/landsat/*.jpg` | The 19 Landsat letter frames (NASA "Your Name in Landsat"), web size |
| `assets/map.jpg` | University of Twente campus map preview, page-up = north |
| `assets/style.css`, `assets/site.js` | Styling and shared scripts (Vigenère table, gallery) |
| `tools/host_content.py` | Encrypt / decrypt the host content |

No build step, no framework: plain HTML, CSS and JavaScript served by GitHub Pages.

## Editing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to change the public page, the host content, the images and the puzzle data, how to preview locally, and how changes get published.

## The game in one paragraph

19 August 1960, 05:00. Satellite 9009's film bucket has come down on campus and broken into five cassettes, each with a 30-minute beacon. Each crew decodes its codeword from landforms shaped like letters (Stage 1), uses it as a Vigenère key to decrypt a direction-finding report naming three stations (Stage 2), plots three bearings on the campus map to find the building where its cassette landed (Stage 3), reports the building to Recovery Control for its strip of film (Stage 4), and all five crews splice the strips into the photograph (Stage 5).

## Credits and sources

- Letter images: NASA, [Your Name in Landsat](https://science.nasa.gov/mission/landsat/outreach/your-name-in-landsat/)
- Story: [Discoverer 14](https://en.wikipedia.org/wiki/Discoverer_14), the first mid-air recovery of a space capsule
- Design references are listed at the bottom of the public page
