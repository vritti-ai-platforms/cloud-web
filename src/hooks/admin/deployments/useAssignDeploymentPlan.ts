import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { MutationResponse } from '@vritti/quantum-ui/api-response';
import type { AssignPlanData } from '@/schemas/admin/deployments';
import { assignDeploymentPlan } from '@/services/admin/deployments.service';
import { deploymentPlanPricesQueryKey } from './useDeploymentPlanPrices';
import { deploymentPlansQueryKey } from './useDeploymentPlans';

type Vars = { id: string; data: AssignPlanData };
type UseAssignOptions = Omit<UseMutationOptions<MutationResponse, AxiosError, Vars>, 'mutationFn'>;

// Assigns a plan+industry to a deployment and invalidates its plan list
export function useAssignDeploymentPlan(options?: UseAssignOptions) {
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, AxiosError, Vars>({
    ...options,
    mutationFn: assignDeploymentPlan,
    onSuccess: (result, vars, ...args) => {
      queryClient.invalidateQueries({ queryKey: deploymentPlansQueryKey(vars.id) });
      queryClient.invalidateQueries({ queryKey: deploymentPlanPricesQueryKey(vars.id) });
      options?.onSuccess?.(result, vars, ...args);
    },
  });
}
