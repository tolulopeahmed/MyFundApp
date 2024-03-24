import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Divider from "../components/Divider";
import Swiper from "react-native-swiper";
import QuickInvestModal from "../components/QuickInvestModal";
import Title from "../components/Title";
import Subtitle from "../components/Subtitle";
import SectionTitle from "../components/SectionTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccountBalances,
  fetchUserTransactions,
  fetchUserData,
  fetchAutoInvestSettings,
} from "../../ReduxActions";
import { useTheme } from "../../ThemeContext";

const images = [require("./sponsorship.png"), require("./ownership.png")];

const Invest = ({ navigation, firstName }) => {
  const [quickInvestModalVisible, setQuickInvestModalVisible] = useState(false);
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);
  const [showBalances, setShowBalances] = useState(true);
  const userInfo = useSelector((state) => state.bank.userInfo); // Get userInfo from Redux state
  const accountBalances = useSelector((state) => state.bank.accountBalances);
  const dispatch = useDispatch();

  const handleQuickInvest = () => {
    navigation.navigate("Sponsorship", { quickInvestModalVisible: true });
  };

  const handleImagePress = (index) => {
    switch (index) {
      case 0:
        navigation.navigate("Sponsorship");
        break;
      case 1:
        navigation.navigate("Ownership");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(fetchAccountBalances()); // Fetch account balances using Redux action
    dispatch(fetchUserTransactions()); // Fetch user transactions using Redux action
    dispatch(fetchUserData(userInfo.token));
    dispatch(fetchAutoInvestSettings()); // Fetch auto-save status and settings when the component mounts
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Header navigation={navigation} headerText="INVEST" />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Title>Invest</Title>
          <Subtitle>Sponsor or Buy</Subtitle>

          <View style={styles.swiper}>
            <Swiper
              autoplay
              autoplayTimeout={5}
              loop
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
              paginationStyle={styles.paginationContainer}
              vertical={(index) => index % 2 === 0}
            >
              {images.map((image, index) => (
                <Pressable
                  key={index}
                  style={styles.slideContainer}
                  onPress={() => handleImagePress(index)}
                >
                  <Image source={image} style={styles.slide} />
                </Pressable>
              ))}
            </Swiper>
          </View>

          <View>
            <Text style={styles.title2}>Choose Type of Investment</Text>
            {/* <Text style={styles.subText}>SPONSOR: Earn <Text style={{color:'green', fontFamily: 'proxima'}}>20% p.a. </Text>every January & July. {'\n'} */}
            {/* OWN: Earn <Text style={{color:'green', fontFamily: 'proxima'}}>Lifetime rent</Text> every year</Text> */}
            <Divider />

            <SectionTitle>AVAILABLE INVESTMENTS</SectionTitle>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Sponsorship")}
                style={{ flex: 1, marginLeft: 20, marginRight: 5, height: 230 }}
              >
                {/* <Ionicons name="person-outline" size={40} alignItems='center' marginTop={5} style={styles.icon}/> */}
                <ImageBackground
                  source={require("./icb2.png")}
                  imageStyle={styles.backgroundImage}
                  style={{ flex: 1, padding: 7, alignItems: "center" }}
                >
                  <Text
                    style={{
                      padding: 3,
                      marginTop: 2,
                      fontSize: 25,
                      fontFamily: "proxima",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    Sponsor
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      fontFamily: "karla",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    Earn{" "}
                    <Text style={{ fontFamily: "proxima", color: "#43FF8E" }}>
                      20% p.a.
                    </Text>{" "}
                    every January and July sponsoring our National Hostel
                    Project
                  </Text>

                  <View style={styles.amountContainer}>
                    {showBalances ? (
                      <>
                        <Text
                          style={styles.dollarSign}
                          adjustsFontSizeToFit={true}
                        >
                          ₦
                        </Text>
                        <Text
                          style={styles.savingsAmount}
                          adjustsFontSizeToFit={true}
                          numberOfLines={1}
                        >
                          {Math.floor(
                            accountBalances.investment
                          ).toLocaleString()}
                        </Text>
                        {/* <Text style={styles.decimal}>.{String(accountBalances.investment).split('.')[1]}</Text> */}
                      </>
                    ) : (
                      <Text style={styles.savingsAmount}>****</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.quickInvestButton}
                    onPress={handleQuickInvest}
                  >
                    <Ionicons
                      name="trending-up-outline"
                      size={24}
                      color="#fff"
                    />
                    <Text style={styles.quickInvestText}>QuickInvest</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Ownership")}
                style={{ flex: 1, marginLeft: 5, marginRight: 20, height: 230 }}
              >
                {/* <Ionicons name="home-outline" size={40} alignItems='center' marginTop={5} style={styles.icon} /> */}
                <ImageBackground
                  source={require("./icb2.png")}
                  imageStyle={styles.backgroundImage}
                  style={{
                    flex: 1,
                    padding: 7,
                    alignItems: "center",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      padding: 3,
                      marginTop: 2,
                      fontSize: 25,
                      fontFamily: "proxima",
                      textAlign: "center",
                      letterSpacing: -0.3,
                      color: "#fff",
                    }}
                  >
                    Own
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      fontFamily: "karla",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    Earn{" "}
                    <Text style={{ fontFamily: "proxima", color: "#43FF8E" }}>
                      rental income for life
                    </Text>{" "}
                    by buying a fraction of our hostels.
                  </Text>

                  <View style={styles.amountContainer}>
                    {showBalances ? (
                      <>
                        <Text
                          style={styles.savingsAmount3}
                          adjustsFontSizeToFit={true}
                          numberOfLines={1}
                        >
                          {accountBalances.properties < 10
                            ? `0${Math.floor(accountBalances.properties)}`
                            : Math.floor(accountBalances.properties)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.savingsAmount3}>**</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.buyPropertyButton}
                    onPress={() => navigation.navigate("Ownership")}
                  >
                    <Ionicons name="home-outline" size={24} color="#fff" />
                    <Text style={styles.quickInvestText}>Buy Property</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <QuickInvestModal
              navigation={navigation}
              quickInvestModalVisible={quickInvestModalVisible}
              setQuickInvestModalVisible={setQuickInvestModalVisible}
            />
          </View>
          <Divider />

          <SectionTitle>OTHER INVESTMENT OPPORTUNITIES</SectionTitle>

          <Text style={styles.cardAddedInfo}>Watch this space!</Text>
        </ScrollView>
      </View>
    </>
  );
};

const createStyles = (isDarkMode) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#140A32" : "#F5F1FF",
    },

    title2: {
      fontSize: 20,
      marginLeft: 25,
      fontFamily: "proxima",
      color: "#4C28BC",
      marginTop: 15,
      marginBottom: 5,
      alignSelf: "center",
      letterSpacing: -0.4,
    },

    swiper: {
      height: 200,
      width: "100%",
    },

    image: {
      width: "90%",
      alignSelf: "center",
      resizeMode: "cover",
      borderRadius: 10,
      marginTop: 5,
    },

    slideContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 5, // Add padding to create space between slides
    },
    slide: {
      width: "95%",
      height: 180,
      resizeMode: "cover",
      borderRadius: 10,
      marginTop: 5,
    },

    dot: {
      backgroundColor: "silver", // Customize the color of the inactive dots
      width: 5,
      height: 5,
      borderRadius: 5,
    },
    activeDot: {
      backgroundColor: isDarkMode ? "#6E3DFF" : "#4C28BC",
      width: 10,
      height: 4,
      borderRadius: 5,
    },

    paginationContainer: {
      bottom: 1, // Adjust the value as per your requirement
    },

    subText: {
      marginHorizontal: 20,
      fontSize: 13,
      fontFamily: "karla",
      textAlign: "center",
      letterSpacing: -0.4,
      color: isDarkMode ? "silver" : "black",
    },

    icon: {
      marginRight: 15,
      color: isDarkMode ? "#6E3DFF" : "#4C28BC",
    },

    investmentType: {
      alignItems: "center",
    },
    investmentTypeHeader: {
      fontFamily: "ProductSans-Bold",
      fontSize: 18,
      marginTop: 10,
      marginBottom: 5,
    },
    investmentTypeSubText: {
      fontFamily: "ProductSans",
      fontSize: 14,
      textAlign: "center",
      marginHorizontal: 10,
    },

    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },

    amountContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 5,
    },

    dollarSign: {
      fontSize: 9,
      fontFamily: "karla",
      textAlign: "center",
      marginTop: 16,
      marginLeft: 5,
      color: "silver",
      letterSpacing: -2,
    },

    // decimal: {
    //   fontSize: 9,
    //   fontFamily: 'karla',
    //   textAlign: 'center',
    //   marginTop: 12,
    //   marginLeft: -5,
    //     color: 'silver',
    //     letterSpacing: 0,
    //   },

    savingsAmount: {
      fontSize: 55,
      fontFamily: "karla",
      textAlign: "center",
      letterSpacing: -4,
      marginRight: 5,
      marginLeft: 5,
      marginBottom: 5,
      color: "yellow",
    },

    savingsAmount3: {
      fontSize: 55,
      fontFamily: "karla",
      textAlign: "center",
      letterSpacing: -2,
      marginRight: 5,
      marginLeft: 5,
      marginBottom: -5,
      color: "gold",
    },

    quickInvestButton: {
      marginTop: "auto", // Adjusts the margin to position the button at the bottom
      marginBottom: 10, // Adds a margin of 10 from the bottom
      flexDirection: "row",
      backgroundColor: "#9D8CD7",
      width: 140,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },

    buyPropertyButton: {
      marginTop: "auto", // Adjusts the margin to position the button at the bottom
      marginBottom: 10, // Adds a margin of 10 from the bottom
      flexDirection: "row",
      backgroundColor: "#9D8CD7",
      width: 147,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },

    quickInvestText: {
      color: "#fff",
      fontSize: 17,
      fontFamily: "ProductSans",
      marginLeft: 4,
    },

    cardAddedInfo: {
      fontSize: 14,
      color: "silver",
      fontFamily: "karla-italic",
      marginTop: 40,
      marginBottom: 40,
      alignSelf: "center",
    },
  });
};
export default Invest;
