import React, { useState } from 'react';
import type { ConstructionObject } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Phone, ExternalLink, Mail, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { getResourceIcon } from '../../utils/dataUtils';

interface ResponsiblePersonsProps {
	responsiblePersons: ConstructionObject['responsiblePersons'];
}

export const ResponsiblePersonsList: React.FC<ResponsiblePersonsProps> = ({ responsiblePersons }) => {
	if (responsiblePersons.length === 0) return null;

	const [expandedPersons, setExpandedPersons] = useState<Set<number>>(new Set());

	const togglePerson = (index: number) => {
		const newExpanded = new Set(expandedPersons);
		if (newExpanded.has(index)) {
			newExpanded.delete(index);
		} else {
			newExpanded.add(index);
		}
		setExpandedPersons(newExpanded);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ответственные лица</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{responsiblePersons.map((person, index) => {
						const isExpanded = expandedPersons.has(index);
						const hasDetails = person.email || person.phone || person.comment;
						
						return (
							<div key={index} className="border rounded-lg p-3">
								<div 
									className={`flex items-center justify-between ${hasDetails ? 'cursor-pointer hover:bg-gray-50' : ''}`}
									onClick={hasDetails ? () => togglePerson(index) : undefined}
								>
									<div className="flex-1">
										<div className="font-medium">{person.name}</div>
										<div className="text-sm text-muted-foreground">{person.role}</div>
									</div>
									{hasDetails && (
										<div className="ml-2">
											{isExpanded ? (
												<ChevronDown className="h-4 w-4 text-muted-foreground" />
											) : (
												<ChevronRight className="h-4 w-4 text-muted-foreground" />
											)}
										</div>
									)}
								</div>
								
								{isExpanded && hasDetails && (
									<div className="mt-3 pt-3 border-t space-y-2">
										{person.email && (
											<div className="flex items-center gap-2 text-sm">
												<Mail className="h-3 w-3 text-muted-foreground" />
												<span className="text-blue-600">{person.email}</span>
											</div>
										)}
										{person.phone && (
											<div className="space-y-1">
												<div className="flex items-center gap-2 text-sm">
													<Phone className="h-3 w-3 text-muted-foreground" />
													<span>{person.phone}</span>
												</div>
												<div className="text-xs text-muted-foreground ml-5">
													Комментарий: Можно обратиться по вопросам...
												</div>
											</div>
										)}
										{person.comment && (
											<div className="flex items-start gap-2 text-sm">
												<MessageSquare className="h-3 w-3 text-muted-foreground mt-0.5" />
												<span className="text-muted-foreground">{person.comment}</span>
											</div>
										)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
};

interface RelatedProjectsProps {
	relatedProjects: ConstructionObject['relatedProjects'];
}

export const RelatedProjectsList: React.FC<RelatedProjectsProps> = ({ relatedProjects }) => {
	if (relatedProjects.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Связанные проекты</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-1">
					{relatedProjects.map((project, index) => (
						<div key={index} className="text-sm">{project}</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

interface ExternalResourcesProps {
	documentLinks: ConstructionObject['documentLinks'];
	onResourceClick: (url: string) => void;
}

export const ExternalResources: React.FC<ExternalResourcesProps> = ({ documentLinks, onResourceClick }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpanded = () => {
		setIsExpanded(prev => !prev);
	};

	const hasResources = documentLinks && documentLinks.length > 0;

	if (!hasResources) return null;

	return (
		<Card>
			<CardHeader>
				<div 
					className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -m-6 p-6 rounded-lg transition-colors"
					onClick={toggleExpanded}
				>
					<CardTitle>Внешние ресурсы</CardTitle>
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							{documentLinks.length} ссылок
						</span>
						{isExpanded ? (
							<ChevronDown className="h-4 w-4 text-muted-foreground" />
						) : (
							<ChevronRight className="h-4 w-4 text-muted-foreground" />
						)}
					</div>
				</div>
			</CardHeader>
			{isExpanded && (
				<CardContent>
					<div className="space-y-2">
						{/* Документальные ссылки */}
						{documentLinks.map((link, index) => (
							<Button
								key={index}
								variant="outline"
								className="w-full justify-start"
								onClick={() => onResourceClick(link.url)}
							>
								<span className="mr-2">{getResourceIcon(link.url)}</span>
								<span className="flex-1 text-left">{link.documentType}</span>
								<ExternalLink className="h-4 w-4 ml-2" />
							</Button>
						))}
					</div>
				</CardContent>
			)}
		</Card>
	);
};
