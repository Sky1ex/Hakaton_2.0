import React from 'react';
import type { ConstructionObject } from '../types';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { ProjectIndicatorsTable } from './ProjectIndicatorsTable';
import { useObjectDetailsSidebar } from '../hooks/useObjectDetailsSidebar';
import { ObjectBasicInfo } from './sidebar-sections/ObjectBasicInfo';
import { 
	ResponsiblePersonsList, 
	ExternalResources 
} from './sidebar-sections/ObjectDetails';
import { EmptyState } from './sidebar-sections/EmptyState';

interface ObjectDetailsSidebarProps {
	object: ConstructionObject | null;
	isOpen: boolean;
	onClose: () => void;
}

export const ObjectDetailsSidebar: React.FC<ObjectDetailsSidebarProps> = ({ 
	object, 
	isOpen, 
	onClose 
}) => {
	const { handleResourceClick } = useObjectDetailsSidebar();

	if (!object) return null;

	return (
		<>
			{/* Sidebar */}
			<div className={`
				fixed top-[120px] right-0 h-[calc(100vh-120px)] w-full lg:w-[32rem] lg:max-w-[32rem] rounded-t-lg bg-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
				${isOpen ? 'translate-x-0' : 'translate-x-full'}
			`}>
				<div className="h-full flex flex-col">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b bg-gray-300 border-gray-400 rounded-t-lg">
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-gray-900">{object.projectName}</h2>
						</div>
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								size="sm"
								onClick={onClose}
								className="h-8 w-8 p-0 hover:bg-gray-400"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
						{/* Основная информация */}
						{object.projectIndicators && object.projectIndicators.indicators && object.projectIndicators.indicators.length > 0 ? (
							<ObjectBasicInfo object={object} />
						) : (
							<EmptyState type="basic-info" />
						)}

						{/* Показатели проекта */}
						{object.projectIndicators && object.projectIndicators.indicators && object.projectIndicators.indicators.length > 0 ? (
							<ProjectIndicatorsTable projectIndicators={object.projectIndicators} />
						) : (
							<EmptyState type="indicators" />
						)}

						{/* Ответственные лица */}
						{object.responsiblePersons && object.responsiblePersons.length > 0 ? (
							<ResponsiblePersonsList responsiblePersons={object.responsiblePersons} />
						) : (
							<EmptyState type="responsible-persons" />
						)}

						{/* Внешние ресурсы */}
						{object.documentLinks && object.documentLinks.length > 0 ? (
							<ExternalResources 
								documentLinks={object.documentLinks}
								onResourceClick={handleResourceClick} 
							/>
						) : (
							<EmptyState type="external-resources" />
						)}
					</div>
				</div>
			</div>
		</>
	);
};