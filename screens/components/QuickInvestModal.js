import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Image,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Divider from "../components/Divider";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserCards,
  updateAccountBalances,
  fetchUserTransactions,
  fetchAccountBalances,
  fetchTopSaversData,
  addAlertMessage,
} from "../../ReduxActions"; // Import fetchUserCards
import { ipAddress } from "../../constants";
import axios from "axios";
import LoadingModal from "./LoadingModal";
import bankOptions from "./BankOptions";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import PinModal from "./PinModal";

const getBackgroundColor = (bankName) => {
  const bank = bankOptions.find((option) => option.name === bankName);
  return bank ? bank.color : "#4C28BC"; // Default to your default color
};

const QuickInvestModal = ({
  navigation,
  quickInvestModalVisible,
  setQuickInvestModalVisible,
  setIsSuccessVisible,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [frequency, setFrequency] = useState("savings");
  const [isContinueButtonDisabled, setIsContinueButtonDisabled] =
    useState(true);
  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const userInfo = useSelector((state) => state.bank.userInfo);
  //const selectedCardId = selectedCard !== undefined && selectedCard !== null ? selectedCard : null;
  const [processing, setProcessing] = useState(false);
  const userCards = useSelector((state) => state.bank.cards) || [];
  const [selectedCardId, setSelectedCardId] = useState(
    userCards.length > 0 ? userCards[0].id : null
  );
  const [showQuickInvestButton, setShowQuickInvestButton] = useState(true);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true); // New state variable
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);
  const accountBalances = useSelector((state) => state.bank.accountBalances);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserCards());
  }, []);

  useEffect(() => {
    if (frequency === "savings") {
      const numericAmount = parseFloat(amount.replace(/,/g, ""));
      if (amount === "" || numericAmount < 100000) {
        setIsSubmitButtonDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
      }
    } else {
      setShowQuickInvestButton(true);
    }
  }, [amount, frequency]);

  useEffect(() => {
    if (frequency === "savings") {
      if (amount === "" || isNaN(parseFloat(amount.replace(/,/g, "")))) {
        setIsSubmitButtonDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
      }
    }
  }, [amount, frequency]);

  useEffect(() => {
    if (frequency === "My Saved Cards") {
      // Check if a card is selected
      if (selectedCardId !== null) {
        setIsContinueButtonDisabled(false);
      } else {
        setIsContinueButtonDisabled(true);
      }
    }
  }, [selectedCardId, frequency]);

  useEffect(() => {
    if (frequency === "Bank Transfer") {
      // Check if the amount is empty or not a valid number
      const numericAmount = parseFloat(amount.replace(/,/g, ""));
      if (amount === "" || isNaN(numericAmount)) {
        setIsSubmitButtonDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
      }
    }
  }, [amount, frequency]);

  const handleAmountButtonPress = (presetAmount) => {
    handleAmountPreset(presetAmount);
    // Dismiss the keyboard when the button is pressed
    Keyboard.dismiss();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    // Check if userCards is not empty
    if (userCards.length > 0) {
      setSelectedCardId(userCards[0].id); // Set selectedCardId to the ID of the first card
      setSelectedCard(userCards.find((card) => card.id === userCards[0].id)); // Set selectedCard to the first card object
    }
  }, [userCards]);

  useEffect(() => {
    // Check if both amount and selectedCard are not empty and selectedCard is not 'null'
    if (amount !== "" && selectedCard !== null) {
      setIsContinueButtonDisabled(false);
    } else {
      setIsContinueButtonDisabled(true);
    }

    // Set initial selectedCard when userCards are available
    if (userCards.length > 0 && selectedCard === null) {
      setSelectedCard(userCards[0].id);
    }

    // Set initial frequency when AutoSaveModal opens
    if (frequency === "") {
      setFrequency("daily"); // Change 'hourly' to the default frequency you want
    }
  }, [amount, selectedCard, userCards, frequency]); // Include 'frequency' in the dependency array

  const handleAmountChange = (value) => {
    // Remove any non-numeric characters except for the decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Check if the numericValue is empty or NaN
    if (numericValue === "" || isNaN(parseFloat(numericValue))) {
      // If empty or NaN, set the amount to an empty string
      setAmount("");
    } else {
      // Ensure there is only one decimal point in the value
      const parts = numericValue.split(".");

      if (parts.length === 1) {
        // No decimal point, format as integer
        setAmount(parseFloat(parts[0]).toLocaleString("en-US"));
      } else if (parts.length === 2) {
        // One decimal point, format with 2 decimal places
        const integerPart = parseFloat(parts[0]).toLocaleString("en-US");
        const decimalPart = parts[1].substring(0, 2); // Maximum 2 decimal places
        setAmount(`${integerPart}.${decimalPart}`);
      }
    }
  };

  const handleAddCard = () => {
    closeModal();
    navigation.navigate("Card", { addCardModalVisible: true });
  };

  const closeModal = () => {
    setQuickInvestModalVisible(false);
  };

  const handleAmountPreset = (presetAmount) => {
    setAmount(presetAmount.toLocaleString("en-US"));
  };

  const clearAmount = () => {
    setAmount("");
  };

  const handleQuickInvest = async () => {
    setProcessing(true);
    try {
      console.log("Selected card ID:", selectedCardId);
      console.log("Amount Entered:", amount);

      // Send the QuickSave request to your API using axios
      const response = await axios.post(
        `${ipAddress}/api/quickinvest/`, // Updated API endpoint
        {
          card_id: selectedCardId,
          amount: parseFloat(amount.replace(/,/g, "")),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data;
        dispatch(updateAccountBalances(responseData.newAccountBalances)); // Dispatch the action here
        dispatch(fetchAccountBalances()); // Add this line
        dispatch(fetchUserTransactions()); // Add this line
        dispatch(fetchTopSaversData());

        setQuickInvestModalVisible(false);
        setIsSuccessVisible(true);
        setProcessing(false);
      } else {
        // Handle QuickInvest error here and show appropriate alerts
        if (response.status === 400) {
          setProcessing(false);
          // Bad request, possibly due to invalid input
          Alert.alert(
            "Error",
            "Invalid input. Please check your data and try again."
          );
        } else if (response.status === 401) {
          setProcessing(false);
          // Unauthorized, user not authenticated
          Alert.alert("Error", "You are not authorized. Please login again.");
        } else {
          // Other server errors
          setProcessing(false);
          Alert.alert(
            "Error",
            "An error occurred while processing your request. Please try again later."
          );
        }
      }
    } catch (error) {
      console.error("QuickInvest Error:", error);
      setProcessing(false);
      // Handle network or other errors here and show an appropriate alert
      Alert.alert(
        "Error",
        "An error occurred. Please check your network connection and try again."
      );
    }
  };

  const handleInvestTransfer = async () => {
    try {
      setProcessing(true);

      // Construct the data to send in the POST request
      const requestData = {
        amount: parseFloat(amount.replace(/,/g, "")),
      };

      // Send a POST request to your server's API endpoint
      const response = await axios.post(
        `${ipAddress}/api/initiate-invest-transfer/`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Dispatch the necessary actions
        const responseData = response.data;
        dispatch(updateAccountBalances(responseData.newAccountBalances));
        dispatch(fetchAccountBalances());
        dispatch(fetchUserTransactions());
        dispatch(fetchTopSaversData());
        setQuickInvestModalVisible(false);

        // Send a POST request to create an alert message associated with the user
        const currentDate = new Date();
        const messageDate = currentDate.toISOString();
        const messageTime = currentDate.toLocaleTimeString();
        const successMessage =
          "Your QuickInvest request is pending approval and will be processed shortly. Check transactions for confirmation.";
        const messageData = {
          text: successMessage,
          date: messageDate,
          time: messageTime,
        };

        await axios.post(
          `${ipAddress}/api/create-alert-message/`,
          messageData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        // Dispatch the success message
        dispatch(addAlertMessage(messageData));

        Alert.alert(
          "QuickInvest Request Successful",
          "Your investment transfer has been initiated and will be processed shortly once your payment (transfer) is confirmed."
        );
      } else {
        // Handle the investment transfer error and show an appropriate error message
        if (response.status === 400) {
          // Bad request, possibly due to invalid input
          Alert.alert(
            "Error",
            "Invalid input. Please check your data and try again."
          );
        } else if (response.status === 401) {
          // Unauthorized, user not authenticated
          Alert.alert("Error", "You are not authorized. Please log in again.");
        } else {
          // Other server errors
          Alert.alert(
            "Error",
            "An error occurred while processing your request. Please try again later."
          );
        }
      }
    } catch (error) {
      console.error("Investment Transfer Error:", error);

      // Handle network or other errors and show an appropriate alert
      Alert.alert(
        "Error",
        "An error occurred. Please check your network connection and try again."
      );
    } finally {
      // Set processing to false to re-enable the "Submit" button
      setProcessing(false);
    }
  };

  const handleSavingsToInvestmentTransfer = async () => {
    try {
      setProcessing(true);
      const requestedAmount = parseFloat(amount.replace(/,/g, ""));
      const savingsBalance = accountBalances.savings; // Replace with the actual balance value from your state

      if (requestedAmount > savingsBalance) {
        // Display an alert for insufficient balance
        Alert.alert(
          "Insufficient Balance",
          "You do not have enough balance in your SAVINGS account for this transfer."
        );
        return;
      }

      // Prepare the data to send to the backend API
      const requestData = {
        amount: requestedAmount,
      };

      console.log("Request Data:", requestData); // Log the requestData

      const response = await axios.post(
        `${ipAddress}/api/savings-to-investment/`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      console.log("API Response:", response); // Log the API response

      if (response.status === 200) {
        const responseData = response.data;
        dispatch(updateAccountBalances(responseData.newAccountBalances));
        dispatch(fetchAccountBalances()); // Add this line
        dispatch(fetchUserTransactions()); // Add this line

        setIsSuccessVisible(true);
        setQuickInvestModalVisible(false);
        setProcessing(false);
      } else {
        // Handle API errors here and show appropriate alerts
        if (response.status === 400) {
          setProcessing(false);
          Alert.alert(
            "Error",
            "Invalid input. Please check your data and try again."
          );
        } else if (response.status === 401) {
          setProcessing(false);
          Alert.alert("Error", "You are not authorized. Please login again.");
        } else {
          setProcessing(false);
          Alert.alert(
            "Error",
            "An error occurred while processing your request. Please try again later."
          );
        }
      }
    } catch (error) {
      console.error("Savings to Investment Transfer Error:", error);
      // Handle network or other errors here and show an appropriate alert
      Alert.alert(
        "Error",
        "An error occurred. Please check your network connection and try again."
      );
    } finally {
      // Reset the processing state
      setProcessing(false);
    }
  };

  console.log("Amount entered in invest:", amount);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={quickInvestModalVisible}
        onRequestClose={() => setQuickInvestModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss(); // Dismiss the keyboard when tapping outside the modal
            closeModal(); // Optionally, close the modal on outside tap
          }}
          accessible={false} // Disable accessibility for this wrapper
          keyboardShouldPersistTaps="handled" // Ensure taps outside input fields dismiss the keyboard
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={closeModal}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={() => dismissKeyboard()} // Dismiss the keyboard when tapping within the modal
            >
              <ScrollView>
                <View style={styles.modalContent}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      paddingLeft: 30,
                    }}
                  >
                    <Text style={styles.modalHeader}>QuickInvest</Text>
                    <Ionicons
                      name="close-outline"
                      size={24}
                      color="grey"
                      marginTop={22}
                      paddingRight={25}
                      onPress={() => setQuickInvestModalVisible(false)}
                    />
                  </View>
                  <Divider />

                  <Text style={styles.modalSubText}>
                    Manually move multiples of N100,000 from your SAVINGS or
                    local bank into your INVESTMENT account with a few taps to
                    enjoy{" "}
                    <Text
                      style={{
                        fontFamily: "proxima",
                        color: isDarkMode ? "#43FF8E" : "green",
                      }}
                    >
                      20% ROI p.a.{" "}
                    </Text>{" "}
                    {"\n"}
                    {"\n"}QuickInvest...
                  </Text>

                  <View style={styles.inputContainer2}>
                    <Text style={styles.nairaSign}>₦</Text>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="Minimum amount is ₦100,000"
                      keyboardType="numeric"
                      onChangeText={(value) => handleAmountChange(value)}
                      value={amount}
                      placeholderTextColor="silver"
                      onBlur={() => {
                        const numericAmount = parseFloat(
                          amount.replace(/,/g, "")
                        );
                        if (numericAmount < 100000) {
                          Alert.alert(
                            "Invalid Amount",
                            "The minimum amount is 100,000. Please enter a valid amount or select a preset amount."
                          );
                        }
                      }}
                    />
                    {amount !== "" && (
                      <TouchableOpacity onPress={clearAmount}>
                        <Ionicons
                          name="close-circle-outline"
                          size={24}
                          color="grey"
                          marginRight={10}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.presetAmountsContainer}>
                    <View style={styles.presetAmountColumn}>
                      <TouchableOpacity
                        style={styles.presetAmountButton}
                        onPress={() => handleAmountButtonPress(100000)}
                      >
                        <Text style={styles.presetAmountText}>100,000</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.presetAmountButton}
                        onPress={() => handleAmountButtonPress(1000000)}
                      >
                        <Text style={styles.presetAmountText}>1,000,000</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.presetAmountColumn}>
                      <TouchableOpacity
                        style={styles.presetAmountButton}
                        onPress={() => handleAmountButtonPress(200000)}
                      >
                        <Text style={styles.presetAmountText}>200,000</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.presetAmountButton}
                        onPress={() => handleAmountButtonPress(2000000)}
                      >
                        <Text style={styles.presetAmountText}>2,000,000</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.presetAmountColumn}>
                      <TouchableOpacity
                        style={styles.presetAmountButton}
                        onPress={() => handleAmountButtonPress(500000)}
                      >
                        <Text style={styles.presetAmountText}>500,000</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.presetAmountButton}
                        onPress={() => handleAmountButtonPress(5000000)}
                      >
                        <Text style={styles.presetAmountText}>5,000,000</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.modalSubText2} alignSelf="flex-start">
                    using...
                  </Text>

                  <View style={styles.inputContainer}>
                    <View style={styles.dropdown}>
                      <Picker
                        style={styles.labelItem}
                        selectedValue={frequency}
                        onValueChange={(value) => setFrequency(value)}
                      >
                        <Picker.Item
                          label="My Saved Cards"
                          value="My Saved Cards"
                        />
                        <Picker.Item
                          label="Bank Transfer"
                          value="Bank Transfer"
                        />
                        <Picker.Item
                          label={`Savings (₦${Math.floor(
                            accountBalances.savings
                          ).toLocaleString()})`}
                          value="savings"
                        />
                      </Picker>
                    </View>
                  </View>

                  {frequency === "My Saved Cards" && (
                    <View style={styles.inputContainer}>
                      <Text style={styles.label3}>Which of them? </Text>
                      {userCards.length === 0 ? (
                        <TouchableOpacity onPress={handleAddCard}>
                          <Text
                            style={{
                              color: "grey",
                              fontFamily: "karla-italic",
                              marginBottom: 5,
                              marginLeft: 15,
                            }}
                          >
                            No cards added yet. Use Transfer or...{" "}
                            <Text
                              style={{
                                color: isDarkMode ? "#8A63F7" : "#4C28BC",
                                fontFamily: "proxima",
                                marginBottom: 5,
                                marginLeft: 15,
                              }}
                            >
                              Add Card Now!
                            </Text>
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.inputContainer}>
                          <View style={styles.iconContainer}>
                            <Ionicons
                              name="card"
                              size={28}
                              color={
                                selectedCard
                                  ? getBackgroundColor(selectedCard.bank_name)
                                  : null
                              }
                              zIndex={-1}
                            />
                          </View>
                          <View style={styles.dropdown}>
                            <Picker
                              style={styles.labelItem}
                              selectedValue={selectedCardId}
                              onValueChange={(value) =>
                                setSelectedCardId(value)
                              }
                            >
                              {userCards.map((card) => (
                                <Picker.Item
                                  label={`         ${
                                    card.bank_name
                                  } - **** ${card.card_number.slice(-4)}`}
                                  value={card.id}
                                  key={card.id}
                                  color={getBackgroundColor(card.bank_name)}
                                />
                              ))}
                            </Picker>
                          </View>
                        </View>
                      )}

                      <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                          style={[
                            styles.primaryButton,
                            (isContinueButtonDisabled || processing) &&
                              styles.primaryButtonDisabled,
                            {
                              backgroundColor: processing
                                ? "green"
                                : isContinueButtonDisabled
                                ? "grey"
                                : "#4C28BC",
                            },
                          ]}
                          onPress={() => {
                            closeModal();
                            setShowPinModal(true);
                          }}
                          disabled={isContinueButtonDisabled || processing}
                        >
                          {processing ? (
                            <>
                              <ActivityIndicator
                                color="white"
                                style={styles.activityIndicator}
                              />
                              <Image
                                source={require("./paystack.png")}
                                style={styles.image}
                              />
                            </>
                          ) : (
                            <Image
                              source={require("./paystack.png")}
                              style={styles.image}
                            />
                          )}
                          <Text
                            style={[
                              styles.primaryButtonText,
                              processing && styles.processingText,
                            ]}
                          >
                            {processing
                              ? "Funding Your Account..."
                              : "QuickInvest Now!"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {frequency === "Bank Transfer" && (
                    <View style={styles.paymentOptionsContainer}>
                      <Text style={styles.modalSubText2} alignSelf="flex-start">
                        {"\n"} 1. Transfer the exact amount you entered above
                        to... {"\n"}
                        <Text style={styles.accountDetails}>
                          {" "}
                          0821326433 (Access Bank) {"\n"} VCORP SYSTEMS LIMITED
                        </Text>{" "}
                        {"\n"}
                        2. Click{" "}
                        <Text style={{ fontFamily: "proxima" }}>
                          {" "}
                          'I Have Sent The Payment'
                        </Text>{" "}
                        after making the transfer and your account will be
                        updated within minutes.
                      </Text>
                      <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                          style={[
                            styles.primaryButton,
                            (isSubmitButtonDisabled || processing) &&
                              styles.primaryButtonDisabled,
                            {
                              backgroundColor: processing
                                ? "green"
                                : isSubmitButtonDisabled
                                ? "grey"
                                : "#4C28BC",
                            },
                          ]}
                          onPress={() => {
                            closeModal();
                            setShowPinModal(true);
                          }}
                          disabled={isSubmitButtonDisabled || processing}
                        >
                          {processing ? (
                            <>
                              <ActivityIndicator
                                color="white"
                                style={styles.activityIndicator}
                              />
                              <MaterialIcons
                                name="account-balance"
                                size={24}
                                color="#fff"
                                marginRight={10}
                              />
                            </>
                          ) : (
                            <MaterialIcons
                              name="account-balance"
                              size={24}
                              color="#fff"
                              marginRight={10}
                            />
                          )}
                          <Text
                            style={[
                              styles.primaryButtonText,
                              processing && styles.processingText,
                            ]}
                          >
                            {processing
                              ? "Processing Your Payment..."
                              : "I Have Sent The Payment"}
                          </Text>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={24}
                            color="green"
                            marginRight={10}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {frequency === "savings" && (
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.primaryButton,
                          (isSubmitButtonDisabled || processing) &&
                            styles.primaryButtonDisabled,
                          {
                            backgroundColor: processing
                              ? "green"
                              : isSubmitButtonDisabled
                              ? "grey"
                              : "#4C28BC",
                          },
                        ]}
                        onPress={() => {
                          closeModal();
                          setShowPinModal(true);
                        }}
                        disabled={isSubmitButtonDisabled || processing}
                      >
                        {processing ? (
                          <>
                            <ActivityIndicator
                              color="white"
                              style={styles.activityIndicator}
                            />
                            <MaterialIcons
                              name="send"
                              size={24}
                              color="#fff"
                              marginRight={10}
                            />
                          </>
                        ) : (
                          <MaterialIcons
                            name="send"
                            size={24}
                            color="#fff"
                            marginRight={10}
                          />
                        )}
                        <Text
                          style={[
                            styles.primaryButtonText,
                            processing && styles.processingText,
                          ]}
                        >
                          {processing
                            ? "Processing Your Payment..."
                            : "Move Funds to Investment"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <LoadingModal visible={processing} />
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableWithoutFeedback>
      </Modal>
      <PinModal
        pinModalVisible={showPinModal}
        setPinModalVisible={setShowPinModal}
        useMode="validate"
        onPinSubmit={() => {
          if (frequency === "savings")
            return handleSavingsToInvestmentTransfer();

          if (frequency === "Bank Transfer") return handleInvestTransfer();

          if (frequency === "My Saved Cards") return handleQuickInvest();
        }}
      />
    </>
  );
};

const createStyles = (isDarkMode) => {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
      backgroundColor: isDarkMode ? "#271561" : "#F5F1FF",
      width: "100%",
      alignItems: "center",
      borderTopRightRadius: 25,
      borderTopLeftRadius: 25,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },

    modalHeader: {
      marginTop: 20,
      fontSize: 25,
      fontFamily: "proxima",
      color: isDarkMode ? "#fff" : "#4C28BC",
      flex: 1,
    },
    modalSubText: {
      fontSize: 14,
      fontFamily: "karla",
      color: isDarkMode ? "#fff" : "black",
      textAlign: "left",
      marginHorizontal: 30,
      marginTop: 5,
    },

    modalSubText2: {
      fontSize: 14,
      fontFamily: "karla",
      textAlign: "center",
      color: isDarkMode ? "#fff" : "black",
      textAlign: "center",
      marginHorizontal: 45,
      marginTop: 5,
      letterSpacing: -0.5,
    },
    accountDetails: {
      fontSize: 17,
      fontFamily: "proxima",
      marginTop: 20,
      marginBottom: 5,
      textAlign: "center",
      letterSpacing: -0.5,
      color: isDarkMode ? "yellow" : "#4C28BC",
    },

    modalSubText3: {
      fontSize: 13,
      fontFamily: "karla-italic",
      textAlign: "center",
      color: isDarkMode ? "#fff" : "black",
      textAlign: "center",
      marginHorizontal: 45,
      marginTop: 25,
      letterSpacing: -0.2,
    },

    inputContainer: {
      marginTop: 5,
      marginBottom: 15,
      width: "100%",
      alignItems: "center",
    },

    presetAmountsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 40,
      marginTop: 5,
    },
    presetAmountColumn: {
      flex: 1,
      flexDirection: "column",
    },
    presetAmountButton: {
      backgroundColor: "#DCD1FF", // Background color changed to #DCD1FF
      borderRadius: 5,
      padding: 10,
      margin: 5,
      alignItems: "center",
    },
    presetAmountText: {
      color: "black", // Text color changed to #4C28BC
      fontSize: 15,
      fontFamily: "karla",
    },

    paymentOptionsContainer: {
      marginTop: -20,
      marginLeft: 5,
      marginRight: 5,
      borderRadius: 10, // Add border radius here
      overflow: "hidden", // This ensures that the border radius is applied to the Picker
    },

    label: {
      fontSize: 17,
      fontFamily: "proxima",
      marginTop: 20,
      marginBottom: 5,
      textAlign: "center",
      letterSpacing: -0.5,
      color: isDarkMode ? "#fff" : "black",
    },

    label3: {
      fontSize: 17,
      fontFamily: "proxima",
      marginBottom: 5,
      marginLeft: 45,
      alignSelf: "flex-start",
      color: isDarkMode ? "#fff" : "black",
    },

    labelItem: {
      color: "black",
      textAlign: "left",
      marginLeft: -16,
      marginBottom: 30,
      fontFamily: "karla",
      //backgroundColor: '#fff',
      borderRadius: 10,
    },

    pickerContainer: {
      borderRadius: 10, // Add border radius here
      overflow: "hidden", // This ensures that the border radius is applied to the Picker
    },

    // labelItem2: {
    //   color: 'black',
    //   textAlign: 'left',
    //   marginLeft: 5,
    //   marginRight: 5,
    //   marginBottom: 10,
    //   fontFamily: 'karla',
    //   backgroundColor: '#fff',
    //   borderRadius: 10,
    // },

    emailInput: {
      color: "grey",
      textAlign: "left",
      marginLeft: -5,
      marginBottom: 30,
      fontFamily: "karla",
      backgroundColor: "#fff",
      borderRadius: 10,
      height: 45,
      padding: 10,
      borderRadius: 10,
    },

    inputContainer2: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 10,
      height: 50,
      width: "80%",
      marginTop: 5,
      borderWidth: 0.5,
      borderColor: "silver",
    },

    iconContainer: {
      position: "absolute", // Use absolute positioning
      left: 10, // Adjust the left position as needed
      top: "50%", // Center vertically
      marginLeft: 45,
      zIndex: 1,
      transform: [{ translateY: -12 }], // Adjust translateY to vertically center the icon
    },

    nairaSign: {
      fontSize: 16,
      marginLeft: 15,
      marginRight: 0,
    },
    amountInput: {
      flex: 1,
      color: "black",
      fontFamily: "karla",
      fontSize: 16,
      letterSpacing: -0.3,
      padding: 10,
    },

    dropdown: {
      height: 50,
      width: "80%",
      backgroundColor: "white",
      borderRadius: 10,
      paddingLeft: 15,
      paddingRight: 5,
      borderWidth: 0.5,
      borderColor: "silver",
    },

    image: {
      marginTop: 5,
      marginRight: 5,
      borderWidth: 1,
      width: 40,
      height: 40,
      resizeMode: "contain",
      marginBottom: 5,
    },

    buttonsContainer: {
      flexDirection: "row",
      marginTop: 15,
      position: "relative",
      marginBottom: 35,
      alignSelf: "center",
    },

    primaryButton: {
      flexDirection: "row",
      backgroundColor: "#4C28BC",
      width: "85%",
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },

    primaryButtonDisabled: {
      flexDirection: "row",
      backgroundColor: "grey", // Background color for disabled state
      width: "85%",
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      opacity: 0.7, // Reduce opacity for disabled state
    },

    primaryButtonText: {
      color: "#fff",
      fontSize: 18,
      fontFamily: "ProductSans",
      marginRight: 5,
    },

    processingText: {
      color: "#fff",
      fontSize: 18,
      fontFamily: "ProductSans",
      marginRight: 5,
    },
  });
};

export default QuickInvestModal;
