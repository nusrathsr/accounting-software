// Import Chart.js
import { Chart, Tooltip } from 'chart.js';
// Import Tailwind config
import { adjustColorOpacity, getCssVariable } from '../utils/Utils';

Chart.register(Tooltip);

// Define Chart.js default settings
Chart.defaults.font.family = '"Inter", sans-serif';
Chart.defaults.font.weight = 500;
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.plugins.tooltip.mode = 'nearest';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.caretSize = 0;
Chart.defaults.plugins.tooltip.caretPadding = 20;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 8;

// Function that generates a gradient for line charts
export const chartAreaGradient = (ctx, chartArea, colorStops) => {
  if (!ctx || !chartArea || !colorStops || colorStops.length === 0) {
    return 'transparent';
  }
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  colorStops.forEach(({ stop, color }) => {
    gradient.addColorStop(stop, color);
  });
  return gradient;
};

export const chartColors = {
  textColor: {
    light: getCssVariable('--color-gray-400') || '#9CA3AF', // fallback gray-400
    dark: getCssVariable('--color-gray-500') || '#6B7280', // fallback gray-500
  },
  gridColor: {
    light: getCssVariable('--color-gray-100') || '#F3F4F6', // fallback gray-100
    dark: adjustColorOpacity(getCssVariable('--color-gray-700') || '#374151', 0.6), // fallback gray-700
  },
  backdropColor: {
    light: getCssVariable('--color-white') || '#FFFFFF',
    dark: getCssVariable('--color-gray-800') || '#1F2937', // fallback gray-800
  },
  tooltipTitleColor: {
    light: getCssVariable('--color-gray-800') || '#1F2937',
    dark: getCssVariable('--color-gray-100') || '#F3F4F6',
  },
  tooltipBodyColor: {
    light: getCssVariable('--color-gray-500') || '#6B7280',
    dark: getCssVariable('--color-gray-400') || '#9CA3AF',
  },
  tooltipBgColor: {
    light: getCssVariable('--color-white') || '#FFFFFF',
    dark: getCssVariable('--color-gray-700') || '#374151',
  },
  tooltipBorderColor: {
    light: getCssVariable('--color-gray-200') || '#E5E7EB',
    dark: getCssVariable('--color-gray-600') || '#4B5563',
  },
};
