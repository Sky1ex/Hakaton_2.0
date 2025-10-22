import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

interface AreaData {
	totalArea: string;
	residentialArea: string;
	commercialArea: string;
}

interface AreaSectionProps {
	areaData: AreaData;
	onInputChange: (field: string, value: string) => void;
}

export const AreaSection: React.FC<AreaSectionProps> = ({ areaData, onInputChange }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Площади (м²)</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="text-sm font-medium">Общая площадь</label>
						<Input
							type="number"
							value={areaData.totalArea}
							onChange={(e) => onInputChange('totalArea', e.target.value)}
							placeholder="0"
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Жилая площадь</label>
						<Input
							type="number"
							value={areaData.residentialArea}
							onChange={(e) => onInputChange('residentialArea', e.target.value)}
							placeholder="0"
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Коммерческая площадь</label>
						<Input
							type="number"
							value={areaData.commercialArea}
							onChange={(e) => onInputChange('commercialArea', e.target.value)}
							placeholder="0"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
