import { Button } from '@/components/ui/button';
import { Plus, Grid3X3, List } from 'lucide-react';
import Link from 'next/link';

interface ProjectHeaderProps {
	viewMode: 'kanban' | 'list';
	onViewModeChange: (mode: 'kanban' | 'list') => void;
}

export function ProjectHeader({ viewMode, onViewModeChange }: ProjectHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Marchés</h1>
				<p className="text-muted-foreground">
					Gérez et suivez tous les marchés d&apos;infrastructure
				</p>
			</div>
			<div className="flex items-center gap-2">
				<div className="flex items-center border rounded-lg p-1">
					<Button
						variant={viewMode === 'kanban' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => onViewModeChange('kanban')}
						className="h-8 px-3"
					>
						<Grid3X3 className="w-4 h-4 mr-1" />
						Kanban
					</Button>
					<Button
						variant={viewMode === 'list' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => onViewModeChange('list')}
						className="h-8 px-3"
					>
						<List className="w-4 h-4 mr-1" />
						Liste
					</Button>
				</div>
				<Button asChild>
					<Link href="/dashboard/projects/new">
						<Plus className="w-4 h-4" />
						Nouveau marché
					</Link>
				</Button>
			</div>
		</div>
	);
}
