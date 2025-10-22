import React from 'react';
import type { Indicator } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, X } from 'lucide-react';

interface ProjectIndicatorsSectionProps {
	projectIndicators: Indicator[];
	editingIndicator: number | null;
	editingIndicatorData: { sum: string; sections: { name: string; value: string; unit: string }[] };
	newIndicator: { sum: string; sections: { name: string; value: string; unit: string }[] };
	onStartEditing: (index: number) => void;
	onUpdateEditingSection: (sectionIndex: number, field: string, value: string) => void;
	onAddEditingSection: () => void;
	onRemoveEditingSection: (sectionIndex: number) => void;
	onSaveEditing: () => void;
	onCancelEditing: () => void;
	onRemoveIndicator: (index: number) => void;
	onUpdateNewSection: (sectionIndex: number, field: string, value: string) => void;
	onAddNewSection: () => void;
	onRemoveNewSection: (sectionIndex: number) => void;
	onAddIndicator: () => void;
}

export const ProjectIndicatorsSection: React.FC<ProjectIndicatorsSectionProps> = ({
	projectIndicators,
	editingIndicator,
	editingIndicatorData,
	newIndicator,
	onStartEditing,
	onUpdateEditingSection,
	onAddEditingSection,
	onRemoveEditingSection,
	onSaveEditing,
	onCancelEditing,
	onRemoveIndicator,
	onUpdateNewSection,
	onAddNewSection,
	onRemoveNewSection,
	onAddIndicator,
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Показатели проекта</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Существующие показатели */}
				<div className="space-y-3">
					{projectIndicators.map((indicator, index) => (
						<div key={index} className="border rounded-lg p-3">
							{editingIndicator === index ? (
								/* Режим редактирования */
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<div className="font-medium">Редактирование показателя #{index + 1}</div>
										<div className="flex gap-2">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={onCancelEditing}
											>
												Отмена
											</Button>
											<Button
												type="button"
												size="sm"
												onClick={onSaveEditing}
											>
												Сохранить
											</Button>
										</div>
									</div>
									
									{/* Сумма показателя */}
									<div>
										<label className="text-sm font-medium">Сумма показателя (рассчитывается автоматически)</label>
										<Input
											type="number"
											step="0.01"
											value={editingIndicatorData.sum}
											readOnly
											placeholder="0"
											className="bg-gray-50"
										/>
									</div>

									{/* Секции показателя */}
									<div className="space-y-2">
										<label className="text-sm font-medium">Секции показателя</label>
										{editingIndicatorData.sections.map((section, sectionIndex) => (
											<div key={sectionIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2">
												<Input
													placeholder="Название секции"
													value={section.name}
													onChange={(e) => onUpdateEditingSection(sectionIndex, 'name', e.target.value)}
												/>
												<Input
													type="number"
													step="0.01"
													placeholder="Значение"
													value={section.value}
													onChange={(e) => onUpdateEditingSection(sectionIndex, 'value', e.target.value)}
												/>
												<Input
													placeholder="Единица измерения"
													value={section.unit}
													onChange={(e) => onUpdateEditingSection(sectionIndex, 'unit', e.target.value)}
												/>
												<div className="flex gap-1">
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={onAddEditingSection}
													>
														<Plus className="h-4 w-4" />
													</Button>
													{editingIndicatorData.sections.length > 1 && (
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => onRemoveEditingSection(sectionIndex)}
														>
															<X className="h-4 w-4" />
														</Button>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							) : (
								/* Режим просмотра */
								<div>
									<div className="flex justify-between items-start mb-2">
										<div className="font-medium">Показатель #{index + 1}</div>
										<div className="flex gap-1">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => onStartEditing(index)}
											>
												Редактировать
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => onRemoveIndicator(index)}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									</div>
									<div className="text-sm text-gray-600 mb-2">
										Сумма: {indicator.sum}
									</div>
									<div className="space-y-1">
										{indicator.section.map((section, sectionIndex) => (
											<div key={sectionIndex} className="text-sm">
												{section.name}: {section.value} {section.unit}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Добавление нового показателя */}
				<div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
					<h4 className="font-medium mb-3">Добавить новый показатель</h4>
					
					{/* Сумма показателя */}
					<div className="mb-3">
						<label className="text-sm font-medium">Сумма показателя (рассчитывается автоматически)</label>
						<Input
							type="number"
							step="0.01"
							value={newIndicator.sum}
							readOnly
							placeholder="0"
							className="bg-gray-50"
						/>
					</div>

					{/* Секции показателя */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Секции показателя</label>
						{newIndicator.sections.map((section, sectionIndex) => (
							<div key={sectionIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2">
								<Input
									placeholder="Название секции"
									value={section.name}
									onChange={(e) => onUpdateNewSection(sectionIndex, 'name', e.target.value)}
								/>
								<Input
									type="number"
									step="0.01"
									placeholder="Значение"
									value={section.value}
									onChange={(e) => onUpdateNewSection(sectionIndex, 'value', e.target.value)}
								/>
								<Input
									placeholder="Единица измерения"
									value={section.unit}
									onChange={(e) => onUpdateNewSection(sectionIndex, 'unit', e.target.value)}
								/>
								<div className="flex gap-1">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={onAddNewSection}
									>
										<Plus className="h-4 w-4" />
									</Button>
									{newIndicator.sections.length > 1 && (
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => onRemoveNewSection(sectionIndex)}
										>
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
							</div>
						))}
					</div>

					<Button type="button" onClick={onAddIndicator} className="mt-3">
						Добавить показатель
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
