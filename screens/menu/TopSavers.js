import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { ProgressBar } from 'react-native-paper';
import { fetchTopSaversData } from '../../ReduxActions';
import Title from '../components/Title';
import { ipAddress } from '../../constants';
import Subtitle from '../components/Subtitle';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';


const TopSavers = ({ navigation }) => {
  const dispatch = useDispatch();
  const userPercentage = useSelector((state) => state.bank.userPercentage);
  const topSaversData = useSelector((state) => state.bank.topSaversData);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const [currentMonth, setCurrentMonth] = useState('');

  useEffect(() => {
    dispatch(fetchTopSaversData());
  }, []);

  useEffect(() => {
    const monthName = moment().format('MMMM');
    setCurrentMonth(monthName);
  }, []);

  console.log('TopSaversData.top_savers:', topSaversData)


  const renderTopSavers = () => {
    return topSaversData.top_savers.map((saver, index) => (
        <View
        key={saver.user_id}
        style={[
          styles.transactionItem,
          saver.email === userInfo.email && { backgroundColor: '#EAE2FC', flex: 1, },
        ]}
      >
        <Text style={styles.transactionRank}>{index + 1}</Text>
        <View style={styles.circularImageContainer}>
                {saver.profile_picture ? (
                    <Image
                    style={styles.circularImage}
                    source={{ uri: ipAddress + saver.profile_picture }}
                    onError={() => console.log('Image load error')}
                    />
                ) : (
                    <Image source={require('./Profile1.png')} style={styles.placeholderImage} />
                )}
                </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.transactionDescription}>{saver.first_name}</Text>
          {/* <ProgressBar
            progress={saver.individual_percentage / 100}
            color={'green'}
            style={styles.progressBar}
          />
          <Text style={styles.percentageText}>
            {saver.individual_percentage.toFixed(0)}%
          </Text> */}
        </View>

        <View style={styles.medalsContainer}>
        {index < 3 && (
          // Add medals for top 3 savers
          <MaterialIcons
            name={index === 0 ? 'emoji-events' : index === 1 ? 'emoji-events' : 'emoji-events'}
            color={index === 0 ? '#FFD700' : index === 1 ? 'silver' : '#CD7F32'}
            size={24}
          />
        )}
      </View>

      </View>
    ));
  };





  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>TOP SAVERS</Text>
        </View>
      </View>

      <Title>Top Savers</Title>
      <Subtitle>Save more to qualify to earn more as a top saver</Subtitle>
      
      
      <View
        flexDirection="row"
        alignSelf="center"
        padding={5}
        alignContents="space-between"
      >
        {/* Add buttons for filtering if needed */}
      </View>

      <View style={styles.propertyContainer}>
        <Ionicons
          name="wallet-outline"
          size={34}
          color="#4C28BC"
          style={{ marginRight: 15 }}
        />
        <View style={styles.progressBarContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontFamily: 'proxima', color: '#4C28BC' }}>
                Top Savers of the Month: 
                <Text style={styles.propertyText}>
                {userPercentage == 100 ? (
                  <Text>
                    {' '}Congratulations {userInfo?.firstName ? `${userInfo.firstName},` : ''} You're currently one of the top savers in {currentMonth}. 🥳🍾🎉🎊 Keep saving to earn more rewards.
              
                  </Text>
                ) : (
                  <Text> Hey {userInfo?.firstName ? `${userInfo.firstName},` : ''}
                    <Text style={{ fontFamily: 'proxima', color: 'green',  }}> you're {userPercentage.toFixed(0)}%</Text>
                    {' '}from being one of the top savers in {currentMonth}
                    . Keep growing your funds to earn more as a top saver. 
                  </Text>
                )}
     </Text>

            </Text>
          </ScrollView>
        </View>
      </View>

      <ScrollView
        style={styles.transactionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {topSaversData.top_savers.length > 0 ? (
          renderTopSavers()
        ) : (
          <View style={styles.noTransactionsContainer}>
            <Text style={styles.noTransactionsMessage}>
              No top savers data available yet.
            </Text>
          </View>
        )}
      </ScrollView>
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
    marginLeft: 15,
    fontFamily: 'karla',
    letterSpacing: 3,
  },
  propertyContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: '#DCD1FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  propertyText: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'karla',
    letterSpacing: -0.2,
    color: 'black',
    marginBottom: 8,
  },
  progressBarContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 3,
  },
  progressBar: {
    height: 4.5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  welcomeText: {
    color: '#4C28BC',
    fontFamily: 'ProductSansBold',
  },
  profileIcons: {
    flexDirection: 'row',
  },
  propertyIcon: {
    marginRight: 10,
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'nexa',
    letterSpacing: -0.2,
    color: 'black',
  },
  percentageText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'proxima',
    letterSpacing: -0.2,
    color: 'green',
  },
  restText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'karla',
    letterSpacing: -0.2,
    color: 'black',
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  transactionContainer: {
    marginTop: 25,
    flex: 1,
  },
  transactionsContainer: {
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,

  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 10,
  },

  transactionRank: {
    color: '#4C28BC',
    fontSize: 15,
    fontFamily: 'nexa',
  },
  transactionDescription: {
    color: '#4C28BC',
    letterSpacing: -0.2,
    fontSize: 17,
    fontFamily: 'proxima',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  circularImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,  // Make it circular
    overflow: 'visible',  // Change 'hidden' to 'visible'
    marginHorizontal: 15,
    alignContent: 'center',
    alignSelf:'center',
  },
  circularImage: {
    flex: 1,
    borderRadius: 30, // Half of the width of the circularImageContainer
  },
  placeholderImage: {
    flex: 1,
    width: 40,
    height: 40,
    borderRadius: 30, 
},
  
  userInfoContainer: {
    flex: 1,
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  noTransactionsMessage: {
    fontSize: 15,
    color: 'silver',
    fontFamily: 'karla-italic',
    marginTop: 190,
    marginBottom: 100,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
});

export default TopSavers;
