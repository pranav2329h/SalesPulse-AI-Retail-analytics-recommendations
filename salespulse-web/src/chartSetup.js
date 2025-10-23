// src/chartSetup.js
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
  Tooltip, Legend, TimeScale
} from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
  Tooltip, Legend, TimeScale
)

/** ✅ Global styling: all chart text white */
ChartJS.defaults.color = '#ffffff'                   // default font color (ticks, titles, etc.)
ChartJS.defaults.font.family = 'Inter, system-ui, -apple-system, Segoe UI, Roboto'
ChartJS.defaults.font.size = 12

// axes grid + ticks
ChartJS.defaults.scale.grid.color = 'rgba(255,255,255,0.15)'
ChartJS.defaults.scale.ticks.color = '#ffffff'

// legends
ChartJS.defaults.plugins.legend.labels.color = '#ffffff'

// titles (if you ever enable plugin titles)
ChartJS.defaults.plugins.title = ChartJS.defaults.plugins.title || {}
ChartJS.defaults.plugins.title.color = '#ffffff'

// tooltips: dark bg + white text for readability
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(5, 5, 10, 0.9)'
ChartJS.defaults.plugins.tooltip.titleColor = '#ffffff'
ChartJS.defaults.plugins.tooltip.bodyColor = '#ffffff'
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.2)'
ChartJS.defaults.plugins.tooltip.borderWidth = 1

// (Optional) smooth animation
ChartJS.defaults.animation = {
  duration: 600,
  easing: 'easeOutQuart'
}
