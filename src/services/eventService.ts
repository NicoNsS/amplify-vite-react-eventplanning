import { generateClient } from 'aws-amplify/data';
import { authService } from './authService';
import type { Schema } from '../../amplify/data/resource';
import { Logger } from '../utils/logger';

const client = generateClient<Schema>();
const log = new Logger('EventService');

export type EventModel = Schema["Event"]["type"];

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  visibility: 'PUBLIC' | 'PRIVATE';
}

export const eventService = {
  async listEvents(): Promise<EventModel[]> {
    log.debug('Listing events');
    try {
      if (!client.models.Event) {
        log.warn("Model 'Event' not found. Please check amplify_outputs.json");
        return [];
      }
      const { data: events } = await client.models.Event.list();
      log.info('Events listed', { count: events.length });
      return events;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = error?.code ?? error?.name;
      log.error('Error listing events', { error: errorMessage }, errorCode);
      throw error;
    }
  },

  observeEvents(callback: (events: EventModel[]) => void) {
    if (!client.models.Event) {
      log.warn("Model 'Event' not found. Please check amplify_outputs.json");
      return { unsubscribe: () => {} };
    }
    return client.models.Event.observeQuery().subscribe({
      next: (data) => callback([...data.items]),
      error: (err) => log.error('ObserveQuery error:', { error: err }),
    });
  },

  async createEvent(input: CreateEventInput): Promise<EventModel> {
    log.debug('Creating event', { input });
    try {
      if (!client.models.Event) {
        throw new Error("Model 'Event' not found in configuration.");
      }
      const userId = await authService.getUserId();
      const { data: newEvent, errors } = await client.models.Event.create({
        ...input,
        createdBy: userId,
      });

      if (errors) {
        log.error('GraphQL errors during event creation', { errors });
        throw new Error(errors[0].message);
      }

      if (!newEvent) {
        throw new Error('Event could not be created');
      }

      log.info('Event created', { eventId: newEvent.id });
      return newEvent;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = error?.code ?? error?.name;
      log.error('Error creating event', { error: errorMessage, input }, errorCode);
      throw error;
    }
  },

  async getEvent(id: string): Promise<EventModel> {
    log.debug('Getting event', { id });
    try {
      if (!client.models.Event) {
        throw new Error("Model 'Event' not found in configuration.");
      }
      const { data: event, errors } = await client.models.Event.get({ id });
      if (errors) {
        log.error('GraphQL errors during get event', { id, errors });
        throw new Error(errors[0].message);
      }
      if (!event) {
        log.warn('Event not found', { id });
        throw new Error('Event not found');
      }
      log.info('Event retrieved', { id });
      return event;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = error?.code ?? error?.name;
      log.error(`Error getting event ${id}`, { error: errorMessage }, errorCode);
      throw error;
    }
  }
};
