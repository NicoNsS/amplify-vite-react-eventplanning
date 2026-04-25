import React, { useState, useEffect } from 'react';
import { View, Heading, Flex, Text, TextField, Button, Card, Divider } from '@aws-amplify/ui-react';
import { commentService, CommentModel } from '../../../services/commentService';
import { Heart, ThumbsUp, PartyPopper } from 'lucide-react';

interface CommentSectionProps {
  eventId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ eventId }) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [eventId]);

  const loadComments = async () => {
    try {
      const fetchedComments = await commentService.listCommentsByEvent(eventId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Fehler beim Laden der Kommentare", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const created = await commentService.createComment({
        eventId,
        content: newComment,
        createdBy: 'Gast-Benutzer' // In einer echten App wäre dies der eingeloggte User
      });
      setComments([created, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error("Fehler beim Erstellen des Kommentars", error);
    }
  };

  const handleReaction = async (commentId: string, reaction: string) => {
    try {
      const updated = await commentService.addReaction(commentId, reaction);
      setComments(comments.map(c => c.id === commentId ? updated : c));
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Reaktion", error);
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
        <Text>Lädt...</Text>
      ) : (
        <Flex direction="column" gap="medium">
          {comments.map((comment) => (
            <Card key={comment.id} variation="outlined">
              <Flex direction="column" gap="xs">
                <Flex justifyContent="space-between">
                  <Text fontWeight="bold">{comment.createdBy}</Text>
                  <Text variation="tertiary" fontSize="small">
                    {new Date(comment.createdAt).toLocaleString()}
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
