import React from 'react';
import {
  Button,
  Flex,
  Heading,
  Card,
  Alert,
} from '@aws-amplify/ui-react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import { useEventForm } from './features/event-form/useEventForm';
import { StepIndicator } from './features/event-form/StepIndicator';
import { GeneralStep } from './features/event-form/GeneralStep';
import { TimeLocationStep } from './features/event-form/TimeLocationStep';
import { PreviewStep } from './features/event-form/PreviewStep';

export const EventForm: React.FC = () => {
  const {
    formData,
    step,
    loading,
    error,
    updateField,
    nextStep,
    prevStep,
    submit,
  } = useEventForm(() => {
    // Optional: Redirect or show detailed success message
  });

  const isLastStep = step === 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLastStep) {
      submit();
    } else {
      nextStep();
    }
  };

  return (
    <Card variation="elevated" padding="large" maxWidth="600px" margin="0 auto">
      <Heading level={3} marginBottom="1.5rem" textAlign="center">Neues Event</Heading>
      
      <StepIndicator currentStep={step} />

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variation="error" marginBottom="1rem">
            {error}
          </Alert>
        )}

        {step === 1 && <GeneralStep data={formData} onChange={updateField} />}
        {step === 2 && <TimeLocationStep data={formData} onChange={updateField} />}
        {step === 3 && <PreviewStep data={formData} />}

        <Flex justifyContent="space-between" marginTop="2rem">
          <Button 
            type="button"
            onClick={prevStep} 
            isDisabled={step === 1 || loading}
            gap="0.5rem"
          >
            <ChevronLeft size={18} />
            Zurück
          </Button>
          
          <Button 
            type="submit" 
            variation="primary"
            isLoading={loading}
            gap="0.5rem"
          >
            {isLastStep ? 'Event erstellen' : 'Weiter'}
            {!isLastStep && <ChevronRight size={18} />}
          </Button>
        </Flex>
      </form>
    </Card>
  );
};
