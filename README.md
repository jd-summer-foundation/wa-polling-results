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

- The dashboard currently covers the quantitative questions (SHWA23–26 and the
  disability-connection demographic). Qualitative open-ended responses
  (SHWA23b, SHWA_D1a) are not yet included.
- Subgroups with n<50 are flagged in the UI and should be interpreted with caution.
