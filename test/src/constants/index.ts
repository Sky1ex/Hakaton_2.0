// Константы для пагинации
export const PAGINATION_CONFIG = {
  DEFAULT_ITEMS_PER_PAGE: 6,
  MAX_VISIBLE_PAGES: 5,
} as const;

// Константы для UI
export const UI_CONFIG = {
  ANIMATION_DURATION: 200,
  SCROLL_BEHAVIOR: 'smooth' as const,
} as const;

// Константы для таблицы показателей
export const INDICATORS_CONFIG = {
  DEFAULT_INDICATOR_NAMES: [
    'Площадь застройки',
    'Количество этажей',
    'Этажность здания',
    'Строительный объем',
    'Общая площадь здания',
    'Площадь квартир',
    'Количество квартир (общее)',
    'Студии',
    '1-комнатные',
    '2-комнатные',
    '3-комнатные',
    '4-комнатные',
    'Количество кладовых',
    'Площадь кладовых',
    'Площадь коммерческих помещений',
    'Высота этажа жилой части',
    'Высота здания'
  ],
} as const;

// Константы для стилей
export const STYLES = {
  COLORS: {
    PRIMARY: 'bg-orange-500 text-white',
    PRIMARY_HOVER: 'hover:bg-orange-600',
    ORANGE: 'bg-orange-500 text-white',
    ORANGE_HOVER: 'hover:bg-orange-600',
    SUCCESS: 'bg-orange-100 text-orange-800 border-orange-200 font-medium',
    SECONDARY: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  SPACING: {
    SMALL: 'px-3 py-2',
    MEDIUM: 'px-4 py-2',
    LARGE: 'px-6 py-3',
  },
} as const;
