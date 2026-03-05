import { zodResolver } from '@hookform/resolvers/zod';
import { useAssignDeploymentPlan } from '@hooks/admin/deployments';
import { useIndustries } from '@hooks/admin/industries';
import { usePlans } from '@hooks/admin/plans';
import { Button } from '@vritti/quantum-ui/Button';
import { Form } from '@vritti/quantum-ui/Form';
import { Select } from '@vritti/quantum-ui/Select';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { type AssignPlanData, assignPlanSchema } from '@/schemas/admin/deployments';

interface AssignPlanFormProps {
  deploymentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AssignPlanForm: React.FC<AssignPlanFormProps> = ({ deploymentId, onSuccess, onCancel }) => {
  const form = useForm<AssignPlanData>({
    resolver: zodResolver(assignPlanSchema),
  });

  const { data: plansResponse } = usePlans();
  const plans = plansResponse?.result ?? [];
  const { data: industriesResponse } = useIndustries();
  const industries = industriesResponse?.result ?? [];

  const assignMutation = useAssignDeploymentPlan({
    onSuccess: () => {
      form.reset();
      onSuccess();
    },
  });

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return (
    <Form form={form} mutation={assignMutation} showRootError transformSubmit={(data) => ({ id: deploymentId, data })}>
      <Select
        name="planId"
        label="Plan"
        placeholder="Select plan"
        options={plans.map((p) => ({ value: p.id, label: `${p.name} (${p.code})` }))}
      />
      <Select
        name="industryId"
        label="Industry"
        placeholder="Select industry"
        options={industries.map((i) => ({ value: i.id, label: i.name }))}
      />
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" loadingText="Assigning...">
          Assign Plan
        </Button>
      </div>
    </Form>
  );
};
