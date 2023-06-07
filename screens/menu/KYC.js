import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, TextInput, ScrollView, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider';
import { MaterialIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'react-native-image-picker';

const screenWidth = Dimensions.get('window').width;





const KYC = ({ navigation, firstName }) => {
    const [selectedGender, setSelectedGender] = useState(null);
    const [relationshipStatus, setRelationshipStatus] = useState(null);
    const [employmentStatus, setEmploymentStatus] = useState(null);
    const [yearlyIncome, setYearlyIncome] = useState(null);
    const [cardType, setCardType] = useState(null);
    const [relationshipWithNextOfKin, setRelationshipWithNextOfKin] = useState(null);

    const { launchImageLibrary } = ImagePicker;
    const [selectedImage, setSelectedImage] = useState(null);


    const openImagePicker = () => {
      const options = {
        title: 'Select ID Image',
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 1,
      };
    
      ImagePicker.launchImageLibrary({}, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setSelectedImage(response);
        }
      });
    };
       
    
    

    const onGenderSelect = (index, value) => {
        setSelectedGender(value);
      };


    const genderOptions = ['Male', 'Female'];
    const relationshipStatusOptions = [
        'Single',
        'Married',
        'Divorced',
        'Separated',
        'Remarried',
      ];
    
      const employmentStatusOptions = [
        'Unemployed',
        'Employed',
        'Self-employed',
        'Business',
        'Retired',
      ];

      const yearlyIncomeOptions = [
        'Less than N200,000',
        'N200,001 - N500,000',
        'N500,001 - N1 million',
        'N1 million - N5 million',
        'N5 million - N10 million',
        'N10 million - N20 million',
        'Above N20 million',
      ];
  
      const cardTypeOptions = [
        'International Passport',
        "Driver's License",
        'National ID Card (NIN)',
        "Permanent Voter's Card",
      ];

      const relationshipWithNextOfKinOptions = [
        'Brother',
        'Sister',
        'Spouse',
        'Father',
        'Mother',
        'Daughter',
        'Son',
        'Friend',
        'Relative',
      ];
     

  return (
    <View style={styles.container}>

<View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>UPDATE KYC</Text>
        <TouchableOpacity style={styles.person}> 
            <Ionicons name="person-outline" size={22} color="#4C28BC" onPress={() => navigation.navigate('More', component={Profile} )}/>
          </TouchableOpacity>
      <TouchableOpacity style={styles.bell}>
            <Ionicons name="notifications-outline" size={22} color="#4C28BC" />
          </TouchableOpacity>
        </View>
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>

      <View style={styles.propertyContainer}>
        <Ionicons name="shield-checkmark-outline" size={34} color="#4C28BC" style={{ marginRight: 15 }} />
        <View style={styles.progressBarContainer}> 
        <Text style={styles.propertyText}> KYC (Know Your Customer) guidelines by CBN are meant to prevent your account from being used, intentionally or unintentionally, by criminal elements for money laundering activities.
</Text>
      </View>
      </View>
      
    
      <View style={styles.inputContainer}>

      <View style={styles.inputWrapper}>
      <Ionicons name='male-female-outline' marginBottom={8} size={20} color="grey" padding={8}/>
      <View style={styles.dropdown}> 
        <SelectDropdown
        data={genderOptions}
        onSelect={onGenderSelect}
        defaultIndex={null}
        defaultButtonText={
            <>
              <Ionicons name="chevron-down" size={16} color="black" />  GENDER
            </>
          }
         buttonTextAfterSelection={(selectedItem) => selectedItem}
          buttonStyle={styles.dropdownButton}
          dropdownStyle={styles.dropdown}
          rowStyle={styles.dropdownRow}
          rowTextStyle={styles.dropdownRowText}
          buttonTextStyle={styles.placeholderText} /> 
            </View>      
            </View>

      <View style={styles.inputWrapper}>
<Ionicons name='heart-outline' marginBottom={8} size={20} color="grey" padding={8}/>
<View style={styles.dropdown}> 
        {/* Relationship Status */}
        <SelectDropdown
          data={relationshipStatusOptions}
          onSelect={(index, value) => setRelationshipStatus(value)}
          defaultIndex={null}
          defaultButtonText={
            <>
            <Ionicons name="chevron-down" size={16} color="black" />  RELATIONSHIP STATUS
            </>
          }
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          buttonStyle={styles.dropdownButton}
          dropdownStyle={styles.dropdown}
          rowStyle={styles.dropdownRow}
          rowTextStyle={styles.dropdownRowText}
          buttonTextStyle={styles.placeholderText}
        />
      </View>    
      </View>

        <View style={styles.inputWrapper}>
        <MaterialIcons name='business' marginBottom={8} size={20} color="grey" padding={8}/>
        <View style={styles.dropdown}>
        {/* Employment Status */}
        <SelectDropdown
          data={employmentStatusOptions}
          onSelect={(index, value) => setEmploymentStatus(value)}
          defaultIndex={null}
          defaultButtonText={
            <>
             <Ionicons name="chevron-down" size={16} color="black" />  EMPLOYMENT STATUS
            </>
          }          buttonTextAfterSelection={(selectedItem) => selectedItem}
          buttonStyle={styles.dropdownButton}
          dropdownStyle={styles.dropdown}
          rowStyle={styles.dropdownRow}
          rowTextStyle={styles.dropdownRowText}
          buttonTextStyle={styles.placeholderText}
        />
      </View>      
      </View>

      <View style={styles.inputWrapper}>  
      <Ionicons name='cash-outline' marginBottom={8} size={20} color="grey" padding={8}/>
      <View style={styles.dropdown}>
        {/* Yearly Income */}
        <SelectDropdown
          data={yearlyIncomeOptions}
          onSelect={(index, value) => setYearlyIncome(value)}
          defaultIndex={null}
          defaultButtonText={
            <>
             <Ionicons name="chevron-down" size={16} color="black" />  YEARLY INCOME
            </>
          }          
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          buttonStyle={styles.dropdownButton}
          dropdownStyle={styles.dropdown}
          rowStyle={styles.dropdownRow}
          rowTextStyle={styles.dropdownRowText}
          buttonTextStyle={styles.placeholderText}
        />
      </View>
        </View>

        <View style={styles.inputWrapper}>
        <MaterialIcons name='child-care' marginBottom={9} size={20} color="grey" padding={8}/>
<TextInput style={styles.input} placeholder="DATE OF BIRTH (DD-MM-YYYY)" keyboardType="phone-pad" />
        </View>
      
        <View style={styles.inputWrapper}>
        <Ionicons name='home-outline' marginBottom={9} size={20} color="grey" padding={8}/>
<TextInput style={styles.input} placeholder="ADDRESS" keyboardType="email-address" />
        </View>

        <View style={styles.inputWrapper}>
        <Ionicons name='person-outline' class="material-symbols-outlined" marginBottom={9} size={20} color="grey" padding={8}/>
<TextInput style={styles.input} placeholder="MOTHER'S MAIDEN NAME" keyboardType="email-address" />
        </View>

        <View style={styles.inputWrapper}>
        <Ionicons name='people-outline' marginBottom={9} size={20} color="grey" padding={8}/>
<TextInput style={styles.input} placeholder="NEXT OF KIN" keyboardType="phone-pad" />
        </View>

        <View style={styles.inputWrapper}>
        <Ionicons name='people' marginBottom={9} size={20} color="grey" padding={8}/>
        <View style={styles.dropdown}>
        {/* Relationship With Next of Kin */}
        <SelectDropdown
          data={relationshipWithNextOfKinOptions}
          onSelect={(index, value) => setRelationshipWithNextOfKin(value)}
          defaultIndex={null}
          defaultButtonText={
            <>
             <Ionicons name="chevron-down" size={16} color="black" />  RELATIONSHIP WITH NEXT OF KIN
            </>
          }              buttonTextAfterSelection={(selectedItem) => selectedItem}
          buttonStyle={styles.dropdownButton}
          dropdownStyle={styles.dropdown}
          rowStyle={styles.dropdownRow}
          rowTextStyle={styles.dropdownRowText}
          buttonTextStyle={styles.placeholderText}
        />
      </View>        
      </View>

      <View style={styles.inputWrapper}>
        <MaterialIcons name='call' marginBottom={9} size={20} color="grey" padding={8}/>
<TextInput style={styles.input} placeholder="NEXT OF KIN'S PHONE NUMBER" keyboardType="phone-pad" />
        </View>
      


        <Divider />

        <View style={styles.inputWrapper}>
  <MaterialIcons name='badge' marginBottom={9} size={20} color="grey" padding={8} />
  <View style={styles.dropdown}>
    {/* Identification Card Type */}
    <SelectDropdown
      data={cardTypeOptions}
      onSelect={(index, value) => setCardType(value)}
      defaultIndex={null}
      defaultButtonText={
        <>
          <Ionicons name="chevron-down" size={16} color="black" /> IDENTIFICATION TYPE
        </>
      }
      buttonTextAfterSelection={(selectedItem) => selectedItem}
      buttonStyle={styles.dropdownButton}
      dropdownStyle={styles.dropdown}
      rowStyle={styles.dropdownRow}
      rowTextStyle={styles.dropdownRowText}
      buttonTextStyle={styles.placeholderText}
    />
  </View>
</View>

<TouchableOpacity onPress={openImagePicker}>
    {selectedImage ? (

      <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
    ) : (
      <Text style={styles.uploadText}>Upload ID</Text>
    )}
  </TouchableOpacity>


      

      
      

      </View>
     
</ScrollView>




      <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#fff" marginRight={10}/>
                <Text style={styles.primaryButtonText}>Update KYC</Text>
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

  

  propertyContainer: {
    alignItems: 'center',
    paddingHorizontal: 13,
    flexDirection: 'row',
    backgroundColor: '#DCD1FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    height: 98,  
},
 
  propertyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'regular',
    fontFamily: 'karla',
    letterSpacing: -0.4,
    color: 'black',
    marginRight: 25,
    },



    inputContainer: {
        marginTop: 20,
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      input: {
        fontSize: 15,
        height: 37,
        width: screenWidth * 0.80,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 14,    
      },
    
      inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 0,
        marginRight: -18,
        justifyContent: 'flex-end', // align items to the end of container
     },


     dropdownButton: {
        borderRadius: 10,
        fontFamily: 'karla',
        height: 35,
        width: screenWidth * 0.80,
        marginBottom: 10,
        backgroundColor: '#fff',
      },
      dropdown: {
        fontFamily: 'ProductSans',
        textAlign: 'left',
      },
      dropdownRow: {
        alignSelf: 'flex-start',
        fontFamily: 'karla',
      },
      dropdownRowText: {
        textAlign: 'left',
        fontSize: 16,
        color: 'black',
        fontFamily: 'ProductSans',
      },
      placeholderText: {
        color: 'black', 
        fontSize: 16, 
        fontFamily: 'karla', 
        marginRight: 0, 
        letterSpacing: -0.6, 
        textAlign: 'left', // Align the text to the left
        marginLeft: 10,
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



});

export default KYC;
