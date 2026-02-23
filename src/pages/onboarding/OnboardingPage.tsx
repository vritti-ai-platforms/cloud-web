import { MultiStepProgressIndicator } from '@components/onboarding/MultiStepProgressIndicator';
import { useOnboarding } from '@context/onboarding';
import { Spinner } from '@vritti/quantum-ui/Spinner';
import type React from 'react';
import { Navigate } from 'react-router-dom';
import { MFASetupStep } from './steps/mfa-setup';
import { SetPasswordStep } from './steps/SetPasswordStep';
import { SuccessStep } from './steps/SuccessStep';
import { VerifyEmailStep } from './steps/verify-email/VerifyEmailStep';
import { VerifyMobileStep } from './steps/verify-mobile';

// Renders the progress bar and the active onboarding step based on backend state
export const OnboardingPage: React.FC = () => {
  const { currentStep, isLoading } = useOnboarding();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="size-8" />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'COMPLETE':
      case 'COMPLETED':
        return (
          <SuccessStep
            hasMfa={false}
            onContinue={() => { window.location.href = '/'; }}
          />
        );
      case 'EMAIL_VERIFICATION':
        return <VerifyEmailStep />;
      case 'PHONE_VERIFICATION':
      case 'MOBILE_VERIFICATION':
        return <VerifyMobileStep />;
      case 'SET_PASSWORD':
        return <SetPasswordStep />;
      case 'MFA_SETUP':
      case 'TWO_FACTOR_SETUP':
        return <MFASetupStep />;
      default:
        console.warn(`Unknown onboarding step: ${currentStep}`);
        return <Navigate to="../login" replace />;
    }
  };

  return (
    <div className="space-y-6">
      <MultiStepProgressIndicator />
      {renderStep()}
    </div>
  );
};
