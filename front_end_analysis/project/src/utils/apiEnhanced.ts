import React from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Aumentado a 30 segundos para gráficos
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

// Configuración dinámica de endpoints disponibles
export const API_ENDPOINTS = {
  // Datos básicos
  data: '/data',
  summary: '/summary',
  filter: (column: string, value: string) => `/filter/${column}/${value}`,
  
  // Análisis de datos
  analysis: {
    provinceScores: '/analysis/provincia_puntuacion',
    genderAgeScores: '/analysis/genero_puntuacion_edad',
    companyCompetence: '/analysis/empresa_competencia',
    technologyUsage: '/analysis/tecnologias_si_no',
    innovationParticipation: '/analysis/participacion_innovacion_ciiu_genero',
    competenceByCIIU: '/analysis/dashboard_competencia_digital_ciiu',
    correlationData: '/analysis/correlacion_data',
    ageDistribution: '/analysis/edad_fundamentos_digitales',
    radarDeficiencies: '/analysis/radar_deficiencias_edad'
  },
  
  // Gráficos e imágenes
  graphics: {
    provinceScores: '/graphics/provincia_puntuacion',
    genderAgeScores: '/graphics/genero_puntuacion_edad',
    companyCompetence: '/graphics/empresa_competencia',
    technologyUsage: '/graphics/tecnologias_si_no',
    innovationParticipation: '/graphics/participacion_innovacion_ciiu_genero',
    competenceByCIIU: '/graphics/dashboard_competencia_digital_ciiu',
    correlationData: '/graphics/correlacion_data',
    ageDistribution: '/graphics/edad_fundamentos_digitales',
    radarDeficiencies: '/graphics/radar_deficiencias_edad'
  }
};

// Clase para manejar todas las peticiones de API
export class ApiService {
  private static instance: ApiService;
  
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Método genérico para peticiones GET
  async get<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `GET ${endpoint}`);
    }
  }

  // Método genérico para peticiones POST
  async post<T = any>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `POST ${endpoint}`);
    }
  }

  // Cargar todos los datos principales de una vez
  async loadAllDashboardData() {
    const endpoints = [
      { key: 'summary', endpoint: API_ENDPOINTS.summary },
      { key: 'rawData', endpoint: API_ENDPOINTS.data },
      { key: 'provinceScores', endpoint: API_ENDPOINTS.analysis.provinceScores },
      { key: 'genderAgeScores', endpoint: API_ENDPOINTS.analysis.genderAgeScores },
      { key: 'companyCompetence', endpoint: API_ENDPOINTS.analysis.companyCompetence },
      { key: 'technologyUsage', endpoint: API_ENDPOINTS.analysis.technologyUsage },
      { key: 'innovationParticipation', endpoint: API_ENDPOINTS.analysis.innovationParticipation },
      { key: 'competenceByCIIU', endpoint: API_ENDPOINTS.analysis.competenceByCIIU },
      { key: 'correlationData', endpoint: API_ENDPOINTS.analysis.correlationData },
      { key: 'ageDistribution', endpoint: API_ENDPOINTS.analysis.ageDistribution },
      { key: 'radarDeficiencies', endpoint: API_ENDPOINTS.analysis.radarDeficiencies }
    ];

    try {
      const results = await Promise.allSettled(
        endpoints.map(({ endpoint }) => this.get(endpoint))
      );

      const data: any = {};
      endpoints.forEach(({ key }, index) => {
        const result = results[index];
        if (result.status === 'fulfilled') {
          data[key] = result.value;
        } else {
          console.warn(`Failed to load ${key}:`, result.reason);
          data[key] = null;
        }
      });

      return data;
    } catch (error) {
      throw this.handleError(error, 'loadAllDashboardData');
    }
  }

  // Verificar estado de conexión con la API
  async checkConnection(): Promise<boolean> {
    try {
      await apiClient.get('/data', { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Obtener estadísticas de la API
  async getApiStats() {
    try {
      const [summary, dataCount] = await Promise.all([
        this.get(API_ENDPOINTS.summary),
        this.get(API_ENDPOINTS.data)
      ]);

      return {
        connected: true,
        dataCount: Array.isArray(dataCount) ? dataCount.length : 0,
        lastUpdate: new Date().toISOString(),
        summaryKeys: Object.keys(summary || {}).length
      };
    } catch (error) {
      return {
        connected: false,
        dataCount: 0,
        lastUpdate: null,
        summaryKeys: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private handleError(error: any, context: string): Error {
    const message = error.response?.data?.detail || error.message || 'Unknown error';
    console.error(`API Error in ${context}:`, message);
    return new Error(`${context}: ${message}`);
  }
}

// Instancia singleton del servicio
export const apiService = ApiService.getInstance();

// Funciones de conveniencia (mantener compatibilidad con código existente)
export const fetchSummary = () => apiService.get(API_ENDPOINTS.summary);
export const fetchData = () => apiService.get(API_ENDPOINTS.data);
export const fetchProvinceScores = () => apiService.get(API_ENDPOINTS.analysis.provinceScores);
export const fetchGenderAgeScores = () => apiService.get(API_ENDPOINTS.analysis.genderAgeScores);
export const fetchCompanyCompetence = () => apiService.get(API_ENDPOINTS.analysis.companyCompetence);
export const fetchTechnologyUsage = () => apiService.get(API_ENDPOINTS.analysis.technologyUsage);
export const fetchInnovationParticipation = () => apiService.get(API_ENDPOINTS.analysis.innovationParticipation);
export const fetchCompetenceByCIIU = () => apiService.get(API_ENDPOINTS.analysis.competenceByCIIU);
export const fetchCorrelationData = () => apiService.get(API_ENDPOINTS.analysis.correlationData);
export const fetchAgeDistribution = () => apiService.get(API_ENDPOINTS.analysis.ageDistribution);
export const fetchRadarDeficiencies = () => apiService.get(API_ENDPOINTS.analysis.radarDeficiencies);
export const fetchFilteredData = (column: string, value: string) => 
  apiService.get(API_ENDPOINTS.filter(column, value));

// Hook personalizado para manejar el estado de la API
export const useApiStatus = () => {
  const [status, setStatus] = React.useState({
    connected: false,
    loading: true,
    error: null as string | null
  });

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const connected = await apiService.checkConnection();
        setStatus({ connected, loading: false, error: null });
      } catch (error) {
        setStatus({ 
          connected: false, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Connection failed' 
        });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return status;
};

export default apiClient;