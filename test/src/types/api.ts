// API Response Types
export interface ApiResponsiblePerson {
  fio: string;
  position: string;
  phone: string;
  email: string;
  description: string;
}

export interface ApiDocumentLink {
  documentType: string;
  url: string;
}

export interface ApiIndicators {
  [key: string]: {
    total: string;
    [sectionKey: string]: string;
  };
}

export interface ApiProjectCard {
  id: string;
  title: string;
  address: string;
  startDate: string;
  endDate: string;
  status: string;
  indicators: ApiIndicators;
  responsiblePersons: ApiResponsiblePerson[];
  documentLinks: ApiDocumentLink[];
}

// API Error Types
export interface ApiError {
  message: string;
  status: number;
}

// API Client Types
export interface SearchParams {
  q: string;
  city?: string;
  residentialComplex?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}
