import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

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
    try {
      const { data: events } = await client.models.Event.list();
      return events;
    } catch (error) {
      console.error('Error listing events:', error);
      throw error;
    }
  },

  observeEvents(callback: (events: EventModel[]) => void) {
    return client.models.Event.observeQuery().subscribe({
      next: (data) => callback([...data.items]),
      error: (err) => console.error('ObserveQuery error:', err),
    });
  },

  async createEvent(input: CreateEventInput): Promise<EventModel> {
    try {
      const { data: newEvent, errors } = await client.models.Event.create({
        ...input,
        createdBy: 'guest',
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      if (!newEvent) {
        throw new Error('Event could not be created');
      }

      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async getEvent(id: string): Promise<EventModel> {
    try {
      const { data: event, errors } = await client.models.Event.get({ id });
      if (errors) throw new Error(errors[0].message);
      if (!event) throw new Error('Event not found');
      return event;
    } catch (error) {
      console.error(`Error getting event ${id}:`, error);
      throw error;
    }
  }
};
