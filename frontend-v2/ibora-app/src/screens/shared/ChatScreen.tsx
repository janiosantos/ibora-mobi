/**
 * ChatScreen - Universal
 * Simple chat between driver and passenger
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { Avatar } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { wsService, WSEventType } from '../../api/websocket';

interface Message {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
  isMine: boolean;
}

interface ChatScreenProps {
  rideId: string;
  otherUser: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  currentUserId: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  rideId,
  otherUser,
  currentUserId,
}) => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Listen for new messages via WebSocket
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (data.ride_id === rideId) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            text: data.text,
            sender_id: data.sender_id,
            created_at: data.created_at,
            isMine: data.sender_id === currentUserId,
          },
        ]);
      }
    };

    const unsubscribe = wsService.on(WSEventType.NEW_MESSAGE, handleNewMessage);

    // Load message history
    loadMessages();

    return () => unsubscribe();
  }, [rideId]);

  const loadMessages = async () => {
    try {
      // Load chat history from API
      // const history = await chatApi.getMessages(rideId);
      // setMessages(history);
      
      // Mock data for now
      setMessages([
        {
          id: '1',
          text: 'Olá! Estou a caminho.',
          sender_id: otherUser.id,
          created_at: new Date().toISOString(),
          isMine: false,
        },
        {
          id: '2',
          text: 'Ok, obrigado!',
          sender_id: currentUserId,
          created_at: new Date().toISOString(),
          isMine: true,
        },
      ]);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const tempMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
      isMine: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Send to API
      // await chatApi.sendMessage(rideId, inputText.trim());
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isMine ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {!item.isMine && (
        <Avatar
          uri={otherUser.avatar_url}
          size={32}
          name={otherUser.name}
        />
      )}

      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: item.isMine ? colors.primary : colors.background.secondary,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: item.isMine ? 'white' : colors.text.primary,
            },
          ]}
        >
          {item.text}
        </Text>

        <Text
          style={[
            styles.messageTime,
            {
              color: item.isMine ? 'rgba(255,255,255,0.7)' : colors.text.tertiary,
            },
          ]}
        >
          {new Date(item.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.text.tertiary} />
            <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
              Nenhuma mensagem ainda
            </Text>
          </View>
        }
      />

      {/* Input Container */}
      <View style={[styles.inputContainer, { backgroundColor: colors.background.secondary }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            },
          ]}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={colors.text.tertiary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: inputText.trim() ? colors.primary : colors.border,
            },
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? 'white' : colors.text.tertiary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: spacing.md,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: 16,
  },
  messageText: {
    fontSize: typography.fontSize.md,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'flex-end',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    marginTop: spacing.md,
  },
});
