import { useState } from 'react';
import type { ConstructionObject, ResponsiblePerson, Indicator } from '../types';
import type { PersonFromExcel } from '../utils/excelParser';

interface FormData {
	projectName: string;
	residentalComplex: string;
	city: string;
	fullAddress: string;
	startDate: string;
	endDate: string;
	status: string;
	dataSource: string;
	totalArea: string;
	residentialArea: string;
	commercialArea: string;
	promotionsCount: string;
	apartmentsCount: string;
	residentsCount: string;
}

interface NewPerson {
	role: string;
	name: string;
	phone: string;
	email: string;
}

interface NewIndicator {
	sum: string;
	sections: { name: string; value: string; unit: string }[];
}

interface EditingIndicatorData {
	sum: string;
	sections: { name: string; value: string; unit: string }[];
}

export const useCreateObjectForm = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		projectName: '',
		residentalComplex: '',
		city: '',
		fullAddress: '',
		startDate: '',
		endDate: '',
		status: 'В процессе',
		dataSource: '',
		totalArea: '',
		residentialArea: '',
		commercialArea: '',
		promotionsCount: '',
		apartmentsCount: '',
		residentsCount: '',
	});

	const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePerson[]>([]);
	const [relatedProjects, setRelatedProjects] = useState<string[]>([]);
	const [projectIndicators, setProjectIndicators] = useState<Indicator[]>([]);
	const [newPerson, setNewPerson] = useState<NewPerson>({ role: '', name: '', phone: '', email: '' });
	const [newProject, setNewProject] = useState('');
	const [newIndicator, setNewIndicator] = useState<NewIndicator>({ 
		sum: '', 
		sections: [{ name: '', value: '', unit: '' }] 
	});
	const [editingIndicator, setEditingIndicator] = useState<number | null>(null);
	const [editingIndicatorData, setEditingIndicatorData] = useState<EditingIndicatorData>({ 
		sum: '', 
		sections: [{ name: '', value: '', unit: '' }]
	});
	
	// Excel данные
	const [selectedPersonFromExcel, setSelectedPersonFromExcel] = useState<PersonFromExcel | null>(null);

	const calculateSum = (sections: { name: string; value: string; unit: string }[]) => {
		return sections
			.filter(s => s.value && !isNaN(parseFloat(s.value)))
			.reduce((sum, section) => sum + parseFloat(section.value), 0);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const addResponsiblePerson = () => {
		if (newPerson.name && newPerson.role) {
			setResponsiblePersons(prev => [...prev, { ...newPerson }]);
			setNewPerson({ role: '', name: '', phone: '', email: '' });
		}
	};

	const removeResponsiblePerson = (index: number) => {
		setResponsiblePersons(prev => prev.filter((_, i) => i !== index));
	};

	// Функции для работы с Excel данными
	const addPersonFromExcel = () => {
		if (selectedPersonFromExcel) {
			const person: ResponsiblePerson = {
				role: selectedPersonFromExcel.role || 'Не указано',
				name: selectedPersonFromExcel.name,
				phone: selectedPersonFromExcel.phone,
				email: selectedPersonFromExcel.email,
			};
			setResponsiblePersons(prev => [...prev, person]);
			setSelectedPersonFromExcel(null);
		}
	};

	const addRelatedProject = () => {
		if (newProject.trim()) {
			setRelatedProjects(prev => [...prev, newProject.trim()]);
			setNewProject('');
		}
	};

	const removeRelatedProject = (index: number) => {
		setRelatedProjects(prev => prev.filter((_, i) => i !== index));
	};

	const addIndicatorSection = () => {
		setNewIndicator(prev => {
			const updatedSections = [...prev.sections, { name: '', value: '', unit: '' }];
			const calculatedSum = calculateSum(updatedSections);
			return {
				...prev,
				sections: updatedSections,
				sum: calculatedSum.toString()
			};
		});
	};

	const updateIndicatorSection = (sectionIndex: number, field: string, value: string) => {
		setNewIndicator(prev => {
			const updatedSections = prev.sections.map((section, index) => 
				index === sectionIndex ? { ...section, [field]: value } : section
			);
			const calculatedSum = calculateSum(updatedSections);
			return {
				...prev,
				sections: updatedSections,
				sum: calculatedSum.toString()
			};
		});
	};

	const removeIndicatorSection = (sectionIndex: number) => {
		setNewIndicator(prev => {
			const updatedSections = prev.sections.filter((_, index) => index !== sectionIndex);
			const calculatedSum = calculateSum(updatedSections);
			return {
				...prev,
				sections: updatedSections,
				sum: calculatedSum.toString()
			};
		});
	};

	const addProjectIndicator = () => {
		if (newIndicator.sections.some(s => s.name && s.value && s.unit)) {
			const calculatedSum = calculateSum(newIndicator.sections);
			const indicator: Indicator = {
				sum: calculatedSum,
				section: newIndicator.sections
					.filter(s => s.name && s.value && s.unit)
					.map(s => ({
						name: s.name,
						value: parseFloat(s.value),
						unit: s.unit
					}))
			};
			setProjectIndicators(prev => [...prev, indicator]);
			setNewIndicator({ sum: '', sections: [{ name: '', value: '', unit: '' }] });
		}
	};

	const removeProjectIndicator = (index: number) => {
		setProjectIndicators(prev => prev.filter((_, i) => i !== index));
	};

	const startEditingIndicator = (index: number) => {
		const indicator = projectIndicators[index];
		setEditingIndicator(index);
		setEditingIndicatorData({
			sum: indicator.sum.toString(),
			sections: indicator.section.map(s => ({
				name: s.name,
				value: s.value.toString(),
				unit: s.unit
			}))
		});
	};

	const updateEditingIndicatorSection = (sectionIndex: number, field: string, value: string) => {
		setEditingIndicatorData(prev => {
			const updatedSections = prev.sections.map((section, index) => 
				index === sectionIndex ? { ...section, [field]: value } : section
			);
			const calculatedSum = calculateSum(updatedSections);
			return {
				...prev,
				sections: updatedSections,
				sum: calculatedSum.toString()
			};
		});
	};

	const addEditingIndicatorSection = () => {
		setEditingIndicatorData(prev => {
			const updatedSections = [...prev.sections, { name: '', value: '', unit: '' }];
			const calculatedSum = calculateSum(updatedSections);
			return {
				...prev,
				sections: updatedSections,
				sum: calculatedSum.toString()
			};
		});
	};

	const removeEditingIndicatorSection = (sectionIndex: number) => {
		setEditingIndicatorData(prev => {
			const updatedSections = prev.sections.filter((_, index) => index !== sectionIndex);
			const calculatedSum = calculateSum(updatedSections);
			return {
				...prev,
				sections: updatedSections,
				sum: calculatedSum.toString()
			};
		});
	};

	const saveEditingIndicator = () => {
		if (editingIndicator !== null && editingIndicatorData.sections.some(s => s.name && s.value && s.unit)) {
			const calculatedSum = calculateSum(editingIndicatorData.sections);
			const updatedIndicator: Indicator = {
				sum: calculatedSum,
				section: editingIndicatorData.sections
					.filter(s => s.name && s.value && s.unit)
					.map(s => ({
						name: s.name,
						value: parseFloat(s.value),
						unit: s.unit
					}))
			};
			setProjectIndicators(prev => prev.map((indicator, index) => 
				index === editingIndicator ? updatedIndicator : indicator
			));
			setEditingIndicator(null);
			setEditingIndicatorData({ sum: '', sections: [{ name: '', value: '', unit: '' }] });
		}
	};

	const cancelEditingIndicator = () => {
		setEditingIndicator(null);
		setEditingIndicatorData({ sum: '', sections: [{ name: '', value: '', unit: '' }] });
	};

	const createObject = (): ConstructionObject => {
		return {
			id: Date.now(),
			projectName: formData.projectName,
			residentalComplex: formData.residentalComplex,
			city: formData.city,
			fullAddress: formData.fullAddress,
			startDate: formData.startDate,
			endDate: formData.endDate,
			lastUpdate: new Date().toISOString().split('T')[0],
			status: formData.status,
			area: {
				total: parseFloat(formData.totalArea) || 0,
				residential: parseFloat(formData.residentialArea) || 0,
				commercial: parseFloat(formData.commercialArea) || 0,
			},
			metrics: {
				promotionsCount: parseInt(formData.promotionsCount) || 0,
				apartmentsCount: parseInt(formData.apartmentsCount) || 0,
				residentsCount: parseInt(formData.residentsCount) || 0,
			},
			projectIndicators: {
				size: projectIndicators.length,
				indicators: projectIndicators
			},
			responsiblePersons,
			relatedProjects,
			documentLinks: [],
		};
	};
	
	const resetForm = () => {
		setFormData({
			projectName: '',
			residentalComplex: '',
			city: '',
			fullAddress: '',
			startDate: '',
			endDate: '',
			status: 'В процессе',
			dataSource: '',
			totalArea: '',
			residentialArea: '',
			commercialArea: '',
			promotionsCount: '',
			apartmentsCount: '',
			residentsCount: '',
		});
		setResponsiblePersons([]);
		setRelatedProjects([]);
		setProjectIndicators([]);
		setNewPerson({ role: '', name: '', phone: '', email: '' });
		setNewProject('');
		setNewIndicator({ sum: '', sections: [{ name: '', value: '', unit: '' }] });
		setEditingIndicator(null);
		setEditingIndicatorData({ sum: '', sections: [{ name: '', value: '', unit: '' }] });
	};

	const handleSubmit = (onSubmit: (object: ConstructionObject) => void) => {
		const newObject = createObject();
		onSubmit(newObject);
		setIsOpen(false);
		resetForm();
	};

	return {
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
		handleSubmit,
		resetForm,
		
		// Setters for new items
		setNewPerson,
		setNewProject,
	};
};
