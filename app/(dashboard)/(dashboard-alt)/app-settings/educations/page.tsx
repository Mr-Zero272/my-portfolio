import { ListEducationsPage } from '@/features/education/pages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Educations',
  description:
    'Manage your education history. Add, edit, or delete your educational qualifications.',
};

function EducationPage() {
  return <ListEducationsPage />;
}

export default EducationPage;
