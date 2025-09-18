import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import XMetadataForm from './components/x-metadata-form';

type XMetadataTabProps = {
  onTabChange: (tab: string) => void;
};

const XMetadataTab = ({ onTabChange }: XMetadataTabProps) => {
  return (
    <>
      {/** Header */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={() => onTabChange('main')}>
          <ArrowLeft className="size-4 cursor-pointer" />
        </Button>
        <h2 className="text-lg font-semibold">X Metadata</h2>
      </div>
      {/** X Metadata Form */}
      <XMetadataForm />
    </>
  );
};

export default XMetadataTab;
