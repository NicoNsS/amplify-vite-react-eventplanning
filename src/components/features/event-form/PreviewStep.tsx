import React from 'react';
import { View, Text, Divider, Flex, Heading } from '@aws-amplify/ui-react';
import { Calendar as CalendarIcon, MapPin, Globe } from 'lucide-react';
import { EventFormData } from './useEventForm';
import { formatDateTime } from '../../../utils/dateUtils';

interface PreviewStepProps {
  data: EventFormData;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ data }) => (
  <View>
    <Heading level={4} marginBottom="1rem">{data.title || 'Unbenanntes Event'}</Heading>
    
    <Flex direction="column" gap="small" marginBottom="1.5rem">
      <Flex alignItems="center" gap="small">
        <CalendarIcon size={18} color="gray" />
        <View>
          <Text fontWeight="bold">Zeitraum</Text>
          <Text fontSize="small">
            {data.startTime ? formatDateTime(data.startTime) : 'Nicht gesetzt'} - 
            {data.endTime ? formatDateTime(data.endTime) : 'Nicht gesetzt'}
          </Text>
        </View>
      </Flex>

      <Flex alignItems="center" gap="small">
        <MapPin size={18} color="gray" />
        <View>
          <Text fontWeight="bold">Ort</Text>
          <Text fontSize="small">{data.location || 'Kein Ort angegeben'}</Text>
        </View>
      </Flex>

      <Flex alignItems="center" gap="small">
        <Globe size={18} color="gray" />
        <View>
          <Text fontWeight="bold">Sichtbarkeit</Text>
          <Text fontSize="small">{data.visibility === 'PUBLIC' ? 'Öffentlich' : 'Privat'}</Text>
        </View>
      </Flex>
    </Flex>

    <Divider marginBottom="1.5rem" />
    
    <View>
      <Text fontWeight="bold" marginBottom="0.5rem">Beschreibung</Text>
      <Text variation="tertiary" style={{ whiteSpace: 'pre-wrap' }}>
        {data.description || 'Keine Beschreibung vorhanden.'}
      </Text>
    </View>
  </View>
);
