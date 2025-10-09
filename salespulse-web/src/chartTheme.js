// src/chartTheme.js
import { Chart as ChartJS } from 'chart.js/auto'

export function applyChartTheme() {
  // ensure ChartJS.defaults exists
  if (!ChartJS?.defaults) return

  ChartJS.defaults.color = '#cbd5e1' // slate-300
  ChartJS.defaults.borderColor = 'rgba(148,163,184,0.15)'
  ChartJS.defaults.font = ChartJS.defaults.font || {}
  ChartJS.defaults.font.family =
    "'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif"

  ChartJS.defaults.plugins = ChartJS.defaults.plugins || {}
  ChartJS.defaults.plugins.legend = ChartJS.defaults.plugins.legend || {}
  ChartJS.defaults.plugins.legend.labels =
    ChartJS.defaults.plugins.legend.labels || {}
  ChartJS.defaults.plugins.legend.labels.color = '#cbd5e1'

  ChartJS.defaults.scales = ChartJS.defaults.scales || {}
  if (ChartJS.defaults.scales.linear) {
    ChartJS.defaults.scales.linear.grid.color = 'rgba(148,163,184,0.12)'
  }
}
