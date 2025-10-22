import React from 'react';
import type { ConstructionObject } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Calendar, CalendarCheck } from 'lucide-react';
import { STYLES } from '../../constants';

interface BasicInfoProps {
	object: ConstructionObject;
}

export const ObjectBasicInfo: React.FC<BasicInfoProps> = ({ object }) => {
	// Форматируем даты
	const formatDate = (dateString: string) => {
		if (!dateString) return 'Не указано';
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('ru-RU', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return dateString;
		}
	};

	return (
		<Card className="bg-gray-200/50 border-gray-300/70">
			<CardHeader className="bg-gray-300/60 border-b border-gray-400/70">
				<CardTitle className="text-gray-900">Основная информация</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 bg-white">
				{/* Адрес */}
				<div className="flex items-start gap-3">
					<MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
					<div className="flex-1">
						<h3 className="font-semibold text-sm text-muted-foreground mb-1">Адрес</h3>
						<p className="text-base">{object.fullAddress}</p>
					</div>
				</div>

				{/* Статус */}
				<div className="flex items-center gap-3">
					<div className="flex-1">
						<h3 className="font-semibold text-sm text-muted-foreground mb-2">Статус</h3>
						<Badge className={`${object.status === 'Сдан' ? STYLES.COLORS.SUCCESS : STYLES.COLORS.SECONDARY}`}>
							{object.status}
						</Badge>
					</div>
				</div>

				{/* Даты строительства */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex items-start gap-3">
						<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div className="flex-1">
							<h3 className="font-semibold text-sm text-muted-foreground mb-1">Начало строительства</h3>
							<p className="text-base">{formatDate(object.startDate)}</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<CalendarCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div className="flex-1">
							<h3 className="font-semibold text-sm text-muted-foreground mb-1">Окончание строительства</h3>
							<p className="text-base">{formatDate(object.endDate)}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
