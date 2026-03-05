import { useDeletePlan, usePlans } from '@hooks/admin/plans';
import { Badge } from '@vritti/quantum-ui/Badge';
import { Button } from '@vritti/quantum-ui/Button';
import { type ColumnDef, DataTable, useDataTable } from '@vritti/quantum-ui/DataTable';
import { Dialog } from '@vritti/quantum-ui/Dialog';
import { DropdownMenu } from '@vritti/quantum-ui/DropdownMenu';
import { PageHeader } from '@vritti/quantum-ui/PageHeader';
import { buildSlug } from '@vritti/quantum-ui/utils/slug';
import { ValueFilter } from '@vritti/quantum-ui/ValueFilter';
import { CreditCard, Eye, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Plan } from '@/schemas/admin/plans';
import { AddPlanForm } from './forms/AddPlanForm';
import { EditPlanForm } from './forms/EditPlanForm';

const TABLE_SLUG = 'plans';

export const PlansPage = () => {
  const navigate = useNavigate();
  const { data: response, isLoading } = usePlans();
  const deleteMutation = useDeletePlan();

  const { table } = useDataTable({
    columns: getColumns({
      onView: (p) => navigate(`/plans/${buildSlug(p.name, p.id)}`),
      onDelete: deleteMutation.mutate,
    }),
    slug: TABLE_SLUG,
    label: 'plan',
    serverState: response,
    enableRowSelection: false,
    enableSorting: true,
    enableMultiSort: false,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader title="Plans" description="Manage subscription plans" />

      {/* Table */}
      <DataTable
        table={table}
        isLoading={isLoading}
        filters={[
          <ValueFilter key="name" name="name" label="Name" fieldType="string" />,
          <ValueFilter key="code" name="code" label="Code" fieldType="string" />,
        ]}
        toolbarActions={{
          actions: (
            <Dialog
              title="Add Plan"
              description="Enter the details for the new subscription plan."
              anchor={(open) => (
                <Button startAdornment={<Plus className="size-4" />} size="sm" onClick={open}>
                  Add Plan
                </Button>
              )}
              content={(close) => <AddPlanForm onSuccess={close} onCancel={close} />}
            />
          ),
        }}
        emptyStateConfig={{
          icon: CreditCard,
          title: 'No plans found',
          description: 'Add your first subscription plan to get started.',
          action: (
            <Dialog
              title="Add Plan"
              description="Enter the details for the new subscription plan."
              anchor={(open) => (
                <Button size="sm" onClick={open}>
                  <Plus className="size-4" />
                  Add Plan
                </Button>
              )}
              content={(close) => <AddPlanForm onSuccess={close} onCancel={close} />}
            />
          ),
        }}
      />
    </div>
  );
};

interface ColumnActions {
  onView: (plan: Plan) => void;
  onDelete: (id: string) => void;
}

function getColumns({ onView, onDelete }: ColumnActions): ColumnDef<Plan, unknown>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Plan',
    },
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-[10px] font-medium">
          {row.original.code}
        </Badge>
      ),
    },
    {
      accessorKey: 'priceCount',
      header: 'Prices',
      cell: ({ row }) => <Badge variant="secondary">{row.original.priceCount} prices</Badge>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
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
              type: 'item' as const,
              id: 'view',
              label: 'View',
              icon: Eye,
              onClick: () => onView(row.original),
            },
            {
              type: 'dialog' as const,
              id: 'edit',
              label: 'Edit',
              icon: Pencil,
              dialog: {
                title: 'Edit Plan',
                description: 'Update the details for this subscription plan.',
                content: (close) => <EditPlanForm plan={row.original} onSuccess={close} onCancel={close} />,
              },
            },
            {
              type: 'item' as const,
              id: 'delete',
              label: 'Delete',
              icon: Trash2,
              variant: 'destructive',
              onClick: () => onDelete(row.original.id),
            },
          ]}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
