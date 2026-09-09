import { ListSocialLinksPage } from '@/features/social-link/pages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Links',
  description: 'Manage your social links. Add, edit, delete, or reorder your social media handles.',
};

function SocialLinksPage() {
  return <ListSocialLinksPage />;
}

export default SocialLinksPage;
