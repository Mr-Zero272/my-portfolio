import DashboardFeature from '@/features/dashboard';

export const metadata = {
  title: 'Dashboard',
  description: 'Manage your blog posts in the dashboard',
};

const DashboardPage = () => {
  return (
    <div>
      <DashboardFeature />
    </div>
  );
};

export default DashboardPage;
