import Link from 'next/link';
import { getCompaniesAction } from '@/actions/company/get-companies-action';
import { CompanyModel } from '@/models/company-schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CompaniesList from '@/components/companies/companies-list';

export default async function EntreprisesPage() {
	const result = await getCompaniesAction();
	const companies: CompanyModel[] = result.companies || [];

	return (
		<div className="flex-1 space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">
						Entreprises
					</h1>
					<p className="text-muted-foreground">
						Gérez les entreprises partenaires et leurs informations
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button asChild>
						<Link href="/companies/new">
							<Plus className="w-4 h-4 mr-2" />
							Nouvelle entreprise
						</Link>
					</Button>
				</div>
			</div>

			<CompaniesList companies={companies} />
		</div>
	);
}
