import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, ImageBackground, TextInput, TouchableOpacity, ScrollView, Text, StyleSheet, Image, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Divider from '../components/Divider';
import * as ImagePicker from 'expo-image-picker';
import Title from '../components/Title';
import SectionTitle from '../components/SectionTitle';
import { ipAddress } from '../../constants';
import axios from 'axios';
import { useUserContext } from '../../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Subtitle from '../components/Subtitle';
import { useSelector, useDispatch } from 'react-redux'; // Import Redux functions
import { addMessage, clearMessages } from '../../ReduxActions';


// EmojiPicker component
const EmojiPicker = ({ onSelectEmoji }) => {
  const emojis = ['😃', '😊', '🙂', '😄', '😁', '😆', '😍', '😎', '😜', '🥳', '🤩', '😘', ];

  return (
    <View style={styles.emojiPicker}>
      {emojis.map((emoji, index) => (
        <TouchableOpacity key={index} onPress={() => onSelectEmoji(emoji)}>
          <Text style={styles.emoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Chat = ({ navigation }) => {
  const [messageText, setMessageText] = useState('');
  const [attachmentImage, setAttachmentImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const { userInfo } = useUserContext();
  const scrollViewRef = useRef(null);
  const [fetchInterval, setFetchInterval] = useState(null);
  const messages = useSelector((state) => state.messages);
  const dispatch = useDispatch();


  useEffect(() => {
    // Request permission for accessing the device's image library
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
      }
    })();
  }, []);


  const sendMessage = async () => {
    const timestamp = new Date().toLocaleTimeString();
    const newMessage = {
      text: messageText,
      fromAdmin: false,
      timestamp,
      image: attachmentImage ? attachmentImage.uri : null,
    };
  
    // Update the state immediately with the new message
    dispatch(addMessage(newMessage));
    setMessageText('');
    setAttachmentImage(null);
  
    try {
      const formData = new FormData();
      formData.append('content', messageText); // Include the text content
      formData.append('recipient_id', 1); // Admin's ID
      formData.append('sender_id', userInfo.id); // User's ID
      if (attachmentImage) {
        formData.append('image', {
          uri: attachmentImage.uri,
          type: 'image/jpeg', // Adjust the MIME type accordingly
          name: 'attachment.jpg', // You can provide a name for the attachment
        });
      }
  
      const response = await axios.post(
        `${ipAddress}/api/send-message/1/`, // Assuming 1 is the admin's ID
        formData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            'Content-Type': 'multipart/form-data', // Specify content type for image attachment
          },
        }
      );
  
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  

  

  
  const fetchMessages = async () => {
    try {
      const recipient_id = 1; // User or admin's ID, depending on the recipient
      const response = await axios.get(
        `${ipAddress}/api/get-messages/${recipient_id}/`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      // Assuming the API response structure matches the structure of your state
      const newMessages = response.data;
      dispatch(clearMessages()); // Clear existing messages before updating with new ones
      newMessages.forEach((message) => {
        dispatch(addMessage(message)); // Add each new message to Redux state
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  



  // Renamed fetchNewMessages to fetchMessages
  useEffect(() => {
    fetchMessages(); // Fetch messages immediately
    // Set up a polling interval to fetch new messages every 10 seconds
    const intervalId = setInterval(fetchMessages, 1 * 60 * 1000); // Adjust the interval as needed
    setFetchInterval(intervalId);

    // Clean up the interval when the component unmounts
    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, []);



  useEffect(() => {
    // Load messages from AsyncStorage and fetch from server
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('chatMessages');
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages);
          parsedMessages.forEach((message) => {
            dispatch(addMessage(message)); // Add each stored message to Redux state
          });
        }


        // Fetch messages from server
        fetchMessages();
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, []);

  

  useEffect(() => {
    // Auto-scroll to the bottom of the chat when a new message is added
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const pickImage = async () => {
    setIsImagePickerOpen(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      exif: true,
    });

    if (!result.canceled) {
      setAttachmentImage(result.assets[0]);
    }
    setIsImagePickerOpen(false);
  };

  const openPreview = (imageUri) => {
    setPreviewImage(imageUri);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const handleSelectEmoji = (emoji) => {
    setMessageText((prevText) => prevText + emoji);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>CHAT ADMIN</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
            <Ionicons name="ios-information-circle-outline" size={24} color="silver" />
          </TouchableOpacity>
        </View>
      </View>

      <Title>Message Admin</Title>
      <Subtitle>Leave us a message here and we'll get back to you ASAP</Subtitle>

      <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
              <ImageBackground
                  source={require('./icb2.png')}
                  style={styles.propertyContainer}
                  imageStyle={styles.backgroundImage}
                  >
                  <Ionicons name="chatbubbles-outline" size={34} color="#fff" style={{ marginRight: 15 }} />
                  <Text style={styles.propertyText}>
                    Kindly consult us during our working hours (Mondays - Fridays: 9am-5pm, Saturdays & Public holidays: 10am-4pm). You can also leave us a message and we will reply once we come back online. Thank you.
                  </Text>
                </ImageBackground>


        <Divider />

        <SectionTitle>CONVERSATION WITH MYFUND</SectionTitle>

        {messages.map((message, index) => (
                <View
                  key={index}
                  style={
                    message.sender_id === 1 // Assuming 1 is the admin's ID
                      ? styles.adminMessage
                      : styles.userMessage
                  }
                >
                  <Text style={styles.messageText}>{message.content}</Text>
                  {/* Render the image if available */}
                  {message.image && (
                    <TouchableOpacity
                      onPress={() => openPreview(message.image)}
                    >
                      <Image
                        source={{ uri: message.image }}
                        style={styles.attachmentImage}
                      />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.timestamp}>
                    {message.timestamp}
                  </Text>
                </View>
              ))}

      </ScrollView>

      <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
    <Ionicons name="happy-outline" size={24} color="#4C28BC" />
  </TouchableOpacity>
  <TextInput
    style={styles.input}
    placeholder="Type your message..."
    onChangeText={(text) => setMessageText(text)}
    value={messageText}
  />
 
 {attachmentImage && (
    <View style={styles.attachmentPreview}>
      <Image source={{ uri: attachmentImage.uri }} style={styles.attachmentImage} />
      <TouchableOpacity style={styles.removeAttachment} onPress={() => setAttachmentImage(null)}>
        <Ionicons name="close-circle" size={24} color="red" marginLeft={80}/>
      </TouchableOpacity>
    </View>
  )}
  <TouchableOpacity style={styles.iconButton} onPress={pickImage} disabled={isImagePickerOpen}>
    <Ionicons name="attach-outline" size={24} color="#4C28BC" />
  </TouchableOpacity>
  <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
    <Ionicons name="ios-send" size={24} color="white" />
  </TouchableOpacity>
</View>


      {/* Image preview */}
      <Modal visible={!!previewImage} transparent>
        <View style={styles.modalContainer}>
          <Image source={{ uri: previewImage }} style={styles.previewImage} />
          <TouchableOpacity style={styles.closeButton} onPress={closePreview}>
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Emoji picker */}
      {isEmojiPickerOpen && (
        <EmojiPicker onSelectEmoji={handleSelectEmoji} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1FF',
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
    height: 43,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerText: {
    flex: 1,
    color: 'silver',
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: 'karla',
    letterSpacing: 3,
  },

  
  savingsContainer: {
    flexDirection: 'column',
    backgroundColor: '#4C28BC',
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
    alignItems: 'center',
    height: 150,
    },

    propertyContainer: {
      alignItems: 'center',
      paddingHorizontal: 13,
      flexDirection: 'row',
      backgroundColor: '#DCD1FF',
      padding: 15,
      marginHorizontal: 20,
      borderRadius: 10,
    },
  

    
backgroundImage: {
  flex: 1,
  resizeMode: 'cover',
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
},
  propertyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'regular',
    fontFamily: 'karla',
    letterSpacing: -0.4,
    color: '#fff',
    marginRight: 25,
    letterSpacing: -0.5,
  },
  adminMessage: {
    backgroundColor: 'green',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
    margin: 5,
  },
  userMessage: {
    backgroundColor: '#4C28BC',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 20,
    padding: 10,
    alignSelf: 'flex-end',
    margin: 5,
  },
  messageText: {
    color: 'white', // Adjust the text color for admin and user messages
    fontFamily: 'ProductSans',
    fontSize: 16,
  },
  timestamp: {
    fontFamily: 'karla',
    fontSize: 9,
    marginTop: 3,
    color: 'silver',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: '#D6D6D6',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 8,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  iconButton: {
    paddingHorizontal: 10,
  },
  attachmentImage: {
    width: 100,
    height: 100,
    marginTop: 5,
    resizeMode: 'cover',
  },
  sendButton: {
    backgroundColor: '#4C28BC',
    borderRadius: 80,
    padding: 8,
  },
  attachmentPreview: {
    position: 'relative',
  },
  removeAttachment: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  previewImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  emojiPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F6F3FF',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  emoji: {
    fontSize: 24,
    marginHorizontal: 5,
    marginVertical: 5,
  },
});

export default Chat;