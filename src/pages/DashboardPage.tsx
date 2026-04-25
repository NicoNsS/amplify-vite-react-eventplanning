import { Heading, View, Text, Grid, Card, Flex, Button, Collection } from "@aws-amplify/ui-react";
import { Plus, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { eventService } from "../services/eventService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Array<Schema["Event"]["type"]>>([]);

  useEffect(() => {
    const sub = eventService.observeEvents(setEvents);
    return () => sub.unsubscribe();
  }, []);

  return (
    <View padding="1rem">
      <View 
        backgroundColor="brand.primary.80" 
        padding={{ base: '1.5rem', medium: '2.5rem' }}
        borderRadius="large" 
        marginBottom="2rem"
        color="white"
        boxShadow="medium"
      >
        <Heading level={1} color="white">Willkommen!</Heading>
        <Text fontSize="1.2rem">Plane dein nächstes großartiges Event.</Text>
        <Button 
          marginTop="1.5rem" 
          backgroundColor="white" 
          color="brand.primary.80"
          onClick={() => navigate('/events/new')}
        >
          Neues Event erstellen
        </Button>
      </View>

      <Grid
        templateColumns={{ base: '1fr', medium: '1fr 1fr', large: '2fr 1fr' }}
        gap="1.5rem"
      >
        <View>
          <Heading level={3} marginBottom="1rem">Deine Events</Heading>
          {events.length === 0 ? (
            <Card variation="elevated">
              <Text>Du hast noch keine Events erstellt.</Text>
            </Card>
          ) : (
            <Collection
              items={events}
              type="list"
              direction="column"
              gap="1rem"
            >
              {(event) => (
                <Card 
                  key={event.id} 
                  variation="elevated" 
                  onClick={() => navigate(`/events/${event.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <Flex direction="column" gap="xs">
                    <Heading level={4}>{event.title}</Heading>
                    <Flex alignItems="center" gap="xs" fontSize="small" color="font.tertiary">
                      <CalendarIcon size={14} />
                      <Text>{new Date(event.startTime).toLocaleDateString()}</Text>
                      <Clock size={14} marginLeft="0.5rem" />
                      <Text>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </Flex>
                    {event.location && (
                      <Flex alignItems="center" gap="xs" fontSize="small" color="font.tertiary">
                        <MapPin size={14} />
                        <Text>{event.location}</Text>
                      </Flex>
                    )}
                  </Flex>
                </Card>
              )}
            </Collection>
          )}
        </View>

        <Flex direction="column" gap="1.5rem">
          <Card variation="elevated">
            <Heading level={4} marginBottom="0.5rem">Ausstehend</Heading>
            <Text fontSize="small">Keine ausstehenden Einladungen.</Text>
          </Card>
          <Card variation="elevated">
            <Heading level={4} marginBottom="0.5rem">Quick Links</Heading>
            <Flex direction="column" gap="xs">
              <Button variation="link" justifyContent="flex-start" size="small" onClick={() => navigate('/calendar')}>Kalender öffnen</Button>
              <Button variation="link" justifyContent="flex-start" size="small" onClick={() => navigate('/settings')}>Profil bearbeiten</Button>
            </Flex>
          </Card>
        </Flex>
      </Grid>

      <Button
        position="fixed"
        bottom={{ base: '1.5rem', medium: '2.5rem' }}
        right={{ base: '1.5rem', medium: '2.5rem' }}
        borderRadius="50%"
        width="3.5rem"
        height="3.5rem"
        padding="0"
        variation="primary"
        onClick={() => navigate('/events/new')}
        boxShadow="large"
        ariaLabel="Event erstellen"
      >
        <Plus size={28} />
      </Button>
    </View>
  );
};

export default DashboardPage;
