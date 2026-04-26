import React from 'react';
import { Grid, TextField } from '@aws-amplify/ui-react';
import { EventFormData } from './useEventForm';
import TimeSuggestions from '../ai/TimeSuggestions';

interface TimeLocationStepProps {
  data: EventFormData;
  onChange: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
}

export const TimeLocationStep: React.FC<TimeLocationStepProps> = ({ data, onChange }) => {
  const handleTimeSelect = (start: string, end: string) => {
    onChange('startTime', start);
    onChange('endTime', end);
  };

  return (
    <Grid gap="medium" data-tour="event-form-time">
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
        placeholder="z.B. Berlin, Alexanderplatz"
      />
    </Grid>
  );
};
