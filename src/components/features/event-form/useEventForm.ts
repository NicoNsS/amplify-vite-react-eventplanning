import { useState } from 'react';
import { eventService, CreateEventInput } from '../../../services/eventService';
import { Logger } from '../../../utils/logger';
import { errorHints } from '../../../utils/errorHints';

const log = new Logger('EventForm');

export interface EventFormData extends Omit<CreateEventInput, 'startTime' | 'endTime'> {
  startTime: string;
  endTime: string;
}

const initialData: EventFormData = {
  title: '',
  description: '',
  location: '',
  startTime: '',
  endTime: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  visibility: 'PRIVATE',
};

export function useEventForm(onSuccess?: () => void) {
  const [formData, setFormData] = useState<EventFormData>(initialData);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const submit = async () => {
    log.info('User submitted event form', { title: formData.title });
    log.debug('Form payload', formData);
    setLoading(true);
    setError(null);
    try {
      await eventService.createEvent({
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      });
      log.info('Event creation successful');
      setFormData(initialData);
      setStep(1);
      onSuccess?.();
    } catch (err: any) {
      const code = err?.code ?? err?.name ?? 'FormSubmitError';
      const hint = errorHints[code];
      log.error('Failed to create event', { error: err.message }, code);
      setError(`${err.message}${hint ? ` – Hinweis: ${hint}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    step,
    loading,
    error,
    updateField,
    nextStep,
    prevStep,
    submit,
  };
}
