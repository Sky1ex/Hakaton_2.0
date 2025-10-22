import { useState, useEffect } from 'react';
import type { ConstructionObject } from '../types';
import { usePagination } from './usePagination';
import { useObjectDetails } from './useObjectDetails';
import { useApi } from './useApi';
import { useDebounce } from './useDebounce';
import { useFilters } from './useFilters';
import { convertApiProjectsToConstructionObjects } from '../utils/apiConverters';
import { PAGINATION_CONFIG } from '../constants';

export const useApp = () => {
	const [objects, setObjects] = useState<ConstructionObject[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	
	const api = useApi();
	
	// Debounce для поискового запроса (1000ms задержка)
	const debouncedSearchQuery = useDebounce(searchQuery, 1000);

	// Используем фильтры
	const {
		filters,
		cities,
		filteredObjects,
		handleSearchChange: handleFilterSearchChange,
		handleCityChange,
		handleResidentialComplexChange,
	} = useFilters({ objects });

	const {
		selectedObject,
		isDetailsOpen,
		openDetails,
		closeDetails,
	} = useObjectDetails();

	// Функция для загрузки всех проектов
	const loadAllProjects = async () => {
		setIsSearching(true);
		
		try {
			const response = await api.getAllProjects();
			
			if (response && response.data && response.data.length > 0) {
				const convertedObjects = convertApiProjectsToConstructionObjects(response.data);
				setObjects(convertedObjects);
				// Очищаем фильтр поиска, чтобы показать все результаты от API
				handleFilterSearchChange('');
			} else {
				setObjects([]);
			}
		} catch (error) {
			console.error('Load all projects error:', error);
			setObjects([]);
		} finally {
			setIsSearching(false);
			setIsInitialLoad(false);
		}
	};

	// Простая функция поиска
	const performSearch = async (query: string) => {
		if (!query.trim()) {
			// Если запрос пустой, загружаем все проекты
			await loadAllProjects();
			return;
		}

		setIsSearching(true);
		
		try {
			const response = await api.searchProjects(query);
			
			// Используем данные из ответа, а не из состояния api
			if (response && response.data && response.data.length > 0) {
				const convertedObjects = convertApiProjectsToConstructionObjects(response.data);
				setObjects(convertedObjects);
				// Очищаем фильтр поиска, чтобы показать все результаты от API
				handleFilterSearchChange('');
			} else {
				setObjects([]);
			}
		} catch (error) {
			console.error('Search error:', error);
			setObjects([]);
		} finally {
			setIsSearching(false);
		}
	};

	// Первоначальная загрузка всех проектов
	useEffect(() => {
		if (isInitialLoad) {
			loadAllProjects();
		}
	}, [isInitialLoad]);

	// Обработка изменений поискового запроса
	useEffect(() => {
		if (!isInitialLoad) {
			performSearch(debouncedSearchQuery);
		}
	}, [debouncedSearchQuery]);

	// Обработчик изменения поискового запроса
	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
		handleFilterSearchChange(query);
	};

	const handleAddObject = (newObject: ConstructionObject) => {
		setObjects(prev => [newObject, ...prev]);
	};

	// Пагинация для отфильтрованных результатов
	const {
		currentPage,
		totalPages,
		paginatedItems: paginatedObjects,
		handlePageChange,
		handlePreviousPage,
		handleNextPage,
	} = usePagination({ 
		items: filteredObjects, 
		itemsPerPage: PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE 
	});

	return {
		// State
		objects: filteredObjects,
		searchQuery,
		isSearching,
		isInitialLoad,
		currentPage,
		totalPages,
		paginatedObjects,
		selectedObject,
		isDetailsOpen,
		
		// API State
		apiLoading: api.loading,
		apiError: api.error,
		
		// Actions
		handleSearchChange,
		handlePageChange,
		handlePreviousPage,
		handleNextPage,
		openDetails,
		closeDetails,
		handleAddObject,
		
		// API Actions
		clearApiError: api.clearError,
		
		// Filters
		cities,
		selectedCity: filters.city,
		selectedResidentialComplex: filters.residentialComplex,
		handleCityChange,
		handleResidentialComplexChange,
	};
};