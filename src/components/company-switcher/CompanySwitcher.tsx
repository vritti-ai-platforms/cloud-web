import { Button } from '@vritti/quantum-ui/Button';
import { Select } from '@vritti/quantum-ui/Select';
import { Separator } from '@vritti/quantum-ui/Separator';
import { buildSlug } from '@vritti/quantum-ui/utils/slug';
import { Building2, ChevronsUpDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompanySwitcherProps {
  currentOrgId: string;
  currentOrgName?: string;
}

// Renders the org switcher dropdown in the top bar breadcrumb
export const CompanySwitcher = ({ currentOrgId, currentOrgName }: CompanySwitcherProps) => {
  const navigate = useNavigate();

  return (
    <Select
      optionsEndpoint="cloud-api/organizations/select"
      fieldKeys={{ valueKey: 'id', labelKey: 'name', groupIdKey: 'planId' }}
      value={currentOrgId}
      searchable
      searchPlaceholder="Find company..."
      contentClassName="w-60"
      anchor={({ selectedOption }) => (
        <Button
          startAdornment={<Building2 className="size-4 text-muted-foreground" />}
          variant="ghost"
          className="h-auto min-w-25 p-0 gap-1.5 text-sm font-normal hover:bg-transparent"
        >
          <span className="flex-1 text-left font-normal text-foreground">
            {selectedOption?.label ?? currentOrgName ?? 'Organization'}
          </span>
          <span className="flex items-center justify-center size-6 rounded-full border border-border hover:bg-accent transition-colors">
            <ChevronsUpDown className="size-3.5 text-muted-foreground" />
          </span>
        </Button>
      )}
      footer={
        <>
          <Separator />
          <div className="p-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto px-2 py-1.5 text-sm font-normal"
              onClick={() => navigate('/organizations')}
            >
              All Companies
            </Button>
          </div>
          <Separator />
          <div className="p-1 bg-accent/40">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto gap-2 px-2 py-1.5 text-sm font-normal"
              onClick={() => navigate('/new-organization')}
            >
              <Plus className="size-4" /> New Company
            </Button>
          </div>
        </>
      }
      onOptionSelect={(option) => {
        if (option) {
          navigate(`/org-${buildSlug(String(option.label), String(option.value))}/overview`);
        }
      }}
    />
  );
};
