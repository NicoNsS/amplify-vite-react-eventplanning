import React from 'react';
import { Flex, View, Text } from '@aws-amplify/ui-react';
import { Check, Info, Calendar as CalendarIcon, MapPin } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { label: 'Allgemein', icon: <Info size={18} />, threshold: 1 },
    { label: 'Zeit & Ort', icon: <CalendarIcon size={18} />, threshold: 2 },
    { label: 'Vorschau', icon: <MapPin size={18} />, threshold: 3 },
  ];

  return (
    <Flex justifyContent="center" marginBottom="2rem" alignItems="center">
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          <Flex direction="column" alignItems="center">
            <View 
              width="2.5rem" height="2.5rem" borderRadius="50%" 
              backgroundColor={currentStep >= step.threshold ? 'brand.primary.80' : 'font.tertiary'}
              display="flex" alignItems="center" justifyContent="center" color="white"
            >
              {currentStep > step.threshold ? <Check size={18} /> : step.icon}
            </View>
            <Text fontSize="xs" marginTop="0.25rem">{step.label}</Text>
          </Flex>
          {index < steps.length - 1 && (
            <View 
              width="3rem" height="2px" 
              backgroundColor={currentStep > step.threshold ? 'brand.primary.80' : 'border.primary'} 
            />
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};
