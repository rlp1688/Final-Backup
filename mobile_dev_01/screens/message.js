// In your UserLocation component or a separate Chat component
import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import io from 'socket.io-client';

// Initialize socket connection (put this in a central place if used across components)
const socket = io('http://your-server-address:3000'); // Replace with your server URL

const ClientChat = ({ mechanicId }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Listen for messages from mechanic
    socket.on('message-from-mechanic', (msg) => {
      setChatMessages(prev => [...prev, { text: msg.text, sender: 'mechanic' }]);
    });

    return () => {
      socket.off('message-from-mechanic');
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const msgData = {
      to: mechanicId, // The mechanic's socket ID or user ID
      text: message,
      timestamp: new Date().toISOString()
    };

    // Send message to server
    socket.emit('message-from-client', msgData);
    
    // Add to local chat
    setChatMessages(prev => [...prev, { text: message, sender: 'me' }]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        {chatMessages.map((msg, index) => (
          <View 
            key={index} 
            style={[
              styles.messageBubble, 
              msg.sender === 'me' ? styles.myMessage : styles.theirMessage
            ]}
          >
            <Text>{msg.text}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%'
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6'
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 10
  }
});

export default ClientChat;