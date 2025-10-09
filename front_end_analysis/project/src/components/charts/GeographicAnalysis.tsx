import React from 'react';
import { MapPin, TrendingUp, AlertTriangle, CheckCircle, Users, BarChart3, Globe } from 'lucide-react';

interface Province {
  name: string;
  participants: number;
  percentage: number;
  color: string;
  digital_competence_avg: number;
  development_level: string;
  level_color: string;
  demographic_profile: {
    gender?: Record<string, number>;
    avg_age?: number;
  };
  tech_adoption: Record<string, number>;
  participation_rank: number;
}

interface Region {
  name: string;
  participants: number;
  percentage: number;
  digital_competence_avg: number;
  provinces_count: number;
  color: string;
}

interface GeographicInsight {
  type: string;
  title: string;
  description: string;
  impact: string;
  recommendations: string[];
}

interface CoverageMetrics {
  total_provinces: number;
  total_regions: number;
  avg_participation_per_province?: number;
  geographic_diversity_index?: number;
  most_digital_province: string;
  least_digital_province: string;
}

interface Summary {
  total_participantes: number;
  geographic_coverage: string;
  digital_readiness_geographic: string;
  top_digital_region: string;
}

interface GeographicAnalysisProps {
  data: {
    provinces_analysis: Province[];
    regions_analysis: Region[];
    geographic_insights: GeographicInsight[];
    coverage_metrics: CoverageMetrics;
    summary: Summary;
  } | null;
}

const GeographicAnalysis: React.FC<GeographicAnalysisProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center text-gray-500 py-12">
        <MapPin className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>Cargando análisis geográfico profundo...</p>
      </div>
    );
  }

  const { provinces_analysis, regions_analysis, geographic_insights, coverage_metrics, summary } = data;

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'alto': return 'text-red-600 bg-red-50 border-red-200';
      case 'medio': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'bajo': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'alto': return <AlertTriangle className="h-5 w-5" />;
      case 'medio': return <TrendingUp className="h-5 w-5" />;
      case 'bajo': return <CheckCircle className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getDevelopmentBadge = (level: string, color: string) => {
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: color }}
      >
        {level}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Resumen Ejecutivo Geográfico */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
        <div className="flex items-center mb-4">
          <Globe className="h-6 w-6 text-emerald-600 mr-3" />
          <h3 className="text-xl font-bold text-navy-primary">Resumen Geográfico</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{summary.total_participantes.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Participantes</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{coverage_metrics.total_provinces}</div>
            <div className="text-sm text-gray-600">Provincias</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{coverage_metrics.total_regions}</div>
            <div className="text-sm text-gray-600">Regiones</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{summary.digital_readiness_geographic}</div>
            <div className="text-sm text-gray-600">Desarrollo Digital</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Región Líder Digital</div>
            <div className="text-lg font-semibold text-navy-primary">{summary.top_digital_region}</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Cobertura Geográfica</div>
            <div className="text-lg font-semibold text-navy-primary">{summary.geographic_coverage}</div>
          </div>
        </div>
      </div>

      {/* Análisis por Regiones */}
      <div className="bg-white rounded-xl shadow-elegant p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <MapPin className="h-6 w-6 text-teal-600 mr-3" />
          <h3 className="text-xl font-bold text-navy-primary">Análisis por Regiones</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regions_analysis.map((region, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: region.color }}
                  ></div>
                  <h4 className="text-lg font-semibold text-gray-800">{region.name}</h4>
                </div>
                <span className="text-xs text-gray-500">{region.provinces_count} provincias</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participantes:</span>
                  <span className="font-semibold">{region.participants.toLocaleString()} ({region.percentage}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Score Digital:</span>
                  <span className={`font-semibold ${
                    region.digital_competence_avg >= 7 ? 'text-green-600' :
                    region.digital_competence_avg >= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {region.digital_competence_avg}/10
                  </span>
                </div>
                
                {/* Barra de progreso para participación */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Participación Regional</span>
                    <span>{region.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${region.percentage}%`,
                        backgroundColor: region.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Análisis Detallado por Provincias */}
      <div className="bg-white rounded-xl shadow-elegant p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-bold text-navy-primary">Análisis Detallado por Provincias</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {provinces_analysis.slice(0, 6).map((province, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: province.color }}
                  ></div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{province.name}</h4>
                    <p className="text-sm text-gray-600">Posición #{province.participation_rank}</p>
                  </div>
                </div>
                {getDevelopmentBadge(province.development_level, province.level_color)}
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Participantes</div>
                    <div className="text-lg font-semibold">{province.participants.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{province.percentage}% del total</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Score Digital</div>
                    <div className={`text-lg font-semibold ${
                      province.digital_competence_avg >= 7 ? 'text-green-600' :
                      province.digital_competence_avg >= 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {province.digital_competence_avg}/10
                    </div>
                  </div>
                </div>
                
                {/* Perfil Demográfico */}
                {province.demographic_profile.gender && (
                  <div className="mt-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Perfil Demográfico:</h5>
                    <div className="flex justify-between text-xs">
                      {Object.entries(province.demographic_profile.gender).map(([gender, count]) => (
                        <span key={gender} className="text-gray-600">
                          {gender}: {count}
                        </span>
                      ))}
                      {province.demographic_profile.avg_age && (
                        <span className="text-gray-600">
                          Edad: {province.demographic_profile.avg_age}años
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Adopción Tecnológica */}
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Adopción Tecnológica:</h5>
                  <div className="space-y-1">
                    {Object.entries(province.tech_adoption).slice(0, 3).map(([tech, rate]) => (
                      <div key={tech} className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 capitalize">{tech}</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${Math.min(rate, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium w-8">{rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Geográficos */}
      <div className="bg-white rounded-xl shadow-elegant p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
          <h3 className="text-xl font-bold text-navy-primary">Insights y Patrones Geográficos</h3>
        </div>
        <div className="space-y-4">
          {geographic_insights.map((insight, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getImpactColor(insight.impact)}`}>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  {getImpactIcon(insight.impact)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold">{insight.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'Alto' ? 'bg-red-100 text-red-800' :
                      insight.impact === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Impacto {insight.impact}
                    </span>
                  </div>
                  <p className="text-sm mb-3 opacity-90">{insight.description}</p>
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold">Recomendaciones:</h5>
                    <ul className="text-sm space-y-1">
                      {insight.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas de Cobertura */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-100">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-slate-600 mr-3" />
          <h3 className="text-xl font-bold text-navy-primary">Métricas de Cobertura Territorial</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Provincia más digital:</span>
              <span className="font-semibold text-green-600">{coverage_metrics.most_digital_province}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Provincia con menor desarrollo:</span>
              <span className="font-semibold text-red-600">{coverage_metrics.least_digital_province}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de provincias analizadas:</span>
              <span className="font-semibold">{coverage_metrics.total_provinces}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Regiones cubiertas:</span>
              <span className="font-semibold">{coverage_metrics.total_regions}</span>
            </div>
            {coverage_metrics.avg_participation_per_province && (
              <div className="flex justify-between">
                <span className="text-gray-600">Promedio por provincia:</span>
                <span className="font-semibold">{coverage_metrics.avg_participation_per_province.toFixed(0)} participantes</span>
              </div>
            )}
            {coverage_metrics.geographic_diversity_index && (
              <div className="flex justify-between">
                <span className="text-gray-600">Índice de diversidad:</span>
                <span className="font-semibold">{(coverage_metrics.geographic_diversity_index * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicAnalysis;