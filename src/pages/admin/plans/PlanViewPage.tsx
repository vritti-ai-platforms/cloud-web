import { usePlans } from '@hooks/admin/plans';
import { useDeletePrice, usePricesByPlan } from '@hooks/admin/prices';
import { Badge } from '@vritti/quantum-ui/Badge';
import { Button } from '@vritti/quantum-ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@vritti/quantum-ui/Card';
import { Dialog } from '@vritti/quantum-ui/Dialog';
import { DropdownMenu } from '@vritti/quantum-ui/DropdownMenu';
import { useSlugParams } from '@vritti/quantum-ui/hooks';
import { PageHeader } from '@vritti/quantum-ui/PageHeader';
import { Spinner } from '@vritti/quantum-ui/Spinner';
import { MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Price } from '@/schemas/admin/prices';
import { AddPriceForm } from './forms/AddPriceForm';
import { EditPriceForm } from './forms/EditPriceForm';

export const PlanViewPage = () => {
  const { id: planId } = useSlugParams();

  const { data: plansResponse } = usePlans();
  const { data: prices = [], isLoading } = usePricesByPlan(planId ?? '');

  const deleteMutation = useDeletePrice();

  const plan = plansResponse?.result.find((p) => p.id === planId);

  if (!planId) return null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={plan?.name ?? 'Plan'}
        description={plan ? `Code: ${plan.code} — ${plan.priceCount} price(s)` : ''}
      />

      {/* Pricing Matrix */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pricing Matrix</CardTitle>
          <Dialog
            title="Add Price"
            description="Set a price for a specific industry, region, and cloud provider combination."
            anchor={(open) => (
              <Button size="sm" variant="outline" startAdornment={<Plus className="size-4" />} onClick={open}>
                Add Price
              </Button>
            )}
            content={(close) => <AddPriceForm planId={planId} onSuccess={close} onCancel={close} />}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6 text-primary" />
            </div>
          ) : prices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No prices configured for this plan yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {prices.map((price) => (
                <PriceRow
                  key={price.id}
                  price={price}
                  onDelete={() => deleteMutation.mutate({ id: price.id, planId })}
                  isDeleting={deleteMutation.isPending && deleteMutation.variables?.id === price.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface PriceRowProps {
  price: Price;
  onDelete: () => void;
  isDeleting: boolean;
}

const PriceRow = ({ price, onDelete, isDeleting }: PriceRowProps) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="font-mono text-xs">
          {price.currency}
        </Badge>
        <span className="text-sm font-semibold">{price.price}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono flex-wrap">
        <span>industry: {price.industryId.slice(0, 8)}…</span>
        <span>·</span>
        <span>region: {price.regionId.slice(0, 8)}…</span>
        <span>·</span>
        <span>provider: {price.providerId.slice(0, 8)}…</span>
      </div>
    </div>
    <DropdownMenu
      trigger={{
        children: (
          <Button variant="ghost" size="icon" className="size-7">
            <MoreVertical className="size-4" />
          </Button>
        ),
      }}
      align="end"
      items={[
        {
          type: 'dialog' as const,
          id: 'edit',
          label: 'Edit',
          icon: Pencil,
          dialog: {
            title: 'Edit Price',
            description: 'Update the price and currency for this combination.',
            content: (close) => <EditPriceForm price={price} onSuccess={close} onCancel={close} />,
          },
        },
        {
          type: 'item' as const,
          id: 'delete',
          label: 'Delete',
          icon: Trash2,
          variant: 'destructive',
          disabled: isDeleting,
          onClick: onDelete,
        },
      ]}
    />
  </div>
);
