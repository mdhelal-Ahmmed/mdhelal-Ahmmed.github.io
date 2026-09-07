# Images for the site

Upload photos and figures into this folder, then reference them from index.html.

Filenames the page currently expects:

| File | Used for |
|---|---|
| `field-1.jpg` | First field work photo |
| `field-2.jpg` | Second field work photo |
| `site-map.jpg` | Study area map |
| `melt-hydrograph.png` | Melt hydrograph with sample times |
| `cq-relationships.png` | Concentration-discharge plots |

The profile photo goes one level up, at `assets/img/portrait.jpg`, around 800 x 1000 px.

Export figures about 1600 px wide and keep each file under roughly 500 KB.

To swap a placeholder tile for a real image, find the matching `figure__ph` block in
`index.html` and replace the whole `<div class="figure__ph">...</div>` with:

    <img src="assets/img/gallery/field-1.jpg" alt="Describe what the photo shows">

Then rewrite the caption underneath it.
