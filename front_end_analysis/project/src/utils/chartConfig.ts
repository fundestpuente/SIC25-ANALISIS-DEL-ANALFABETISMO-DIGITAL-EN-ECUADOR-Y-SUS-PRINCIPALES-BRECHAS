import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
} from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  MatrixController,
  MatrixElement
);

export const chartColors = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  pink: '#EC4899',
  purple: '#A855F7',
  indigo: '#6366F1',
  teal: '#14B8A6',
};

export const colorPalette = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.success,
  chartColors.warning,
  chartColors.danger,
  chartColors.info,
  chartColors.pink,
  chartColors.purple,
  chartColors.indigo,
  chartColors.teal,
];

export const getChartOptions = (title: string, isDark: boolean) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: isDark ? '#E5E7EB' : '#374151',
      },
    },
    title: {
      display: true,
      text: title,
      color: isDark ? '#F9FAFB' : '#111827',
      font: {
        size: 16,
        weight: 'bold' as const,
      },
    },
    tooltip: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      titleColor: isDark ? '#F9FAFB' : '#111827',
      bodyColor: isDark ? '#E5E7EB' : '#374151',
      borderColor: isDark ? '#374151' : '#E5E7EB',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        color: isDark ? '#E5E7EB' : '#374151',
      },
      grid: {
        color: isDark ? '#374151' : '#E5E7EB',
      },
    },
    y: {
      ticks: {
        color: isDark ? '#E5E7EB' : '#374151',
      },
      grid: {
        color: isDark ? '#374151' : '#E5E7EB',
      },
    },
  },
});
