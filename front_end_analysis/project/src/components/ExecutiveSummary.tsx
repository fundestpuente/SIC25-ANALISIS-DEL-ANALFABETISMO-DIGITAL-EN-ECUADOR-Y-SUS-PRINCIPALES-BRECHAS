import React, { useState, useEffect } from 'react';
import { fetchExecutiveSummary } from '../utils/api';
import { 
  Users, 
  MapPin, 
  Target, 
  Award,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ArrowUpRight
} from 'lucide-react';

interface ExecutiveSummaryData {
  status: string;
  fecha_analisis: string;
  resumen_demografico: {
    total_participantes: number;
    distribucion_genero: {
      dominante: { nombre: string; porcentaje: number };
      total_generos: number;
    };
    edad: { promedio: number; rango: string };
  };
  resumen_geografico: {
    total_provincias: number;
    provincia_dominante: { nombre: string; porcentaje: number };
    cobertura_geografica: string;
  };
  competencias_digitales: {
    promedio_general: number;
    nivel_competencia: string;
    competencias_evaluadas: number;
    top_competencias: Array<{ competencia: string; promedio: number }>;
  };
  adopcion_tecnologica: {
    adopcion_promedio: number;
    nivel_adopcion: string;
    tecnologias_evaluadas: number;
    top_tecnologias: Array<{ tecnologia: string; adopcion: number }>;
  };
  brechas_principales: Array<{
    tipo: string;
    magnitud: number;
    impacto: string;
    descripcion: string;
  }>;
  kpis: Array<{
    nombre: string;
    valor: string;
    tipo: string;
    tendencia: string;
    descripcion: string;
  }>;
  recomendaciones_estrategicas: Array<{
    categoria: string;
    prioridad: string;
    recomendacion: string;
    impacto_esperado: string;
  }>;
  conclusiones_clave: string[];
}

const ExecutiveSummary: React.FC = () => {
  const [data, setData] = useState<ExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExecutiveSummary = async () => {
      try {
        const result = await fetchExecutiveSummary();
        setData(result);
      } catch (error) {
        console.error('Error cargando resumen ejecutivo:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExecutiveSummary();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center text-gray-500">Error cargando el resumen ejecutivo</div>
      </div>
    );
  }

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'positiva':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'negativa':
        return <ArrowUpRight className="w-4 h-4 text-red-500 transform rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">{kpi.nombre}</h3>
              {getTendenciaIcon(kpi.tendencia)}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">{kpi.valor}</p>
            <p className="text-sm text-gray-500">{kpi.descripcion}</p>
          </div>
        ))}
      </div>

      {/* Resumen por Secciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demografía */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold">Demografía</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Participantes:</span>
              <span className="font-semibold">{data.resumen_demografico.total_participantes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Género Dominante:</span>
              <span className="font-semibold">
                {data.resumen_demografico.distribucion_genero.dominante.nombre} 
                ({data.resumen_demografico.distribucion_genero.dominante.porcentaje}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Edad Promedio:</span>
              <span className="font-semibold">{data.resumen_demografico.edad.promedio} años</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rango de Edad:</span>
              <span className="font-semibold">{data.resumen_demografico.edad.rango}</span>
            </div>
          </div>
        </div>

        {/* Geografía */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold">Distribución Geográfica</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Provincia Principal:</span>
              <span className="font-semibold">
                {data.resumen_geografico.provincia_dominante.nombre}
                ({data.resumen_geografico.provincia_dominante.porcentaje}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Competencias y Tecnología */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Competencias Digitales */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold">Competencias Digitales</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Promedio General:</span>
              <span className="text-2xl font-bold text-purple-600">
                {data.competencias_digitales.promedio_general}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nivel:</span>
              <span className="font-semibold">{data.competencias_digitales.nivel_competencia}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Top Competencias:</p>
              {data.competencias_digitales.top_competencias.slice(0, 3).map((comp, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{comp.competencia.replace(/_/g, ' ')}</span>
                  <span className="font-medium">{comp.promedio}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Adopción Tecnológica */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-semibold">Adopción Tecnológica</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Adopción Promedio:</span>
              <span className="text-2xl font-bold text-orange-600">
                {data.adopcion_tecnologica.adopcion_promedio}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nivel:</span>
              <span className="font-semibold">{data.adopcion_tecnologica.nivel_adopcion}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Top Tecnologías:</p>
              {data.adopcion_tecnologica.top_tecnologias.slice(0, 3).map((tech, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="capitalize">{tech.tecnologia.replace(/_/g, ' ')}</span>
                  <span className="font-medium">{tech.adopcion}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brechas Principales */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-semibold">Brechas Identificadas</h3>
        </div>
        <div className="space-y-4">
          {data.brechas_principales.map((brecha, index) => (
            <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-red-800">{brecha.tipo}</h4>
                <span className="text-sm bg-red-200 text-red-800 px-2 py-1 rounded">
                  {brecha.impacto}
                </span>
              </div>
              <p className="text-red-700 text-sm mb-2">{brecha.descripcion}</p>
              <p className="text-sm text-red-600">
                Magnitud: <span className="font-semibold">{brecha.magnitud} puntos</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendaciones Estratégicas */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-semibold">Recomendaciones Estratégicas</h3>
        </div>
        <div className="space-y-4">
          {data.recomendaciones_estrategicas.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-800">{rec.categoria}</h4>
                <span className={`text-xs px-2 py-1 rounded border ${getPrioridadColor(rec.prioridad)}`}>
                  {rec.prioridad}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{rec.recomendacion}</p>
              <p className="text-sm text-blue-600 font-medium">
                Impacto esperado: {rec.impacto_esperado}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusiones Clave */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-green-800">Conclusiones Clave</h3>
        </div>
        <ul className="space-y-2">
          {data.conclusiones_clave.map((conclusion, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-green-700">{conclusion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExecutiveSummary;