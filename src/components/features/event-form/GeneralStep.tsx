import React from 'react';
import { Grid, TextField, TextAreaField, SelectField } from '@aws-amplify/ui-react';
import { EventFormData } from './useEventForm';
import { Visibility } from '../../../types/event';

interface GeneralStepProps {
  data: EventFormData;
  onChange: (field: keyof EventFormData, value: any) => void;
}

const visibilityOptions: { label: string; value: Visibility }[] = [
  { label: 'Privat (nur Einladung)', value: 'PRIVATE' },
  { label: 'Öffentlich (entdeckbar)', value: 'PUBLIC' }
];

export const GeneralStep: React.FC<GeneralStepProps> = ({ data, onChange }) => (
  <Grid gap="medium" data-tour="event-form-basics">
    <TextField
      label="Titel *"
      value={data.title}
      onChange={e => onChange('title', e.target.value)}
      required
      placeholder="z.B. Geburtstagsparty"
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
