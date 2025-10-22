import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

interface FormData {
	projectName: string;
	residentalComplex: string;
	city: string;
	fullAddress: string;
	startDate: string;
	endDate: string;
	status: string;
	dataSource: string;
}

interface BasicInfoSectionProps {
	formData: FormData;
	onInputChange: (field: string, value: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, onInputChange }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Основная информация</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="text-sm font-medium">Название проекта *</label>
						<Input
							value={formData.projectName}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('projectName', e.target.value)}
							placeholder="ЖК Солнечный"
							required
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Жилой комплекс *</label>
						<Input
							value={formData.residentalComplex}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('residentalComplex', e.target.value)}
							placeholder="Солнечный"
							required
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Город *</label>
						<Input
							value={formData.city}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('city', e.target.value)}
							placeholder="Ижевск"
							required
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Полный адрес *</label>
						<Input
							value={formData.fullAddress}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('fullAddress', e.target.value)}
							placeholder="г. Ижевск, ул. Солнечная, д. 45"
							required
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Дата начала</label>
						<Input
							type="date"
							value={formData.startDate}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('startDate', e.target.value)}
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Дата окончания</label>
						<Input
							type="date"
							value={formData.endDate}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('endDate', e.target.value)}
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Статус</label>
						<select
							value={formData.status}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onInputChange('status', e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="В процессе">В процессе</option>
							<option value="Сдан">Сдан</option>
							<option value="Приостановлен">Приостановлен</option>
						</select>
					</div>
					<div>
						<label className="text-sm font-medium">Источник данных</label>
						<Input
							value={formData.dataSource}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('dataSource', e.target.value)}
							placeholder="https://example.com"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
