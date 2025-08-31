import { Badge } from '@/components/ui/badge';
import {
	KanbanProvider,
	KanbanBoard,
	KanbanHeader,
	KanbanCards,
	KanbanCard,
} from '@/components/ui/shadcn-io/kanban';
import { MissionKanbanCard } from './missions-kanban-card';
import { EmptyMissionColumn } from './empty-missions-column';
import { MissionModel } from '@/models/mission-schema';

type MissionKanbanItem = {
	id: string;
	name: string;
	column: string;
	data: MissionModel;
};

interface MissionKanbanViewProps {
	columns: Array<{
		id: string;
		name: string;
		count: number;
		color: string;
		bgColor: string;
		borderColor: string;
	}>;
	missions: MissionKanbanItem[];
	onMissionsChange: (missions: MissionKanbanItem[]) => void;
}

export function MissionKanbanView({ columns, missions, onMissionsChange }: MissionKanbanViewProps) {
	return (
		<div className="h-[calc(100vh-400px)] min-h-[600px] overflow-hidden">
			<KanbanProvider
				columns={columns}
				data={missions}
				onDataChange={onMissionsChange}
				className="h-full"
			>
				{(column) => {
					const columnData = missions.filter(
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
								<EmptyMissionColumn />
							) : (
								<KanbanCards id={column.id}>
									{(item) => {
										const mission = item.data as MissionModel;
										return (
											<KanbanCard
												key={item.id}
												id={item.id}
												name={item.name}
												column={item.column}
												className="bg-transparent border-0 shadow-none p-0"
											>
												<MissionKanbanCard mission={mission} />
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
