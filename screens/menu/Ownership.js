import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouseCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BuyPropertyModal from './BuyPropertyModal'
import Profile from './Profile'


const Ownership = ({navigation}) => {
    const [propertyModalVisible, setPropertyModalVisible] = useState(false);

    // in the Save component
  const handleActivateAutoSave = () => {
    setModalVisible(true);
    setAutoSave(true);
  };

  return (
    <>
    <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
    </TouchableOpacity>
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>BUY PROPERTIES</Text>
      <TouchableOpacity style={styles.person}> 
          <Ionicons name="person-outline" size={22} color="#4C28BC" onPress={() => navigation.navigate('More', component={Profile} )}/>
        </TouchableOpacity>
    <TouchableOpacity style={styles.bell}>
          <Ionicons name="notifications-outline" size={22} color="#4C28BC" />
        </TouchableOpacity>
      </View>
  </View>              
  
  <Text style={styles.title}>Fractional Ownership Investment</Text>

      <ScrollView style={styles.container}>



            <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('./funaab.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText2}>K&Q Hostels, FUNAAB</Text>
        <Text style={styles.subText1}>At Harmony Estate opposite FUNAAB.</Text>
        <Text style={styles.subText2}>1 Bed/Self-contain: 26 units</Text>
        <Text style={styles.subText2}>Room and Parlour: 14 units</Text>
        <Text style={{color: '#4C28BC', marginLeft: 4, alignSelf: 'flex-start', fontFamily: 'proxima', fontSize: 15}}>N5million/unit</Text>
        <Text style={styles.rate}>N150,000 p.a.</Text>
        <TouchableOpacity style={styles.button} onPress={() => setPropertyModalVisible(true)}>
        <FontAwesomeIcon icon={faHouseCircleCheck} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Buy Now!</Text>
        </TouchableOpacity>
      </View>
      </View>

      {propertyModalVisible && (
<BuyPropertyModal 
      navigation={navigation} 
      propertyModalVisible={propertyModalVisible} 
      setPropertyModalVisible={setPropertyModalVisible} />
      )}


      <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('./amethyst.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText2}>Amethyst Hall, Lagos</Text>
        <Text style={styles.subText1}>At Harmony Estate opposite FUNAAB.</Text>
        <Text style={styles.subText2}>1 Bed/Self-contain: 26 units</Text>
        <Text style={styles.subText2}>Room and Parlour: 14 units</Text>
        <Text style={{color: '#4C28BC', marginLeft: 4, alignSelf: 'flex-start', fontFamily: 'proxima', fontSize: 15}}>N5million/unit</Text>
        <Text style={styles.rate}>N250,000 p.a.</Text>
        <TouchableOpacity style={styles.soldButton}>
        <FontAwesomeIcon icon={faHouseCircleCheck} animation="beat" style={styles.soldButtonIcon} />
          <Text style={styles.soldButtonText}>Sold Out</Text>
        </TouchableOpacity>
      </View>
      </View>


      <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('./phase2.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText2}>WLA Legacy Hall, Lagos</Text>
        <Text style={styles.subText1}>At Harmony Estate opposite FUNAAB.{'\n'}<Text style={{color: '#4C28BC', fontFamily: 'proxima', fontSize: 15}}>N5million/unit</Text></Text>
        <Text style={styles.subText2}>1 Bed/Self-contain: 26 units</Text>
        <Text style={styles.subText2}>Room and Parlour: 14 units</Text>
        <Text style={styles.rate}>N200,000 p.a.</Text>
        <TouchableOpacity style={styles.soldButton}>
        <FontAwesomeIcon icon={faHouseCircleCheck} animation="beat" style={styles.soldButtonIcon} />
          <Text style={styles.soldButtonText}>Sold Out</Text>
        </TouchableOpacity>
      </View>
      </View>

      <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('./phase3.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText2}>MyFund Hall, Lagos</Text>
        <Text style={styles.subText1}>At Harmony Estate opposite FUNAAB.</Text>
        <Text style={styles.subText2}>1 Bed/Self-contain: 26 units</Text>
        <Text style={styles.subText2}>Room and Parlour: 14 units</Text>
        <Text style={{color: '#4C28BC', fontFamily: 'proxima', fontSize: 15}}>N5million/unit</Text>
        <Text style={styles.rate}>N250,000 p.a.</Text>
        <TouchableOpacity style={styles.soldButton}>
        <FontAwesomeIcon icon={faHouseCircleCheck} animation="beat" style={styles.soldButtonIcon} />
          <Text style={styles.soldButtonText}>Sold Out</Text>
        </TouchableOpacity>
      </View>
      </View>

      <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('./amethyst.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText2}>Wonderland, Lagos</Text>
        <Text style={styles.subText1}>At Harmony Estate opposite FUNAAB.{'\n'}<Text style={{color: '#4C28BC', fontFamily: 'proxima', fontSize: 15}}>N5million/unit</Text></Text>
        <Text style={styles.subText2}>1 Bed/Self-contain: 26 units</Text>
        <Text style={styles.subText2}>Room and Parlour: 14 units</Text>
        <Text style={styles.rate}>N250,000 p.a.</Text>
        <TouchableOpacity style={styles.soldButton}>
        <FontAwesomeIcon icon={faHouseCircleCheck} animation="beat" style={styles.soldButtonIcon} />
          <Text style={styles.soldButtonText}>Sold Out</Text>
        </TouchableOpacity>
      </View>
      </View>
      
    </ScrollView>
    </>
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
icon: {
  marginRight: 0,
},

headerContainer: {
flex: 1,
flexDirection: 'row',
justifyContent: 'flex-end',

},

headerText:{
flex: 1,
color: 'silver',
alignSelf: 'center',
marginLeft: 15,
fontFamily: 'karla',
letterSpacing: 3,
},

person: {
    borderWidth: 1.5,
    padding: 4.5,
    borderRadius: 80,
    borderColor: '#4C28BC',
    height: 35,
    width: 35,
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center'
},

bell: {
    marginLeft: 6,
    borderWidth: 1.5,
    borderColor: '#4C28BC',
    padding: 4.5,
    height: 35,
    width: 35,
    borderRadius: 80,
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center'
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
    backgroundColor: '#F5F1FF',

  },

  itemContainer: {
    flex: 1,
    backgroundColor: '#E5DDFF',
    borderRadius: 10,
    borderWidth: 0.3,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative', // Add this property to enable positioning of the button
  },

  imageContainer: {
    width: '50%',
    padding: 5,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 9,

  },

 detailsContainer: {
  flex: 1, // Add this property to allow the container to take full width
  padding: 1,
  justifyContent: 'center',
  alignSelf: 'center',
  alignContent: 'center',
  alignItems: 'center'
},

  headerText2: {
    color: '#4C28BC',
    fontSize: 16,
    fontFamily: 'proxima',
    letterSpacing: -0.5,
    marginTop: 13,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },

  subText1: {
    fontSize: 11,
    width: '95%',
    fontFamily: 'karla',
    letterSpacing: -0.3,
  },

  subText2: {
    fontSize: 11,
    width: '95%',
    color: '#808080',
  },

  rate: {
    fontSize: 16,
    fontFamily: 'karla',
    color: 'green',
    marginBottom: 50,
    letterSpacing: -0.5,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },

  button: {
    position: 'absolute', // Position the button absolutely inside the item container
    bottom: 10, // Adjust the value as per your requirement
    right: 10, // Adjust the value as per your requirement
    backgroundColor: '#4C28BC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    width: '55%',
    borderRadius: 10,
  },


  buttonIcon: {
    color: '#FFFFFF',
    marginRight: 7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'ProductSans',
    fontSize: 14,
  },


  soldButton: {
    backgroundColor: 'white',
    position: 'absolute', // Position the button absolutely inside the item container
    bottom: 10, // Adjust the value as per your requirement
    right: 10, // Adjust the value as per your requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    width: '55%',
    borderRadius: 10,
    borderColor: 'grey',
  },

  soldButtonIcon: {
    color: 'silver',
    marginRight: 7,
  },
  soldButtonText: {
    color: 'silver',
    fontFamily: 'ProductSans',
    fontSize: 14,
  },

});

export default Ownership;
