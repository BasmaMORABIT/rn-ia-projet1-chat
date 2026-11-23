import { View, Text, StyleSheet } from 'react-native';

// Composant de présentation : pas de state, il affiche ce qu'il reçoit en props.
const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={isUser ? styles.userText : styles.aiText}>{content}</Text>
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 12,
  },
  userBubble: {
    alignSelf: 'flex-end', // à droite
    backgroundColor: '#4f46e5',
  },
  aiBubble: {
    alignSelf: 'flex-start', // à gauche
    backgroundColor: '#e5e7eb',
  },
  userText: {
    color: 'white',
    fontSize: 16,
  },
  aiText: {
    color: '#111827',
    fontSize: 16,
  },
});
