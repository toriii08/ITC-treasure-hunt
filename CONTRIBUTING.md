# Contributing

This repository holds the website for **Operation Langezijds**, the ITC PhD Day treasure hunt. The site is plain HTML, CSS and JavaScript on GitHub Pages. Anything pushed to the `main` branch is live within about a minute. There is nothing to install for ordinary text edits.

## 1. Get write access

Ask the repository owner to add you as a collaborator (GitHub → repository → **Settings → Collaborators**). You will get an email invitation to accept.

## 2. Two ways to edit

### A. In the browser (small text changes)

1. Open the file on GitHub (for example `index.html`), click the pencil icon.
2. Make the change, then **Commit changes**. Commit directly to `main` for typos; for anything bigger choose *"Create a new branch and start a pull request"* so someone else can look at it first.
3. Wait about a minute and reload the live site.

### B. On your computer (anything bigger, or to preview first)

```bash
git clone https://github.com/toriii08/ITC-treasure-hunt.git
cd ITC-treasure-hunt
python3 -m http.server 8000        # then open http://localhost:8000
```

Preview in the browser, edit, refresh. When you are happy:

```bash
git checkout -b my-change          # optional but recommended
git add -A
git commit -m "Describe what you changed"
git push -u origin my-change       # then open a pull request on GitHub
```

Opening the HTML file directly from disk (`file://`) does **not** work for the host page, because the browser blocks it from loading the encrypted file. Always use the local server above.

## 3. What lives where

| You want to change… | Edit this |
|---|---|
| Story text, stage descriptions, timeline, rules, sources | `index.html` (plain HTML, sections are marked with `<section id="…">`) |
| Colours, fonts, layout | `assets/style.css` |
| Answers, bearings, hints, Ground Truth key, crew cards, runbook | the **host content**, see section 4 |
| A Landsat letter image | replace `assets/landsat/<LETTER>.jpg` (keep the file name; about 480 px wide, portrait) |
| The campus map | replace `assets/map.jpg` (keep 1797 × 1270 px, or update `W`/`H` in `assets/host.js` and the coordinates in `compute_v5.py` (host area, section H7)) |
| Which buildings are targets / stations, or the codeword phrases | `compute_v5.py`, found in the host area (section H7) and never committed; see section 5 |

Keep the public page spoiler-free: no keys, station numbers, bearings or target buildings there. Everything that gives away an answer belongs in the host content.

## 4. Editing the host content (passcode-protected part)

The repository is public, so the host content is stored encrypted in `assets/host.enc.json` and decrypted in the browser with the organisers' passcode. The plaintext source `host_src/host_content.html` is git-ignored and must never be committed.

One-time setup:

```bash
pip install cryptography
```

Workflow:

```bash
# 1. Recreate the plaintext source from the encrypted file (asks for the passcode)
python3 tools/host_content.py decrypt

# 2. Edit host_src/host_content.html
#    It is an HTML fragment: <section> blocks plus a <script type="application/json" id="hostdata">
#    block holding the per-crew data (keys, ciphers, stations, bearings, targets) and the
#    building pixel coordinates used to draw the bearing lines on the map.

# 3. Preview: python3 -m http.server 8000, open /host.html, enter the passcode.
#    (host.html reads the ENCRYPTED file, so re-run step 4 before previewing a change.)

# 4. Re-encrypt and commit the result
python3 tools/host_content.py encrypt
git add assets/host.enc.json
git commit -m "Update host content"
git push
```

You can set the passcode in the environment instead of typing it: `HOST_PASSCODE=... python3 tools/host_content.py encrypt`.

To change the passcode: decrypt with the old one, encrypt with the new one, commit, and tell the other organisers. The passcode is never stored in the repository.

## 5. Changing the puzzle itself

The generator script `compute_v5.py` holds the building pixel coordinates (`B`), the target and DF stations per crew (`TEAMS`) and the codeword phrases (`KEYS`), so it is **not in the repository**: copy it from the host area (section H7) into `host_src/compute_v5.py`, which is git-ignored. Run it with `python3 host_src/compute_v5.py`; it prints, for each crew, the ciphertext, the three bearings, the smallest crossing angle (keep it above 30°) and the distance to the nearest other building circle (keep it above about 100 px so a ±2° protractor error cannot land on a neighbour). Copy the new values into the host content (both the answer table and the `hostdata` JSON) and into the example cipher on the public page if you change Crew 01.

Any change to bearings must be checked once with a real protractor on the printed A3 map before the event.

## 6. Publishing

GitHub Pages serves the `main` branch from the repository root. Nothing else to do: a push to `main` is a deployment. If the site ever stops updating, check **Settings → Pages** on GitHub (source should be "Deploy from a branch", branch `main`, folder `/ (root)`), and the **Actions** tab for a failed "pages build and deployment" run.

## 7. House rules

- Keep answers out of `index.html`, commit messages and issue titles. The repository is public.
- Do not commit `host_src/`. It holds the plaintext host content and `compute_v5.py`, both of which contain every answer.
- Do not resize or rename the Landsat images; the gallery and the host cards reference them by letter.
- NASA images are public domain; keep the credit line on the public page.
