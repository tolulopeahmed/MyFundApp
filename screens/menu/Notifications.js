import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTransactions,
  fetchUserData,
  fetchAlertMessages,
} from "../../ReduxActions";
import { useTheme } from "../../ThemeContext";
import { StatusBar } from "react-native";

const Notifications = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Transactions");
  const userInfo = useSelector((state) => state.bank.userInfo);
  const userTransactions = useSelector((state) => state.bank.userTransactions);
  const alertMessages = useSelector((state) => state.bank.alertMessages);
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("alertMessages:", alertMessages);
    dispatch(fetchUserTransactions());
    dispatch(fetchUserData(userInfo.token));
    dispatch(fetchAlertMessages());
  }, []);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  console.log("alertMessages:", alertMessages);

  const iconMapping = {
    "Card Successful": "card-outline",
    QuickSave: "save-outline",
    AutoSave: "car-outline",
    QuickInvest: "trending-up-outline",
    AutoInvest: "car-sport-outline",
    "Pending Referral Reward": "ellipsis-horizontal-circle-outline",
    "Referral Reward": "checkmark-circle",
    "Withdrawal (Savings > Investment)": "arrow-down-outline",
    "Withdrawal (Investment > Savings)": "arrow-down-outline",
    "Withdrawal (Wallet > Savings)": "arrow-down-outline",
    "Withdrawal (Wallet > Investment)": "arrow-down-outline",
    "Withdrawal (Savings > Bank)": "arrow-down-outline",
    "Withdrawal (Investment > Bank)": "arrow-down-outline",
    "Withdrawal (Wallet > Bank)": "arrow-down-outline",
    Property: "home-outline",
    "Referral Reward (Pending)": "ellipsis-horizontal-circle-outline",
    "Referral Reward (Confirmed)": "checkmark-circle",
    IBADAN: "home-outline",
    FUNAAB: "home-outline",
    "QuickSave (Pending)": "ellipsis-horizontal-circle-outline",
    "QuickSave (Confirmed)": "checkmark-circle",
    "Sent to User": "arrow-up-outline",
    "QuickSave (Failed)": "close-circle-outline",
    "Annual Rent (Pending)": "checkmark-circle",
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime2 = (timeString) => {
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    const time = new Date(`2023-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", options);
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  let sortedAllItems = [];

  if (userTransactions && alertMessages) {
    const allItems = [
      ...(userTransactions || []).map((transaction, index) => ({
        type: "transaction",
        data: transaction,
        timestamp:
          transaction && transaction.timestamp
            ? new Date(transaction.timestamp).getTime()
            : 0,
      })),
      ...(alertMessages || []).map((message, index) => ({
        type: "message",
        data: message,
        timestamp:
          message && message.timestamp
            ? new Date(message.timestamp).getTime()
            : 0,
      })),
    ];

    // Sort and filter items based on the selected tab
    if (selectedTab === "Transactions") {
      // Filter and display only transactions, no need to sort them
      sortedAllItems = allItems.filter((item) => item.type === "transaction");
    } else if (selectedTab === "Messages") {
      // Filter and display only messages and sort them by the timestamp in descending order
      sortedAllItems = allItems.filter((item) => item.type === "message");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>NOTIFICATIONS</Text>
        </View>
      </View>

      <View
        flexDirection="row"
        alignSelf="center"
        padding={5}
        alignContents="space-between"
      >
        <Pressable
          style={[
            styles.cardContainer,
            selectedTab === "Transactions" && { backgroundColor: "#4C28BC" },
          ]}
          onPress={() => handleTabChange("Transactions")}
        >
          <Text
            style={[
              styles.title2,
              selectedTab === "Transactions" && { color: "#fff" },
            ]}
          >
            Transactions
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.cardContainer,
            selectedTab === "Messages" && { backgroundColor: "#4C28BC" },
          ]}
          onPress={() => handleTabChange("Messages")}
        >
          <Text
            style={[
              styles.title2,
              selectedTab === "Messages" && { color: "#fff" },
            ]}
          >
            Messages
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.transactionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {sortedAllItems.map((item, index) => {
          if (item.type === "message") {
            return (
              <View key={index} style={styles.transactionItem}>
                <Ionicons
                  name="mail-outline"
                  size={25}
                  style={styles.transactionIcon}
                />
                <View style={styles.transactionText}>
                  <Text style={styles.transactionDescription2}>
                    {item.data.text}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(item.data.date)} | {formatTime(item.data.date)}
                  </Text>
                </View>
              </View>
            );
          } else if (item.type === "transaction") {
            return (
              <View key={index} style={styles.transactionItem}>
                {item.type === "transaction" ? (
                  <>
                    <Ionicons
                      name={
                        iconMapping[item.data.description] || "card-outline"
                      }
                      size={25}
                      style={styles.transactionIcon}
                    />
                    <View style={styles.transactionText}>
                      <Text style={styles.transactionDescription}>
                        {item.data.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(item.data.date)} |{" "}
                        {formatTime2(item.data.time)}
                      </Text>
                      <Text style={styles.transactionID}>
                        ID: {item.data.transaction_id} -{" "}
                        <Text style={{ fontFamily: "proxima" }}>
                          {item.data.referral_email}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.transactionAmountContainer}>
                      <Text
                        style={
                          item.data.transaction_type === "pending"
                            ? styles.pendingAmount
                            : item.data.transaction_type === "credit"
                            ? styles.transactionAmount
                            : styles.negativeAmount // Apply the pendingAmount style for pending transactions
                        }
                      >
                        <Text style={{ fontSize: 12 }}>₦</Text>
                        <Text>
                          {Math.floor(item.data.amount).toLocaleString()}
                          <Text style={{ fontSize: 12 }}>
                            .{String(item.data.amount).split(".")[1]}
                          </Text>
                        </Text>
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="mail-outline"
                      size={25}
                      style={styles.transactionIcon}
                    />
                    <View style={styles.transactionText}>
                      <Text style={styles.transactionDescription}>
                        {item.data.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(item.data.date)} |{" "}
                        {formatTime2(item.data.time)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            );
          }
          return null; // Skip items that don't match the selected tab
        })}
        {sortedAllItems.length === 0 && (
          <View style={styles.noTransactionsContainer}>
            <Text style={styles.noTransactionsMessage}>
              No notifications to display.
            </Text>
          </View>
        )}
      </ScrollView>
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
      marginTop: StatusBar?.currentHeight ?? 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      backgroundColor: isDarkMode ? "#140A32" : "white",
      height: 43,
    },
    icon: {
      marginRight: 0,
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
      marginLeft: 15,
      fontFamily: "karla",
      letterSpacing: 3,
    },

    person: {
      borderWidth: 1.5,
      padding: 4.5,
      borderRadius: 80,
      borderColor: "#4C28BC",
      height: 35,
      width: 35,
      alignSelf: "center",
      alignItems: "center",
      alignContent: "center",
    },

    bell: {
      marginLeft: 6,
      borderWidth: 1.5,
      borderColor: "#4C28BC",
      padding: 4.5,
      height: 35,
      width: 35,
      borderRadius: 80,
      alignSelf: "center",
      alignItems: "center",
      alignContent: "center",
    },

    cardContainer: {
      borderWidth: 0.8,
      alignItems: "center",
      flex: 1,
      backgroundColor: isDarkMode ? "black" : "white",
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      borderBottomWidth: 0.8,
      borderLeftWidth: 0.8,
      borderRightWidth: 0.8,
      borderColor: "silver",
    },

    title2: {
      fontSize: 16,
      fontFamily: "proxima",
      color: isDarkMode ? "#fff" : "silver",
      marginTop: 5,
      marginBottom: 5,
    },

    propertyContainer: {
      alignItems: "center",
      paddingHorizontal: 16,
      flexDirection: "row",
      backgroundColor: "#DCD1FF",
      padding: 15,
      marginHorizontal: 20,
      borderRadius: 10,
      marginTop: 10,
    },

    textContainer: {
      flex: 1,
      flexDirection: "column",
      overflow: "hidden",
    },

    propertyText: {
      flexShrink: 1,
      flexDirection: "column",
      fontSize: 15,
      fontWeight: "regular",
      fontFamily: "ProductSans",
      color: "#4C28BC",
      position: "relative",
      marginBottom: 5,
    },

    transactionContainer: {
      marginTop: 25,
      flex: 1,
    },

    transactionsContainer: {
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 5,
    },
    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    transactionIcon: {
      backgroundColor: isDarkMode ? "#1D0E4A" : "#DEE4FC",
      color: isDarkMode ? "#6E3DFF" : "#4C28BC",
      padding: 8,
      borderRadius: 10,
      marginRight: 10,
    },
    transactionText: {
      flex: 1,
      alignItems: "flex-start",
    },
    transactionDescription: {
      color: isDarkMode ? "#6E3DFF" : "#4C28BC",
      letterSpacing: -1,
      fontSize: 19,
      fontFamily: "karla",
      marginTop: 3,
      textAlign: "left",
      alignItems: "flex-start",
    },
    transactionDescription2: {
      color: isDarkMode ? "#6E3DFF" : "#4C28BC",
      letterSpacing: -0.9,
      fontSize: 17.5,
      fontFamily: "karla",
      marginTop: 3,
      textAlign: "left",
      alignItems: "flex-start",
    },
    transactionDate: {
      fontFamily: "karla",
      fontSize: 10,
      marginTop: 1,
      color: isDarkMode ? "grey" : "black",
    },
    transactionTime: {
      fontFamily: "karla",
      fontSize: 10,
      marginTop: 1,
    },
    transactionID: {
      fontFamily: "nexa",
      fontSize: 10,
      marginTop: 1,
      color: "#4C28BC",
    },
    transactionAmount: {
      color: "green",
      fontSize: 23,
      fontFamily: "karla",
      letterSpacing: -1,
      marginTop: 10,
      textAlign: "right",
    },
    pendingAmount: {
      color: "grey", // Change to your desired color
      fontSize: 23,
      fontFamily: "karla",
      letterSpacing: -1,
      marginTop: 10,
      textAlign: "right",
    },
    negativeAmount: {
      color: "brown",
      fontSize: 23,
      fontFamily: "karla",
      letterSpacing: -1,
      marginTop: 10,
      textAlign: "right",
    },

    transactionAmountContainer: {
      textAlign: "right",
    },

    noTransactionsContainer: {
      flex: 1,
      justifyContent: "center", // Center vertically
      alignItems: "center", // Center horizontally
    },
    noTransactionsMessage: {
      fontSize: 15,
      color: "silver",
      fontFamily: "karla-italic",
      marginTop: 140,
      marginBottom: 100,
    },
  });
};

export default Notifications;
