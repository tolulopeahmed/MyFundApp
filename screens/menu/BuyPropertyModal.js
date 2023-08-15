import React, { useState } from 'react';
import { Modal, Text, animation, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';

const BuyPropertyModal = ({ navigation, propertyModalVisible, setPropertyModalVisible}) => {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [paymentOption, setPaymentOption] = useState('');


  const handleActivate = () => {
    setModalVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      navigation.navigate('Save');
      setAnimation(new Animated.Value(0));
    });
  };

  const closeModal = () => {
    setPropertyModalVisible(false);
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={propertyModalVisible}
      onRequestClose={() => setPropertyModalVisible(false)}
    >

<TouchableOpacity
  style={styles.modalContainer}
  activeOpacity={1}
  onPress={closeModal}
  
>
  <TouchableOpacity
    activeOpacity={1}
    style={styles.modalContent}
    onPress={() => {}}
  > 
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
             <Text style={styles.modalHeader} >Buy Property</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setPropertyModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
            Buy Kings and Queen Hostels, at Harmony Estate, Federal University of Agriculture, Abeokuta, FUNAAB. {'\n'}{'\n'}Pay: <Text style={{color: '#4C28BC', fontFamily: 'proxima'}}>N5million/unit</Text> {'\n'}Earn <Text style={{color: 'green', fontFamily: 'proxima'}}>N250,000/year</Text>{'\n'}
            {'\n'}Select how many units you want to buy.
          </Text>
        
          
          <View style={styles.inputContainer}>
      <View style={styles.dropdown}>
        <Picker
          style={styles.labelItem}
          selectedValue={frequency}
          onValueChange={(value) => setFrequency(value)}
        >
          <Picker.Item color='silver' label="Select How Many Units" value="Frequency" />
          <Picker.Item label="1 unit" value="1" />
          <Picker.Item label="2 units" value="2" />
          <Picker.Item label="3 units" value="3" />
          <Picker.Item label="4 units" value="4" />
          <Picker.Item label="5 units" value="5" />
        </Picker>

      </View>
    </View>


          <View style={styles.paymentOptionsContainer}>
            <Text style={styles.label}>Payment Options</Text>
            
            <Picker
          style={styles.labelItem2}
          selectedValue={paymentOption}
          onValueChange={(value) => setPaymentOption(value)}
        >
          <Picker.Item color='silver' label="Select Source of Funding" value="Frequency"/>
          <Picker.Item label="Savings: (15000)" value="Savings: (15000)" />
          <Picker.Item label="Sponsorship Investment: (250000)" value="Sponsorship Investment: (250000)" />
          <Picker.Item label="Pay with saved card" value="Pay with saved card" />
          <Picker.Item label="Add new card" value="Add new card" />
          <Picker.Item label="Pay with bank transfer" value="Pay with bank transfer" />
        </Picker>
                       </View>


        <Text style={styles.modalSubText2}>By clicking Confirm, you agree to the <Text style={{color: '#4C28BC', fontFamily: 'proxima'}}>Deed of Agreement.</Text></Text>

          <View style={styles.buttonsContainer}>
  <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('PropertyList')}>
    <Text style={styles.primaryButtonText}>Continue</Text>
  </TouchableOpacity>

         
          </View>
          </TouchableOpacity>
          </TouchableOpacity>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#F6F3FF',
    width: '100%',
    alignItems: 'center',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,      
  },

  modalHeader: {
    marginTop: 20,
    fontSize: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
    flex: 1,
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 30,
    marginTop: 5,
  },
   
  modalSubText2: {
    fontSize: 12,
    fontFamily: 'karla',
    textAlign: 'center',
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 30,
    marginTop: 5,
  },

  inputContainer: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },

  autoSaveSetting: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginLeft: 40,
    alignSelf: 'flex-start',
    marginBottom: 10,

  },

  label: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginRight: 190,
    marginTop: 20,
    marginBottom: 10,
  },

  labelItem: {
    color: 'grey',
    textAlign: 'left',
    marginLeft: -16,
    marginBottom: 30,
    fontFamily: 'karla',
    backgroundColor: '#fff',
    marginRadius: 10,
  },

  labelItem2: {
    color: 'grey',
    textAlign: 'left',
    marginLeft: -5,
    marginBottom: 30,
    fontFamily: 'karla',
    backgroundColor: '#fff',
    marginRadius: 10,

  },

  dropdown: {
    height: 45,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 5,

  },


  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    position: 'relative',
    marginBottom: 35,
    alignSelf: 'center'
  },

  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
  },


};

export default BuyPropertyModal;
