import type { ConstructionObject, FilterState, ProjIndicators, Indicator } from '../types';
import { CITIES } from '../types';

export const getUniqueCities = (objects: ConstructionObject[]): string[] => {
  const citiesFromObjects = objects.map(obj => obj.city);
  
  return Array.from(new Set([...citiesFromObjects, ...CITIES])).sort();
};

export const getResidentialComplexesByCity = (objects: ConstructionObject[], city: string): string[] => {
  return Array.from(
    new Set(
      objects
        .filter(obj => obj.city === city)
        .map(obj => obj.projectName)
    )
  ).sort();
};

export const filterObjects = (objects: ConstructionObject[], filters: FilterState): ConstructionObject[] => {
  console.log('🔍 Filtering objects:', {
    totalObjects: objects.length,
    filters,
    sampleObject: objects[0] ? {
      id: objects[0].id,
      city: objects[0].city,
      residentalComplex: objects[0].residentalComplex,
      projectName: objects[0].projectName
    } : null
  });

  const filtered = objects.filter(obj => {
    // Поиск по всем полям объекта
    const searchableText = [
      obj.projectName,
      obj.residentalComplex,
      obj.city,
      obj.fullAddress,
      obj.status,
      ...obj.responsiblePersons.map(p => p.name),
    ].join(' ').toLowerCase();
    
    const matchesSearch = !filters.searchQuery || searchableText.includes(filters.searchQuery.toLowerCase());
    const matchesCity = !filters.city || obj.city === filters.city;
    const matchesResidentialComplex = !filters.residentialComplex || 
      obj.residentalComplex === filters.residentialComplex;
    
    const result = matchesSearch && matchesCity && matchesResidentialComplex;
    
    if (filters.residentialComplex && obj.residentalComplex === filters.residentialComplex) {
      console.log('✅ Found matching residential complex:', {
        filter: filters.residentialComplex,
        objectComplex: obj.residentalComplex,
        objectTitle: obj.projectName,
        matches: result
      });
    }
    
    return result;
  });

  console.log('📊 Filter results:', {
    filtered: filtered.length,
    original: objects.length
  });

  return filtered;
};

export const getResourceIcon = (url: string): string => {
  if (url.includes('docs.google.com')) return '📄';
  if (url.includes('autocad') || url.includes('dwg')) return '📐';
  if (url.includes('1c') || url.includes('1c.ru')) return '💼';
  if (url.includes('pdf')) return '📋';
  return '🔗';
};

// Нормализация названия проекта - убираем город, оставляем только ЖК и номер дома
export const normalizeProjectName = (projectName: string, city: string): string => {
  if (!projectName) return projectName;
  
  let normalized = projectName;
  
  // Убираем город из названия в различных форматах
  // Формат: "г.Киров, " или "г.Ульяновск, "
  normalized = normalized.replace(new RegExp(`г\\.${city}\\s*,?\\s*`, 'gi'), '');
  
  // Формат: "г.Киров " или "г.Ульяновск "
  normalized = normalized.replace(new RegExp(`г\\.${city}\\s+`, 'gi'), '');
  
  // Убираем лишние пробелы и запятые в начале и конце
  normalized = normalized.replace(/^[\s,]+/, '').replace(/[\s,]+$/, '');
  
  // Если название начинается с "ЖК", оставляем как есть
  if (normalized.startsWith('ЖК')) {
    return normalized;
  }
  
  // Если в названии есть "МЖД" или другие сокращения, оставляем их
  if (normalized.includes('МЖД') || normalized.includes('№')) {
    return normalized;
  }
  
  return normalized;
};

export const isWebResource = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://');
};

// Функция для поиска показателя по названию
export const findIndicatorByName = (indicators: ProjIndicators, searchName: string): Indicator | null => {
	if (!indicators || !indicators.indicators) return null;
	
	return indicators.indicators.find(indicator => 
		indicator.section.some(section => 
			section.name.toLowerCase().includes(searchName.toLowerCase())
		)
	) || null;
};

// Функция для получения значения показателя по названию
export const getIndicatorValue = (indicators: ProjIndicators, searchName: string): number | null => {
	const indicator = findIndicatorByName(indicators, searchName);
	return indicator ? indicator.sum : null;
};

// Функция для получения значения показателя с единицами измерения
export const getIndicatorValueWithUnit = (indicators: ProjIndicators, searchName: string): string | null => {
	const indicator = findIndicatorByName(indicators, searchName);
	if (!indicator) return null;
	
	const unit = indicator.section.length > 0 ? indicator.section[0].unit : '';
	const value = indicator.sum;
	
	if (value === 0) return null;
	
	return `${value.toLocaleString()}${unit ? ` ${unit}` : ''}`;
};
