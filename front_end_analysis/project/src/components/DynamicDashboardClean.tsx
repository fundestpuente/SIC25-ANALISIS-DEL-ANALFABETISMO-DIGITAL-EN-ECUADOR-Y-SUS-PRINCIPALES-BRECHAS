import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApiStatusChecker from './ApiStatusChecker';
import { 
  fetchData, 
  fetchSummary, 
  fetchProvinceScores,
  fetchGenderAgeScores,
  fetchCompanyCompetence,
  fetchTechnologyUsage,
  fetchInnovationParticipation,
  fetchCompetenceByCIIU,
  fetchCorrelationData,
  fetchAgeDistribution,
  fetchRadarDeficiencies,
  fetchFilteredData
} from '../utils/api';

interface DashboardData {
  summary: any;
  rawData: any[];
  provinceScores: any[];
  genderAgeScores: any[];
  companyCompetence: any[];
  technologyUsage: any[];
  innovationParticipation: any;
  competenceByCIIU: any;
  correlationData: any;
  ageDistribution: any[];
  radarDeficiencies: any;
}

interface FilterState {
  column: string;
  value: string;
}

const DynamicDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterState | null>(null);
  const [filterOptions, setFilterOptions] = useState<{[key: string]: string[]}>({});
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar datos principales
      const [
        summaryData,
        rawData,
        provinceScores,
        genderAgeScores,
        companyCompetence,
        technologyUsage,
        innovationParticipation,
        competenceByCIIU,
        correlationData,
        ageDistribution,
        radarDeficiencies
      ] = await Promise.all([
        fetchSummary(),
        fetchData(),
        fetchProvinceScores(),
        fetchGenderAgeScores(),
        fetchCompanyCompetence(),
        fetchTechnologyUsage(),
        fetchInnovationParticipation(),
        fetchCompetenceByCIIU(),
        fetchCorrelationData(),
        fetchAgeDistribution(),
        fetchRadarDeficiencies()
      ]);

      setData({
        summary: summaryData,
        rawData,
        provinceScores,
        genderAgeScores,
        companyCompetence,
        technologyUsage,
        innovationParticipation,
        competenceByCIIU,
        correlationData,
        ageDistribution,
        radarDeficiencies
      });

      // Generar opciones de filtro dinámicamente
      generateFilterOptions(rawData);
      
      toast.success('Datos cargados exitosamente');
    } catch (err) {
      setError('Error al cargar los datos');
      toast.error('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateFilterOptions = (rawData: any[]) => {
    if (!rawData || rawData.length === 0) return;

    const options: {[key: string]: string[]} = {};
    
    // Identificar columnas categóricas comunes
    const categoricalColumns = ['Provincia', 'Genero', 'RangoEdad', 'NivelEducacion', 'TipoEmpresa'];
    
    categoricalColumns.forEach(column => {
      const uniqueValues = [...new Set(rawData
        .map(record => record[column] || record[column.toLowerCase()])
        .filter(value => value && value !== '')
      )];
      
      if (uniqueValues.length > 0 && uniqueValues.length < 50) {
        options[column] = uniqueValues.sort();
      }
    });

    setFilterOptions(options);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const handleFilter = async (column: string, value: string) => {
    try {
      setActiveFilter({ column, value });
      const filteredData = await fetchFilteredData(column, value);
      
      setData(prev => prev ? { ...prev, rawData: filteredData } : null);
      
      toast.success(`Filtro aplicado: ${column} = ${value}`);
    } catch (err) {
      toast.error('Error al aplicar filtro');
    }
  };

  const clearFilter = () => {
    setActiveFilter(null);
    loadAllData();
  };

  const handleDownload = () => {
    if (!data) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `dashboard_data_${timestamp}.json`;
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Datos descargados: ${filename}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-4">
              <button 
                onClick={loadAllData} 
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Dinámico - Análisis de Analfabetismo Digital
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análisis interactivo de datos de Ecuador
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <div className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}>
              ⟲
            </div>
            Actualizar
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <span className="mr-2">⬇</span>
            Descargar
          </button>
        </div>
      </div>

      {/* Estado de la API */}
      <ApiStatusChecker />

      {/* Controles de filtro */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">🔍</span>
            Filtros Dinámicos
          </h3>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {Object.entries(filterOptions).map(([column, values]) => (
              <div key={column} className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {column}:
                </label>
                <select
                  onChange={(e) => e.target.value && handleFilter(column, e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue=""
                >
                  <option value="">Seleccionar {column}</option>
                  {values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            
            {activeFilter && (
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {activeFilter.column}: {activeFilter.value}
                </span>
                <button 
                  onClick={clearFilter}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  ✕ Limpiar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data && [
          {
            title: 'Total Registros',
            value: data.rawData?.length || 0,
            icon: '👥',
            color: 'text-blue-600'
          },
          {
            title: 'Provincias',
            value: data.provinceScores?.length || 0,
            icon: '🗺',
            color: 'text-green-600'
          },
          {
            title: 'Análisis Género/Edad',
            value: data.genderAgeScores?.length || 0,
            icon: '📊',
            color: 'text-purple-600'
          },
          {
            title: 'Competencias Empresas',
            value: data.companyCompetence?.length || 0,
            icon: '🏢',
            color: 'text-orange-600'
          }
        ].map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value.toLocaleString()}
                </p>
              </div>
              <span className={`text-2xl ${metric.color}`}>{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs de análisis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap">
            {[
              { id: 'overview', name: 'Resumen', icon: '📋' },
              { id: 'geographic', name: 'Geográfico', icon: '🗺' },
              { id: 'demographic', name: 'Demográfico', icon: '👥' },
              { id: 'technology', name: 'Tecnología', icon: '💻' },
              { id: 'competence', name: 'Competencias', icon: '🎯' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Resumen Estadístico
                  </h3>
                  {data?.summary && (
                    <div className="space-y-2">
                      {Object.entries(data.summary).slice(0, 5).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{key}:</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {typeof value === 'object' ? JSON.stringify(value).slice(0, 50) + '...' : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Estado del Sistema
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Última actualización:</span>
                      <span className="text-gray-600 dark:text-gray-400">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Estado de API:</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Conectado
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Filtro activo:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {activeFilter ? `${activeFilter.column}: ${activeFilter.value}` : 'Ninguno'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'geographic' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Análisis por Provincia
              </h3>
              <div className="space-y-3">
                {data?.provinceScores?.slice(0, 10).map((province, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {String(Object.values(province)[0] || 'N/A')}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {String(Object.values(province)[1] || '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'demographic' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Análisis Demográfico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Por Género y Edad</h4>
                  <div className="space-y-2">
                    {data?.genderAgeScores?.slice(0, 5).map((item, index) => (
                      <div key={index} className="text-sm p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        {JSON.stringify(item).slice(0, 100)}...
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Distribución de Edades</h4>
                  <div className="space-y-2">
                    {data?.ageDistribution?.slice(0, 5).map((item, index) => (
                      <div key={index} className="text-sm p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        {JSON.stringify(item).slice(0, 100)}...
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technology' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Uso de Tecnologías
              </h3>
              <div className="space-y-3">
                {data?.technologyUsage?.slice(0, 8).map((tech, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-600 rounded">
                    <span className="text-gray-900 dark:text-white">
                      {String(Object.values(tech)[0] || 'N/A')}
                    </span>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {String(Object.values(tech)[1] || '0')}
                      </span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {String(Object.values(tech)[2] || '0')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'competence' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Competencias Empresariales
                  </h3>
                  <div className="space-y-3">
                    {data?.companyCompetence?.slice(0, 6).map((comp, index) => (
                      <div key={index} className="p-3 border border-gray-200 dark:border-gray-600 rounded">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Empresa {index + 1}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {JSON.stringify(comp).slice(0, 80)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Competencias por CIIU
                  </h3>
                  {data?.competenceByCIIU && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Registros:</strong> {data.competenceByCIIU.df?.length || 0}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Preguntas:</strong> {data.competenceByCIIU.preguntas_originales?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 p-2 bg-white dark:bg-gray-800 rounded border">
                        {JSON.stringify(data.competenceByCIIU).slice(0, 200)}...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicDashboard;