"use client";

import * as React from 'react';
import { useState, useTransition, useEffect, useRef, useActionState } from 'react';
import { updateProjectAction } from '@/actions/project/update-project-action';
import { toast } from 'sonner';
import { ProjectModel } from '@/models/project-schema';
import type { CompanyModel } from '@/models/company-schema';
import UpdateProjectHeader from '@/components/projects/update/update-project-header';
import UpdateProjectInfoCard from '@/components/projects/update/update-project-info-card';
import type { getProjectAction } from '@/actions/project/get-project-action';
import { useRouter } from 'next/navigation';

interface UpdateProjectFormClientProps {
	project: Awaited<ReturnType<typeof getProjectAction>>;
	companies: CompanyModel[];
}

export default function UpdateProjectFormClient({ 
	project, 
	companies
}: UpdateProjectFormClientProps) {
	const [state, formAction] = useActionState(updateProjectAction, {});
	const [isPending, startTransition] = useTransition();
	const formRef = useRef<HTMLFormElement | null>(null);
	const router = useRouter();

	const [formData, setFormData] = useState<Partial<ProjectModel>>({
		title: project.title,
		description: project.description,
		startDate: project.startDate,
		endDate: project.endDate,
		status: project.status,
		nature: project.nature,
		companyId: project.companyId,
	});

	useEffect(() => {
		if (state.success) {
			toast.success('Projet mis à jour avec succès', {
				description: 'Les modifications ont été enregistrées.',
				duration: 4000,
			});
			router.push('/dashboard/projects');
		} else if (state.errors?._form) {
			toast.error('Erreur lors de la mise à jour', {
				description: state.errors._form[0],
				duration: 5000,
			});
		}
	}, [state.success, state.errors, router]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!formRef.current) return;

		const form = new FormData(formRef.current);
		
		// Add project ID
		form.set('id', project.id);

		console.log('Form data being submitted for project update:');
		for (const [key, value] of form.entries()) {
			console.log(key, value);
		}

		// Validate required fields
		const title = form.get('title');
		const description = form.get('description');
		const startDate = form.get('startDate');
		const endDate = form.get('endDate');
		const companyId = form.get('companyId');
		const nature = form.get('nature');
		const status = form.get('status');
		
		if (!title || !description || !startDate || !endDate || !companyId || !nature || !status) {
			toast.error('Champs requis manquants', {
				description: 'Veuillez remplir tous les champs obligatoires.',
				duration: 5000,
			});
			return;
		}

		startTransition(() => {
			formAction(form);
		});
	};

	return (
		<>
			<UpdateProjectHeader 
				project={project}
				isPending={isPending} 
			/>
			<div className="mx-auto max-w-7xl px-6 py-8">
				<form id="project-form" ref={formRef} onSubmit={handleSubmit}>
					<div className="grid gap-8 lg:grid-cols-1">
						<div className="space-y-6">
							<UpdateProjectInfoCard 
								project={project}
								formData={formData} 
								setFormData={setFormData}
								companies={companies}
								state={state}
							/>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
