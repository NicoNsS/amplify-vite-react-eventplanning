import React from 'react';
import { Grid, TextField, TextAreaField, SelectField, View, Text, Flex } from '@aws-amplify/ui-react';
import { EventFormData } from './useEventForm';
import { Visibility } from '../../../types/event';
import { useTranslation } from '../../../hooks/useTranslation';
import { Info } from 'lucide-react';

interface GeneralStepProps {
  data: EventFormData;
  onChange: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
}

const visibilityOptions: { label: string; value: Visibility }[] = [
  { label: 'Privat (nur Einladung)', value: 'PRIVATE' },
  { label: 'Öffentlich (entdeckbar)', value: 'PUBLIC' }
];

export const GeneralStep: React.FC<GeneralStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <Grid gap="medium" data-tour="event-form-basics">
      <Flex 
        backgroundColor="brand.primary.10" 
        padding="1rem" 
        borderRadius="medium" 
        alignItems="flex-start" 
        gap="small"
        marginBottom="0.5rem"
      >
        <Info size={20} color="#2F80ED" style={{ marginTop: '2px' }} />
        <Text fontSize="small" color="brand.primary.90">
          {t('eventWizard.step1Hint')}
        </Text>
      </Flex>
      
      <TextField
        label="Titel *"
        value={data.title}
        onChange={e => onChange('title', e.target.value)}
        required
        placeholder="z.B. Geburtstagsparty 🎉"
      />
      <TextAreaField
        label="Beschreibung"
        value={data.description}
        onChange={e => onChange('description', e.target.value)}
        rows={4}
        placeholder="Erzähle deinen Gästen mehr über das Event..."
      />
      <SelectField
        label="Sichtbarkeit"
        value={data.visibility}
        onChange={e => onChange('visibility', e.target.value as Visibility)}
      >
        {visibilityOptions.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </SelectField>
    </Grid>
  );
};
