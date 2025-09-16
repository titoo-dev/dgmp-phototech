"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpdateMissionHeaderProps {
	isPending: boolean;
}

export default function UpdateMissionHeader({ isPending }: UpdateMissionHeaderProps) {
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
					</div>
					<Button
						type="submit"
						form="mission-form"
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
