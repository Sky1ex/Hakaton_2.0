import { useCallback } from 'react';
import { isWebResource } from '../utils/dataUtils';

/**
 * Хук для управления сайдбаром с деталями объекта
 * Предоставляет функции для работы с внешними ресурсами
 */
export const useObjectDetailsSidebar = () => {
	/**
	 * Обработчик клика по внешнему ресурсу
	 * Открывает ссылку в новой вкладке, если это веб-ресурс
	 * 
	 * @param url - URL ресурса для открытия
	 */
	const handleResourceClick = useCallback((url: string) => {
		if (!url) {
			console.warn('URL не предоставлен');
			return;
		}

		if (isWebResource(url)) {
			try {
				window.open(url, '_blank', 'noopener,noreferrer');
			} catch (error) {
				console.error('Ошибка при открытии ссылки:', error);
			}
		} else {
			console.warn('Некорректный URL:', url);
		}
	}, []);

	/**
	 * Обработчик клика по изображению проекта
	 * Открывает тестовое изображение в новой вкладке
	 */
	const handleImageClick = useCallback(() => {
		try {
			window.open('/test.webp', '_blank', 'noopener,noreferrer');
		} catch (error) {
			console.error('Ошибка при открытии изображения:', error);
		}
	}, []);

	return {
		handleResourceClick,
		handleImageClick,
	};
};
