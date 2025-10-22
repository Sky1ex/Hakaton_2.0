import React, { useRef } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search } from 'lucide-react';
import { RESIDENTIAL_COMPLEXES } from '../types';

interface SearchAndFilterProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	selectedCity: string;
	onCityChange: (city: string) => void;
	selectedResidentialComplex: string;
	onResidentialComplexChange: (residentialComplex: string) => void;
	cities: string[];
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
	searchQuery,
	onSearchChange,
	selectedCity,
	onCityChange,
	selectedResidentialComplex,
	onResidentialComplexChange,
	cities,
}) => {
	const searchInputRef = useRef<HTMLInputElement>(null);

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onSearchChange(value);
	};
	return (
		<div className="space-y-4 mb-6 p-4 bg-gray-200/60 rounded-lg border border-gray-300/70">
			{/* Поиск */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
				<Input
					ref={searchInputRef}
					placeholder="Поиск по названию, адресу, статусу, ответственным лицам..."
					value={searchQuery}
					onChange={handleSearchInputChange}
					className="pl-10 bg-white/90 backdrop-blur-sm border-gray-400/60 focus:border-primary/50 transition-colors duration-200"
				/>
			</div>

			{/* Фильтры */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="flex-1">
					<label className="text-sm font-medium mb-2 block text-gray-800">Город</label>
					<Select value={selectedCity} onValueChange={onCityChange}>
						<SelectTrigger className="bg-white/90 backdrop-blur-sm border-gray-400/60 focus:border-primary/50 transition-colors duration-200">
							<SelectValue placeholder="Выберите город" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Все города</SelectItem>
							{cities.map((city) => (
								<SelectItem key={city} value={city}>
									{city}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex-1">
					<label className="text-sm font-medium mb-2 block text-gray-800">Жилой комплекс</label>
					<Select
						value={selectedResidentialComplex}
						onValueChange={onResidentialComplexChange}
						disabled={!selectedCity || selectedCity === 'all'}
					>
						<SelectTrigger className="bg-white/90 backdrop-blur-sm border-gray-400/60 focus:border-primary/50 transition-colors duration-200">
							<SelectValue placeholder={!selectedCity || selectedCity === 'all' ? "Сначала выберите город" : "Выберите ЖК"} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Все ЖК</SelectItem>
							{RESIDENTIAL_COMPLEXES.map((residentialComplex) => (
								<SelectItem key={residentialComplex} value={residentialComplex}>
									{residentialComplex}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
};