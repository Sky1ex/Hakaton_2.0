import { INDICATORS_CONFIG } from '../constants';

/**
 * Форматирует числовое значение для отображения в таблице
 */
export const formatValue = (value: number): string => {
  if (value === 0) return '-';
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(2).replace('.', ',');
};

/**
 * Получает название показателя по индексу
 */
export const getIndicatorName = (indicator: any, index: number): string => {
  // Если у показателя есть секции с названиями, используем их
  if (indicator.section.length > 0 && indicator.section[0].name) {
    return indicator.section[0].name;
  }
  
  // Иначе используем стандартные названия
  return INDICATORS_CONFIG.DEFAULT_INDICATOR_NAMES[index] || `Показатель ${index + 1}`;
};

/**
 * Проверяет, является ли URL веб-ресурсом
 */
export const isWebResource = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Получает иконку для типа ресурса
 */
export const getResourceIcon = (url: string): string => {
  if (isWebResource(url)) {
    return '🌐';
  }
  return '📄';
};

/**
 * Извлекает район из полного адреса
 */
export const extractDistrict = (fullAddress: string): string => {
  return fullAddress.split(',')[1]?.trim() || 'Центральный район';
};

/**
 * Создает массив заголовков секций
 */
export const createSectionHeaders = (maxSections: number): string[] => {
  return Array.from({ length: maxSections }, (_, i) => `Секция №${i + 1}`);
};
