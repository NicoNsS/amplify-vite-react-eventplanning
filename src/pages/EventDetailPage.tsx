import { Heading, View, Text, Card, Flex, Button, Loader, Alert } from "@aws-amplify/ui-react"; 
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, ChevronLeft } from "lucide-react";
import { eventService, EventModel } from "../services/eventService";

export default function EventDetailPage() { 
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    eventService.getEvent(id)
      .then(setEvent)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
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
    </View>
  );
}
