import { View } from '@aws-amplify/ui-react';
import { EventForm } from '../components/EventForm';

export default function NewEventPage() {
  return (
    <View padding="1rem">
      <EventForm />
    </View>
  );
}
