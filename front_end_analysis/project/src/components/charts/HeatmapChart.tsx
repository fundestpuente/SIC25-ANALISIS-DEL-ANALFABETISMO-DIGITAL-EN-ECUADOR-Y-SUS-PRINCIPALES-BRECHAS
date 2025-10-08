import { Chart } from 'react-chartjs-2';

interface HeatmapChartProps {
  data: any;
  isDark: boolean;
}

const HeatmapChart = ({ data, isDark }: HeatmapChartProps) => {
  if (!data) return null;

  const labels = Object.keys(data);
  const matrixData: any[] = [];

  labels.forEach((xLabel, x) => {
    labels.forEach((yLabel, y) => {
      matrixData.push({
        x: xLabel,
        y: yLabel,
        v: data[xLabel][yLabel] || 0,
      });
    });
  });

  const chartData = {
    datasets: [
      {
        label: 'Correlación',
        data: matrixData,
        backgroundColor: (context: any) => {
          const value = context.raw.v;
          const alpha = Math.abs(value);
          return value >= 0
            ? `rgba(59, 130, 246, ${alpha})`
            : `rgba(239, 68, 68, ${alpha})`;
        },
        borderWidth: 1,
        borderColor: isDark ? '#374151' : '#E5E7EB',
        width: ({ chart }: any) => (chart.chartArea || {}).width / labels.length - 1,
        height: ({ chart }: any) => (chart.chartArea || {}).height / labels.length - 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: () => '',
          label: (context: any) => {
            const v = context.raw;
            return `${v.x} - ${v.y}: ${v.v.toFixed(2)}`;
          },
        },
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        titleColor: isDark ? '#F9FAFB' : '#111827',
        bodyColor: isDark ? '#E5E7EB' : '#374151',
        borderColor: isDark ? '#374151' : '#E5E7EB',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        labels: labels,
        ticks: {
          color: isDark ? '#E5E7EB' : '#374151',
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: 'category' as const,
        labels: labels,
        offset: true,
        ticks: {
          color: isDark ? '#E5E7EB' : '#374151',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return <Chart type="matrix" data={chartData} options={options} />;
};

export default HeatmapChart;
