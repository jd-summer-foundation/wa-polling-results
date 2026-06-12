/* WA Accessible Housing Poll dashboard */
(function () {
  const D = window.POLL_DATA;

  const SCALES = {
    support: [
      { key: "Strongly support", color: "var(--support-strong)", dark: true },
      { key: "Somewhat support", color: "var(--support)", dark: true },
      { key: "Neither support nor oppose", color: "var(--neutral)", dark: false },
      { key: "Unsure", color: "var(--unsure)", dark: false },
      { key: "Somewhat oppose", color: "var(--oppose)", dark: true },
      { key: "Strongly oppose", color: "var(--oppose-strong)", dark: true },
    ],
    likelihood: [
      { key: "Much more likely", color: "var(--support-strong)", dark: true },
      { key: "Somewhat more likely", color: "var(--support)", dark: true },
      { key: "No difference", color: "var(--neutral)", dark: false },
      { key: "Unsure", color: "var(--unsure)", dark: false },
      { key: "Somewhat less likely", color: "var(--oppose)", dark: true },
      { key: "Much less likely", color: "var(--oppose-strong)", dark: true },
    ],
  };

  const QUESTIONS = {
    SHWA23: { scale: "support", short: "Support for adopting the standard" },
    SHWA24: { scale: "likelihood", short: "After hearing the case for (ageing in place)" },
    SHWA25: { scale: "likelihood", short: "After hearing the case against (construction costs)" },
    SHWA26: { scale: "likelihood", short: "After hearing other states have adopted it" },
  };

  const SEGMENTS = [
    { id: "age", label: "Age" },
    { id: "gender", label: "Gender" },
    { id: "location", label: "Metro / regional" },
    { id: "disability", label: "Disability connection" },
  ];

  const fmt = (v) => Math.round(v) + "%";

  function questionText(qid) {
    // Strip the question code prefix, keep the wording.
    return D[qid].question.replace(/^SHWA\w+\.\s*/, "");
  }

  function makeBar(values, scale, slim) {
    const bar = document.createElement("div");
    bar.className = "bar" + (slim ? " slim" : "");
    for (const step of scale) {
      const v = values[step.key];
      if (v == null || v <= 0) continue;
      const seg = document.createElement("div");
      seg.className = "bar-seg" + (step.dark ? "" : " light-text");
      seg.style.width = v + "%";
      seg.style.background = step.color;
      seg.title = step.key + ": " + v.toFixed(1) + "%";
      if (v >= 6) seg.textContent = fmt(v);
      bar.appendChild(seg);
    }
    return bar;
  }

  function makeBarRow(group, scale, opts) {
    const row = document.createElement("div");
    row.className = "bar-row";
    if (!opts || !opts.noLabel) {
      const label = document.createElement("div");
      label.className = "bar-label";
      const caveat = group.n < 50 ? "†" : "";
      label.innerHTML =
        "<span>" + group.label + caveat + "</span><span class='n'>n=" + group.n + "</span>";
      row.appendChild(label);
    }
    row.appendChild(makeBar(group.values, scale, opts && opts.slim));
    return row;
  }

  function makeLegend(scale) {
    const legend = document.createElement("div");
    legend.className = "legend";
    for (const step of scale) {
      const item = document.createElement("div");
      item.className = "legend-item";
      const sw = document.createElement("span");
      sw.className = "legend-swatch";
      sw.style.background = step.color;
      item.appendChild(sw);
      item.appendChild(document.createTextNode(step.key));
      legend.appendChild(item);
    }
    return legend;
  }

  /* ---------- Hero ---------- */
  const overall23 = D.SHWA23.segments.overall[0].values;
  document.getElementById("hero-net").textContent = fmt(overall23["NET: Support"]);
  document.getElementById("hero-strong").textContent = fmt(overall23["Strongly support"]);
  document.getElementById("hero-oppose").textContent = fmt(overall23["NET: Oppose"]);

  const chipFacts = [];
  for (const seg of ["age", "gender", "location", "disability"]) {
    for (const g of D.SHWA23.segments[seg]) {
      if (g.n >= 50) chipFacts.push(g);
    }
  }
  const chips = document.getElementById("hero-chips");
  const highlight = [
    ["Women", "gender"], ["55+", "age"], ["Regional", "location"],
    ["Personal connection to disability", "disability"],
  ];
  for (const [label] of highlight) {
    const g = chipFacts.find((x) => x.label === label);
    if (!g) continue;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = label + ": <strong>" + fmt(g.values["NET: Support"]) + " support</strong>";
    chips.appendChild(chip);
  }

  /* ---------- Overall chart ---------- */
  const overallChart = document.getElementById("overall-chart");
  overallChart.appendChild(makeBarRow(D.SHWA23.segments.overall[0], SCALES.support, { noLabel: true }));
  overallChart.appendChild(makeLegend(SCALES.support));
  document.getElementById("overall-finding").innerHTML =
    "Support is the majority position in every demographic group measured. It is strongest among " +
    "people living with a disability (<strong>" +
    fmt(D.SHWA23.segments.disability[1].values["NET: Support"]) +
    "</strong> support) and women (<strong>" +
    fmt(D.SHWA23.segments.gender[1].values["NET: Support"]) +
    "</strong>), but even the lowest-supporting groups remain above 70% support.";

  /* ---------- Message cards ---------- */
  const CARDS = [
    {
      qid: "SHWA24", tag: "The case for", tagClass: "for",
      argument:
        "Supporters argue the standard would help more Western Australians stay living safely in their own homes as they age, rather than needing costly modifications or having to move when their mobility and support needs change.",
      takeaway: (v) =>
        "The ageing-in-place argument is highly persuasive: <strong>" +
        fmt(v["NET: More likely to support"]) +
        "</strong> say it makes them more likely to support the standard, against just " +
        fmt(v["NET: Less likely to support"]) + " less likely.",
    },
    {
      qid: "SHWA25", tag: "The case against", tagClass: "against",
      argument:
        "Opponents say the standard could increase construction costs, reduce housing supply, and make new homes less affordable.",
      takeaway: (v) =>
        "The cost argument largely fails to move people: <strong>" +
        fmt(v["No difference"]) +
        "</strong> say it makes no difference, and those who become <em>more</em> likely to support (" +
        fmt(v["NET: More likely to support"]) + ") outnumber those who become less likely (" +
        fmt(v["NET: Less likely to support"]) + ").",
    },
    {
      qid: "SHWA26", tag: "National consistency", tagClass: "consistency",
      argument:
        "All states except NSW and WA have adopted the standard, and a Treasury interim report identified national consistency as important for reducing complexity, compliance risk and costs.",
      takeaway: (v) =>
        "WA being a holdout matters to voters: <strong>" +
        fmt(v["NET: More likely to support"]) +
        "</strong> are more likely to support adoption knowing most other states already have, with only " +
        fmt(v["NET: Less likely to support"]) + " less likely.",
    },
  ];

  const cardsEl = document.getElementById("message-cards");
  for (const card of CARDS) {
    const v = D[card.qid].segments.overall[0].values;
    const el = document.createElement("div");
    el.className = "message-card";

    el.innerHTML =
      "<span class='tag " + card.tagClass + "'>" + card.tag + "</span>" +
      "<p class='argument'>" + card.argument + "</p>" +
      "<div class='net-pair'>" +
      "<div class='net-stat more'><div class='net-num'>" + fmt(v["NET: More likely to support"]) +
      "</div><div class='net-cap'>more likely to support</div></div>" +
      "<div class='net-stat nodiff'><div class='net-num'>" + fmt(v["No difference"]) +
      "</div><div class='net-cap'>no difference</div></div>" +
      "<div class='net-stat less'><div class='net-num'>" + fmt(v["NET: Less likely to support"]) +
      "</div><div class='net-cap'>less likely to support</div></div>" +
      "</div>";

    el.appendChild(makeBar(v, SCALES.likelihood, true));
    const takeaway = document.createElement("p");
    takeaway.className = "takeaway";
    takeaway.innerHTML = card.takeaway(v);
    el.appendChild(takeaway);
    cardsEl.appendChild(el);
  }

  /* ---------- Explorer ---------- */
  const qSelect = document.getElementById("q-select");
  for (const [qid, meta] of Object.entries(QUESTIONS)) {
    const opt = document.createElement("option");
    opt.value = qid;
    opt.textContent = meta.short;
    qSelect.appendChild(opt);
  }

  const segButtons = document.getElementById("seg-buttons");
  let currentSeg = "age";
  for (const seg of SEGMENTS) {
    const btn = document.createElement("button");
    btn.textContent = seg.label;
    btn.dataset.seg = seg.id;
    if (seg.id === currentSeg) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentSeg = seg.id;
      segButtons.querySelectorAll("button").forEach((b) =>
        b.classList.toggle("active", b.dataset.seg === currentSeg));
      renderExplore();
    });
    segButtons.appendChild(btn);
  }
  qSelect.addEventListener("change", renderExplore);

  function renderExplore() {
    const qid = qSelect.value;
    const scale = SCALES[QUESTIONS[qid].scale];
    const chart = document.getElementById("explore-chart");
    const legend = document.getElementById("explore-legend");
    chart.innerHTML = "";
    legend.innerHTML = "";

    document.getElementById("explore-question").textContent = "“" + questionText(qid) + "”";

    const groups = [D[qid].segments.overall[0], ...D[qid].segments[currentSeg]];
    let hasCaveat = false;
    for (const g of groups) {
      if (g.n < 50) hasCaveat = true;
      chart.appendChild(makeBarRow(g, scale));
    }
    legend.appendChild(makeLegend(scale));
    document.getElementById("caveat-note").hidden = !hasCaveat;
  }

  renderExplore();
})();
