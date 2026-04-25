import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Logger } from '../utils/logger';

const client = generateClient<Schema>();
const log = new Logger('InvitationService');

export type InvitationModel = Schema["Invitation"]["type"];

export interface CreateInvitationInput {
  eventId: string;
  inviteeEmail: string;
  role: 'SPEAKER' | 'VENDOR' | 'VIP' | 'ATTENDEE';
}

export const invitationService = {
  async createInvitation(input: CreateInvitationInput): Promise<InvitationModel> {
    log.debug('Creating invitation', { input });
    try {
      const { data: newInvitation, errors } = await client.models.Invitation.create({
        ...input,
        status: 'PENDING',
      });

      if (errors) {
        log.error('GraphQL errors during invitation creation', { errors });
        throw new Error(errors[0].message);
      }
      if (!newInvitation) throw new Error('Invitation could not be created');

      log.info('Invitation created', { invitationId: newInvitation.id, eventId: input.eventId });
      return newInvitation;
    } catch (error: any) {
      log.error('Error creating invitation', { error: error.message, input });
      throw error;
    }
  },

  async getInvitation(id: string): Promise<InvitationModel> {
    log.debug('Getting invitation', { id });
    try {
      const { data: invitation, errors } = await client.models.Invitation.get({ id });
      if (errors) {
        log.error('GraphQL errors during get invitation', { id, errors });
        throw new Error(errors[0].message);
      }
      if (!invitation) {
        log.warn('Invitation not found', { id });
        throw new Error('Invitation not found');
      }
      log.info('Invitation retrieved', { id });
      return invitation;
    } catch (error: any) {
      log.error(`Error getting invitation ${id}`, { error: error.message });
      throw error;
    }
  },

  async updateInvitationStatus(id: string, status: InvitationModel['status']): Promise<InvitationModel> {
    log.debug('Updating invitation status', { id, status });
    try {
      const { data: updatedInvitation, errors } = await client.models.Invitation.update({
        id,
        status,
      });

      if (errors) {
        log.error('GraphQL errors during update invitation status', { id, errors });
        throw new Error(errors[0].message);
      }
      if (!updatedInvitation) throw new Error('Invitation could not be updated');

      log.info('Invitation status updated', { id, status });
      return updatedInvitation;
    } catch (error: any) {
      log.error(`Error updating invitation status ${id}`, { error: error.message });
      throw error;
    }
  },

  async listInvitationsByEvent(eventId: string): Promise<InvitationModel[]> {
    log.debug('Listing invitations for event', { eventId });
    try {
      const { data: invitations } = await client.models.Invitation.list({
        filter: { eventId: { eq: eventId } }
      });
      log.info('Invitations listed', { eventId, count: invitations.length });
      return invitations;
    } catch (error: any) {
      log.error(`Error listing invitations for event ${eventId}`, { error: error.message });
      throw error;
    }
  }
};
