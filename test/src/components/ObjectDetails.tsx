import React from 'react';
import type { ConstructionObject } from '../types';
import { Button } from './ui/button';
import { ExternalLink, X } from 'lucide-react';
import { getResourceIcon, isWebResource } from '../utils/dataUtils';
import { ProjectIndicatorsTable } from './ProjectIndicatorsTable';
import { ObjectBasicInfo } from './sidebar-sections/ObjectBasicInfo';
import { ResponsiblePersonsList } from './sidebar-sections/ObjectDetails';
import { EmptyState } from './sidebar-sections/EmptyState';

interface ObjectDetailsProps {
	object: ConstructionObject | null;
	isOpen: boolean;
	onClose: () => void;
}

export const ObjectDetails: React.FC<ObjectDetailsProps> = ({ object, isOpen, onClose }) => {
	if (!object || !isOpen) return null;

	const handleResourceClick = (url: string) => {
		if (isWebResource(url)) {
			window.open(url, '_blank');
		}
	};

	return (
		<div className="lg:hidden fixed inset-0 z-50 w-screen h-screen bg-white overflow-hidden">
			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="flex-shrink-0 border-b bg-white/90 backdrop-blur-sm shadow-sm border-gray-200 px-6 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold">{object.projectName}</h1>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="h-8 w-8"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
				
				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">
					<div className="space-y-6">
						{/* Основная информация */}
						<ObjectBasicInfo object={object} />

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
							<div>
								<h3 className="font-semibold text-lg mb-3">Внешние ресурсы</h3>
								<div className="space-y-2">
									{object.documentLinks.map((link, index) => (
										<Button
											key={index}
											variant="outline"
											className="w-full justify-start"
											onClick={() => handleResourceClick(link.url)}
										>
											<span className="mr-2">{getResourceIcon(link.url)}</span>
											<span className="flex-1 text-left">{link.documentType}</span>
											<ExternalLink className="h-4 w-4 ml-2" />
										</Button>
									))}
								</div>
							</div>
						) : (
							<EmptyState type="external-resources" />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
