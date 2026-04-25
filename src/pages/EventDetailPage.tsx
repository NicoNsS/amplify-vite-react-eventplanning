import { Heading, View, Text, Card, Flex, Button, Loader, Alert, Tabs } from "@aws-amplify/ui-react"; 
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, ChevronLeft, Scan } from "lucide-react";
import { eventService, EventModel } from "../services/eventService";
import QRCodeGenerator from "../components/features/checkin/QRCodeGenerator";
import QRScanner from "../components/features/checkin/QRScanner";
import CommentSection from "../components/features/comments/CommentSection";
import { invitationService, InvitationModel } from "../services/invitationService";
import { Logger } from "../utils/logger";

const log = new Logger('EventDetail');

export default function EventDetailPage() { 
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<InvitationModel | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const loadData = async () => {
      log.info('Loading event details', { eventId: id });
      try {
        const ev = await eventService.getEvent(id);
        setEvent(ev);

        // Simulator: Lade oder erstelle eine Test-Einladung für den aktuellen User
        const invitations = await invitationService.listInvitationsByEvent(id);
        if (invitations.length > 0) {
          setInvitation(invitations[0]);
        } else {
          log.debug('No invitation found, creating mock invitation');
          // Erstelle eine Mock-Einladung für die Demo
          const mockInv = await invitationService.createInvitation({
            eventId: id,
            inviteeEmail: 'test@example.com',
            role: 'ATTENDEE'
          });
          setInvitation(mockInv);
        }
      } catch (err: any) {
        log.error('Error loading event data', { error: err.message, eventId: id });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <Flex justifyContent="center" padding="4rem">
        <Loader size="large" />
      </Flex>
    );
  }

  if (error || !event) {
    return (
      <View padding="1rem">
        <Alert variation="error">{error || "Event nicht gefunden"}</Alert>
        <Button onClick={() => navigate('/')} marginTop="1rem">Zurück zum Dashboard</Button>
      </View>
    );
  }

  return (
    <View padding="1rem">
      <Button 
        variation="link" 
        onClick={() => navigate(-1)} 
        marginBottom="1rem"
        gap="0.5rem"
      >
        <ChevronLeft size={20} /> Zurück
      </Button>

      <Card variation="elevated">
        <Heading level={1} marginBottom="1.5rem">{event.title}</Heading>
        
        <Flex direction="column" gap="medium">
          <Flex alignItems="center" gap="small">
            <Calendar size={20} color="gray" />
            <Text>{new Date(event.startTime).toLocaleDateString()}</Text>
          </Flex>

          <Flex alignItems="center" gap="small">
            <Clock size={20} color="gray" />
            <Text>
              {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Flex>

          {event.location && (
            <Flex alignItems="center" gap="small">
              <MapPin size={20} color="gray" />
              <Text>{event.location}</Text>
            </Flex>
          )}

          <View marginTop="1rem">
            <Text fontWeight="bold" marginBottom="0.5rem">Beschreibung</Text>
            <Text variation="tertiary" style={{ whiteSpace: 'pre-wrap' }}>
              {event.description || 'Keine Beschreibung vorhanden.'}
            </Text>
          </View>
        </Flex>
      </Card>

      <Tabs
        marginTop="xl"
        defaultValue="Details"
        items={[
          {
            label: 'Details',
            value: 'Details',
            content: (
              <View paddingTop="large">
                <CommentSection eventId={event.id} />
              </View>
            ),
          },
          {
            label: 'Check-In',
            value: 'Check-In',
            content: (
              <View paddingTop="large" data-tour="qr-checkin">
                <Flex direction="column" gap="medium">
                  {invitation && (
                    <QRCodeGenerator 
                      invitationId={invitation.id} 
                      eventName={event.title} 
                    />
                  )}
                  
                  <Button 
                    onClick={() => setShowScanner(!showScanner)}
                    variation="menu"
                    gap="small"
                  >
                    <Scan size={20} /> {showScanner ? "Scanner schließen" : "Organisator: Gast einchecken"}
                  </Button>

                  {showScanner && (
                    <Card variation="outlined" marginTop="medium">
                      <QRScanner onSuccess={() => setShowScanner(false)} />
                    </Card>
                  )}
                </Flex>
              </View>
            ),
          },
        ]}
      />
    </View>
  );
}
