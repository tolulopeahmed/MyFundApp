import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Divider from "../components/Divider";
import * as ImagePicker from "expo-image-picker";
import Title from "../components/Title";
import SectionTitle from "../components/SectionTitle";
import { ipAddress } from "../../constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Subtitle from "../components/Subtitle";
import { useSelector, useDispatch } from "react-redux"; // Import Redux functions
import { addMessage, clearMessages } from "../../ReduxActions";
import { useTheme } from "../../ThemeContext";

const Chat = ({ navigation }) => {
  const [messageText, setMessageText] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [attachmentImage, setAttachmentImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const scrollViewRef = useRef(null);
  const [fetchInterval, setFetchInterval] = useState(null);
  const messages = useSelector((state) => state.bank.messages);
  const dispatch = useDispatch();

  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);

  const handleSubmit = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to send this message?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setSendingMessage(true);
              const response = await axios.post(
                `${ipAddress}/api/message-admin/`,
                {
                  message: messageText,
                },
                {
                  headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                  },
                }
              );

              console.log(response);

              Alert.alert(
                "Message sent to admin, please check your email for a reply"
              );
              navigation.goBack();
            } catch (error) {
              console.error("Error sending message:", error);
              Alert.alert(
                "Error",
                "Failed to send message. Please try again later."
              );
            } finally {
              setSendingMessage(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    setIsButtonEnabled(messageText.trim().length > 0);
  }, [messageText]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>CHAT ADMIN</Text>
          <TouchableOpacity onPress={() => navigation.navigate("FAQ")}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="silver"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Title>Message Admin</Title>
      <Subtitle>
        Leave us a message here and we'll get back to you ASAP
      </Subtitle>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior as needed
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Adjust offset as needed
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          <ImageBackground
            source={require("./icb2.png")}
            style={styles.propertyContainer}
            imageStyle={styles.backgroundImage}
          >
            <Ionicons
              name="chatbubbles-outline"
              size={34}
              color="#fff"
              style={{ marginRight: 15 }}
            />
            <Text style={styles.propertyText}>
              Kindly consult us during our working hours (Mondays - Fridays:
              9am-5pm, Saturdays & Public holidays: 10am-4pm). You can also
              leave us a message and we will reply once we come back online.
              Thank you.
            </Text>
          </ImageBackground>

          <Divider />

          <View style={styles.form}>
            <View>
              <SectionTitle>Username/Email</SectionTitle>
              <Text
                style={{
                  marginLeft: 20,
                  color: "white",
                  fontFamily: "nexa",
                  marginTop: 5,
                }}
              >
                {userInfo.email}
              </Text>
            </View>
            <View>
              <SectionTitle>Fullname</SectionTitle>
              <Text
                style={{
                  marginLeft: 20,
                  color: "white",
                  fontFamily: "nexa",
                  marginTop: 5,
                }}
              >
                {userInfo.firstName} {userInfo.lastName}
              </Text>
            </View>
            <View>
              <SectionTitle>Comment</SectionTitle>
              <TextInput
                multiline={true}
                value={messageText}
                onChangeText={setMessageText}
                style={{
                  height: 200,
                  backgroundColor: isDarkMode ? "#27223B" : "#F5F5F5",
                  borderRadius: 20,
                  marginRight: 20,
                  marginLeft: 20,
                  marginTop: 2,
                  marginBottom: 2,
                  color: isDarkMode ? "white" : "black",
                  padding: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              />
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: isButtonEnabled ? "#4C28BC" : "grey" },
              ]}
              disabled={!isButtonEnabled}
              onPress={handleSubmit}
            >
              {sendingMessage ? (
                <ActivityIndicator
                  color="#fff"
                  size="small"
                  style={{ marginRight: 10 }}
                />
              ) : (
                <Ionicons
                  name="send-sharp"
                  size={24}
                  color="#fff"
                  marginRight={10}
                />
              )}
              <Text style={styles.primaryButtonText}>
                {sendingMessage ? " Sending... Please wait..." : "Send Message"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (isDarkMode) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#140A32" : "#F5F1FF",
    },
    header: {
      marginTop: StatusBar?.currentHeight + 5 ?? 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      backgroundColor: isDarkMode ? "black" : "white",
      height: 43,
    },
    headerContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    headerText: {
      flex: 1,
      color: "silver",
      alignSelf: "center",
      marginLeft: 10,
      fontFamily: "karla",
      letterSpacing: 3,
    },

    savingsContainer: {
      flexDirection: "column",
      backgroundColor: "#4C28BC",
      marginHorizontal: 20,
      borderRadius: 10,
      marginTop: 5,
      alignItems: "center",
      height: 150,
    },

    propertyContainer: {
      alignItems: "center",
      paddingHorizontal: 13,
      flexDirection: "row",
      backgroundColor: "#DCD1FF",
      padding: 15,
      marginHorizontal: 20,
      borderRadius: 10,
    },

    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    propertyText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "regular",
      fontFamily: "karla",
      letterSpacing: -0.4,
      color: "#fff",
      marginRight: 25,
      letterSpacing: -0.5,
    },
    adminMessage: {
      backgroundColor: "green",
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 10,
      alignSelf: "flex-start",
      marginLeft: 20,
      margin: 5,
    },
    userMessage: {
      backgroundColor: "#4C28BC",
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      marginRight: 20,
      padding: 10,
      alignSelf: "flex-end",
      margin: 5,
    },
    messageText: {
      color: "white", // Adjust the text color for admin and user messages
      fontFamily: "ProductSans",
      fontSize: 16,
    },
    timestamp: {
      fontFamily: "karla",
      fontSize: 9,
      marginTop: 3,
      color: "silver",
      alignSelf: "flex-end",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      borderTopWidth: 1,
      borderColor: "#D6D6D6",
      backgroundColor: isDarkMode ? "#08021C" : "white",
    },
    input: {
      flex: 1,
      height: 45,
      backgroundColor: isDarkMode ? "#27223B" : "#F5F5F5",
      borderRadius: 20,
      paddingHorizontal: 8,
      marginRight: 5,
      marginTop: 5,
      marginBottom: 5,
      color: isDarkMode ? "white" : "black",
    },
    iconButton: {
      paddingHorizontal: 10,
    },
    attachmentImage: {
      width: 100,
      height: 100,
      marginTop: 5,
      resizeMode: "cover",
    },
    sendButton: {
      backgroundColor: "#4C28BC",
      borderRadius: 80,
      padding: 8,
    },
    attachmentPreview: {
      position: "relative",
    },
    removeAttachment: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.85)",
    },
    previewImage: {
      width: "80%",
      height: "80%",
      resizeMode: "contain",
    },
    closeButton: {
      position: "absolute",
      top: 20,
      right: 20,
    },
    emojiPicker: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      paddingVertical: 10,
      backgroundColor: "#F6F3FF",
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

    form: {
      flex: 1,
      flexDirection: "column",
      gap: 10,
    },

    keyboardAvoidingContainer: {
      flex: 1,
    },

    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      alignContent: "center",
      marginTop: 10,
    },
    primaryButton: {
      flexDirection: "row",
      backgroundColor: "#4C28BC",
      width: "90%",
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },

    primaryButtonText: {
      color: "#fff",
      fontSize: 18,
      fontFamily: "ProductSans",
    },
  });
};
export default Chat;
