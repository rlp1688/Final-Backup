// MechanicChat.js
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://your-server-address:3000'); // Same as client

const MechanicChat = ({ clientId }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Register as mechanic
    socket.emit('register', {
      userId: 'mechanic123', // Replace with actual mechanic ID
      name: 'John Mechanic',
      role: 'mechanic'
    });

    // Listen for messages from client
    socket.on('message-from-client', (msg) => {
      setChatMessages(prev => [...prev, { text: msg.text, sender: 'client' }]);
    });

    return () => {
      socket.off('message-from-client');
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const msgData = {
      to: clientId, // The client's ID
      text: message
    };

    socket.emit('message-from-mechanic', msgData);
    setChatMessages(prev => [...prev, { text: message, sender: 'me' }]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      {/* Similar chat UI as the client component */}
    </View>
  );
};

// Use similar styles as the ClientChat component

export default MechanicChat;