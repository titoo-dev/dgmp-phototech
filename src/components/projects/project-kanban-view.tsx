import { Badge } from '@/components/ui/badge';
import {
	KanbanProvider,
	KanbanBoard,
	KanbanHeader,
	KanbanCards,
	KanbanCard,
} from '@/components/ui/shadcn-io/kanban';
import { ProjectKanbanCard } from './project-kanban-card';
import { EmptyKanbanColumn } from './empty-kanban-column';
import { ProjectModel } from '@/models/project-schema';

type ProjectKanbanItem = {
	id: string;
	name: string;
	column: ProjectModel['status'];
	data: ProjectModel;
};

interface ProjectKanbanViewProps {
	columns: Array<{
		id: string;
		name: string;
		count: number;
		color: string;
		bgColor: string;
		borderColor: string;
	}>;
	projects: ProjectKanbanItem[];
	onProjectsChange: (projects: ProjectKanbanItem[]) => void;
}

export function ProjectKanbanView({ columns, projects, onProjectsChange }: ProjectKanbanViewProps) {
	return (
		<div className="h-[calc(100vh-400px)] min-h-[600px] overflow-hidden">
			<KanbanProvider
				columns={columns}
				data={projects}
				onDataChange={onProjectsChange}
				className="h-full"
			>
				{(column) => {
					const columnData = projects.filter(
						(item) => item.column === column.id
					);
					const isEmpty = columnData.length === 0;

					return (
						<KanbanBoard
							key={column.id}
							id={column.id}
							className={`${column.bgColor} ${column.borderColor} flex-shrink-0`}
						>
							<KanbanHeader
								className={`${column.color} font-semibold border-b border-border/40`}
							>
								<div className="flex items-center justify-between">
									<span>{column.name}</span>
									<Badge variant="secondary" className="ml-2">
										{column.count}
									</Badge>
								</div>
							</KanbanHeader>
							{isEmpty ? (
								<EmptyKanbanColumn />
							) : (
								<KanbanCards id={column.id}>
									{(item) => {
										const projet = item.data as ProjectModel;
										return (
											<KanbanCard
												key={item.id}
												id={item.id}
												name={item.name}
												column={item.column}
												className="bg-transparent border-0 shadow-none p-0"
											>
												<ProjectKanbanCard projet={projet} />
											</KanbanCard>
										);
									}}
								</KanbanCards>
							)}
						</KanbanBoard>
					);
				}}
			</KanbanProvider>
		</div>
	);
}
