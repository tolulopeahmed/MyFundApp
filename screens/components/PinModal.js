import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Divider from "../components/Divider";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  quickLogout,
  setModalBodyText,
  setModalHeaderText,
  triggerErrorHapticFeedback,
  triggerSuccessHapticFeedback,
  updateUserTransactionPin,
  validateUserTransactionPin,
} from "../../utils/pinModalUtils";
import { Alert } from "react-native";
import LoadingModal from "./LoadingModal";
import { useNavigation } from "@react-navigation/native";

const PinModal = ({
  pinModalVisible,
  setPinModalVisible,
  onPinSubmit,
  useMode, // Can either be create, validate, change
}) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [noOfTrial, setNoOfTrial] = useState(3);
  const [isConfirmMode, setIsConfirmMode] = useState(false); // Track if user is in confirmation mode
  const [isLoading, setIsLoading] = useState(false);
  const [chosenPin, setChosenPin] = useState("");
  const [previusPinConfirmed, setPreviousPinConfirmed] = useState(false);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const modalHeaderText = setModalHeaderText(useMode);
  const modalBodyText = setModalBodyText(
    useMode,
    previusPinConfirmed,
    isConfirmMode
  );
  const token = userInfo.token;
  const navigation = useNavigation();

  const changeModeSubmit = async () => {
    setIsLoading(true);
    try {
      if (!previusPinConfirmed) {
        const enteredPin = pin.reduce((acc, cur) => acc + cur, "");
        const existingPinConfirmed = await validateUserTransactionPin(
          enteredPin,
          token
        );
        if (existingPinConfirmed) {
          setPreviousPinConfirmed(true);
          setPin(["", "", "", ""]);
          triggerSuccessHapticFeedback();
        } else {
          Alert.alert("Pin does not match");
          setPin(["", "", "", ""]);
          triggerErrorHapticFeedback();
        }
      } else if (isConfirmMode) {
        const confirmationPin = pin.reduce((acc, cur) => acc + cur, "");
        const pinsMatch = confirmationPin === chosenPin;

        if (pinsMatch) {
          await updateUserTransactionPin(confirmationPin, token);
          Alert.alert("Pin successfully changed");
          triggerSuccessHapticFeedback();
          closeModal();
        } else {
          Alert.alert("Pins don't match");
          triggerErrorHapticFeedback();
          setPin(["", "", "", ""]);
        }
      } else {
        const enteredChosenPin = pin.reduce((acc, cur) => acc + cur, "");
        setChosenPin(enteredChosenPin);

        const pinAlreadyInUse = await validateUserTransactionPin(
          enteredChosenPin,
          token
        );
        console.log(`Pin in use ${pinAlreadyInUse}`);

        if (pinAlreadyInUse) {
          Alert.alert("You entered your existing transaction pin");
          return closeModal();
        }
        setIsConfirmMode(true);
        setPin(["", "", "", ""]);
        triggerSuccessHapticFeedback();
      }
    } catch (e) {
      Alert.alert("A problem occurred, please try again!");
      setPin(["", "", "", ""]);
      triggerErrorHapticFeedback();
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const createModeSubmit = async () => {
    setIsLoading(true);
    try {
      if (!isConfirmMode) {
        setIsConfirmMode(true);
        setChosenPin(pin.reduce((acc, cur) => acc + cur, ""));
        setPin(["", "", "", ""]);
        triggerSuccessHapticFeedback();
      }

      if (isConfirmMode) {
        const confirmationPin = pin.reduce((acc, cur) => acc + cur, "");
        const pinsMatch = confirmationPin === chosenPin;

        if (pinsMatch) {
          await updateUserTransactionPin(confirmationPin, token);
          Alert.alert("Pin successfully created");
          await AsyncStorage.setItem("has-pin", "true");
          triggerSuccessHapticFeedback();
          setPinModalVisible(false);
        } else {
          Alert.alert("Pins don't match");
          triggerErrorHapticFeedback();
          setPin(["", "", "", ""]);
        }
      }
    } catch (e) {
      Alert.alert("A problem occurred, please try again!");
      setPin(["", "", "", ""]);
      triggerErrorHapticFeedback();
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePinSubmit = async () => {
    setIsLoading(true);
    try {
      const enteredPin = pin.reduce((acc, cur) => acc + cur, "");
      const existingPinConfirmed = await validateUserTransactionPin(
        enteredPin,
        token
      );
      if (existingPinConfirmed) {
        await onPinSubmit();
      } else {
        setNoOfTrial((state) => {
          console.log(state);
          state -= 1;
          console.log(state);
          Alert.alert(
            `Incorrect Pin, ${state} more ${state === 1 ? "chance" : "chances"}`
          );
          return state;
        });

        triggerErrorHapticFeedback();
        setPin(["", "", "", ""]);

        if (noOfTrial === 0) {
          await quickLogout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      }
    } catch (e) {
      Alert.alert("A problem occurred, please try again!");
      triggerErrorHapticFeedback();
      console.log(e);
    } finally {
      setIsLoading(false);
      setPin(["", "", "", ""]);
    }
  };

  const onSubmit = () => {
    if (useMode === "change") changeModeSubmit();
    if (useMode === "create") createModeSubmit();
    if (useMode === "validate") validatePinSubmit();
  };

  useEffect(() => {
    // Check if all digits are entered and toggle confirmation mode
    const isAllDigitsEntered = pin.every((digit) => digit !== "");
    if (isAllDigitsEntered) onSubmit();
  }, [pin]);

  const closeModal = () => {
    setPinModalVisible(useMode === "create" ? true : false);
    setPin(["", "", "", ""]);
  };

  const handleNumberPress = (number) => {
    const newPin = [...pin];
    for (let i = 0; i < 4; i++) {
      if (newPin[i] === "") {
        newPin[i] = number;
        break;
      }
    }
    setPin(newPin);
  };

  const handleBackspacePress = () => {
    const newPin = [...pin];
    for (let i = 3; i >= 0; i--) {
      if (newPin[i] !== "") {
        newPin[i] = "";
        break;
      }
    }
    setPin(newPin);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={pinModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={closeModal}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{modalHeaderText}</Text>
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
            <Text style={styles.modalBodyText}>{modalBodyText}</Text>
            <View style={styles.pinContainer}>
              {pin.map((digit, index) => (
                <View key={index} style={styles.pinInput}>
                  {digit && <Text style={styles.pinText}>*</Text>}
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
    height: 70,
    width: "22%",
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

export default PinModal;
