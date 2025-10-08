import { useEffect, useState } from 'react';
import ChartCard from './ChartCard';

// Definir las claves posibles para las gráficas
type ChartKey =
  | 'boxplot_edad'
  | 'correlacion'
  | 'grafico_edad'
  | 'grafico_empresa'
  | 'grafico_participacion'
  | 'grafico_provincia'
  | 'grafico_tecnologias'
  | 'radar_deficiencias';

// Usar Record para definir el tipo de imagesLoaded
type ImagesLoaded = Record<ChartKey, boolean>;

// Interfaz para la configuración de las gráficas
interface ChartConfig {
  key: ChartKey;
  src: string;
  alt: string;
}

const ChartsAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [imagesLoaded, setImagesLoaded] = useState<ImagesLoaded>({
    boxplot_edad: false,
    correlacion: false,
    grafico_edad: false,
    grafico_empresa: false,
    grafico_participacion: false,
    grafico_provincia: false,
    grafico_tecnologias: false,
    radar_deficiencias: false,
  });

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Configuración de las gráficas
  const chartsConfig: ChartConfig[] = [
    {
      key: 'boxplot_edad',
      src: '/graphics/boxplot_edad_por_respuesta.png',
      alt: 'Boxplot de Edad por Respuesta',
    },
    {
      key: 'correlacion',
      src: '/graphics/correlacion_competencias.png',
      alt: 'Correlación entre Competencias',
    },
    {
      key: 'grafico_edad',
      src: '/graphics/grafico_edad.png',
      alt: 'Distribución de Edad',
    },
    {
      key: 'grafico_empresa',
      src: '/graphics/grafico_empresa.png',
      alt: 'Competencia por Tipo de Empresa',
    },
    {
      key: 'grafico_participacion',
      src: '/graphics/grafico_participacion_innovacion_ciiu_genero.png',
      alt: 'Participación en Innovación por Sector y Género',
    },
    {
      key: 'grafico_provincia',
      src: '/graphics/grafico_provincia.png',
      alt: 'Puntuación por Provincia',
    },
    {
      key: 'grafico_tecnologias',
      src: '/graphics/grafico_tecnologias_si_no.png',
      alt: 'Uso de Tecnologías Digitales',
    },
    {
      key: 'radar_deficiencias',
      src: '/graphics/radar_deficiencias_edad.png',
      alt: 'Deficiencias en Habilidades por Edad',
    },
  ];

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const imagePromises = chartsConfig.map(({ key, src }) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setImagesLoaded((prev) => ({ ...prev, [key]: true }));
              resolve();
            };
            img.onerror = () => {
              console.warn(`Failed to load image: ${src}`);
              setImagesLoaded((prev) => ({ ...prev, [key]: false }));
              resolve();
            };
          })
        );
        await Promise.all(imagePromises);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Manejar navegación con teclas
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (event.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : chartsConfig.length - 1));
      } else if (event.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < chartsConfig.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, chartsConfig.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartsConfig.map(({ key, src, alt }, index) => (
          <ChartCard
            key={key}
            title={alt}
            description={getDescription(key)}
          >
            {imagesLoaded[key] ? (
              <img
                src={src}
                alt={alt}
                className="w-full h-80 object-contain cursor-pointer"
                onClick={() => {
                  setCurrentIndex(index);
                  setIsModalOpen(true);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-80 text-red-500">
                Imagen no disponible
              </div>
            )}
          </ChartCard>
        ))}
      </div>

      {/* Modal para ver la imagen ampliada */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative">
            <img
              src={chartsConfig[currentIndex].src}
              alt={chartsConfig[currentIndex].alt}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
            >
              ×
            </button>
            {/* Botón de flecha izquierda */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev > 0 ? prev - 1 : chartsConfig.length - 1));
              }}
            >
              ←
            </button>
            {/* Botón de flecha derecha */}
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev < chartsConfig.length - 1 ? prev + 1 : 0));
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Función para obtener la descripción de cada gráfica
const getDescription = (key: ChartKey): string => {
  const descriptions: Record<ChartKey, string> = {
    boxplot_edad:
      'Gráfico de caja que muestra la distribución de edades según respuestas, identificando patrones por grupo etario.',
    correlacion:
      'Mapa de calor mostrando correlaciones estadísticas entre competencias digitales, destacando relaciones entre habilidades.',
    grafico_edad:
      'Visualización de la distribución de edades en relación con conocimientos digitales, mostrando tendencias demográficas.',
    grafico_empresa:
      'Visualización apilada de competencias digitales por tipo de empresa, identificando fortalezas y áreas de mejora.',
    grafico_participacion:
      'Análisis apilado de la participación en innovación según sector CIIU y género, destacando brechas de inclusión.',
    grafico_provincia:
      'Análisis horizontal de las puntuaciones promedio por provincia, mostrando regiones con mejor y peor desempeño.',
    grafico_tecnologias:
      'Distribución de respuestas afirmativas y negativas sobre el uso de tecnologías digitales en el contexto laboral.',
    radar_deficiencias:
      'Gráfico radial comparativo de deficiencias en habilidades digitales por grupo de edad, visualizando áreas críticas.',
  };
  return descriptions[key];
};

export default ChartsAnalysis;