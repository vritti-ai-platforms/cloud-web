import type { CreateOrgFormData, OrgPlan as OrgPlanType } from '@schemas/organizations';
import { OrgPlan } from '@schemas/organizations';
import { Badge } from '@vritti/quantum-ui/Badge';
import { Button } from '@vritti/quantum-ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@vritti/quantum-ui/Card';
import { Form } from '@vritti/quantum-ui/Form';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';

const PLANS = [
  {
    plan: OrgPlan.free,
    label: 'Free',
    badge: null,
    features: ['1 Business Unit', 'Basic email support', 'Shared infrastructure', '30 GB storage', '1 included app'],
  },
  {
    plan: OrgPlan.pro,
    label: 'Pro',
    badge: 'Most Popular',
    features: [
      '3 Business Units',
      'Priority chat & email support',
      'Shared optimized infrastructure',
      '200 GB storage',
      '3 included apps',
    ],
  },
  {
    plan: OrgPlan.enterprise,
    label: 'Enterprise',
    badge: 'Best Value',
    features: [
      'Unlimited Business Units',
      '24/7 Dedicated manager',
      'Dedicated isolated infrastructure',
      '1 TB storage',
      'All apps included',
    ],
  },
] as const;

interface ChoosePlanStepProps {
  form: UseFormReturn<CreateOrgFormData>;
  selectedPlan: OrgPlanType;
  onSelect: (plan: OrgPlanType) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const ChoosePlanStep: React.FC<ChoosePlanStepProps> = ({ form, selectedPlan, onSelect, onBack, onContinue }) => {
  return (
    <Form form={form} onSubmit={onContinue}>
      <div className="grid grid-cols-3 gap-4">
        {PLANS.map(({ plan, label, badge, features }) => (
          <Card
            key={plan}
            className={[
              'cursor-pointer transition-all',
              selectedPlan === plan ? 'ring-2 ring-primary' : 'hover:border-primary/50',
            ].join(' ')}
            onClick={() => onSelect(plan)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{label}</CardTitle>
                {badge && <Badge variant="secondary">{badge}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="submit">
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Form>
  );
};
