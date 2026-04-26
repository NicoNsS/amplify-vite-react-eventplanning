import React, { useState, useEffect, useCallback } from 'react';
import { View, Heading, Flex, Text, TextField, Button, Card, Divider } from '@aws-amplify/ui-react';
import { commentService, CommentModel } from '../../../services/commentService';
import { authService } from '../../../services/authService';
import { LoadingSpinner } from '../../LoadingSpinner';
import { Heart, ThumbsUp, PartyPopper } from 'lucide-react';
import { formatDateTime } from '../../../utils/dateUtils';
import { Logger } from '../../../utils/logger';

const log = new Logger('CommentSection');

interface CommentSectionProps {
  eventId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ eventId }) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = useCallback(async () => {
    try {
      const fetchedComments = await commentService.listCommentsByEvent(eventId);
      setComments(fetchedComments);
    } catch (error) {
      log.error("Fehler beim Laden der Kommentare", { error });
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const userName = await authService.getUserName();
      const created = await commentService.createComment({
        eventId,
        content: newComment,
        createdBy: userName
      });
      setComments(prev => [created, ...prev]);
      setNewComment('');
    } catch (error) {
      log.error("Fehler beim Erstellen des Kommentars", { error });
    }
  };

  const handleReaction = async (commentId: string, reaction: string) => {
    try {
      const updated = await commentService.addReaction(commentId, reaction);
      setComments(prev => prev.map(c => c.id === commentId ? updated : c));
    } catch (error) {
      log.error("Fehler beim Hinzufügen der Reaktion", { error });
    }
  };

  const getReactionCount = (comment: CommentModel, type: string) => {
    const reactions = (comment.reactions as Record<string, number>) || {};
    return reactions[type] || 0;
  };

  return (
    <View marginTop="xl">
      <Heading level={3}>Kommentare</Heading>

      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="small" marginTop="medium">
          <TextField
            label="Dein Kommentar"
            placeholder="Schreibe etwas..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" variation="primary">Senden</Button>
        </Flex>
      </form>

      <Divider marginTop="large" marginBottom="large" />

      {isLoading ? (
        <LoadingSpinner label="Kommentare werden geladen..." />
      ) : (
        <Flex direction="column" gap="medium">
          {comments.map((comment) => (
            <Card key={comment.id} variation="outlined">
              <Flex direction="column" gap="xs">
                <Flex justifyContent="space-between">
                  <Text fontWeight="bold">{comment.createdBy}</Text>
                  <Text variation="tertiary" fontSize="small">
                    {formatDateTime(comment.createdAt)}
                  </Text>
                </Flex>
                <Text>{comment.content}</Text>
                <Flex gap="small" marginTop="small">
                  <Button
                    size="small"
                    onClick={() => handleReaction(comment.id, 'like')}
                    gap="xs"
                  >
                    <ThumbsUp size={16} /> {getReactionCount(comment, 'like')}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleReaction(comment.id, 'heart')}
                    gap="xs"
                  >
                    <Heart size={16} color="red" /> {getReactionCount(comment, 'heart')}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleReaction(comment.id, 'party')}
                    gap="xs"
                  >
                    <PartyPopper size={16} /> {getReactionCount(comment, 'party')}
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))}
          {comments.length === 0 && <Text>Noch keine Kommentare.</Text>}
        </Flex>
      )}
    </View>
  );
};

export default CommentSection;
