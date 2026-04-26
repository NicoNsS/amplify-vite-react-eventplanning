import React from 'react';
import { Grid, TextField, Flex, Text } from '@aws-amplify/ui-react';
import { EventFormData } from './useEventForm';
import TimeSuggestions from '../ai/TimeSuggestions';
import { useTranslation } from '../../../hooks/useTranslation';
import { Sparkles } from 'lucide-react';

interface TimeLocationStepProps {
  data: EventFormData;
  onChange: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
}

export const TimeLocationStep: React.FC<TimeLocationStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  
  const handleTimeSelect = (start: string, end: string) => {
    onChange('startTime', start);
    onChange('endTime', end);
  };

  return (
    <Grid gap="medium" data-tour="event-form-time">
      <Flex 
        backgroundColor="brand.secondary.10" 
        padding="1rem" 
        borderRadius="medium" 
        alignItems="flex-start" 
        gap="small"
        marginBottom="0.5rem"
      >
        <Sparkles size={20} color="#FF6B6B" style={{ marginTop: '2px' }} />
        <Text fontSize="small" color="brand.secondary.90">
          {t('eventWizard.step2Hint')}
        </Text>
      </Flex>
      
      <TextField
        label="Startzeit *"
        type="datetime-local"
        value={data.startTime}
        onChange={e => onChange('startTime', e.target.value)}
        required
      />
      <TextField
        label="Endzeit *"
        type="datetime-local"
        value={data.endTime}
        onChange={e => onChange('endTime', e.target.value)}
        required
      />
      
      <TimeSuggestions onSelect={handleTimeSelect} />

      <TextField
        label="Ort"
        value={data.location}
        onChange={e => onChange('location', e.target.value)}
        placeholder="z.B. Café Soul, Berlin ☕"
      />
    </Grid>
  );
};
