import { ListExperiencePage } from '@/features/experience';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiences',
  description: 'Manage your work experience history. Add, edit, or delete your work experience.',
};

function ExperiencesPage() {
  return <ListExperiencePage />;
}

export default ExperiencesPage;
