import React, { useState } from 'react';
import {
  Button,
  Flex,
  Heading,
  Card,
  Alert,
  View,
} from '@aws-amplify/ui-react';
import { ChevronRight, ChevronLeft, PartyPopper } from 'lucide-react';

import { useEventForm } from './features/event-form/useEventForm';
import { StepIndicator } from './features/event-form/StepIndicator';
import { GeneralStep } from './features/event-form/GeneralStep';
import { TimeLocationStep } from './features/event-form/TimeLocationStep';
import { PreviewStep } from './features/event-form/PreviewStep';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

export const EventForm: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showBalloon, setShowBalloon] = useState(false);

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
    showToast(t('eventWizard.launchSuccess'), 'success');
    setShowBalloon(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  });

  const isLastStep = step === 3;

  const getStepTitle = () => {
    switch (step) {
      case 1: return t('eventWizard.step1Title');
      case 2: return t('eventWizard.step2Title');
      case 3: return t('eventWizard.step3Title');
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLastStep) {
      submit();
    } else {
      nextStep();
    }
  };

  return (
    <Card variation="elevated" padding="large" maxWidth="600px" margin="0 auto" style={{ position: 'relative' }}>
      {showBalloon && <View className="balloon-fly">🎈</View>}
      <Flex justifyContent="center" alignItems="center" marginBottom="1.5rem" gap="small">
        <PartyPopper color="#FF6B6B" />
        <Heading level={3} textAlign="center">{getStepTitle()}</Heading>
      </Flex>
      
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
