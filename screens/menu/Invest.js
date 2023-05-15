import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Divider from '../components/Divider';

const Invest = ({ navigation, firstName }) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} headerText="INVEST" />
      <Text style={styles.title}>Select Type of Investment</Text>
      <Image source={require('./myfundhostel.jpeg')} style={styles.image} />
      <Text style={styles.subText}>Build your portfolio. Earn 20% in Sponsorship Investments. Earn lifetime rent via the Fractional Ownership Investments (FOI).</Text>
      <Divider />
      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity onPress={() => navigation.navigate('Sponsorship')} style={{ backgroundColor: '#E0D7FF', flex: 1, padding: 7, alignItems: 'center', marginLeft: 20, marginRight: 5, borderRadius: 10, height: 230}}>
          <Ionicons name="person-outline" size={40} color="#4C28BC" alignItems='center' marginTop={5} />
          <Text style={{ padding: 3, marginTop: 2, fontSize: 17, fontFamily: 'proxima', textAlign: 'center', color: '#4C28BC' }}>Sponsorship Investment</Text>
          <Text style={{ marginTop: 4, fontSize: 12, fontFamily: 'karla', textAlign: 'center', }}>Earn up to <Text color='red'>20% p.a.</Text> sponsoring our National Hostel Project.</Text>
          <TouchableOpacity style={styles.quickInvestButton} onPress={() => navigation.navigate('Sponsorship')}>
            <Ionicons name="add-outline" size={24} color="#fff" />
            <Text style={styles.quickInvestText}>QuickInvest</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Ownership')} style={{ backgroundColor: '#E2E4FF', flex: 1, padding: 7, alignItems: 'center', marginLeft: 5, marginRight: 20, borderRadius: 10, height: 230}}>
          <Ionicons name="home-outline" size={40} color="#4C28BC" alignItems='center' marginTop={5} />
          <Text style={{ padding: 3, marginTop: 2, fontSize: 17, fontFamily: 'proxima', textAlign: 'center', color: '#4C28BC', letterSpacing: -0.3, }}>Fractional Ownership Investment</Text>
          <Text style={{ marginTop: 4, fontSize: 12, fontFamily: 'karla', textAlign: 'center',}}>Earn rental income for life by buying a fraction of our hostels.</Text>
          <TouchableOpacity style={styles.buyPropertyButton} onPress={() => navigation.navigate('Ownership')}>
            <Ionicons name="home-outline" size={24} color="#fff" />
            <Text style={styles.quickInvestText}>Buy Property</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1FF',
  },

  title: {
    fontSize: 20,
    marginLeft: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,  
    letterSpacing: -0.4,  
  },
  image: {
    width: '90%',
    height: 150,
    alignSelf: 'center',
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 5,
  },
  subText: {
    marginTop: 15,
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
    marginTop: 17,
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: 140,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },

  buyPropertyButton: {
    marginTop: 17,
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: 147,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },

  quickInvestText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'ProductSans',
    marginLeft: 4,
  },

});

export default Invest;