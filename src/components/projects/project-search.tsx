'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProjectSearchProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export function ProjectSearch({ searchQuery, onSearchChange }: ProjectSearchProps) {
	return (
		<div className="relative flex-1 max-w-sm">
			<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				placeholder="Rechercher un projet..."
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				className="pl-8"
			/>
		</div>
	);
}
