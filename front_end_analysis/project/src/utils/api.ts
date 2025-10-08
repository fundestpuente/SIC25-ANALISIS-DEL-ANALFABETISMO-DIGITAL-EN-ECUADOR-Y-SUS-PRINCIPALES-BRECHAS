import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An error occurred';
    
    if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Error de red: No se puede conectar con la API. Verifica que esté corriendo en http://localhost:8000';
    } else if (error.message.includes('CORS')) {
      errorMessage = 'Error CORS: Reinicia la API usando RESTART_API.bat';
    } else if (error.response?.status === 404) {
      errorMessage = 'Endpoint no encontrado en la API';
    } else if (error.response?.status === 500) {
      errorMessage = 'Error interno del servidor';
    } else {
      errorMessage = error.response?.data?.detail || error.message || 'Error desconocido';
    }
    
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    toast.error(`API Error: ${errorMessage}`);
    throw error;
  }
);

export const fetchSummary = async () => {
  const response = await apiClient.get('/summary');
  return response.data;
};

export const fetchData = async () => {
  const response = await apiClient.get('/data');
  return response.data;
};

export const fetchProvinceScores = async () => {
  const response = await apiClient.get('/analysis/provincia_puntuacion');
  return response.data;
};

export const fetchGenderAgeScores = async () => {
  const response = await apiClient.get('/analysis/genero_puntuacion_edad');
  return response.data;
};

export const fetchCompanyCompetence = async () => {
  const response = await apiClient.get('/analysis/empresa_competencia');
  return response.data;
};

export const fetchTechnologyUsage = async () => {
  const response = await apiClient.get('/analysis/tecnologias_si_no');
  return response.data;
};

export const fetchInnovationParticipation = async () => {
  const response = await apiClient.get('/analysis/participacion_innovacion_ciiu_genero');
  return response.data;
};

export const fetchCompetenceByCIIU = async () => {
  const response = await apiClient.get('/analysis/dashboard_competencia_digital_ciiu');
  return response.data;
};

export const fetchCorrelationData = async () => {
  const response = await apiClient.get('/analysis/correlacion_data');
  return response.data;
};

export const fetchAgeDistribution = async () => {
  const response = await apiClient.get('/analysis/edad_fundamentos_digitales');
  return response.data;
};

export const fetchRadarDeficiencies = async () => {
  const response = await apiClient.get('/analysis/radar_deficiencias_edad');
  return response.data;
};

export const fetchFilteredData = async (column: string, value: string) => {
  const response = await apiClient.get(`/filter/${column}/${value}`);
  return response.data;
};

export default apiClient;
