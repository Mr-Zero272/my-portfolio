import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MetadataForm from './components/metadata-form';

type MetadataTabProps = {
  onTabChange: (tab: string) => void;
};

const MetadataTab = ({ onTabChange }: MetadataTabProps) => {
  return (
    <>
      {/** Header */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={() => onTabChange('main')}>
          <ArrowLeft className="size-4 cursor-pointer" />
        </Button>
        <h2 className="text-lg font-semibold">Metadata</h2>
      </div>
      {/** Metadata Form */}
      <MetadataForm />
    </>
  );
};

export default MetadataTab;
