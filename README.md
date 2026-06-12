# WA Accessible Housing Poll — Results Dashboard

A static dashboard visualising June 2026 polling of n=762 Western Australians
on the WA Government adopting the liveable housing design standard from the
National Construction Code. Built for an audience of politicians, staffers and
journalists: headline findings up top, demographic breakdowns on demand.

## Structure

- `docs/index.html` — the dashboard (plain HTML/CSS/JS, no build step, no dependencies)
- `docs/data.js` — poll results extracted from the data tables
- `scripts/extract_data.py` — regenerates `docs/data.js` from the crosstab workbook:

  ```sh
  pip install openpyxl
  python3 scripts/extract_data.py path/to/data_tables.xlsx
  ```

## Viewing locally

Open `docs/index.html` directly in a browser, or serve it:

```sh
python3 -m http.server -d docs
```

## Deploying

Enable GitHub Pages for this repository (Settings → Pages), serving from the
`/docs` folder.

## Notes

- The dashboard covers the quantitative questions (SHWA23–26 and the
  disability-connection demographic) plus the qualitative open-enders:
  coded "why" themes with a stance toggle (SHWA23b), home-accessibility
  experience themes (SHWA_D1a), and curated verbatim quotes. Quote curation
  lives in `scripts/extract_data.py` (`WHY_QUOTES` / `HOME_QUOTES`), which
  pulls quote text from the workbook by source row and asserts every excerpt
  matches the verbatim response.
- Subgroups with n<50 are flagged in the UI and should be interpreted with caution.
