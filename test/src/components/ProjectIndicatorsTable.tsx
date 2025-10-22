import React, { useState, useMemo } from 'react';
import type { ProjIndicators } from '../types';
import { formatValue, getIndicatorName, createSectionHeaders } from '../utils/formatters';
import { STYLES } from '../constants';
import { Image, ExternalLink } from 'lucide-react';

interface ProjectIndicatorsTableProps {
	projectIndicators: ProjIndicators;
}

export const ProjectIndicatorsTable: React.FC<ProjectIndicatorsTableProps> = ({ projectIndicators }) => {
	if (!projectIndicators || !projectIndicators.indicators || projectIndicators.indicators.length === 0) {
		return null;
	}

	// Состояние для отображения таблицы (по умолчанию скрыта)
	const [isTableVisible, setIsTableVisible] = useState(false);

	// Функция для переключения видимости таблицы
	const toggleTableVisibility = () => {
		setIsTableVisible(prev => !prev);
	};

	// Определяем количество секций на основе максимального количества секций в показателях
	const maxSections = useMemo(() => 
		Math.max(...projectIndicators.indicators.map(indicator => indicator.section.length)),
		[projectIndicators.indicators]
	);
	
	// Создаем заголовки для секций
	const sectionHeaders = useMemo(() => 
		createSectionHeaders(maxSections),
		[maxSections]
	);

	const handleImageClick = () => {
		// Открываем изображение в новой вкладке
		window.open('/test.jpg', '_blank');
	};

	return (
		<div className="space-y-4 p-4 bg-gray-200/50 rounded-lg border border-gray-300/70">
			<div className="flex gap-3">
				<button
					onClick={toggleTableVisibility}
					className={`${STYLES.SPACING.MEDIUM} ${STYLES.COLORS.ORANGE} text-white rounded-lg ${STYLES.COLORS.ORANGE_HOVER} transition-colors font-medium cursor-pointer`}
				>
					Показатели проекта
				</button>
				<button
					onClick={handleImageClick}
					className={`${STYLES.SPACING.MEDIUM} bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer flex items-center gap-2`}
				>
					<Image className="h-4 w-4" />
					Камера
					<ExternalLink className="h-4 w-4" />
				</button>
			</div>
			{/* Показываем таблицу только если она видима */}
			{isTableVisible && (
				<div className="overflow-x-auto bg-white rounded-lg border border-gray-300">
					<table className="w-full border-collapse border border-gray-400 text-sm">
						<thead>
							<tr className="bg-gray-200">
								<th className="border border-gray-400 px-3 py-2 text-left font-medium text-gray-800">№ П/П</th>
								<th className="border border-gray-400 px-3 py-2 text-left font-medium text-gray-800">Показатель</th>
								{/* Показываем все заголовки секций */}
								{sectionHeaders.map((header, index) => (
									<th key={index} className="border border-gray-400 px-3 py-2 text-center font-medium text-gray-800">
										{header}
									</th>
								))}
								<th className="border border-gray-400 px-3 py-2 text-center font-medium text-gray-800">ИТОГО</th>
							</tr>
						</thead>
						<tbody>
							{projectIndicators.indicators.map((indicator, index) => (
								<tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
									<td className="border border-gray-400 px-3 py-2 text-center font-medium text-gray-700">
										{index + 1}
									</td>
									<td className="border border-gray-400 px-3 py-2 font-medium text-gray-700">
										{getIndicatorName(indicator, index)}
									</td>
									{/* Показываем все колонки секций */}
									{sectionHeaders.map((_, sectionIndex) => (
										<td key={sectionIndex} className="border border-gray-400 px-3 py-2 text-center text-gray-700">
											{indicator.section[sectionIndex] ? formatValue(indicator.section[sectionIndex].value) : '-'}
										</td>
									))}
									<td className="border border-gray-400 px-3 py-2 text-center font-medium bg-gray-200 text-gray-800">
										{formatValue(indicator.sum)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};
