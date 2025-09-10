"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type { getProjectAction } from '@/actions/project/get-project-action';

interface UpdateProjectHeaderProps {
	project: Awaited<ReturnType<typeof getProjectAction>>;
	isPending: boolean;
}

export default function UpdateProjectHeader({ project, isPending }: UpdateProjectHeaderProps) {
	const router = useRouter();

	return (
		<div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-7xl px-6">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.back()}
							className="gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Retour
						</Button>
						<div>
							<h1 className="text-lg font-semibold">
								Modifier le projet
							</h1>
							<p className="text-sm text-muted-foreground">
								{project.title} • {project.company.name}
							</p>
						</div>
					</div>
					<Button
						type="submit"
						form="project-form"
						disabled={isPending}
						className="gap-2"
					>
						<Save className="h-4 w-4" />
						{isPending ? "Enregistrement..." : "Enregistrer les modifications"}
					</Button>
				</div>
			</div>
		</div>
	);
}
