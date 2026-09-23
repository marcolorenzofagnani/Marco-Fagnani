/**
 * Facsimile radar (stile report app) per le pagine esempio-report-*.
 * Nessuna dipendenza Recharts: SVG statico leggero.
 */
export function mountSampleRadars(root = document) {
  root.querySelectorAll("[data-radar]").forEach((el) => {
    if (el.dataset.radarMounted) return;
    let payload;
    try {
      payload = JSON.parse(el.getAttribute("data-radar") || "{}");
    } catch {
      return;
    }
    const labels = payload.labels || [];
    const values = payload.values || [];
    const benchmark = payload.benchmark || [];
    if (labels.length < 3 || values.length !== labels.length) return;

    el.dataset.radarMounted = "1";
    el.innerHTML = buildRadarSvg({
      labels,
      values,
      benchmark:
        benchmark.length === labels.length ? benchmark : labels.map(() => 70),
    });
  });
}

function buildRadarSvg({ labels, values, benchmark }) {
  const n = labels.length;
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  /** Raggio più contenuto + canvas più ampio: le label laterali (es. Strength) restano leggibili. */
  const maxR = 108;
  const levels = [0.25, 0.5, 0.75, 1];

  const point = (i, score01) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const r = maxR * Math.max(0, Math.min(1, score01));
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const poly = (scores) =>
    scores
      .map((v, i) => point(i, Number(v) / 100).map((x) => x.toFixed(1)).join(","))
      .join(" ");

  const grid = levels
    .map((lv) => {
      const pts = Array.from({ length: n }, (_, i) => point(i, lv));
      return `<polygon points="${pts
        .map((p) => p.map((x) => x.toFixed(1)).join(","))
        .join(" ")}" fill="none" stroke="rgba(30,74,85,0.12)" stroke-width="1"/>`;
    })
    .join("");

  const axes = Array.from({ length: n }, (_, i) => {
    const [x, y] = point(i, 1);
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(
      1,
    )}" stroke="rgba(30,74,85,0.14)" stroke-width="1"/>`;
  }).join("");

  const labelNodes = labels
    .map((label, i) => {
      const [edgeX, edgeY] = point(i, 1);
      const dx = edgeX - cx;
      const dy = edgeY - cy;
      const len = Math.hypot(dx, dy) || 1;
      const pad = 18;
      const x = edgeX + (dx / len) * pad;
      const y = edgeY + (dy / len) * pad;
      const anchor = Math.abs(dx) < 14 ? "middle" : dx > 0 ? "start" : "end";
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(
        1,
      )}" text-anchor="${anchor}" dominant-baseline="middle" class="sample-radar__label">${escapeXml(
        label,
      )}</text>`;
    })
    .join("");

  return `
<svg class="sample-radar__svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Grafico a ragno delle aree valutate">
  <g>${grid}${axes}</g>
  <polygon points="${poly(benchmark)}" fill="none" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="4 4"/>
  <polygon points="${poly(values)}" fill="rgba(42,138,146,0.14)" stroke="#1e4a55" stroke-width="2.2"/>
  ${values
    .map((v, i) => {
      const [x, y] = point(i, Number(v) / 100);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(
        1,
      )}" r="3.2" fill="#1e4a55"/>`;
    })
    .join("")}
  ${labelNodes}
</svg>
<div class="sample-radar__legend" aria-hidden="true">
  <span><i class="sample-radar__swatch sample-radar__swatch--now"></i> Attuale</span>
  <span><i class="sample-radar__swatch sample-radar__swatch--bench"></i> Benchmark</span>
</div>`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
