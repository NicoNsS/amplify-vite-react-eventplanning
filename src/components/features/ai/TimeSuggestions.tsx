import React from 'react';
import { Flex, Text, Button, Badge } from '@aws-amplify/ui-react';
import { Sparkles } from 'lucide-react';

interface TimeSuggestionsProps {
  onSelect: (start: string, end: string) => void;
}

const TimeSuggestions: React.FC<TimeSuggestionsProps> = ({ onSelect }) => {
  // Simulator für AI-Vorschläge basierend auf "besten Zeiten"
  const suggestions = [
    { start: '18:00', end: '20:00', label: 'Feierabend-Event' },
    { start: '10:00', end: '12:00', label: 'Vormittags-Workshop' },
    { start: '12:30', end: '14:00', label: 'Business Lunch' },
  ];

  const handleApply = (startTime: string, endTime: string) => {
    // Heute als Basisdatum nehmen
    const today = new Date().toISOString().split('T')[0];
    onSelect(`${today}T${startTime}`, `${today}T${endTime}`);
  };

  return (
    <Flex direction="column" gap="small" marginTop="medium">
      <Flex alignItems="center" gap="xs">
        <Sparkles size={16} color="#007EB9" />
        <Text fontSize="small" fontWeight="bold">KI-Zeitvorschläge (basierend auf Beliebtheit)</Text>
      </Flex>
      <Flex gap="xs" wrap="wrap">
        {suggestions.map((s, idx) => (
          <Button 
            key={idx} 
            size="small" 
            onClick={() => handleApply(s.start, s.end)}
            variation="link"
            padding="0"
          >
            <Badge variation="info" style={{ cursor: 'pointer' }}>
              {s.label} ({s.start})
            </Badge>
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};

export default TimeSuggestions;
