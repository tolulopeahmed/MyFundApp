import React, { useState }from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Divider from '../components/Divider';
import Swiper from 'react-native-swiper';
import QuickInvestModal from '../components/QuickInvestModal';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';
import SectionTitle from '../components/SectionTitle';


const images = [
  require('./sponsorship.png'),
  require('./ownership.png'),
];




const Invest = ({ navigation, firstName }) => {
  const [quickInvestModalVisible, setQuickInvestModalVisible] = useState(false);

  const handleQuickInvest = () => {
    navigation.navigate('Sponsorship', { quickInvestModalVisible: true });
  };

  const handleImagePress = (index) => {
    switch (index) {
      case 0:
        navigation.navigate('Sponsorship');
        break;
      case 1:
        navigation.navigate('Ownership');
        break;
        default:
        break;
    }
  };

  return (
    <>
    <View style={styles.container}>
      <Header navigation={navigation} headerText="INVEST" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      
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
          vertical={(index) => (index % 2 === 0)}
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
        <Text style={styles.subText}>SPONSOR: Earn <Text style={{color:'green', fontFamily: 'proxima'}}>20% p.a. </Text>every January & July. {'\n'}
        OWN: Earn <Text style={{color:'green', fontFamily: 'proxima'}}>Lifetime rent </Text> every year</Text>
        <Divider />

        <SectionTitle>AVAILABLE INVESTMENTS</SectionTitle>

        <View style={{ flexDirection: 'row', marginTop: 10, }}>
          <TouchableOpacity onPress={() => navigation.navigate('Sponsorship')} style={{ backgroundColor: '#E0D7FF', flex: 1, padding: 7, alignItems: 'center', marginLeft: 20, marginRight: 5, borderRadius: 10, height: 230}}>
            <Ionicons name="person-outline" size={40} color="#4C28BC" alignItems='center' marginTop={5} />
            <Text style={{ padding: 3, marginTop: 2, fontSize: 17, fontFamily: 'proxima', textAlign: 'center', color: '#4C28BC' }}>Sponsorship Investment</Text>
            <Text style={{ marginTop: 4, fontSize: 12, fontFamily: 'karla', textAlign: 'center', }}>Earn up to <Text color='red'>20% per anum</Text> sponsoring our National Hostel Project. Paid every January and July</Text>
            <TouchableOpacity style={styles.quickInvestButton} onPress={handleQuickInvest}>
              <Ionicons name="trending-up-outline" size={24} color="#fff" />
              <Text style={styles.quickInvestText}>QuickInvest</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Ownership')} style={{ backgroundColor: '#E2E4FF', flex: 1, padding: 7, alignItems: 'center', marginLeft: 5, marginRight: 20, borderRadius: 10, height: 230}}>
            <Ionicons name="home-outline" size={40} color="#4C28BC" alignItems='center' marginTop={5} />
            <Text style={{ padding: 3, marginTop: 2, fontSize: 17, fontFamily: 'proxima', textAlign: 'center', color: '#4C28BC', letterSpacing: -0.3, }}>Ownership Investment</Text>
            <Text style={{ marginTop: 4, fontSize: 12, fontFamily: 'karla', textAlign: 'center',}}>Earn rental income for life by buying a fraction of our hostels.</Text>
            <TouchableOpacity style={styles.buyPropertyButton} onPress={() => navigation.navigate('Ownership')}>
              <Ionicons name="home-outline" size={24} color="#fff" />
              <Text style={styles.quickInvestText}>Buy Property</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {quickInvestModalVisible && (
  <QuickInvestModal
  navigation={navigation}
  quickInvestModalVisible={quickInvestModalVisible} 
  setQuickInvestModalVisible={setQuickInvestModalVisible}
  />
)}

      </View>
      <Divider />

      <SectionTitle>OTHER INVESTMENT OPPORTUNITIES</SectionTitle>


      </ScrollView>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1FF',
  },



  title2: {
    fontSize: 20,
    marginLeft: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
    marginTop: 15,
    marginBottom: 5,
    alignSelf: 'center',
    letterSpacing: -0.4,  
  },

  swiper: {
    height: 200, 
    width:'100%'
  },

  image: {
    width: '90%',
    alignSelf: 'center',
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 5,
  },

  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5, // Add padding to create space between slides

  },
  slide: {
    width: '95%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 5,
  },
  
  dot: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Customize the color of the inactive dots
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  activeDot: {
    backgroundColor: '#4C28BC', // Customize the color of the active dot
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
    fontFamily: 'karla',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  investmentTypesContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    backgroundColor: '#E2E4FF'
  },
  investmentType: {
    alignItems: 'center',
  },
  investmentTypeHeader: {
    fontFamily: 'ProductSans-Bold',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
  },
  investmentTypeSubText: {
    fontFamily: 'ProductSans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  quickInvestButton: {
    marginTop: 'auto', // Adjusts the margin to position the button at the bottom
    marginBottom: 10, // Adds a margin of 10 from the bottom
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: 140,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  
  buyPropertyButton: {
    marginTop: 'auto', // Adjusts the margin to position the button at the bottom
    marginBottom: 10, // Adds a margin of 10 from the bottom
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: 147,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  

  quickInvestText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'ProductSans',
    marginLeft: 4,
  },

});

export default Invest;
