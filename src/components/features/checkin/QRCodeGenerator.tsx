import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { View, Text, Card, Heading, Flex } from '@aws-amplify/ui-react';

interface QRCodeGeneratorProps {
  invitationId: string;
  eventName: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ invitationId, eventName }) => {
  // Der QR-Code enthält die Invitation ID, die beim Scannen verifiziert wird
  const checkInData = JSON.stringify({
    type: 'EVENT_CHECKIN',
    invitationId: invitationId
  });

  return (
    <Card variation="outlined">
      <Flex direction="column" alignItems="center" gap="medium">
        <Heading level={4}>Dein Check-In QR-Code</Heading>
        <Text>Zeige diesen Code beim Einlass zu "{eventName}" vor.</Text>
        <View padding="medium" backgroundColor="white">
          <QRCodeSVG value={checkInData} size={200} />
        </View>
        <Text variation="tertiary" fontSize="small">ID: {invitationId}</Text>
      </Flex>
    </Card>
  );
};

export default QRCodeGenerator;
