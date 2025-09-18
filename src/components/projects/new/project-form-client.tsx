"use client";

import * as React from 'react';
import { useTransition, useActionState, useEffect, useRef, useCallback } from 'react';
import { createProjectAction } from '@/actions/project/create-project-action';
import { toast } from 'sonner';
import type { CompanyModel } from '@/models/company-schema';

import ProjectHeader from '@/components/projects/new/project-header';
import ProjectFormFields from '@/components/projects/new/project-form-fields';

interface ProjectFormClientProps {
	companies: CompanyModel[];
}

const STORAGE_KEY = 'project-form-draft';

type FormDraftData = {
	title: string;
	startDate: string;
	endDate: string;
	companyId: string;
	description: string;
	nature: string;
	status: string;
};

export default function ProjectFormClient({ companies }: ProjectFormClientProps) {
	const [state, formAction] = useActionState(createProjectAction, {});
	const [isPending, startTransition] = useTransition();
	const formRef = useRef<HTMLFormElement>(null);
	const [formData, setFormData] = React.useState<FormDraftData>({
		title: '',
		startDate: '',
		endDate: '',
		companyId: '',
		description: '',
		nature: '',
		status: '',
	});

	// Load data from localStorage on mount
	useEffect(() => {
		const savedData = localStorage.getItem(STORAGE_KEY);
		if (savedData) {
			try {
				const parsedData = JSON.parse(savedData);
				// Validate that parsedData has the correct structure
				if (parsedData && typeof parsedData === 'object') {
					const validatedData: FormDraftData = {
						title: typeof parsedData.title === 'string' ? parsedData.title : '',
						startDate: typeof parsedData.startDate === 'string' ? parsedData.startDate : '',
						endDate: typeof parsedData.endDate === 'string' ? parsedData.endDate : '',
						companyId: typeof parsedData.companyId === 'string' ? parsedData.companyId : '',
						description: typeof parsedData.description === 'string' ? parsedData.description : '',
						nature: typeof parsedData.nature === 'string' ? parsedData.nature : '',
						status: typeof parsedData.status === 'string' ? parsedData.status : '',
					};
					
					// Use setTimeout to ensure the form is ready
					setTimeout(() => {
						setFormData(validatedData);
						// Show notification that data was restored
						if (Object.values(validatedData).some(value => value.trim() !== '')) {
							toast.info('Données du formulaire restaurées', {
								description: 'Vos données précédemment saisies ont été récupérées.',
								duration: 3000,
							});
						}
					}, 100);
				}
			} catch (error) {
				console.error('Error parsing saved form data:', error);
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	}, []);

	// Save data to localStorage whenever formData changes
	useEffect(() => {
		if (Object.values(formData).some(value => typeof value === 'string' && value.trim() !== '')) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
		}
	}, [formData]);

	// Clear localStorage on successful submission
	useEffect(() => {
		if (state.success) {
			toast.success('Marché créé avec succès', {
				description: 'Le marché a été ajouté à la base de données.',
				duration: 4000,
			});
			localStorage.removeItem(STORAGE_KEY);
			setFormData({
				title: '',
				startDate: '',
				endDate: '',
				companyId: '',
				description: '',
				nature: '',
				status: '',
			});
			formRef.current?.reset();
		} else if (state.errors?._form) {
			toast.error('Erreur lors de la création', {
				description: state.errors._form[0],
				duration: 5000,
			});
		}
	}, [state.success, state.errors?._form]);

	const handleFieldChange = useCallback((field: keyof FormDraftData, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}));
	}, []);

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
					<ProjectFormFields 
						state={state} 
						companies={companies}
						formData={formData}
						onFieldChange={handleFieldChange}
					/>
				</form>
			</div>
		</>
	);
}
