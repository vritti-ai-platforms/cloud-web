import {
  useDeleteDeployment,
  useDeployment,
  useDeploymentPlans,
  useRemoveDeploymentPlan,
} from '@hooks/admin/deployments';
import { Badge } from '@vritti/quantum-ui/Badge';
import { Button } from '@vritti/quantum-ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@vritti/quantum-ui/Card';
import { Dialog } from '@vritti/quantum-ui/Dialog';
import { useDialog, useSlugParams } from '@vritti/quantum-ui/hooks';
import { PageHeader } from '@vritti/quantum-ui/PageHeader';
import { Spinner } from '@vritti/quantum-ui/Spinner';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AssignPlanForm } from './forms/AssignPlanForm';
import { EditDeploymentForm } from './forms/EditDeploymentForm';

export const DeploymentViewPage = () => {
  const { id } = useSlugParams();
  const navigate = useNavigate();

  const editDialog = useDialog();
  const deleteDialog = useDialog();

  const { data: deployment, isLoading } = useDeployment(id ?? '');
  const { data: assignedPlans = [], isLoading: plansLoading } = useDeploymentPlans(id ?? '');

  const deleteMutation = useDeleteDeployment({
    onSuccess: () => navigate('/deployments'),
  });

  const removePlanMutation = useRemoveDeploymentPlan();

  const handleDeleteConfirm = () => {
    if (!id) return;
    deleteMutation.mutate(id);
  };

  const handleRemovePlan = (planId: string, industryId: string) => {
    if (!id) return;
    removePlanMutation.mutate({ id, data: { planId, industryId } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!deployment) return null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={deployment.name}
        description={`${deployment.regionName ?? deployment.regionId} — ${deployment.cloudProviderName ?? deployment.cloudProviderId}`}
        actions={
          <Button variant="outline" size="sm" onClick={editDialog.open}>
            Edit
          </Button>
        }
      />

      {/* Status badges */}
      <div className="flex items-center gap-2">
        {deployment.status === 'active' ? (
          <Badge className="bg-success/15 text-success border-success/30 capitalize">{deployment.status}</Badge>
        ) : deployment.status === 'stopped' ? (
          <Badge variant="destructive" className="capitalize">
            {deployment.status}
          </Badge>
        ) : (
          <Badge variant="secondary" className="capitalize">
            {deployment.status}
          </Badge>
        )}
        <Badge variant="outline" className="capitalize">
          {deployment.type}
        </Badge>
      </div>

      {/* Assigned Plans card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assigned Plans</CardTitle>
          <Dialog
            title="Assign Plan"
            description="Assign a plan and industry combination to this deployment."
            anchor={(open) => (
              <Button size="sm" variant="outline" startAdornment={<Plus className="size-4" />} onClick={open}>
                Assign Plan
              </Button>
            )}
            content={(close) => <AssignPlanForm deploymentId={id ?? ''} onSuccess={close} onCancel={close} />}
          />
        </CardHeader>
        <CardContent>
          {plansLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6 text-primary" />
            </div>
          ) : assignedPlans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No plans assigned to this deployment yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {assignedPlans.map((item) => {
                const isRemoving =
                  removePlanMutation.isPending &&
                  removePlanMutation.variables?.data.planId === item.planId &&
                  removePlanMutation.variables?.data.industryId === item.industryId;

                return (
                  <div key={`${item.planId}-${item.industryId}`} className="flex items-center justify-between py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{item.planName}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.industryName} — <span className="font-mono">{item.planCode}</span>
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      disabled={isRemoving}
                      onClick={() => handleRemovePlan(item.planId, item.industryId)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="size-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete this deployment</p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All associated plan assignments will be removed.
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={deleteDialog.open}>
              Delete Deployment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog
        open={editDialog.isOpen}
        onOpenChange={(v) => {
          if (!v) editDialog.close();
        }}
        title="Edit Deployment"
        description="Update the details for this deployment."
        content={(close) => <EditDeploymentForm deployment={deployment} onSuccess={close} onCancel={close} />}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(v) => {
          if (!v) deleteDialog.close();
        }}
        title="Delete Deployment"
        description={`Are you sure you want to delete "${deployment.name}"? This action cannot be undone.`}
        footer={
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={deleteDialog.close}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Deployment'}
            </Button>
          </div>
        }
      />
    </div>
  );
};
