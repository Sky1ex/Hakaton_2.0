import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X } from 'lucide-react';

interface RelatedProjectsSectionProps {
	relatedProjects: string[];
	newProject: string;
	onAddProject: () => void;
	onRemoveProject: (index: number) => void;
	onUpdateNewProject: (value: string) => void;
}

export const RelatedProjectsSection: React.FC<RelatedProjectsSectionProps> = ({
	relatedProjects,
	newProject,
	onAddProject,
	onRemoveProject,
	onUpdateNewProject,
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Связанные проекты</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					{relatedProjects.map((project, index) => (
						<div key={index} className="flex items-center gap-2 p-2 border rounded">
							<span className="flex-1">{project}</span>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onRemoveProject(index)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
				<div className="flex gap-2">
					<Input
						placeholder="Название проекта"
						value={newProject}
						onChange={(e) => onUpdateNewProject(e.target.value)}
					/>
					<Button type="button" onClick={onAddProject}>
						Добавить
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
