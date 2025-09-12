import { getCompanyAction } from '@/actions/company/get-company-action';
import EditCompanyForm from './edit-company-form';
import { getSessionAction } from '@/actions/get-session';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: Props) {
  const { session } = await getSessionAction()
  
  if (!session?.user) {
    return redirect('/auth/signin')
  }

  const { params } = props;
  const { id } = await params;
  const companyId = id;
  const company = await getCompanyAction(companyId);

  return <EditCompanyForm company={company} />;
}

