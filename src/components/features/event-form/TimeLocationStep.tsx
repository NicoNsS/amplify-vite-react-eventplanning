import React from 'react';
import { Grid, TextField } from '@aws-amplify/ui-react';
import { EventFormData } from './useEventForm';

interface TimeLocationStepProps {
  data: EventFormData;
  onChange: (field: keyof EventFormData, value: any) => void;
}

export const TimeLocationStep: React.FC<TimeLocationStepProps> = ({ data, onChange }) => (
  <Grid gap="medium">
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
    <TextField
      label="Ort"
      value={data.location}
      onChange={e => onChange('location', e.target.value)}
      placeholder="z.B. Berlin, Alexanderplatz"
    />
  </Grid>
);
