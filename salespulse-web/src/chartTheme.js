// src/chartTheme.js
import { Chart } from "chart.js/auto";

// Call this once (you already do in main.jsx)
export function applyChartTheme() {
  // Typography + base color
  Chart.defaults.font.family = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = "#000000"; // <-- all text black by default

  // Legend + tooltip
  Chart.defaults.plugins.legend.labels.color = "#000000";
  Chart.defaults.plugins.tooltip.titleColor = "#000000";
  Chart.defaults.plugins.tooltip.bodyColor = "#000000";
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(255,255,255,0.95)";
  Chart.defaults.plugins.tooltip.borderColor = "rgba(0,0,0,0.15)";
  Chart.defaults.plugins.tooltip.borderWidth = 1;

  // Scales (ticks + grid)
  const tickColor = "#000000";
  const gridColor = "rgba(0,0,0,0.08)";
  const borderColor = "rgba(0,0,0,0.12)";

  ["category", "linear", "time"].forEach((scale) => {
    if (!Chart.defaults.scales[scale]) Chart.defaults.scales[scale] = {};
    Chart.defaults.scales[scale].ticks = { color: tickColor };
    Chart.defaults.scales[scale].grid = { color: gridColor };
    Chart.defaults.scales[scale].border = { color: borderColor };
  });
}
