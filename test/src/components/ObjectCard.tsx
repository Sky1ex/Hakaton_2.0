import React from 'react';
import type { ConstructionObject } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Users, Home } from 'lucide-react';
import { extractDistrict } from '../utils/formatters';
import { STYLES } from '../constants';

interface ObjectCardHeaderProps {
	object: ConstructionObject;
}

export const ObjectCardHeader: React.FC<ObjectCardHeaderProps> = ({ object }) => {
	const district = extractDistrict(object.fullAddress);
	
	return (
		<CardHeader className="pb-3">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<CardTitle className="text-lg mb-1 text-orange-500 font-semibold">{object.projectName}</CardTitle>
					<CardDescription className="flex items-center gap-1">
						<MapPin className="h-4 w-4" />
						{object.city}, {district}
					</CardDescription>
				</div>
				<Badge className={`${object.status === 'Сдан' ? STYLES.COLORS.SUCCESS : STYLES.COLORS.SECONDARY}`}>
					{object.status}
				</Badge>
			</div>
		</CardHeader>
	);
};

interface ObjectCardContentProps {
	object: ConstructionObject;
}

export const ObjectCardContent: React.FC<ObjectCardContentProps> = ({ object }) => {
	return (
		<CardContent className="pt-0">
			<div className="grid grid-cols-2 gap-4 text-sm">
				<div className="flex items-center gap-2">
					<Calendar className="h-4 w-4 text-muted-foreground" />
					<span className="text-muted-foreground">Начало:</span>
					<span className="font-medium text-orange-500">{object.startDate}</span>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="h-4 w-4 text-muted-foreground" />
					<span className="text-muted-foreground">Конец:</span>
					<span className="font-medium text-orange-500">{object.endDate}</span>
				</div>
				{object.metrics.apartmentsCount > 0 && (
					<div className="flex items-center gap-2">
						<Home className="h-4 w-4 text-muted-foreground" />
						<span className="text-muted-foreground">Квартир:</span>
						<span className="font-medium text-orange-500">{object.metrics.apartmentsCount}</span>
					</div>
				)}
				{object.metrics.residentsCount > 0 && (
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-muted-foreground" />
						<span className="text-muted-foreground">Жителей:</span>
						<span className="font-medium text-orange-500">{object.metrics.residentsCount}</span>
					</div>
				)}
			</div>
		</CardContent>
	);
};

interface ObjectCardProps {
	object: ConstructionObject;
	onClick: () => void;
}

export const ObjectCard: React.FC<ObjectCardProps> = ({ object, onClick }) => {
	return (
		<Card
			className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 bg-gray-200/40 backdrop-blur-sm border-gray-300/60"
			onClick={onClick}
		>
			<ObjectCardHeader object={object} />
			<ObjectCardContent object={object} />
		</Card>
	);
};