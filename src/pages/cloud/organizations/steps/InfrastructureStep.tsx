import { useDeployments, useRegionProviders, useRegions } from '@hooks/cloud/infrastructure';
import { Button } from '@vritti/quantum-ui/Button';
import { Form } from '@vritti/quantum-ui/Form';
import { Select } from '@vritti/quantum-ui/Select';
import { Spinner } from '@vritti/quantum-ui/Spinner';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import type { CreateOrgFormData } from '@/schemas/cloud/organizations';

interface InfrastructureStepProps {
  form: UseFormReturn<CreateOrgFormData>;
  onBack: () => void;
  onContinue: () => void;
}

export const InfrastructureStep: React.FC<InfrastructureStepProps> = ({ form, onBack, onContinue }) => {
  const regionId = useWatch({ control: form.control, name: 'regionId' });
  const cloudProviderId = useWatch({ control: form.control, name: 'cloudProviderId' });
  const industryId = form.getValues('industryId');

  const { data: regions = [], isLoading: regionsLoading } = useRegions();
  const { data: providers = [], isLoading: providersLoading } = useRegionProviders(regionId ?? '');
  const { data: deployments = [], isLoading: deploymentsLoading } = useDeployments({
    regionId: regionId ?? '',
    cloudProviderId: cloudProviderId ?? '',
    industryId: industryId ?? '',
  });

  const handleRegionChange = () => {
    form.setValue('cloudProviderId', '');
    form.setValue('cloudProviderName', '');
    form.setValue('deploymentId', '');
    form.setValue('deploymentName', '');
  };

  const handleProviderChange = () => {
    form.setValue('deploymentId', '');
    form.setValue('deploymentName', '');
  };

  const canContinue = !!(regionId && cloudProviderId && form.getValues('deploymentId'));

  return (
    <Form form={form} onSubmit={onContinue}>
      <div className="flex flex-col gap-6">
        {/* Region */}
        <div>
          {regionsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              Loading regions...
            </div>
          ) : (
            <Select
              name="regionId"
              label="Region"
              placeholder="Select a region"
              options={regions.map((r) => ({
                value: r.id,
                label: `${r.name} — ${r.city}, ${r.state} (${r.code})`,
              }))}
              onChange={(value) => {
                const region = regions.find((r) => r.id === value);
                form.setValue('regionName', region?.name ?? '');
                handleRegionChange();
              }}
            />
          )}
        </div>

        {/* Cloud Provider */}
        <div>
          {providersLoading && regionId ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              Loading providers...
            </div>
          ) : (
            <Select
              name="cloudProviderId"
              label="Cloud Provider"
              placeholder={regionId ? 'Select a cloud provider' : 'Select a region first'}
              options={providers.map((p) => ({ value: p.id, label: `${p.name} (${p.code})` }))}
              disabled={!regionId}
              onChange={(value) => {
                const provider = providers.find((p) => p.id === value);
                form.setValue('cloudProviderName', provider?.name ?? '');
                handleProviderChange();
              }}
            />
          )}
        </div>

        {/* Deployment */}
        <div>
          {deploymentsLoading && regionId && cloudProviderId ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              Loading deployments...
            </div>
          ) : (
            <Select
              name="deploymentId"
              label="Deployment"
              placeholder={
                cloudProviderId
                  ? deployments.length === 0
                    ? 'No deployments available for this selection'
                    : 'Select a deployment'
                  : 'Select a cloud provider first'
              }
              options={deployments.map((d) => ({
                value: d.id,
                label: `${d.name} (${d.type})`,
              }))}
              disabled={!cloudProviderId || deployments.length === 0}
              onChange={(value) => {
                const deployment = deployments.find((d) => d.id === value);
                form.setValue('deploymentName', deployment?.name ?? '');
                form.setValue('planId', '');
                form.setValue('planName', '');
              }}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="submit" disabled={!canContinue}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Form>
  );
};
