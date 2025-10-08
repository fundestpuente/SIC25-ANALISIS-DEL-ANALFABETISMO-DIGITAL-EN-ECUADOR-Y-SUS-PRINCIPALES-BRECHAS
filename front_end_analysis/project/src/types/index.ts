export interface SummaryData {
  count: number;
  mean: number;
  std: number;
  min: number;
  max: number;
}

export interface DataPoint {
  [key: string]: any;
}

export interface ProvinceScore {
  provincia: string;
  puntuacion_promedio: number;
}

export interface GenderAgeScore {
  genero: string;
  rango_edad: string;
  puntuacion_promedio: number;
}

export interface CompanyCompetence {
  tipo_empresa: string;
  competencia: string;
  count: number;
}

export interface TechnologyUsage {
  tecnologia: string;
  si: number;
  no: number;
}

export interface InnovationParticipation {
  ciiu: string;
  genero: string;
  participacion: number;
}

export interface DigitalCompetenceByCIIU {
  ciiu: string;
  competencia: string;
  nivel: number;
}

export interface CorrelationData {
  [key: string]: {
    [key: string]: number;
  };
}

export interface AgeDistribution {
  fundamento: string;
  ages: number[];
}

export interface RadarDeficiency {
  edad_grupo: string;
  habilidades: {
    [key: string]: number;
  };
}

export interface FilterOption {
  value: string;
  label: string;
}
