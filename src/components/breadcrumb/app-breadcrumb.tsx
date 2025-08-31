'use client';
import { useSelectedLayoutSegments } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import { Fragment, useMemo } from 'react';

interface BreadcrumbSegment {
	label: string;
	href: string;
	isLast: boolean;
}

const segmentLabels: Record<string, string> = {
	dashboard: 'Tableau de bord',
	projects: 'Projets',
	reports: 'Rapports de mission',
	missions: 'Missions',
	companies: 'Entreprises',
	users: 'Utilisateurs',
	images: 'Images',
	settings: 'Paramètres',
	profile: 'Profil',
	admin: 'Administration',
	create: 'Créer',
	edit: 'Modifier',
	view: 'Voir',
	new: 'Nouveau',
};

function formatSegmentLabel(segment: string): string {
	// Check if we have a predefined label
	if (segmentLabels[segment]) {
		return segmentLabels[segment];
	}

	// If it's a UUID or ID-like string, return "Détails"
	if (
		/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
			segment
		)
	) {
		return 'Détails';
	}

	// If it's a number, return "Détails"
	if (/^\d+$/.test(segment)) {
		return 'Détails';
	}

	// Otherwise, capitalize first letter and replace dashes/underscores with spaces
	return segment
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

function buildBreadcrumbSegments(segments: string[]): BreadcrumbSegment[] {
	const breadcrumbSegments: BreadcrumbSegment[] = [];

	segments.forEach((segment, index) => {
		const href = '/' + segments.slice(0, index + 1).join('/');
		const isLast = index === segments.length - 1;

		breadcrumbSegments.push({
			label: formatSegmentLabel(segment),
			href,
			isLast,
		});
	});

	return breadcrumbSegments;
}

interface AppBreadcrumbProps {
	className?: string;
	showHome?: boolean;
	maxItems?: number;
}

export function AppBreadcrumb({
	className,
	showHome = true,
	maxItems = 5,
}: AppBreadcrumbProps) {
	const segments = useSelectedLayoutSegments();
	const breadcrumbSegments = useMemo(
		() => buildBreadcrumbSegments(segments),
		[segments]
	);

	// Don't show breadcrumb if we're on the home page
	if (segments.length === 0) {
		return null;
	}

	const shouldShowEllipsis = breadcrumbSegments.length > maxItems;
	const displaySegments = shouldShowEllipsis
		? [
				...breadcrumbSegments.slice(0, 1),
				...breadcrumbSegments.slice(-Math.max(maxItems - 2, 1)),
		  ]
		: breadcrumbSegments;

	return (
		<Breadcrumb className={className}>
			<BreadcrumbList>
				{showHome && (
					<>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									href="/"
									className="flex items-center gap-1.5"
								>
									<Home className="h-4 w-4" />
									<span className="sr-only">Accueil</span>
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				)}

				{shouldShowEllipsis && breadcrumbSegments.length > maxItems && (
					<>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href={displaySegments[0].href}>
									{displaySegments[0].label}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbEllipsis />
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				)}

				{(shouldShowEllipsis
					? displaySegments.slice(1)
					: displaySegments
				).map((segment) => (
					<Fragment key={segment.href}>
						<BreadcrumbItem>
							{segment.isLast ? (
								<BreadcrumbPage>{segment.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink asChild>
									<Link href={segment.href}>
										{segment.label}
									</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
						{!segment.isLast && <BreadcrumbSeparator />}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
