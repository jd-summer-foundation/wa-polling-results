# Talking points by initial support level

Does a respondent's **initial** stance on the liveable housing standard (SHWA23)
shape how they react to the three talking points (SHWA24/25/26)? Yes — strongly.

**Data:** respondent-level raw file, n=762, **unweighted** (toplines differ from
the weighted published data tables by ~1pt). Reproduce with:

```sh
python3 scripts/analyze_talking_points_by_support.py <raw_data.xlsx>
```

Outputs land in `analysis/`: `talking_points_by_support.csv` (tidy),
`talking_points_by_support.xlsx` (full crosstabs + net scores), and three figures.

## Net score (% more likely − % less likely)

| Initial support | SHWA24 occupant benefit | SHWA25 cost/supply | SHWA26 consistency |
|---|--:|--:|--:|
| Strongly support (n=389) | **+85** | +29 | +71 |
| Somewhat support (n=209) | +54 | −3 | +39 |
| Neither (n=68) | +37 | −34 | −3 |
| Somewhat oppose (n=40)\* | −20 | −38 | −18 |
| Strongly oppose (n=28)\* | −14 | −43 | −25 |
| Unsure (n=28)\* | +21 | −4 | +14 |

\* n<50, directional only.

## What stands out

1. **Initial stance conditions everything.** Net persuasion falls steadily from
   strong supporters to opponents for all three arguments — the gradient is the
   headline result, and it confirms the hypothesis.

2. **The occupant-benefit frame (SHWA24) travels furthest.** It is the only
   argument that stays clearly net-positive across supporters *and* the
   persuadable middle (Neither: +37), and it does the least damage among
   opponents. It is the safest message for a mixed audience.

3. **The cost/supply frame (SHWA25) is the opposition's most potent weapon.**
   It only nets positive among *strong* supporters; for soft supporters it is
   already flat (−3) and for everyone from "Neither" down it is sharply
   negative. The cost attack bites hardest on exactly the persuadable middle.

4. **National consistency (SHWA26) is a strong supporter-reinforcer** but fades
   to roughly neutral in the middle and turns opponents away — useful as a
   secondary proof point, not a frame for winning over sceptics.

5. **Reading the cells, not just the net.** Among strong supporters, SHWA24
   moves 85% "more likely" with only 14% "no difference" — they are not at a
   ceiling, they actively endorse. Among opponents the negative nets are mostly
   "less likely" responses — the arguments (especially cost) *entrench* them.

**Caveat:** these are stated shifts in likelihood, so some of the gradient
reflects respondents answering consistently with their initial stance rather
than genuine movement. Treat the oppose/unsure rows as directional (small n).
