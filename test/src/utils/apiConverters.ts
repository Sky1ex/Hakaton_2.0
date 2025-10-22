import type { ApiProjectCard, ApiResponsiblePerson, ApiIndicators, ApiDocumentLink } from '../types/api';
import type { ConstructionObject, ResponsiblePerson, ProjIndicators, Indicator, Section, DocumentLink } from '../types';
import { normalizeProjectName } from './dataUtils';
import { RESIDENTIAL_COMPLEXES } from '../types';

// Convert API responsible person to frontend format
export const convertResponsiblePerson = (apiPerson: ApiResponsiblePerson): ResponsiblePerson => ({
  role: fixEncoding(apiPerson.position),
  name: fixEncoding(apiPerson.fio),
  phone: apiPerson.phone,
  email: apiPerson.email,
  comment: fixEncoding(apiPerson.description),
});

// Convert API document links to frontend format
export const convertDocumentLinks = (apiDocumentLinks: ApiDocumentLink[]): DocumentLink[] => {
  return apiDocumentLinks.map(link => ({
    documentType: fixEncoding(link.documentType),
    url: link.url,
  }));
};

// Convert API indicators to frontend format
export const convertIndicators = (apiIndicators: ApiIndicators): ProjIndicators => {
  const indicators: Indicator[] = [];

  Object.entries(apiIndicators).forEach(([indicatorName, indicatorData]) => {
    const totalValue = parseFloat(indicatorData.total.replace(',', '.')) || 0;
    
    // Extract sections (excluding 'total')
    const sectionEntries = Object.entries(indicatorData).filter(([key]) => key !== 'total');
    
    const indicatorSections: Section[] = sectionEntries.map(([, value]) => ({
      name: indicatorName, // Используем название показателя, а не секции
      value: parseFloat(value.replace(',', '.')) || 0,
      unit: getUnitFromIndicatorName(indicatorName),
    }));

    indicators.push({
      sum: totalValue,
      section: indicatorSections,
    });
  });

  return {
    size: indicators.length,
    indicators,
  };
};

// Helper function to determine unit from indicator name
const getUnitFromIndicatorName = (indicatorName: string): string => {
  if (indicatorName.includes('площадь') || indicatorName.includes('Площадь')) {
    return 'м²';
  }
  if (indicatorName.includes('объем') || indicatorName.includes('Объем')) {
    return 'м³';
  }
  if (indicatorName.includes('высота') || indicatorName.includes('Высота')) {
    return 'м';
  }
  if (indicatorName.includes('этаж') || indicatorName.includes('Этаж')) {
    return 'эт.';
  }
  if (indicatorName.includes('квартир') || indicatorName.includes('комнатные') || indicatorName.includes('шт')) {
    return 'шт';
  }
  return 'шт';
};

// Helper function to determine residential complex from title
const determineResidentialComplex = (title: string): string => {
  // Ищем точное совпадение с константами ЖК
  for (const complex of RESIDENTIAL_COMPLEXES) {
    if (title.includes(complex)) {
      return complex;
    }
  }
  
  // Если точного совпадения нет, возвращаем первый ЖК по умолчанию
  return RESIDENTIAL_COMPLEXES[0];
};

// Helper function to fix encoding issues
const fixEncoding = (text: string): string => {
  if (!text) return text;
  
  // Try to fix common encoding issues
  try {
    // If text contains encoding issues, try to decode it
    if (text.includes('Ð')) {
      // This might be UTF-8 text interpreted as Latin-1
      const bytes = new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) {
        bytes[i] = text.charCodeAt(i);
      }
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(bytes);
    }
  } catch (error) {
    console.warn('Failed to fix encoding for text:', text, error);
  }
  
  return text;
};

// Convert API project card to frontend ConstructionObject
export const convertApiProjectToConstructionObject = (apiProject: ApiProjectCard): ConstructionObject => {
  // Fix encoding issues
  const fixedTitle = fixEncoding(apiProject.title);
  const fixedAddress = fixEncoding(apiProject.address);
  const fixedStatus = fixEncoding(apiProject.status);
  
  
  // Extract city from title first (assuming format like "г.Ульяновск, ...")
  const titleCityMatch = fixedTitle.match(/г\.([^,]+)/);
  const cityFromTitle = titleCityMatch ? titleCityMatch[1].trim() : null;
  
  // Extract city from address as fallback (assuming format like "г.Киров, ...")
  const addressCityMatch = fixedAddress.match(/г\.([^,]+)/);
  const cityFromAddress = addressCityMatch ? addressCityMatch[1].trim() : null;
  
  // Use city from title if available, otherwise from address, otherwise default to Киров
  const city = cityFromTitle || cityFromAddress || 'Киров';

  // Extract residential complex from title
  const residentialComplex = determineResidentialComplex(fixedTitle);

  // Нормализуем название проекта - убираем город
  const normalizedProjectName = normalizeProjectName(fixedTitle, city);

  console.log('🏗️ Project parsing:', {
    originalTitle: fixedTitle,
    originalAddress: fixedAddress,
    cityFromTitle,
    cityFromAddress,
    finalCity: city,
    residentialComplex,
    normalizedProjectName
  });

  return {
    id: parseInt(apiProject.id) || 0,
    projectName: normalizedProjectName,
    residentalComplex: residentialComplex,
    city: city,
    fullAddress: fixedAddress,
    startDate: apiProject.startDate,
    endDate: apiProject.endDate,
    lastUpdate: new Date().toISOString().split('T')[0], // Current date as last update
    status: fixedStatus,
    projectIndicators: convertIndicators(apiProject.indicators),
    area: {
      total: 0, // Not available in API
      residential: 0, // Not available in API
      commercial: 0, // Not available in API
    },
    metrics: {
      promotionsCount: 0, // Not available in API
      apartmentsCount: 0, // Not available in API
      residentsCount: 0, // Not available in API
    },
    responsiblePersons: apiProject.responsiblePersons.map(convertResponsiblePerson),
    relatedProjects: [], // Not available in API
    documentLinks: convertDocumentLinks(apiProject.documentLinks),
  };
};

// Convert array of API projects to frontend format
export const convertApiProjectsToConstructionObjects = (apiProjects: ApiProjectCard[]): ConstructionObject[] => {
  console.log('🔄 Converting API projects:', {
    count: apiProjects.length,
    firstProject: apiProjects[0],
  });
  
  const converted = apiProjects.map(convertApiProjectToConstructionObject);
  
  console.log('✅ Converted objects:', {
    count: converted.length,
    firstConverted: converted[0],
  });
  
  return converted;
};
