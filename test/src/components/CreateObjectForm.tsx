import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus } from 'lucide-react';
import { useCreateObjectForm } from '../hooks/useCreateObjectForm';
import { useExcelData } from '../hooks/useExcelData';
import { BasicInfoSection } from './form-sections/BasicInfoSection';
import { AreaSection } from './form-sections/AreaSection';
import { MetricsSection } from './form-sections/MetricsSection';
import { ProjectIndicatorsSection } from './form-sections/ProjectIndicatorsSection';
import { ResponsiblePersonsSection } from './form-sections/ResponsiblePersonsSection';
import { RelatedProjectsSection } from './form-sections/RelatedProjectsSection';

interface CreateObjectFormProps {
	// onSubmit будет добавлен когда функционал будет готов
}

export const CreateObjectForm: React.FC<CreateObjectFormProps> = () => {
	const {
		// State
		isOpen,
		formData,
		responsiblePersons,
		relatedProjects,
		projectIndicators,
		newPerson,
		newProject,
		newIndicator,
		editingIndicator,
		editingIndicatorData,
		selectedPersonFromExcel,
		
		// Actions
		setIsOpen,
		handleInputChange,
		addResponsiblePerson,
		removeResponsiblePerson,
		addPersonFromExcel,
		setSelectedPersonFromExcel,
		addRelatedProject,
		removeRelatedProject,
		addIndicatorSection,
		updateIndicatorSection,
		removeIndicatorSection,
		addProjectIndicator,
		removeProjectIndicator,
		startEditingIndicator,
		updateEditingIndicatorSection,
		addEditingIndicatorSection,
		removeEditingIndicatorSection,
		saveEditingIndicator,
		cancelEditingIndicator,
		
		// Setters
		setNewPerson,
		setNewProject,
	} = useCreateObjectForm();

	// Excel данные
	const { people: peopleFromExcel, isLoading: excelLoading, error: excelError, reloadData } = useExcelData();

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		// Показываем предупреждение о разработке
		alert('Функционал создания объектов находится в разработке. Скоро будет доступен!');
		
		// Не вызываем handleSubmit, чтобы ничего не происходило
		// handleSubmit(onSubmit);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
					<Plus className="h-4 w-4" />
					Создать объект (в разработке)
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-orange-500 font-semibold">Создание нового строительного объекта</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={handleFormSubmit} className="space-y-6">
					{/* Основная информация */}
					<BasicInfoSection 
						formData={{
							projectName: formData.projectName,
							residentalComplex: formData.residentalComplex,
							city: formData.city,
							fullAddress: formData.fullAddress,
							startDate: formData.startDate,
							endDate: formData.endDate,
							status: formData.status,
							dataSource: formData.dataSource,
						}}
						onInputChange={handleInputChange}
					/>

					{/* Площади */}
					<AreaSection 
						areaData={{
							totalArea: formData.totalArea,
							residentialArea: formData.residentialArea,
							commercialArea: formData.commercialArea,
						}}
						onInputChange={handleInputChange}
					/>

					{/* Показатели */}
					<MetricsSection 
						metricsData={{
							promotionsCount: formData.promotionsCount,
							apartmentsCount: formData.apartmentsCount,
							residentsCount: formData.residentsCount,
						}}
						onInputChange={handleInputChange}
					/>

					{/* Показатели проекта */}
					<ProjectIndicatorsSection
						projectIndicators={projectIndicators}
						editingIndicator={editingIndicator}
						editingIndicatorData={editingIndicatorData}
						newIndicator={newIndicator}
						onStartEditing={startEditingIndicator}
						onUpdateEditingSection={updateEditingIndicatorSection}
						onAddEditingSection={addEditingIndicatorSection}
						onRemoveEditingSection={removeEditingIndicatorSection}
						onSaveEditing={saveEditingIndicator}
						onCancelEditing={cancelEditingIndicator}
						onRemoveIndicator={removeProjectIndicator}
						onUpdateNewSection={updateIndicatorSection}
						onAddNewSection={addIndicatorSection}
						onRemoveNewSection={removeIndicatorSection}
						onAddIndicator={addProjectIndicator}
					/>

					{/* Ответственные лица */}
					<ResponsiblePersonsSection
						responsiblePersons={responsiblePersons}
						newPerson={newPerson}
						peopleFromExcel={peopleFromExcel}
						selectedPersonFromExcel={selectedPersonFromExcel}
						onAddPerson={addResponsiblePerson}
						onRemovePerson={removeResponsiblePerson}
						onUpdateNewPerson={(field, value) => setNewPerson(prev => ({ ...prev, [field]: value }))}
						onSelectPersonFromExcel={setSelectedPersonFromExcel}
						onAddPersonFromExcel={addPersonFromExcel}
						excelLoading={excelLoading}
						excelError={excelError}
						onReloadExcelData={reloadData}
					/>

					{/* Связанные проекты */}
					<RelatedProjectsSection
						relatedProjects={relatedProjects}
						newProject={newProject}
						onAddProject={addRelatedProject}
						onRemoveProject={removeRelatedProject}
						onUpdateNewProject={setNewProject}
					/>

					{/* Кнопки */}
					<div className="flex justify-end gap-3">
						<Button 
							type="button" 
							variant="outline" 
							onClick={() => setIsOpen(false)}
							className="hover:bg-secondary transition-colors duration-200"
						>
							Отмена
						</Button>
						<Button 
							type="submit"
							className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
						>
							Создать объект (в разработке)
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};