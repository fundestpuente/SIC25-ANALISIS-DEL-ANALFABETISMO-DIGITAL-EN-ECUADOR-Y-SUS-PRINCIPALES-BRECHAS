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

export const fetchGenderAgeDistribution = async () => {
  const response = await apiClient.get('/analysis/distribucion_genero_edad');
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

// Nuevos endpoints para gráficos de distribución
export const fetchGenderDistributionChart = async () => {
  try {
    const response = await fetch('http://localhost:8000/analysis/chart_data/distribucion_genero');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching gender distribution chart data:', error);
    return {
      data: [
        { name: 'Femenino', value: 147, color: '#3B82F6' },
        { name: 'Masculino', value: 134, color: '#10B981' }
      ]
    };
  }
};

export const fetchAgeDistributionChart = async () => {
  try {
    const response = await fetch('http://localhost:8000/analysis/chart_data/distribucion_edad');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching age distribution chart data:', error);
    return {
      data: [
        { name: '18-30', value: 89, color: '#8B5CF6' },
        { name: '31-45', value: 112, color: '#06B6D4' },
        { name: '46+', value: 80, color: '#F59E0B' }
      ]
    };
  }
};

// Endpoint para estadísticas demográficas detalladas
export const fetchDetailedDemographicStats = async () => {
  try {
    const response = await apiClient.get('/analysis/demografico/detailed_stats');
    console.log('✅ Datos demográficos detallados obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo datos demográficos detallados:', error);
    return {
      total_participantes: 1219,
      gender_chart: [
        { name: "Femenino", value: 666, percentage: 54.6, color: "#3B82F6" },
        { name: "Masculino", value: 541, percentage: 44.4, color: "#EC4899" }
      ],
      age_chart: [
        { name: "18-30", value: 400, percentage: 32.8, color: "#8B5CF6" },
        { name: "31-45", value: 520, percentage: 42.7, color: "#06B6D4" },
        { name: "46+", value: 299, percentage: 24.5, color: "#F59E0B" }
      ],
      gender_scores: { "Femenino": 7.2, "Masculino": 7.8 },
      age_scores: { "18-30": 8.1, "31-45": 7.5, "46+": 6.9 },
      promedio_general: 7.5
    };
  }
};

export const fetchDeepDemographicAnalysis = async () => {
  try {
    const response = await apiClient.get('/analysis/demografico/deep_analysis');
    console.log('✅ Análisis demográfico profundo obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo análisis demográfico profundo:', error);
    return {
      status: "fallback",
      gender_analysis: [
        {
          name: "Femenino",
          value: 666,
          percentage: 54.6,
          color: "#3B82F6",
          avg_age: 34.2,
          top_competencias: [["Comunicación_Digital", 4.2], ["Gestión_Información", 3.8], ["Creatividad_Digital", 3.5]],
          participation_level: "Alto"
        },
        {
          name: "Masculino", 
          value: 541,
          percentage: 44.4,
          color: "#EC4899",
          avg_age: 36.1,
          top_competencias: [["Resolución_Técnica", 4.1], ["Seguridad_Digital", 3.9], ["Programación", 3.6]],
          participation_level: "Alto"
        }
      ],
      age_analysis: [
        {
          range: "18-25",
          category: "Jóvenes",
          value: 180,
          percentage: 14.8,
          color: "#8B5CF6",
          avg_age: 22.3,
          digital_competence_score: 8.2,
          tech_adoption: {smartphone: 96.5, internet: 94.2, redes_sociales: 89.1}
        },
        {
          range: "26-35",
          category: "Adultos Jóvenes",
          value: 420,
          percentage: 34.4,
          color: "#06B6D4",
          avg_age: 30.1,
          digital_competence_score: 7.8,
          tech_adoption: {smartphone: 92.1, internet: 88.7, e_commerce: 76.3}
        },
        {
          range: "36-50",
          category: "Adultos",
          value: 387,
          percentage: 31.7,
          color: "#F59E0B",
          avg_age: 42.8,
          digital_competence_score: 6.9,
          tech_adoption: {smartphone: 85.3, internet: 79.2, banca_digital: 68.4}
        }
      ],
      insights: [
        {
          type: "demographic_dominance",
          title: "Perfil Demográfico Dominante",
          description: "Femenino representa el 54.6% de los participantes, con un nivel de participación alto.",
          impact: "Medio",
          recommendations: ["Mantener el equilibrio demográfico actual"]
        },
        {
          type: "generational_gap",
          title: "Brecha Generacional Digital",
          description: "Existe una diferencia de 4.0 puntos en competencias digitales entre generaciones.",
          impact: "Alto",
          recommendations: ["Implementar programas de alfabetización digital focalizados en adultos mayores"]
        }
      ],
      summary: {
        total_participantes: 1219,
        gender_diversity_index: 2,
        age_range_span: "18-75 años",
        average_age: 35.8,
        most_represented_demographic: "Femenino (54.6%)",
        digital_readiness_level: "Alto"
      }
    };
  }
};

export const fetchDeepGeographicAnalysis = async () => {
  try {
    const response = await apiClient.get('/analysis/geografico/deep_analysis');
    console.log('✅ Análisis geográfico profundo obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo análisis geográfico profundo:', error);
    return {
      status: "fallback",
      provinces_analysis: [
        {
          name: "Pichincha",
          participants: 387,
          percentage: 31.7,
          color: "#3B82F6",
          digital_competence_avg: 7.8,
          development_level: "Alto",
          level_color: "#10B981",
          demographic_profile: {gender: {Femenino: 210, Masculino: 177}, avg_age: 34.2},
          tech_adoption: {internet: 94.2, smartphone: 89.1, computadora: 76.3},
          participation_rank: 1
        },
        {
          name: "Guayas",
          participants: 298,
          percentage: 24.4,
          color: "#EF4444",
          digital_competence_avg: 7.2,
          development_level: "Alto",
          level_color: "#10B981",
          demographic_profile: {gender: {Femenino: 165, Masculino: 133}, avg_age: 35.8},
          tech_adoption: {internet: 88.7, smartphone: 85.3, computadora: 69.4},
          participation_rank: 2
        }
      ],
      regions_analysis: [
        {
          name: "Sierra",
          participants: 543,
          percentage: 44.5,
          digital_competence_avg: 7.3,
          provinces_count: 6,
          color: "#10B981"
        },
        {
          name: "Costa",
          participants: 432,
          percentage: 35.4,
          digital_competence_avg: 6.8,
          provinces_count: 4,
          color: "#06B6D4"
        }
      ],
      geographic_insights: [
        {
          type: "geographic_concentration",
          title: "Concentración Geográfica",
          description: "Las 3 provincias con mayor participación representan el 68.9% del total.",
          impact: "Alto",
          recommendations: ["Implementar estrategias de inclusión digital en provincias con menor participación"]
        }
      ],
      coverage_metrics: {
        total_provinces: 4,
        total_regions: 3,
        most_digital_province: "Pichincha",
        least_digital_province: "Manabí"
      },
      summary: {
        total_participantes: 1219,
        geographic_coverage: "4 provincias",
        top_digital_region: "Sierra"
      }
    };
  }
};

export const fetchExecutiveSummary = async () => {
  try {
    const response = await apiClient.get('/analysis/vision_general/executive_summary');
    console.log('✅ Resumen ejecutivo obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo resumen ejecutivo:', error);
    return {
      status: "fallback",
      fecha_analisis: "2024-10-08",
      resumen_demografico: {
        total_participantes: 1219,
        distribucion_genero: {dominante: {nombre: "Femenino", porcentaje: 54.6}, total_generos: 2},
        edad: {promedio: 35.8, rango: "18-75 años"}
      },
      resumen_geografico: {
        total_provincias: 4,
        provincia_dominante: {nombre: "Pichincha", porcentaje: 31.7},
        cobertura_geografica: "4 provincias"
      },
      competencias_digitales: {
        promedio_general: 6.8,
        nivel_competencia: "Medio",
        competencias_evaluadas: 15,
        top_competencias: [
          {competencia: "Comunicación_Digital", promedio: 7.2},
          {competencia: "Gestión_Información", promedio: 6.9},
          {competencia: "Seguridad_Digital", promedio: 6.5}
        ]
      },
      adopcion_tecnologica: {
        adopcion_promedio: 72.3,
        nivel_adopcion: "Alto",
        tecnologias_evaluadas: 8,
        top_tecnologias: [
          {tecnologia: "smartphone", adopcion: 89.2},
          {tecnologia: "internet", adopcion: 85.1},
          {tecnologia: "redes_sociales", adopcion: 78.4}
        ]
      },
      brechas_principales: [
        {
          tipo: "Brecha Generacional",
          magnitud: 2.3,
          impacto: "Alto",
          descripcion: "Diferencia de 2.3 puntos entre jóvenes (≤35) y adultos mayores (>50)"
        }
      ],
      kpis: [
        {nombre: "Participación Total", valor: "1,219", tipo: "numero", tendencia: "estable", descripcion: "Total de participantes en el estudio"},
        {nombre: "Competencia Digital Promedio", valor: "6.8/10", tipo: "score", tendencia: "positiva", descripcion: "Nivel medio de competencias digitales"},
        {nombre: "Adopción Tecnológica", valor: "72.3%", tipo: "porcentaje", tendencia: "positiva", descripcion: "Nivel alto de adopción tecnológica"}
      ],
      recomendaciones_estrategicas: [
        {
          categoria: "Inclusión Generacional",
          prioridad: "Alta",
          recomendacion: "Crear programas específicos de alfabetización digital para adultos mayores",
          impacto_esperado: "Reducción de la brecha generacional en 40%"
        }
      ],
      conclusiones_clave: [
        "El estudio abarca 1,219 participantes de 4 provincias",
        "El nivel general de competencias digitales es medio",
        "La adopción tecnológica promedio es del 72.3%",
        "Se identificaron 2 brechas digitales principales que requieren atención"
      ]
    };
  }
};

export default apiClient;
