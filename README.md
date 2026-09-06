# mdhelal-ahmmed.github.io

Source for my research website, live at <https://mdhelal-ahmmed.github.io>.

Static HTML, CSS and JavaScript. No build step, no framework, no dependencies. Edit a file, commit,
and the site rebuilds in about a minute.

```
index.html                      Home, About, Research, Publications, Gallery, Teaching, CV, Contact
notes.html                      Research notes
assets/css/style.css            All styling, driven by CSS custom properties at the top of the file
assets/js/main.js               Theme toggle, mobile nav, publication rendering, image lightbox
assets/data/publications.json   Publication list, rendered by main.js
assets/img/portrait.jpg         Profile photo (not added yet)
assets/img/gallery/             Figures and field photos (not added yet)
```

---

## Editing without a terminal

Open any file above, click the pencil icon, edit in the browser, then **Commit changes**. That is
the whole workflow. For images, use **Add file → Upload files** on the repository page.

To preview locally instead, download the repo and run a small server, because browsers block
`fetch` on files opened directly from disk and the publication list will come up empty:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

---

## Adding a publication

Edit `assets/data/publications.json` and add one object to the list. Only `type`, `year`, `authors`
and `title` are required.

```json
{
  "type": "journal",
  "year": "2026",
  "authors": "Ahmmed, M. H., Smith, J., & Doe, A.",
  "title": "Title of the paper",
  "venue": "Journal of Hydrology",
  "volume": "640",
  "pages": "131820",
  "doi": "10.1016/j.jhydrol.2026.131820",
  "url": "https://doi.org/10.1016/j.jhydrol.2026.131820",
  "pdf": "assets/pdf/ahmmed-2026.pdf",
  "data": "https://doi.org/10.5281/zenodo.0000000",
  "status": ""
}
```

`type` must be one of `journal`, `review`, `conference` or `report`, matching the filter buttons on the
page. Entries sort newest first automatically, and my name is bolded wherever it appears in the
`authors` string. A `status` value such as "Under review" or "Oral presentation" shows as a dashed
badge.

Mind the commas: JSON does not allow a trailing comma after the last entry. If the list stops
rendering, paste the file into <https://jsonlint.com> to find the error.

---

## Adding a gallery figure

Upload the image to `assets/img/gallery/`, then in `index.html` replace the placeholder tile:

```html
<button class="figure__media" type="button" aria-label="Enlarge: hysteresis loops">
  <div class="figure__ph"> ... </div>
</button>
```

with:

```html
<button class="figure__media" type="button" aria-label="Enlarge: hysteresis loops">
  <img src="assets/img/gallery/hysteresis.png" alt="Describe what the figure shows">
</button>
```

Then rewrite the `<figcaption>`. Clicking a figure opens the lightbox with its caption underneath.
Export figures around 1600 px wide and keep them under about 500 KB.

The profile photo goes at `assets/img/portrait.jpg`, ideally around 800 × 1000 px. While the file is
missing the image hides itself rather than showing a broken icon.

---

## Adding a note

Duplicate an `<li class="note">` block in `notes.html`, move it to the top of the list, and give it a
unique `id`. Newest first.

---

## Placeholders

Anything still needing real content is wrapped in `<span class="ph">` and renders with a dashed clay
underline. Search the HTML for `class="ph"` to find them all. Delete the span and keep the text once
it is real:

```html
<!-- before -->
<span class="ph" data-slot="institution">University</span>
<!-- after -->
University of North Dakota
```

---

## Changing the look

Everything visual lives in the `:root` block at the top of `assets/css/style.css`.

| Variable    | Controls                                     |
|-------------|----------------------------------------------|
| `--accent`  | Links, buttons, active nav (deep water blue) |
| `--clay`    | Section labels, eyebrows, highlights          |
| `--paper`   | Page background                               |
| `--ink`     | Body text                                     |
| `--measure` | Reading width of prose blocks                 |

Dark mode has its own block below it. Change a colour in both places and the whole site follows.
The theme toggle in the header remembers a visitor's choice; with nothing saved, the site follows
their operating system setting.

---

## Attaching a custom domain later

If you buy a domain, say `helalahmmed.com`, add these DNS records at the registrar:

| Type  | Name  | Value                     |
|-------|-------|---------------------------|
| A     | `@`   | `185.199.108.153`         |
| A     | `@`   | `185.199.109.153`         |
| A     | `@`   | `185.199.110.153`         |
| A     | `@`   | `185.199.111.153`         |
| CNAME | `www` | `mdhelal-ahmmed.github.io` |

Check <https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site> first,
in case those addresses have changed. Then go to **Settings → Pages → Custom domain**, enter the
domain, save, and tick **Enforce HTTPS** once the certificate is issued, which can take up to an
hour. The `mdhelal-ahmmed.github.io` address keeps working either way.

---

## Before sharing the address

- [ ] Replace every `class="ph"` placeholder with real content
- [ ] Add `assets/img/portrait.jpg`
- [ ] Fill in `assets/data/publications.json` and delete the two example entries
- [ ] Point both `data-slot="cv-pdf"` links at the real CV file
- [ ] Fill in the Google Scholar, ORCID, ResearchGate and LinkedIn links
- [ ] Delete the two instruction callouts in the Research and Field & Data sections
- [ ] Check it on a phone
# mdhelal-Ahmmed.github.io
Personal research website. Catchment hydrology and nutrient biogeochemistry in cold agricultural landscapes.
