import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouseCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BuyPropertyModal from './BuyPropertyModal'
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';
import Success from '../components/Success';



const Ownership = ({navigation}) => {
    const [propertyModalVisible, setPropertyModalVisible] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);


    const propertyData = [
      {
        id: 1,
        name: 'K&Q Hostels, FUNAAB',
        location: 'At Harmony Estate opposite FUNAAB.',
        units: {
          'Selfcon': 26,
        },
        price: 5000000, // Price per unit
        rent: 450000,  // Annual rent
        roi: 3,        // ROI in percentage
        image: require('./funaab.png'), // Include the image source
      },

      {
        id: 2,
        name: 'K&Q Hostels, FUNAAB',
        location: 'At Harmony Estate opposite FUNAAB.',
        units: {
          'R/P': 14,
        },
        price: 8500000, // Price per unit
        rent: 350000,  // Annual rent
        roi: 3,        // ROI in percentage
        image: require('./phase3.jpeg'), // Include the image source
      },

      {
        id: 3,
        name: 'Amethyst Hall, Lagos',
        location: 'At Harmony Estate opposite FUNAAB.',
        units: {
          'Selfcon': 0,
        },
        price: 7000000,
        rent: 250000,
        roi: 5,
        image: require('./amethyst.png'), // Include the image source
      },
      {
        id: 4,
        name: 'Ruby Residence, Abuja',
        location: 'At a prime location in Abuja.',
        units: {
          'Selfcon': 0,
          'R/P': 0,
        },
        price: 8000000,
        rent: 350000,
        roi: 4,
        image: require('./phase2.png'), // Include the image source
      },
      {
        id: 5,
        name: 'Topaz Towers, Lagos',
        location: 'Luxury living in Lagos.',
        units: {
          'Selfcon': 0,
          'R/P': 0,
        },
        price: 7000000,
        rent: 300000,
        roi: 4.5,
        image: require('./phase3.png'), // Include the image source
      },
      {
        id: 6,
        name: 'Sapphire Suites, Port Harcourt',
        location: 'Waterfront property in Port Harcourt.',
        units: {
          'Selfcon': 0,
          'R/P': 0,
        },
        price: 6000000,
        rent: 280000,
        roi: 4.7,
        image: require('./amethyst.png'), // Include the image source
      },
    ];
    
    
    const openPropertyModal = (property) => {
      setSelectedProperty(property);
      setPropertyModalVisible(true);
    };

    const handleCloseSuccessModal = () => {
      setIsSuccessVisible(false); 
      navigation.navigate('PropertyList');

    };
    



    
  return (
    <>
    <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
    </TouchableOpacity>
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>BUY PROPERTIES</Text>
      </View>
  </View>              
  
  <ScrollView style={styles.container}>
        <Title>Own</Title>
        <Subtitle>Buy properties and earn lifetime rental income</Subtitle>

        {propertyData.map((property, index) => (
          <View style={styles.itemContainer} key={index}>
            <View style={styles.imageContainer}>
              <Image source={property.image} style={styles.propertyImage} />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.headerText2}>{property.name}</Text>
              <Text style={styles.subText1}>{property.location}</Text>
              {Object.entries(property.units).map(([unitType, unitCount]) => (
                <Text style={styles.subText2} key={unitType}>
                  {unitType}: {unitCount} units
                </Text>
              ))}
              <Text style={{ color: '#4C28BC', marginLeft: 4, marginTop: 6, marginBottom: -2, letterSpacing: -0.4, alignSelf: 'flex-start', fontFamily: 'proxima', fontSize: 18 }}>
              ₦{Math.floor(property.price).toLocaleString()}<Text style={{fontSize: 11}}>/unit</Text>
              </Text>
              <Text style={styles.rate}>₦{Math.floor(property.rent).toLocaleString()} p.a. </Text>
             
              {property.units['Selfcon'] > 0 || property.units['R/P'] > 0 ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => openPropertyModal(property)} // Open modal and pass property details

                  >
                  <FontAwesomeIcon icon={faHouseCircleCheck} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Buy Now!</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.soldButton} disabled>
                  <FontAwesomeIcon icon={faHouseCircleCheck} style={styles.soldButtonIcon} />
                  <Text style={styles.soldButtonText}>Sold Out</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      
{isSuccessVisible && (
      <Success  
      isVisible={isSuccessVisible}
      onClose={handleCloseSuccessModal} // Pass the callback function
      navigation={navigation}
      />
      )}


    {propertyModalVisible && (
<BuyPropertyModal 
      navigation={navigation} 
      propertyModalVisible={propertyModalVisible} 
      setPropertyModalVisible={setPropertyModalVisible} 
      selectedProperty={selectedProperty} // Pass selected property details to the modal
      setIsSuccessVisible={setIsSuccessVisible} // Pass the function here
      />
      )}
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
  propertyImage: {
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
    fontSize: 14,
    fontFamily: 'karla',
    color: 'green',
    marginBottom: 50,
    letterSpacing: -0.7,
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
    backgroundColor: 'silver',
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
    color: 'grey',
    marginRight: 7,
  },
  soldButtonText: {
    color: 'grey',
    fontFamily: 'ProductSans',
    fontSize: 14,
  },

});

export default Ownership;
