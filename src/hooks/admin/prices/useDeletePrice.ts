import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { deletePrice } from '@/services/admin/prices.service';

type Vars = { id: string; planId: string };
type UseDeletePriceOptions = Omit<UseMutationOptions<void, AxiosError, Vars>, 'mutationFn'>;

// Deletes a price and invalidates the plan's prices list
export function useDeletePrice(options?: UseDeletePriceOptions) {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, Vars>({
    ...options,
    mutationFn: ({ id }) => deletePrice(id),
    onSuccess: (result, vars, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'prices', 'plan', vars.planId] });
      options?.onSuccess?.(result, vars, ...args);
    },
  });
}
