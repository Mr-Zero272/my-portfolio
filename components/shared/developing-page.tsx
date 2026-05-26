import { Code2Icon } from 'lucide-react';
import StateUI from './state-ui';

const DevelopingPage = () => {
  return (
    <StateUI
      icon={<Code2Icon className="size-12" />}
      title="On Development"
      description="This feature is currently under development. Please check back later."
      variant="default"
    />
  );
};

export default DevelopingPage;
