import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ErrorBanner = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorBanner;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fee2e2',
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  text: {
    flex: 1,
    color: '#b91c1c',
  },
  button: {
    marginLeft: 8,
    backgroundColor: '#b91c1c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
