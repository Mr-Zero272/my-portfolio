import { DashboardService } from '@/services/dashboard-service';
import ActivityChart from './components/line-chart';
import DistributionChart from './components/pie-chart';
import { SectionCards } from './components/section-cards';

const DashboardFeature = async () => {
  const [stats, activityData, distributionData] = await Promise.all([
    DashboardService.getStats(),
    DashboardService.getActivityData(),
    DashboardService.getProjectStatusDistribution(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards stats={stats} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="col-span-1 md:col-span-2">
              <ActivityChart data={activityData} />
            </div>
            <div>
              <DistributionChart data={distributionData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFeature;
