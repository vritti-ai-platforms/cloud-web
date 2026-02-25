import type { CreateOrgFormData, IndustryOption } from '@schemas/organizations';
import { OrgSize } from '@schemas/organizations';
import { Button } from '@vritti/quantum-ui/Button';
import { FieldGroup, Form } from '@vritti/quantum-ui/Form';
import { Select } from '@vritti/quantum-ui/Select';
import { TextField } from '@vritti/quantum-ui/TextField';
import { ArrowRight } from 'lucide-react';
import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface BasicInfoStepProps {
  form: UseFormReturn<CreateOrgFormData>;
  industries: IndustryOption[] | undefined;
  onContinue: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ form, industries, onContinue }) => {
  return (
    <Form form={form} onSubmit={onContinue}>
      <FieldGroup>
        <TextField
          name="name"
          label="Organization Name"
          placeholder="e.g., HealthFirst Clinics"
        />
        <TextField
          name="subdomain"
          label="Organization URL"
          placeholder="company-slug"
          endAdornment={<span className="text-muted-foreground text-sm pr-3">.vrittiai.com</span>}
          description="This will be your organization's subdomain URL"
        />
        <Select
          name="industryId"
          label="Industry"
          placeholder="Select industry"
          options={(industries ?? []).map((i) => ({ value: i.id, label: i.name }))}
        />
        <Select
          name="size"
          label="Organization Size"
          placeholder="Select size"
          options={Object.values(OrgSize).map((v) => ({ value: v, label: `${v} employees` }))}
        />
      </FieldGroup>
      <div className="flex justify-end">
        <Button type="submit">
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Form>
  );
};
