import React from 'react';
import { Flex, Loader, View, Text } from '@aws-amplify/ui-react';

interface LoadingSpinnerProps {
  label?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  label = 'Lädt...', 
  fullPage = false 
}) => {
  const content = (
    <Flex direction="column" alignItems="center" justifyContent="center" gap="medium">
      <Loader size="large" />
      {label && <Text variation="tertiary">{label}</Text>}
    </Flex>
  );

  if (fullPage) {
    return (
      <View padding="4rem" height="50vh">
        {content}
      </View>
    );
  }

  return content;
};
