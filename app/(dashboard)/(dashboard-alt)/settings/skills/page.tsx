import { ListSkillsPage } from '@/features/skill/pages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Manage your skills. Add, edit, or delete your skills.',
};

function SkillsPage() {
  return <ListSkillsPage />;
}

export default SkillsPage;
