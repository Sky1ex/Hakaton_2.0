import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText, Users, Link, BarChart3 } from 'lucide-react';

interface EmptyStateProps {
	type: 'basic-info' | 'indicators' | 'responsible-persons' | 'external-resources';
}

const getEmptyStateConfig = (type: EmptyStateProps['type']) => {
	switch (type) {
		case 'basic-info':
			return {
				icon: BarChart3,
				title: 'Основная информация',
				message: 'Данные о площадях и показателях отсутствуют'
			};
		case 'indicators':
			return {
				icon: BarChart3,
				title: 'Показатели проекта',
				message: 'Детальные показатели проекта не найдены'
			};
		case 'responsible-persons':
			return {
				icon: Users,
				title: 'Ответственные лица',
				message: 'Информация об ответственных лицах отсутствует'
			};
		case 'external-resources':
			return {
				icon: Link,
				title: 'Внешние ресурсы',
				message: 'Документы и ссылки отсутствуют'
			};
		default:
			return {
				icon: FileText,
				title: 'Данные отсутствуют',
				message: 'Информация недоступна'
			};
	}
};

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
	const config = getEmptyStateConfig(type);
	const IconComponent = config.icon;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconComponent className="h-5 w-5 text-muted-foreground" />
					{config.title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-center py-6">
					<IconComponent className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
					<p className="text-sm text-muted-foreground">
						{config.message}
					</p>
				</div>
			</CardContent>
		</Card>
	);
};
