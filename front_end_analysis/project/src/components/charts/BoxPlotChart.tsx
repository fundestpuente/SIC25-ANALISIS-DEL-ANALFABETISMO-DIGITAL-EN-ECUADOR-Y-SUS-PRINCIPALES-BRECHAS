import { Bar } from 'react-chartjs-2';

interface BoxPlotChartProps {
  data: any[];
  isDark: boolean;
}

const BoxPlotChart = ({ data, isDark }: BoxPlotChartProps) => {
  if (!data || data.length === 0) return null;

  const calculateStats = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    return { min, q1, median, q3, max };
  };

  const chartData = {
    labels: data.map((d) => d.fundamento),
    datasets: [
      {
        label: 'Min',
        data: data.map((d) => calculateStats(d.ages).min),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Q1',
        data: data.map((d) => calculateStats(d.ages).q1),
        backgroundColor: 'rgba(59, 130, 246, 0.4)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Median',
        data: data.map((d) => calculateStats(d.ages).median),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Q3',
        data: data.map((d) => calculateStats(d.ages).q3),
        backgroundColor: 'rgba(59, 130, 246, 0.4)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Max',
        data: data.map((d) => calculateStats(d.ages).max),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#E5E7EB' : '#374151',
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
  };

  return <Bar data={chartData} options={options} />;
};

export default BoxPlotChart;
