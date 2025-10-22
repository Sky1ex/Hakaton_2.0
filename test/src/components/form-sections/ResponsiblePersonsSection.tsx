import React from 'react';
import type { ResponsiblePerson } from '../../types';
import type { PersonFromExcel } from '../../utils/excelParser';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PersonCombobox } from '../ui/person-combobox';
import { X, Plus } from 'lucide-react';

interface ResponsiblePersonsSectionProps {
	responsiblePersons: ResponsiblePerson[];
	newPerson: { role: string; name: string; phone: string; email: string };
	peopleFromExcel: PersonFromExcel[];
	selectedPersonFromExcel: PersonFromExcel | null;
	onAddPerson: () => void;
	onRemovePerson: (index: number) => void;
	onUpdateNewPerson: (field: string, value: string) => void;
	onSelectPersonFromExcel: (person: PersonFromExcel | null) => void;
	onAddPersonFromExcel: () => void;
	excelLoading?: boolean;
	excelError?: string | null;
	onReloadExcelData?: () => void;
}

export const ResponsiblePersonsSection: React.FC<ResponsiblePersonsSectionProps> = ({
	responsiblePersons,
	newPerson,
	peopleFromExcel,
	selectedPersonFromExcel,
	onAddPerson,
	onRemovePerson,
	onUpdateNewPerson,
	onSelectPersonFromExcel,
	onAddPersonFromExcel,
	excelLoading = false,
	excelError = null,
	onReloadExcelData,
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Ответственные лица</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Список уже добавленных людей */}
				<div className="space-y-2">
					{responsiblePersons.map((person, index) => (
						<div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<span className="font-medium">{person.name}</span>
									<span className="text-sm text-muted-foreground">- {person.role}</span>
								</div>
								{person.phone && (
									<span className="text-sm text-muted-foreground">{person.phone}</span>
								)}
								{person.email && (
									<span className="text-sm text-muted-foreground ml-2">{person.email}</span>
								)}
							</div>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onRemovePerson(index)}
								className="text-red-600 hover:text-red-700 hover:bg-red-50"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>

				{/* Добавление из Excel файла */}
				<div className="space-y-3 p-4 border-2 border-dashed border-border/50 rounded-lg bg-muted/30">
					<div className="flex items-center justify-between">
						<h4 className="font-medium text-foreground">Добавить из списка команд</h4>
						{onReloadExcelData && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onReloadExcelData}
								disabled={excelLoading}
								className="text-foreground border-border/50 hover:bg-muted/50"
							>
								{excelLoading ? 'Загрузка...' : 'Обновить'}
							</Button>
						)}
					</div>
					{excelError && (
						<div className="text-destructive text-sm bg-destructive/10 p-2 rounded">
							Ошибка загрузки данных: {excelError}
						</div>
					)}
					{excelLoading ? (
						<div className="text-muted-foreground text-sm bg-muted/30 p-2 rounded">
							Загрузка данных из Excel файла...
						</div>
					) : (
						<div className="flex gap-2">
							<div className="flex-1">
								<PersonCombobox
									people={peopleFromExcel}
									selectedPerson={selectedPersonFromExcel}
									onSelectPerson={onSelectPersonFromExcel}
									placeholder="Выберите человека из списка..."
									excludePeople={responsiblePersons.map(person => ({
										id: `existing_${person.name}`,
										name: person.name,
										role: person.role,
										department: '',
										phone: person.phone,
										email: person.email
									}))}
								/>
							</div>
							<Button 
								type="button" 
								onClick={onAddPersonFromExcel}
								disabled={!selectedPersonFromExcel}
								className="bg-primary hover:bg-primary/90 !text-black"
							>
								<Plus className="h-4 w-4 mr-1" />
								Добавить
							</Button>
						</div>
					)}
				</div>

				{/* Ручное добавление */}
				<div className="space-y-3 p-4 border-2 border-dashed border-border/50 rounded-lg bg-muted/30">
					<h4 className="font-medium text-foreground">Добавить вручную</h4>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
						<Input
							placeholder="Роль"
							value={newPerson.role}
							onChange={(e) => onUpdateNewPerson('role', e.target.value)}
						/>
						<Input
							placeholder="Имя"
							value={newPerson.name}
							onChange={(e) => onUpdateNewPerson('name', e.target.value)}
						/>
						<Input
							placeholder="Телефон"
							value={newPerson.phone}
							onChange={(e) => onUpdateNewPerson('phone', e.target.value)}
						/>
						<Button 
							type="button" 
							onClick={onAddPerson}
							disabled={!newPerson.name.trim() || !newPerson.role.trim()}
						>
							<Plus className="h-4 w-4 mr-1" />
							Добавить
						</Button>
					</div>
					<Input
						placeholder="Email (необязательно)"
						value={newPerson.email}
						onChange={(e) => onUpdateNewPerson('email', e.target.value)}
						className="md:col-span-2"
					/>
				</div>
			</CardContent>
		</Card>
	);
};
