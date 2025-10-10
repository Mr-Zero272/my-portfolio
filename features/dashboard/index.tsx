import ChartLineMultiple from './components/line-chart';
import ChartPieDonutText from './components/pie-chart';
import { SectionCards } from './components/section-cards';

const DashboardFeature = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="grid grid-cols-3 gap-5 px-4 lg:px-6">
            <div className="col-span-2">
              <ChartLineMultiple />
            </div>
            <div>
              <ChartPieDonutText />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFeature;
