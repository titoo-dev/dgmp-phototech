import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ProjectStatusBadgeProps {
	status: string;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
	switch (status) {
		case 'uncontrolled':
			return (
				<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
					<Clock className="w-3 h-3 mr-1" />
					Non contrôlé
				</Badge>
			);
		case 'controlled_in_progress':
			return (
				<Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
					<Clock className="w-3 h-3 mr-1" />
					En cours
				</Badge>
			);
		case 'controlled_delivered':
			return (
				<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
					<CheckCircle className="w-3 h-3 mr-1" />
					Livré
				</Badge>
			);
		case 'controlled_other':
			return (
				<Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
					<AlertCircle className="w-3 h-3 mr-1" />
					Autre
				</Badge>
			);
		case 'disputed':
			return (
				<Badge className="bg-red-100 text-red-800 hover:bg-red-100">
					<AlertCircle className="w-3 h-3 mr-1" />
					En litige
				</Badge>
			);
		default:
			return <Badge variant="secondary">{status}</Badge>;
	}
}
