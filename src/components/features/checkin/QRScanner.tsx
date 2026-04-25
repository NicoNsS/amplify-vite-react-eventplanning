import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { View, Heading, Alert, Button, Flex, Loader } from '@aws-amplify/ui-react';
import { invitationService } from '../../../services/invitationService';

interface QRScannerProps {
  onSuccess?: (invitationId: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onSuccess }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.type === 'EVENT_CHECKIN' && data.invitationId) {
            scanner.clear();
            handleCheckIn(data.invitationId);
          }
        } catch (e) {
          console.error("Ungültiger QR-Code Format", e);
        }
      },
      (errorMessage) => {
        // Scan-Fehler werden hier ignoriert, um das Log nicht zu fluten
        console.debug(errorMessage);
      }
    );

    return () => {
      scanner.clear().catch(error => console.error("Fehler beim Stoppen des Scanners", error));
    };
  }, []);

  const handleCheckIn = async (invitationId: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      await invitationService.updateInvitationStatus(invitationId, 'ATTENDED');
      setScanResult(invitationId);
      if (onSuccess) onSuccess(invitationId);
    } catch (err: any) {
      setError(err.message || "Check-In fehlgeschlagen");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    window.location.reload(); // Einfachste Art den Scanner-DOM-Zustand zurückzusetzen
  };

  return (
    <View padding="medium">
      <Heading level={4} marginBottom="medium">Gäste Check-In</Heading>
      
      {!scanResult && !error && (
        <div id="reader"></div>
      )}

      {isProcessing && (
        <Flex justifyContent="center" padding="medium">
          <Loader size="large" />
          <span>Verarbeite Check-In...</span>
        </Flex>
      )}

      {scanResult && (
        <Alert variation="success" heading="Check-In Erfolgreich!">
          Gast mit ID {scanResult} wurde erfolgreich eingecheckt.
          <Button onClick={resetScanner} variation="primary" marginTop="medium">
            Nächsten Gast scannen
          </Button>
        </Alert>
      )}

      {error && (
        <Alert variation="error" heading="Fehler beim Check-In">
          {error}
          <Button onClick={resetScanner} variation="primary" marginTop="medium">
            Erneut versuchen
          </Button>
        </Alert>
      )}
    </View>
  );
};

export default QRScanner;
