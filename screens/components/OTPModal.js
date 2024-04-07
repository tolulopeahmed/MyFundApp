import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Divider from "../components/Divider";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "./LoadingModal";
import { useNavigation } from "@react-navigation/native";
import { addAlertMessage } from "../../ReduxActions";
import axios from "axios";

const OTPModal = ({
  otpModalVisible,
  setOtpModalVisible,
  reference,
  otpMessage,
  setIsSuccessVisible,
  type,
}) => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const token = userInfo.token;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const closeModal = () => {
    setOtpModalVisible(false);
    setPin(["", "", "", "", "", ""]);
  };

  const handleNumberPress = (number) => {
    const newPin = [...pin];
    for (let i = 0; i < pin.length; i++) {
      if (newPin[i] === "") {
        newPin[i] = number;
        break;
      }
    }
    setPin(newPin);
  };

  const handleBackspacePress = () => {
    const newPin = [...pin];
    for (let i = pin.length - 1; i >= 0; i--) {
      if (newPin[i] !== "") {
        newPin[i] = "";
        break;
      }
    }
    setPin(newPin);
  };

  const handleOtp = async () => {
    try {
      const response = await axios.post(
        `${ipAddress}/api/submit_otp/`,
        {
          reference,
          entered_otp: pin.join(""),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (!response.data.status) {
        Alert.alert("Error encountered");
        return closeModal();
      }

      // Dispatch the success message
      const currentDate = new Date();
      const messageDate = currentDate.toISOString();
      const messageTime = currentDate.toLocaleTimeString();
      const successMessage = `Your ${type} will be processed. Keep growing your funds.🥂`;
      const messageData = {
        text: successMessage,
        date: messageDate,
        time: messageTime,
      };

      // Send a POST request to create an alert message associated with the user
      await axios.post(
        `${ipAddress}/api/create-alert-message/`,
        {
          text: successMessage,
          date: messageDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // Dispatch the success message with date and time properties
      dispatch(addAlertMessage(messageData));
      closeModal();
      setIsSuccessVisible(true);
    } catch (e) {
      Alert.alert("An error occurred");
      closeModal();
    }
  };

  useEffect(() => {
    // Check if all digits are entered and toggle confirmation mode
    const isAllDigitsEntered = pin.every((digit) => digit !== "");
    if (isAllDigitsEntered) {
      handleOtp();
    }
  }, [pin]);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={otpModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={closeModal}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Input OTP</Text>
              <Ionicons
                name="close-outline"
                size={24}
                color="#4C28BC"
                onPress={closeModal}
                style={styles.closeIcon}
              />
            </View>
            <Divider />

            <Text style={styles.modalBodyText}>
              {userInfo?.firstName ? `${userInfo.firstName},` : ""}
            </Text>
            <Text style={styles.modalBodyText}>{otpMessage}</Text>
            <View style={styles.pinContainer}>
              {pin.map((digit, index) => (
                <View key={index} style={styles.pinInput}>
                  {digit !== "" && <Text style={styles.pinText}>*</Text>}
                </View>
              ))}
            </View>
            <View style={styles.keyboardContainer}>
              <View style={styles.keyboardRow}>
                {[1, 2, 3].map((number) => (
                  <TouchableOpacity
                    key={number}
                    style={styles.keyboardButton}
                    onPress={() => handleNumberPress(number)}
                  >
                    <Text style={styles.keyboardButtonText}>{number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.keyboardRow}>
                {[4, 5, 6].map((number) => (
                  <TouchableOpacity
                    key={number}
                    style={styles.keyboardButton}
                    onPress={() => handleNumberPress(number)}
                  >
                    <Text style={styles.keyboardButtonText}>{number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.keyboardRow}>
                {[7, 8, 9].map((number) => (
                  <TouchableOpacity
                    key={number}
                    style={styles.keyboardButton}
                    onPress={() => handleNumberPress(number)}
                  >
                    <Text style={styles.keyboardButtonText}>{number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.keyboardRow}>
                <TouchableOpacity
                  style={styles.keyboardButton}
                  onPress={() => handleNumberPress(0)}
                >
                  <Text style={styles.keyboardButtonText}>*</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyboardButton}
                  onPress={() => handleNumberPress(0)}
                >
                  <Text style={styles.keyboardButtonText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyboardButton}
                  onPress={handleBackspacePress}
                >
                  <Ionicons name="backspace-sharp" size={28} color="brown" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <LoadingModal visible={isLoading} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#F6F3FF",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalHeaderText: {
    fontSize: 25,
    fontFamily: "proxima",
    color: "#4C28BC",
  },
  closeIcon: {
    marginLeft: 10,
  },
  modalBodyText: {
    fontSize: 16,
    fontFamily: "karla",
    color: "black",
    marginBottom: 20,
  },

  pinContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    flexDirection: "row",
  },

  pinInput: {
    fontSize: 30,
    height: 50,
    width: "13%",
    fontFamily: "karla",
    backgroundColor: "white",
    borderRadius: 9,
    marginBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    marginHorizontal: 3,
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "gray",
  },

  pinText: {
    fontSize: 40,
    fontFamily: "karla",
    color: "black",
  },
  keyboardContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  keyboardButton: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderColor: "silver",
    borderWidth: 0.8,
  },
  keyboardButtonText: {
    color: "grey",
    fontSize: 24,
    fontFamily: "nexa",
  },
});

export default OTPModal;
