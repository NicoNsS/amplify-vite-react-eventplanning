import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Logger } from '../utils/logger';

const client = generateClient<Schema>();
const log = new Logger('CommentService');

export type CommentModel = Schema["Comment"]["type"];

export interface CreateCommentInput {
  eventId: string;
  content: string;
  createdBy: string;
}

export const commentService = {
  async createComment(input: CreateCommentInput): Promise<CommentModel> {
    log.debug('Creating comment', { input });
    try {
      const { data: newComment, errors } = await client.models.Comment.create({
        ...input,
        reactions: {},
      });

      if (errors) {
        log.error('GraphQL errors during comment creation', { errors });
        throw new Error(errors[0].message);
      }
      if (!newComment) throw new Error('Comment could not be created');

      log.info('Comment created', { commentId: newComment.id, eventId: input.eventId });
      return newComment;
    } catch (error: any) {
      log.error('Error creating comment', { error: error.message, input });
      throw error;
    }
  },

  async listCommentsByEvent(eventId: string): Promise<CommentModel[]> {
    log.debug('Listing comments for event', { eventId });
    try {
      const { data: comments } = await client.models.Comment.list({
        filter: { eventId: { eq: eventId } }
      });
      log.info('Comments listed', { eventId, count: comments.length });
      return comments;
    } catch (error: any) {
      log.error(`Error listing comments for event ${eventId}`, { error: error.message });
      throw error;
    }
  },

  async addReaction(commentId: string, reaction: string): Promise<CommentModel> {
    log.debug('Adding reaction', { commentId, reaction });
    try {
      const { data: comment } = await client.models.Comment.get({ id: commentId });
      if (!comment) {
        log.warn('Comment not found for reaction', { commentId });
        throw new Error('Comment not found');
      }

      const reactions = (comment.reactions as Record<string, number>) || {};
      reactions[reaction] = (reactions[reaction] || 0) + 1;

      const { data: updatedComment, errors } = await client.models.Comment.update({
        id: commentId,
        reactions,
      });

      if (errors) {
        log.error('GraphQL errors during adding reaction', { commentId, errors });
        throw new Error(errors[0].message);
      }
      if (!updatedComment) throw new Error('Comment could not be updated');

      log.info('Reaction added', { commentId, reaction });
      return updatedComment;
    } catch (error: any) {
      log.error(`Error adding reaction to comment ${commentId}`, { error: error.message });
      throw error;
    }
  }
};
