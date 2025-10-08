import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
    const sampleRecord = rawData[0];
    
    // Identificar columnas categóricas comunes
    const categoricalColumns = ['Provincia', 'Genero', 'RangoEdad', 'NivelEducacion', 'TipoEmpresa'];
    
    categoricalColumns.forEach(column => {
      const uniqueValues = [...new Set(rawData
        .map(record => record[column] || record[column.toLowerCase()])
        .filter(value => value && value !== '')
      )];
      
      if (uniqueValues.length > 0 && uniqueValues.length < 50) { // Limitar opciones
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
      
      // Actualizar solo los datos filtrados
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
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Cargando dashboard...</span>
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
              <Button onClick={loadAllData} variant="outline" size="sm">
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Dinámico - Análisis de Analfabetismo Digital
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análisis interactivo de datos de Ecuador
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>
      </div>

      {/* Controles de filtro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros Dinámicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            {Object.entries(filterOptions).map(([column, values]) => (
              <div key={column} className="flex items-center space-x-2">
                <label className="text-sm font-medium">{column}:</label>
                <Select onValueChange={(value) => handleFilter(column, value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={`Seleccionar ${column}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            
            {activeFilter && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {activeFilter.column}: {activeFilter.value}
                </Badge>
                <Button onClick={clearFilter} variant="ghost" size="sm">
                  Limpiar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data && [
          {
            title: 'Total Registros',
            value: data.rawData?.length || 0,
            icon: Users,
            color: 'text-blue-600'
          },
          {
            title: 'Provincias',
            value: data.provinceScores?.length || 0,
            icon: PieChart,
            color: 'text-green-600'
          },
          {
            title: 'Análisis Género/Edad',
            value: data.genderAgeScores?.length || 0,
            icon: TrendingUp,
            color: 'text-purple-600'
          },
          {
            title: 'Competencias Empresas',
            value: data.companyCompetence?.length || 0,
            icon: BarChart3,
            color: 'text-orange-600'
          }
        ].map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value.toLocaleString()}
                  </p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs de análisis */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="geographic">Geográfico</TabsTrigger>
          <TabsTrigger value="demographic">Demográfico</TabsTrigger>
          <TabsTrigger value="technology">Tecnología</TabsTrigger>
          <TabsTrigger value="competence">Competencias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen Estadístico</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.summary && (
                  <div className="space-y-2">
                    {Object.entries(data.summary).slice(0, 5).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-600">
                          {typeof value === 'object' ? JSON.stringify(value).slice(0, 50) + '...' : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datos en Tiempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Última actualización:</span>
                    <span className="text-gray-600">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado de API:</span>
                    <Badge variant="default">Conectado</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Filtro activo:</span>
                    <span className="text-gray-600">
                      {activeFilter ? `${activeFilter.column}: ${activeFilter.value}` : 'Ninguno'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis por Provincia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.provinceScores?.slice(0, 10).map((province, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="font-medium">{Object.values(province)[0]}</span>
                    <Badge variant="outline">{Object.values(province)[1]}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Demográfico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Por Género y Edad</h4>
                  <div className="space-y-2">
                    {data?.genderAgeScores?.slice(0, 5).map((item, index) => (
                      <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {JSON.stringify(item).slice(0, 100)}...
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Distribución de Edades</h4>
                  <div className="space-y-2">
                    {data?.ageDistribution?.slice(0, 5).map((item, index) => (
                      <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {JSON.stringify(item).slice(0, 100)}...
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uso de Tecnologías</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.technologyUsage?.slice(0, 8).map((tech, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <span>{Object.values(tech)[0]}</span>
                    <div className="flex space-x-2">
                      <Badge variant="default">{Object.values(tech)[1]}</Badge>
                      <Badge variant="secondary">{Object.values(tech)[2]}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competence" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competencias Empresariales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.companyCompetence?.slice(0, 6).map((comp, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="text-sm text-gray-600 mb-1">
                        Empresa {index + 1}
                      </div>
                      <div className="text-xs text-gray-500">
                        {JSON.stringify(comp).slice(0, 80)}...
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competencias por CIIU</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.competenceByCIIU && (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Registros:</strong> {data.competenceByCIIU.df?.length || 0}
                    </div>
                    <div className="text-sm">
                      <strong>Preguntas:</strong> {data.competenceByCIIU.preguntas_originales?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      {JSON.stringify(data.competenceByCIIU).slice(0, 200)}...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DynamicDashboard;