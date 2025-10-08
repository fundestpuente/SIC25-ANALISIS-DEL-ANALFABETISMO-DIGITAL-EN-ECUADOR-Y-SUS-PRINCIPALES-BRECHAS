import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface GraphicsViewerProps {
  apiBaseUrl?: string;
}

const GraphicsViewer: React.FC<GraphicsViewerProps> = ({ 
  apiBaseUrl = 'http://localhost:8000' 
}) => {
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});

  // Configuración de gráficos disponibles en la API
  const graphicsConfig = [
    {
      key: 'provincia_puntuacion',
      title: 'Puntuación por Provincia',
      description: 'Análisis de competencias digitales por provincia',
      endpoint: '/graphics/provincia_puntuacion'
    },
    {
      key: 'genero_puntuacion_edad',
      title: 'Género, Puntuación y Edad',
      description: 'Distribución por género y grupos etarios',
      endpoint: '/graphics/genero_puntuacion_edad'
    },
    {
      key: 'empresa_competencia',
      title: 'Competencias Empresariales',
      description: 'Análisis de competencias por tipo de empresa',
      endpoint: '/graphics/empresa_competencia'
    },
    {
      key: 'tecnologias_si_no',
      title: 'Adopción de Tecnologías',
      description: 'Uso de tecnologías digitales (Sí/No)',
      endpoint: '/graphics/tecnologias_si_no'
    },
    {
      key: 'participacion_innovacion_ciiu_genero',
      title: 'Participación en Innovación',
      description: 'Análisis por CIIU y género en innovación',
      endpoint: '/graphics/participacion_innovacion_ciiu_genero'
    },
    {
      key: 'correlacion_data',
      title: 'Correlación de Competencias',
      description: 'Matriz de correlación entre competencias',
      endpoint: '/graphics/correlacion_data'
    },
    {
      key: 'edad_fundamentos_digitales',
      title: 'Edad y Fundamentos Digitales',
      description: 'BoxPlot de edad por respuesta a fundamentos',
      endpoint: '/graphics/edad_fundamentos_digitales'
    },
    {
      key: 'radar_deficiencias_edad',
      title: 'Radar de Deficiencias por Edad',
      description: 'Análisis radar de deficiencias por grupo etario',
      endpoint: '/graphics/radar_deficiencias_edad'
    }
  ];

  const handleImageLoad = (key: string) => {
    setLoading(prev => ({ ...prev, [key]: false }));
    setErrors(prev => ({ ...prev, [key]: false }));
  };

  const handleImageError = (key: string) => {
    setLoading(prev => ({ ...prev, [key]: false }));
    setErrors(prev => ({ ...prev, [key]: true }));
    toast.error(`Error al cargar el gráfico: ${key}`);
  };

  const handleImageLoadStart = (key: string) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: false }));
  };

  const downloadImage = async (endpoint: string, filename: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`);
      if (!response.ok) throw new Error('Error al descargar');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.png`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Gráfico descargado: ${filename}.png`);
    } catch (error) {
      toast.error('Error al descargar el gráfico');
    }
  };

  const refreshAllImages = () => {
    // Forzar recarga de todas las imágenes
    const timestamp = Date.now();
    const images = document.querySelectorAll('.dynamic-chart-image');
    images.forEach((img: any) => {
      const originalSrc = img.src.split('?')[0];
      img.src = `${originalSrc}?t=${timestamp}`;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Visualizaciones Dinámicas
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gráficos generados automáticamente desde la API
          </p>
        </div>
        
        <button
          onClick={refreshAllImages}
          className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <span className="mr-2">🔄</span>
          Actualizar Gráficos
        </button>
      </div>

      {/* Grid de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {graphicsConfig.map((graphic) => (
          <div 
            key={graphic.key}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header del gráfico */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {graphic.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {graphic.description}
                  </p>
                </div>
                
                <button
                  onClick={() => downloadImage(graphic.endpoint, graphic.key)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Descargar gráfico"
                >
                  ⬇
                </button>
              </div>
            </div>

            {/* Contenedor de la imagen */}
            <div className="relative bg-gray-50 dark:bg-gray-700 min-h-[300px] flex items-center justify-center">
              {loading[graphic.key] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 dark:text-gray-400">Cargando...</span>
                  </div>
                </div>
              )}

              {errors[graphic.key] ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-4xl mb-2">❌</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Error al cargar el gráfico
                  </p>
                  <button
                    onClick={() => {
                      const img = document.getElementById(`img-${graphic.key}`) as HTMLImageElement;
                      if (img) {
                        handleImageLoadStart(graphic.key);
                        img.src = `${apiBaseUrl}${graphic.endpoint}?t=${Date.now()}`;
                      }
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <img
                  id={`img-${graphic.key}`}
                  src={`${apiBaseUrl}${graphic.endpoint}`}
                  alt={graphic.title}
                  className="dynamic-chart-image max-w-full max-h-full object-contain"
                  onLoad={() => handleImageLoad(graphic.key)}
                  onError={() => handleImageError(graphic.key)}
                  onLoadStart={() => handleImageLoadStart(graphic.key)}
                  style={{ display: loading[graphic.key] ? 'none' : 'block' }}
                />
              )}
            </div>

            {/* Footer con información adicional */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>API: {graphic.endpoint}</span>
                <span>Actualizado: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 Información sobre los Gráficos
        </h3>
        <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <p>• Los gráficos se actualizan automáticamente cuando se inicia la API</p>
          <p>• Haz clic en "Actualizar Gráficos" para forzar una recarga</p>
          <p>• Usa el botón de descarga (⬇) para guardar cada gráfico individualmente</p>
          <p>• Los gráficos se generan en tiempo real basados en los datos actuales</p>
        </div>
      </div>
    </div>
  );
};

export default GraphicsViewer;