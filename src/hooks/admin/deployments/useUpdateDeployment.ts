import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { Deployment, UpdateDeploymentData } from '@/schemas/admin/deployments';
import { updateDeployment } from '@/services/admin/deployments.service';
import { deploymentQueryKey } from './useDeployment';
import { DEPLOYMENTS_QUERY_KEY } from './useDeployments';

type Vars = { id: string; data: UpdateDeploymentData };
type UseUpdateDeploymentOptions = Omit<UseMutationOptions<Deployment, AxiosError, Vars>, 'mutationFn'>;

// Updates a deployment and invalidates relevant queries
export function useUpdateDeployment(options?: UseUpdateDeploymentOptions) {
  const queryClient = useQueryClient();
  return useMutation<Deployment, AxiosError, Vars>({
    ...options,
    mutationFn: updateDeployment,
    onSuccess: (result, vars, ...args) => {
      queryClient.invalidateQueries({ queryKey: DEPLOYMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: deploymentQueryKey(vars.id) });
      options?.onSuccess?.(result, vars, ...args);
    },
  });
}
