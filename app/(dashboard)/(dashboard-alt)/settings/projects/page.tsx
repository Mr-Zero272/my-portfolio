import { ListProjectPage } from '@/features/project';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Manage your projects. Add, edit, or delete your projects.',
};

function ProjectsPage() {
  return <ListProjectPage />;
}

export default ProjectsPage;
