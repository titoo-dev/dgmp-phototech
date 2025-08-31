import { getCompanyAction } from '@/actions/company/get-company-action';
import EditCompanyForm from './edit-company-form';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: Props) {
  const { params } = props;
  const { id } = await params;
  const companyId = Number(id);
  const company = await getCompanyAction(companyId);

  return <EditCompanyForm company={company} />;
}

