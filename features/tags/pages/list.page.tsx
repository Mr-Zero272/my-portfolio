import { PageHeader } from '@/components/shared/page-header copy';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { TagTable } from '../components';

export const ListTagsPage = () => {
  return (
    <div>
      <PageHeader
        title="Tags"
        description="Manage tags"
        actions={
          <Button>
            <PlusIcon />
            Add tags
          </Button>
        }
      />
      <TagTable />
    </div>
  );
};
