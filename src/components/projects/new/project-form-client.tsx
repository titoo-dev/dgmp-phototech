"use client";

import * as React from 'react';
import { useTransition, useActionState, useEffect, useRef } from 'react';
import { createProjectAction } from '@/actions/project/create-project-action';
import { toast } from 'sonner';
import type { CompanyModel } from '@/models/company-schema';

import ProjectHeader from '@/components/projects/new/project-header';
import ProjectFormFields from '@/components/projects/new/project-form-fields';

interface ProjectFormClientProps {
	companies: CompanyModel[];
}

export default function ProjectFormClient({ companies }: ProjectFormClientProps) {
	const [state, formAction] = useActionState(createProjectAction, {});
	const [isPending, startTransition] = useTransition();
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.success) {
			toast.success('Projet créé avec succès', {
				description: 'Le projet a été ajouté à la base de données.',
				duration: 4000,
			});
			formRef.current?.reset();
		} else if (state.errors?._form) {
			toast.error('Erreur lors de la création', {
				description: state.errors._form[0],
				duration: 5000,
			});
		}
	}, [state.success, state.errors?._form]);

	const handleSubmit = (formData: FormData) => {
		startTransition(() => {
			formAction(formData);
		});
	};

	return (
		<>
			<ProjectHeader isPending={isPending} />
			<div className="mx-auto max-w-7xl px-6 py-8">
				<form id="project-form" ref={formRef} action={handleSubmit}>
					<ProjectFormFields state={state} companies={companies} />
				</form>
			</div>
		</>
	);
}
