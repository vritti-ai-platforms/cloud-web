import { OrgCard, OrgCardSkeleton } from '@components/organizations/OrgCard';
import { useMyOrgs } from '@hooks/organizations';
import { Button } from '@vritti/quantum-ui/Button';
import { Typography } from '@vritti/quantum-ui/Typography';
import { ArrowRight, Building2, MailOpen, Plus } from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useMyOrgs({ limit: 3 });

  const visibleOrgs = data?.result ?? [];

  return (
    <div className="space-y-6">
      {/* Organizations section */}
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Typography variant="h3">My Organizations</Typography>
            <Typography variant="body2" intent="muted">
              Manage your organizations and their configurations
            </Typography>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => navigate('/organizations')}>
              View All <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate('/organizations/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Organization
            </Button>
          </div>
        </div>

        {/* Cards grid — max 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <OrgCardSkeleton />
              <OrgCardSkeleton />
              <OrgCardSkeleton />
            </>
          ) : visibleOrgs.length > 0 ? (
            visibleOrgs.map((org) => <OrgCard key={org.id} org={org} />)
          ) : (
            <div className="col-span-full py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <Typography variant="body1" intent="muted">
                You don't belong to any organizations yet.
              </Typography>
            </div>
          )}
        </div>

        {/* Truncation note when there are more orgs than shown */}
        {data?.hasMore && (
          <Typography variant="body2" intent="muted">
            Showing 3 of {data.total} organizations.
          </Typography>
        )}
      </div>

      {/* Invitations section stub */}
      <div className="border-t border-border pt-6 space-y-4">
        {/* Section header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Typography variant="h3">Pending Invitations</Typography>
            <Typography variant="body2" intent="muted">
              Invitation requests to join organizations
            </Typography>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/invitations')}>
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Empty state */}
        <div className="py-10 text-center">
          <MailOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <Typography variant="body1" intent="muted">
            No pending invitations
          </Typography>
        </div>
      </div>
    </div>
  );
};
