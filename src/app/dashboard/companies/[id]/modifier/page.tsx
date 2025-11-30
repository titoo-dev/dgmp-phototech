import { getCompanyAction } from '@/actions/company/get-company-action';
import EditCompanyForm from './edit-company-form';
import { verifyOrganization } from '@/lib/auth-guard';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: Props) {
	await verifyOrganization();

  const { params } = props;
  const { id } = await params;
  const companyId = id;
  const company = await getCompanyAction(companyId);

  return <EditCompanyForm company={company} />;
}

