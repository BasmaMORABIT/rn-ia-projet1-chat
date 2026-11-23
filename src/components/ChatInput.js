import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

// Composant de présentation : le texte et les actions viennent du parent (App).
const ChatInput = ({ value, onChangeText, onSend, disabled }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pose ta question..."
        value={value}
        onChangeText={onChangeText}
        multiline
      />
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onSend}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  input: {
    flex: 1, // prend toute la place restante à côté du btn et le btn garde sa taille
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    marginLeft: 8,
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
