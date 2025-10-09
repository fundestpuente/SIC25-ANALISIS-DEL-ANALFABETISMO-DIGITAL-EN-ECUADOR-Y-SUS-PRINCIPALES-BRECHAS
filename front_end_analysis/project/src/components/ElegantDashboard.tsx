import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3, Users, MapPin, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import SimpleApiStatus from './SimpleApiStatus';
import GraphicsViewer from './GraphicsViewer';
import DistributionChart from './charts/DistributionChart';
import InteractiveBarChart from './charts/InteractiveBarChart';
import DemographicAnalysis from './charts/DemographicAnalysis';
import GeographicAnalysis from './charts/GeographicAnalysis';
import ExecutiveSummary from './ExecutiveSummary';
import { 
  fetchData, 
  fetchSummary, 
  fetchProvinceScores,
  fetchGenderAgeScores,
  fetchGenderAgeDistribution,
  fetchCompanyCompetence,
  fetchTechnologyUsage,
  fetchInnovationParticipation,
  fetchCompetenceByCIIU,
  fetchCorrelationData,
  fetchAgeDistribution,
  fetchRadarDeficiencies,
  fetchGenderDistributionChart,
  fetchAgeDistributionChart,
  fetchDeepDemographicAnalysis,
  fetchDeepGeographicAnalysis
} from '../utils/api';

interface DashboardData {
  summary: any;
  rawData: any[];
  provinceScores: any[];
  genderAgeScores: any[];
  genderAgeDistribution: any;
  companyCompetence: any[];
  technologyUsage: any[];
  innovationParticipation: any;
  competenceByCIIU: any;
  correlationData: any;
  ageDistribution: any[];
  radarDeficiencies: any;
}

const ElegantDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('general');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Estado para datos de gráficos
  const [genderChartData, setGenderChartData] = useState<any>(null);
  const [ageChartData, setAgeChartData] = useState<any>(null);
  const [deepDemographicData, setDeepDemographicData] = useState<any>(null);
  const [deepGeographicData, setDeepGeographicData] = useState<any>(null);

  const navigationSections = [
    { id: 'general', label: 'Visión General', icon: BarChart3 },
    { id: 'demografico', label: 'Análisis Demográfico', icon: Users },
    { id: 'geografico', label: 'Distribución Geográfica', icon: MapPin },
    { id: 'visualizaciones', label: 'Gráficos Avanzados', icon: TrendingUp }
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando datos del dashboard...');
      
      // Cargar datos de forma individual para mejor debugging
      const summary = await fetchSummary().catch(err => {
        console.warn('⚠️ Error cargando summary:', err);
        return null;
      });

      const rawData = await fetchData().catch(err => {
        console.warn('⚠️ Error cargando rawData:', err);
        return [];
      });

      const provinceScores = await fetchProvinceScores().catch(err => {
        console.warn('⚠️ Error cargando provinceScores:', err);
        return [];
      });

      const genderAgeScores = await fetchGenderAgeScores().catch(err => {
        console.warn('⚠️ Error cargando genderAgeScores:', err);
        return [];
      });

      const genderAgeDistribution = await fetchGenderAgeDistribution().catch(err => {
        console.warn('⚠️ Error cargando genderAgeDistribution:', err);
        return null;
      });

      const companyCompetence = await fetchCompanyCompetence().catch(err => {
        console.warn('⚠️ Error cargando companyCompetence:', err);
        return [];
      });

      const technologyUsage = await fetchTechnologyUsage().catch(err => {
        console.warn('⚠️ Error cargando technologyUsage:', err);
        return [];
      });

      const otherData = await Promise.allSettled([
        fetchInnovationParticipation(),
        fetchCompetenceByCIIU(),
        fetchCorrelationData(),
        fetchAgeDistribution(),
        fetchRadarDeficiencies()
      ]);

      const [
        innovationParticipation,
        competenceByCIIU,
        correlationData,
        ageDistribution,
        radarDeficiencies
      ] = otherData.map(result => result.status === 'fulfilled' ? result.value : null);

      const dashboardData = {
        summary,
        rawData,
        provinceScores,
        genderAgeScores,
        genderAgeDistribution,
        companyCompetence,
        technologyUsage,
        innovationParticipation,
        competenceByCIIU,
        correlationData,
        ageDistribution,
        radarDeficiencies
      };

      console.log('✅ Datos cargados:', dashboardData);
      setData(dashboardData);
      
      // Cargar datos de gráficos por separado
      try {
        const genderData = await fetchGenderDistributionChart();
        setGenderChartData(genderData?.data || null);
        console.log('✅ Datos de género cargados:', genderData);
      } catch (err) {
        console.warn('⚠️ Error cargando datos de género:', err);
      }
      
      try {
        const ageData = await fetchAgeDistributionChart();
        setAgeChartData(ageData?.data || null);
        console.log('✅ Datos de edad cargados:', ageData);
      } catch (err) {
        console.warn('⚠️ Error cargando datos de edad:', err);
      }
      
      try {
        const deepDemographicData = await fetchDeepDemographicAnalysis();
        setDeepDemographicData(deepDemographicData);
        console.log('✅ Análisis demográfico profundo cargado:', deepDemographicData);
      } catch (err) {
        console.warn('⚠️ Error cargando análisis demográfico profundo:', err);
      }
      
      try {
        const deepGeographicData = await fetchDeepGeographicAnalysis();
        setDeepGeographicData(deepGeographicData);
        console.log('✅ Análisis geográfico profundo cargado:', deepGeographicData);
      } catch (err) {
        console.warn('⚠️ Error cargando análisis geográfico profundo:', err);
      }
      
      toast.success('Dashboard cargado correctamente');
      
    } catch (err) {
      console.error('❌ Error general:', err);
      setError('Error al conectar con la API. Verifique que el servidor esté funcionando.');
      toast.error('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, subtitle }: any) => (
    <div className="bg-white rounded-lg shadow-elegant p-6 hover:shadow-elevated transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-navy-primary mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="p-3 bg-gradient-to-br from-navy-primary to-navy-secondary rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderGeneralSection = () => {
    return (
      <div className="space-y-8">
        {/* Resumen Ejecutivo */}
        <ExecutiveSummary />
      </div>
    );
  };

  const renderDemograficoSection = () => {
    return (
      <div className="space-y-8">
        {/* Análisis Demográfico Profundo */}
        <DemographicAnalysis data={deepDemographicData} />
      </div>
    );
  };

  const renderGeograficoSection = () => {
    return (
      <div className="space-y-8">
        {/* Análisis Geográfico Profundo */}
        <GeographicAnalysis data={deepGeographicData} />
      </div>
    );
  };

  const renderVisualizacionesSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-elegant p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-navy-primary mb-6">Gráficos y Visualizaciones Avanzadas</h3>
        <GraphicsViewer />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSection();
      case 'demografico': return renderDemograficoSection();
      case 'geografico': return renderGeograficoSection();
      case 'visualizaciones': return renderVisualizacionesSection();
      default: return renderGeneralSection();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-elegant flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-navy-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-navy-primary">Cargando dashboard...</p>
          <p className="text-sm text-gray-600 mt-2">Conectando con la API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-elegant flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-4">Error de Conexión</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2 text-sm text-red-700 mb-6">
              <p>• Verifique que la API esté ejecutándose en http://localhost:8000</p>
              <p>• Revise la consola del navegador para más detalles</p>
              <p>• Asegúrese de que no haya problemas de CORS</p>
            </div>
            <button 
              onClick={loadAllData}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
            >
              Reintentar Conexión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-elegant font-roboto">
      {/* Header */}
      <header className="bg-white shadow-elegant border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              {sidebarOpen ? <X className="w-6 h-6 text-navy-primary" /> : <Menu className="w-6 h-6 text-navy-primary" />}
            </button>
            <h1 className="text-2xl font-bold text-navy-primary">
              Análisis del Analfabetismo Digital en Ecuador
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <SimpleApiStatus />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white shadow-elegant border-r border-gray-200`}>
          <nav className="p-6">
            <div className="space-y-2">
              {navigationSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 hover:bg-gray-100 ${
                      activeSection === section.id 
                        ? 'bg-navy-primary text-white shadow-md' 
                        : 'text-gray-700 hover:text-navy-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                      activeSection === section.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Indicador de estado de datos */}
          {data && !loading && (
            <div className="mb-6">
              {(!data.rawData || data.rawData.length === 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <p className="text-yellow-800 text-sm">
                      Algunos datos pueden no estar disponibles. Verifique la conexión con la API.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ElegantDashboard;