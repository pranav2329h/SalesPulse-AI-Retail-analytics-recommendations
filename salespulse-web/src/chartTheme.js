import { defaults } from "chart.js/auto";

export function applyChartTheme() {
  const d = defaults;
  if (!d) return;

  d.color = "#cbd5e1";
  d.borderColor = "rgba(148,163,184,0.15)";
  d.font = d.font || {};
  d.font.family =
    "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  d.plugins = d.plugins || {};
  d.plugins.legend = d.plugins.legend || {};
  d.plugins.legend.labels = d.plugins.legend.labels || {};
  d.plugins.legend.labels.color = "#cbd5e1";
  d.scales = d.scales || {};
  if (d.scales.linear) {
    d.scales.linear.grid = d.scales.linear.grid || {};
    d.scales.linear.grid.color = "rgba(148,163,184,0.12)";
  }
}
