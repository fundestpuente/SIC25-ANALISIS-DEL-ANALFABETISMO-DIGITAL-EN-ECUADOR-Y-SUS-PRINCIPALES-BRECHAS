import { useEffect, useState, useMemo } from 'react';
import { Users, TrendingUp, MapPin, PieChart as PieChartIcon } from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import StatsCard from './StatsCard';
import ChartCard from './ChartCard';
import { fetchSummary, fetchData, fetchProvinceScores } from '../utils/api';
import { SummaryData, DataPoint, ProvinceScore } from '../types';
import { colorPalette, getChartOptions } from '../utils/chartConfig';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { isDark } = useTheme();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [provinceScores, setProvinceScores] = useState<ProvinceScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, rawData, provinceData] = await Promise.all([
        fetchSummary(),
        fetchData(),
        fetchProvinceScores(),
      ]);
      setSummary(summaryData);
      setData(rawData);
      setProvinceScores(provinceData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const topProvince = useMemo(() => {
    if (provinceScores.length === 0) return null;
    return provinceScores.reduce((max, curr) =>
      curr.puntuacion_promedio > max.puntuacion_promedio ? curr : max
    );
  }, [provinceScores]);

  const genderDistribution = useMemo(() => {
    const genderCounts: { [key: string]: number } = {};
    data.forEach((item) => {
      const gender = item.Genero || item.genero || 'Unknown';
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });
    return genderCounts;
  }, [data]);

  const ageRangeDistribution = useMemo(() => {
    const ageCounts: { [key: string]: number } = {};
    data.forEach((item) => {
      const ageRange = item.RangoEdad || item.rango_edad;
      if (ageRange) {
        ageCounts[ageRange] = (ageCounts[ageRange] || 0) + 1;
      } else if (item.Edad || item.edad) {
        const age = item.Edad || item.edad;
        let range = '50+';
        if (age < 20) range = '18-19';
        else if (age < 30) range = '20-29';
        else if (age < 40) range = '30-39';
        else if (age < 50) range = '40-49';
        ageCounts[range] = (ageCounts[range] || 0) + 1;
      }
    });
    return ageCounts;
  }, [data]);

  const genderChartData = {
    labels: Object.keys(genderDistribution),
    datasets: [
      {
        data: Object.values(genderDistribution),
        backgroundColor: colorPalette,
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  const ageChartData = {
    labels: Object.keys(ageRangeDistribution),
    datasets: [
      {
        label: 'Respondentes',
        data: Object.values(ageRangeDistribution),
        backgroundColor: colorPalette[0],
        borderRadius: 8,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Respondentes"
          value={summary?.count || 0}
          icon={Users}
          color="bg-blue-500"
        />
        <StatsCard
          title="Puntuación Promedio"
          value={summary?.mean ? summary.mean.toFixed(2) : '0'}
          icon={TrendingUp}
          color="bg-green-500"
          subtitle={`Min: ${summary?.min || 0} | Max: ${summary?.max || 0}`}
        />
        <StatsCard
          title="Provincia Destacada"
          value={topProvince?.provincia || 'N/A'}
          icon={MapPin}
          color="bg-purple-500"
          subtitle={`Puntuación: ${topProvince?.puntuacion_promedio ? topProvince.puntuacion_promedio.toFixed(2) : '0'}`}
        />
        <StatsCard
          title="Distribución de Género"
          value={Object.keys(genderDistribution).length}
          icon={PieChartIcon}
          color="bg-orange-500"
          subtitle="Categorías"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Distribución por Género"
          description="Este gráfico muestra la distribución de respondentes según su género, permitiendo identificar la representación de cada grupo en el estudio."
        >
          <Pie
            data={genderChartData}
            options={{
              ...getChartOptions('Distribución por Género', isDark),
              maintainAspectRatio: false,
            }}
          />
        </ChartCard>

        <ChartCard
          title="Distribución por Rango de Edad"
          description="Visualización de la distribución de respondentes por rangos de edad, útil para entender qué grupos etarios están más representados en el estudio."
        >
          <Bar
            data={ageChartData}
            options={{
              ...getChartOptions('Distribución por Rango de Edad', isDark),
              maintainAspectRatio: false,
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
