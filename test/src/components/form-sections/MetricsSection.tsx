import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

interface MetricsData {
	promotionsCount: string;
	apartmentsCount: string;
	residentsCount: string;
}

interface MetricsSectionProps {
	metricsData: MetricsData;
	onInputChange: (field: string, value: string) => void;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({ metricsData, onInputChange }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Показатели</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="text-sm font-medium">Количество акций</label>
						<Input
							type="number"
							value={metricsData.promotionsCount}
							onChange={(e) => onInputChange('promotionsCount', e.target.value)}
							placeholder="0"
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Количество квартир</label>
						<Input
							type="number"
							value={metricsData.apartmentsCount}
							onChange={(e) => onInputChange('apartmentsCount', e.target.value)}
							placeholder="0"
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Количество жителей</label>
						<Input
							type="number"
							value={metricsData.residentsCount}
							onChange={(e) => onInputChange('residentsCount', e.target.value)}
							placeholder="0"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
