# Архитектура приложения "Строительные объекты"

## 📁 Структура проекта

```
src/
├── components/           # React компоненты
│   ├── ui/              # Базовые UI компоненты
│   ├── ErrorBoundary.tsx
│   ├── ObjectCard.tsx
│   ├── ObjectDetails.tsx
│   ├── ProjectIndicatorsTable.tsx
│   └── SearchAndFilter.tsx
├── hooks/               # Кастомные React хуки
│   ├── useFilters.ts
│   ├── useObjectDetails.ts
│   └── usePagination.ts
├── constants/           # Константы приложения
│   └── index.ts
├── utils/               # Утилиты и вспомогательные функции
│   ├── dataUtils.ts
│   └── formatters.ts
├── types/               # TypeScript типы и интерфейсы
│   └── index.ts
├── data/                # Моковые данные
│   └── mockData.ts
├── lib/                 # Библиотечные утилиты
│   └── utils.ts
├── App.tsx              # Главный компонент
└── main.tsx            # Точка входа
```

## 🏗️ Архитектурные принципы

### 1. **Разделение ответственности**
- **Компоненты**: только UI логика и рендеринг
- **Хуки**: бизнес-логика и управление состоянием
- **Утилиты**: чистые функции для обработки данных
- **Константы**: централизованное хранение настроек

### 2. **Кастомные хуки**
- `useFilters` - управление фильтрацией объектов
- `usePagination` - логика пагинации
- `useObjectDetails` - управление модальным окном деталей

### 3. **Оптимизация производительности**
- `React.memo` для предотвращения лишних перерендеров
- `useMemo` для кэширования вычислений
- Условный рендеринг для экономии ресурсов

### 4. **Обработка ошибок**
- `ErrorBoundary` для graceful обработки ошибок
- Типизация для предотвращения runtime ошибок

## 🔧 Основные компоненты

### App.tsx
Главный компонент, использующий кастомные хуки для управления состоянием:
```typescript
const { filters, cities, districts, filteredObjects, ... } = useFilters({ objects });
const { currentPage, totalPages, paginatedObjects, ... } = usePagination({ items: filteredObjects });
const { selectedObject, isDetailsOpen, openDetails, closeDetails } = useObjectDetails();
```

### ObjectCard.tsx
Оптимизированный компонент карточки объекта с `React.memo`:
- Использует утилиты для форматирования
- Константы для стилей
- Мемоизация для производительности

### ProjectIndicatorsTable.tsx
Компонент таблицы показателей с:
- Условным рендерингом
- Использованием утилит форматирования
- Константами для стилей

## 🎯 Преимущества новой архитектуры

### 1. **Поддерживаемость**
- Четкое разделение логики
- Переиспользуемые хуки
- Централизованные константы

### 2. **Тестируемость**
- Изолированная бизнес-логика в хуках
- Чистые функции в утилитах
- Легкое мокирование зависимостей

### 3. **Производительность**
- Мемоизация компонентов
- Оптимизированные вычисления
- Условный рендеринг

### 4. **Масштабируемость**
- Модульная структура
- Переиспользуемые компоненты
- Легкое добавление новых функций

## 🚀 Использование

### Добавление нового хука
```typescript
// src/hooks/useNewFeature.ts
export const useNewFeature = (props) => {
  const [state, setState] = useState(initialState);
  
  const handleAction = useCallback(() => {
    // логика
  }, [dependencies]);
  
  return { state, handleAction };
};
```

### Добавление новых констант
```typescript
// src/constants/index.ts
export const NEW_CONFIG = {
  VALUE: 'example',
  OPTIONS: ['option1', 'option2'],
} as const;
```

### Создание новых утилит
```typescript
// src/utils/newUtils.ts
export const newUtility = (param: string): string => {
  return param.toUpperCase();
};
```

## 📝 Соглашения по коду

1. **Именование**: camelCase для функций, PascalCase для компонентов
2. **Типизация**: строгая типизация всех функций и компонентов
3. **Импорты**: группировка по типам (React, библиотеки, локальные)
4. **Комментарии**: JSDoc для публичных функций
5. **Константы**: использование `as const` для неизменяемых значений

## 🔄 Миграция

При добавлении новых функций следуйте принципам:
1. Создайте хук для бизнес-логики
2. Добавьте константы в `constants/index.ts`
3. Создайте утилиты для обработки данных
4. Используйте существующие UI компоненты
5. Добавьте типы в `types/index.ts`
6. Оберните в `ErrorBoundary` при необходимости
