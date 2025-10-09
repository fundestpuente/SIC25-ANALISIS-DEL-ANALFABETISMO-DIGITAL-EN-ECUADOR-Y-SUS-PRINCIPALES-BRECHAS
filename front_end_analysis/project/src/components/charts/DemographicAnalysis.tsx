import React from 'react';
import { Users, TrendingUp, AlertTriangle, CheckCircle, BarChart3, PieChart } from 'lucide-react';

interface Competencia {
  0: string; // skill name
  1: number; // average score
}

interface GenderAnalysis {
  name: string;
  value: number;
  percentage: number;
  color: string;
  avg_age: number;
  top_competencias: Competencia[];
  participation_level: string;
}

interface AgeAnalysis {
  range: string;
  category: string;
  value: number;
  percentage: number;
  color: string;
  avg_age: number;
  digital_competence_score: number;
  tech_adoption: Record<string, number>;
}

interface Insight {
  type: string;
  title: string;
  description: string;
  impact: string;
  recommendations: string[];
}

interface Summary {
  total_participantes: number;
  gender_diversity_index: number;
  age_range_span: string;
  average_age: number;
  most_represented_demographic: string;
  digital_readiness_level: string;
}

interface DemographicAnalysisProps {
  data: {
    gender_analysis: GenderAnalysis[];
    age_analysis: AgeAnalysis[];
    insights: Insight[];
    summary: Summary;
  } | null;
}

const DemographicAnalysis: React.FC<DemographicAnalysisProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center text-gray-500 py-12">
        <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>Cargando análisis demográfico profundo...</p>
      </div>
    );
  }

  const { gender_analysis, age_analysis, insights, summary } = data;

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

  return (
    <div className="space-y-8">
      {/* Resumen Ejecutivo */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-bold text-navy-primary">Resumen Ejecutivo</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{summary.total_participantes.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Participantes</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{summary.average_age}años</div>
            <div className="text-sm text-gray-600">Edad Promedio</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{summary.digital_readiness_level}</div>
            <div className="text-sm text-gray-600">Preparación Digital</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Perfil Dominante</div>
          <div className="text-lg font-semibold text-navy-primary">{summary.most_represented_demographic}</div>
          <div className="text-sm text-gray-500">Rango etario: {summary.age_range_span}</div>
        </div>
      </div>

      {/* Análisis por Género */}
      <div className="bg-white rounded-xl shadow-elegant p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <PieChart className="h-6 w-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-bold text-navy-primary">Análisis por Género</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gender_analysis.map((gender, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: gender.color }}
                  ></div>
                  <h4 className="text-lg font-semibold text-gray-800">{gender.name}</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  gender.participation_level === 'Alto' ? 'bg-green-100 text-green-800' :
                  gender.participation_level === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {gender.participation_level}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participantes:</span>
                  <span className="font-semibold">{gender.value.toLocaleString()} ({gender.percentage}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Edad promedio:</span>
                  <span className="font-semibold">{gender.avg_age} años</span>
                </div>
                
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Competencias Destacadas:</h5>
                  <div className="space-y-2">
                    {gender.top_competencias.slice(0, 3).map((comp, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">{comp[0].replace(/_/g, ' ')}</span>
                        <div className="flex items-center">
                          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full"
                              style={{ width: `${(comp[1] / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{comp[1]}</span>
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

      {/* Análisis por Edad */}
      <div className="bg-white rounded-xl shadow-elegant p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-orange-600 mr-3" />
          <h3 className="text-xl font-bold text-navy-primary">Análisis Generacional</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {age_analysis.map((age, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: age.color }}
                  ></div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{age.range} años</h4>
                    <p className="text-sm text-gray-600">{age.category}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participantes:</span>
                  <span className="font-semibold">{age.value.toLocaleString()} ({age.percentage}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Edad promedio:</span>
                  <span className="font-semibold">{age.avg_age} años</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competencia digital:</span>
                  <span className={`font-semibold ${
                    age.digital_competence_score >= 7 ? 'text-green-600' :
                    age.digital_competence_score >= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {age.digital_competence_score}/10
                  </span>
                </div>
                
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Adopción Tecnológica:</h5>
                  <div className="space-y-2">
                    {Object.entries(age.tech_adoption).slice(0, 3).map(([tech, rate]) => (
                      <div key={tech} className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 capitalize">{tech.replace(/_/g, ' ')}</span>
                        <div className="flex items-center">
                          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                              style={{ width: `${rate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{rate}%</span>
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

      {/* Insights y Hallazgos */}
      <div className="bg-white rounded-xl shadow-elegant p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
          <h3 className="text-xl font-bold text-navy-primary">Insights y Hallazgos Clave</h3>
        </div>
        <div className="space-y-4">
          {insights.map((insight, index) => (
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
    </div>
  );
};

export default DemographicAnalysis;