export interface ResponsiblePerson {
  role: string;
  name: string;
  phone?: string;
  email?: string;
  comment?: string;
}

export interface Area {
  total: number;
  residential: number;
  commercial: number;
}

export interface Metrics {
  promotionsCount: number;
  apartmentsCount: number;
  residentsCount: number;
}

export interface Section{
  name: string;
  value: number;
  unit: string;
}

export interface Indicator{
  sum: number;
  section: Section[];
}

export interface ProjIndicators{
  size: number;
  indicators: Indicator[];
}

export interface DocumentLink {
  documentType: string;
  url: string;
}

export interface ConstructionObject {
  id: number;
  projectName: string;
  residentalComplex: string;
  city: string;
  fullAddress: string;
  startDate: string;
  endDate: string;
  lastUpdate: string;
  status: string;
  projectIndicators: ProjIndicators;
  area: Area;
  metrics: Metrics;
  responsiblePersons: ResponsiblePerson[];
  relatedProjects: string[];
  documentLinks: DocumentLink[];
}

// Константы для ЖК
export const RESIDENTIAL_COMPLEXES = [
  'ЖК Знак',
  'ЖК Игикай', 
  'ЖК Зарядное',
  'ЖК Город Новаторов'
] as const;

export type ResidentialComplex = typeof RESIDENTIAL_COMPLEXES[number];

// Константы для городов
export const CITIES = [
  'Киров',
  'Ульяновск', 
  'Ижевск'
] as const;

export type City = typeof CITIES[number];

export interface FilterState {
  city: string;
  residentialComplex: string;
  searchQuery: string;
}
