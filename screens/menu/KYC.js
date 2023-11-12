import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Image, Dimensions, TextInput, ScrollView, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider';
import { MaterialIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker';
import LoadingModal from '../components/LoadingModal';
import axios from 'axios';
import { ipAddress } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKYCStatus, setKYCStatus } from '../../ReduxActions';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';
import { useTheme } from '../../ThemeContext';

const screenWidth = Dimensions.get('window').width;


const KYC = ({ navigation, firstName }) => {
    const [selectedGender, setSelectedGender] = useState(null);
    const [relationshipStatus, setRelationshipStatus] = useState(null);
    const [employmentStatus, setEmploymentStatus] = useState(null);
    const [yearlyIncome, setYearlyIncome] = useState(null);
    const [cardType, setCardType] = useState(null);
    const [relationshipWithNextOfKin, setRelationshipWithNextOfKin] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [nameOfNextOfKin, setNameOfNextOfKin] = useState('');
    const [nextOfKinPhoneNumber, setNextOfKinPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [mothersMaidenName, setMothersMaidenName] = useState('');
    const userInfo = useSelector((state) => state.bank.userInfo); // Get userInfo from Redux state
    const kycStatus = useSelector((state) => state.bank.kycStatus);
    const [isInputsFilled, setInputsFilled] = useState(false);
    const { isDarkMode, colors } = useTheme();
    const styles = createStyles(isDarkMode);
    const dispatch = useDispatch();

    useEffect(() => {
      // Fetch the KYC status when the component mounts
      dispatch(fetchKYCStatus());
    }, [dispatch]);


      // Function to format and update the date of birth as the user types
      const handleDateOfBirthChange = (text) => {
        // Check if the input matches the YYYY-MM-DD format
        if (/^\d{0,4}(\-)?\d{0,2}(\-)?\d{0,2}$/.test(text)) {
          // Remove all non-numeric characters
          const numericText = text.replace(/[^\d]/g, '');
    
          // Auto-insert hyphens
          if (numericText.length >= 5) {
            setDateOfBirth(
              numericText.slice(0, 4) +
                '-' +
                numericText.slice(4, 6) +
                '-' +
                numericText.slice(6, 8)
            );
          } else if (numericText.length >= 3) {
            setDateOfBirth(
              numericText.slice(0, 4) + '-' + numericText.slice(4, 6)
            );
          } else {
            setDateOfBirth(numericText);
          }
        }
      };


    useEffect(() => {
      requestMediaLibraryPermissions();
    }, []);
  
    const requestMediaLibraryPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access the media library is required!');
      }
    };

    const checkInputs = () => {
      // Check if all required inputs have values
      if (
        selectedGender !== null &&
        relationshipStatus !== null &&
        employmentStatus !== null &&
        yearlyIncome !== null &&
        dateOfBirth.length > 0 &&
        address.length > 0 &&
        mothersMaidenName.length > 0 &&
        cardType !== null &&
        nameOfNextOfKin.length > 0 &&
        relationshipWithNextOfKin !== null &&
        nextOfKinPhoneNumber.length > 0
      ) {
        setInputsFilled(true);
      } else {
        setInputsFilled(false);
      }
    };
    
    useEffect(() => {
      checkInputs();
    }, [selectedGender, relationshipStatus, employmentStatus, yearlyIncome, dateOfBirth, address, mothersMaidenName, cardType, nameOfNextOfKin, relationshipWithNextOfKin, nextOfKinPhoneNumber]);
    
  
    const openImagePicker = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });
    
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setShowImage(true);
      }      
    };
    
    const removeImage = () => {
      setSelectedImage(null);
      setShowImage(false);
    };
    
    const onGenderSelect = (index, value) => {
      setSelectedGender(index);
    };
    


    const genderOptions = ['Male', 'Female', 'Non-binary', 'Others'];
    const relationshipStatusOptions = [
        'Single',
        'Married',
        'Divorced',
        'Separated',
        'Remarried',
        'Widowed',
        'Others',
      ];
    
      const employmentStatusOptions = [
        'Unemployed',
        'Employed',
        'Self-employed',
        'Business',
        'Retired',
        'Student',
        'Others',
      ];

      const yearlyIncomeOptions = [
        'Less than N200000',
        'N200001 - N500000',
        'N500001 - N1 million',
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
        'Bank Verification Number (BVN)',
        'Others',
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
        'Others',
      ];

      const imageUri = selectedImage; // The local file path to the selected image

      const handleUpdateKYC = async () => {
        try {
          setProcessing(true);
      
          // Ensure the selectedImage is not null before processing
          if (selectedImage) {
            const formData = new FormData();
      
            // Append text data fields with snake_case
            formData.append('gender', selectedGender);
            formData.append('relationship_status', relationshipStatus);
            formData.append('employment_status', employmentStatus);
            formData.append('yearly_income', yearlyIncome);
            formData.append('date_of_birth', dateOfBirth);
            formData.append('address', address);
            formData.append('mothers_maiden_name', mothersMaidenName);
            formData.append('identification_type', cardType);
            formData.append('next_of_kin_name', nameOfNextOfKin);
            formData.append('relationship_with_next_of_kin', relationshipWithNextOfKin);
            formData.append('next_of_kin_phone_number', nextOfKinPhoneNumber);
      
            // Append the image as a file with the correct content type and file name
            formData.append('id_upload', {
              uri: selectedImage,
              type: 'image/jpeg', // Adjust content type if needed
              name: 'kyc_image.jpg', // Adjust file name if needed
            });
      
            // Make the API request
            const response = await axios.patch(
              `${ipAddress}/api/update-kyc/`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${userInfo.token}`,
                },
              }
            );
      
            if (response.status === 200) {
              const responseData = response.data;
              dispatch(setKYCStatus(responseData.kycStatus)); // Update KYC status in Redux
              setProcessing(false);
      
              Alert.alert(
                'KYC Submitted!',
                'Your KYC has been submitted for approval. You will receive a notification once it is approved or rejected.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.navigate('KYC');
                    },
                  },
                ]
              );
            } else {
              setProcessing(false);
              Alert.alert('KYC Update Failed', 'KYC update failed. Please try again later.');
            }
          } else {
            setProcessing(false);
            Alert.alert('Image Missing', 'Please upload an image for your KYC.');
          }
        } catch (error) {
          console.error('Error Updating KYC:', error);
          setProcessing(false);
          Alert.alert('Error', 'Failed to update KYC. Please check your connection and try again later.');
        }
      };
      
      
  
      console.log('selectedGender:', selectedGender);
      console.log('relationshipStatus:', relationshipStatus);
      console.log('employmentStatus:', employmentStatus);
      console.log('yearlyIncome:', yearlyIncome);
      console.log('dateOfBirth:', dateOfBirth);
      console.log('address:', address);
      console.log('selectedImage:', selectedImage);
      console.log('mothersMaidenName:', mothersMaidenName);
      console.log('cardType:', cardType);
      console.log('nameOfNextOfKin:', nameOfNextOfKin);
      console.log('relationshipWithNextOfKin:', relationshipWithNextOfKin);
      console.log('nextOfKinPhoneNumber:', nextOfKinPhoneNumber);

      console.log('showImage..:', imageUri);
     console.log('KYCstatus:', kycStatus);


  return (
    <View style={styles.container}>

<View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>UPDATE KYC</Text>
        </View>
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>
<Title>Update KYC</Title>
<Subtitle>Update your details for added account security</Subtitle>


      <View style={styles.propertyContainer}>
        <Ionicons name="shield-checkmark-outline" size={34} style={styles.icon} />
        <View style={styles.progressBarContainer}> 
        <Text style={styles.propertyText}>KYC (Know Your Customer) guidelines by CBN are meant to prevent your account from being used, intentionally or unintentionally, by criminal elements for money laundering activities.
</Text>
      </View>
      </View>

      <View style={styles.statusContainer}>
      <Text style={styles.propertyText}>
        Status:
        <Text style={styles.statusText}> {kycStatus === "pending" ? "Not yet started" : kycStatus}
        </Text>
      </Text>
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
          onSelect={(index, value) => setRelationshipStatus(index)}
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
          onSelect={(index, value) => setEmploymentStatus(index)}
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
          onSelect={(index, value) => setYearlyIncome(index)}
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
        <MaterialIcons name="child-care" marginBottom={9} size={20} color="grey" padding={8} />
        <TextInput
          style={styles.input}
          placeholder="DATE OF BIRTH (YYYY-MM-DD)"
          keyboardType="phone-pad"
          value={dateOfBirth}
          onChangeText={handleDateOfBirthChange}
        />
      </View>
      
      <View style={styles.inputWrapper}>
          <Ionicons name='home-outline' marginBottom={9} size={20} color="grey" padding={8} />
          <TextInput
            style={styles.input}
            placeholder="ADDRESS"
            keyboardType="email-address"
            value={address} // Set the value to the address variable
            onChangeText={(text) => setAddress(text)} // Handle text input changes
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name='person-outline' marginBottom={9} size={20} color="grey" padding={8} />
          <TextInput
            style={styles.input}
            placeholder="MOTHER'S MAIDEN NAME"
            keyboardType="email-address"
            value={mothersMaidenName} // Set the value to the mothersMaidenName variable
            onChangeText={(text) => setMothersMaidenName(text)} // Handle text input changes
          />
        </View>

        
        <View style={styles.inputWrapper}>
  <MaterialIcons name='badge' marginBottom={9} size={20} color="grey" padding={8} />
  <View style={styles.dropdown}>
    {/* Identification Card Type */}
    <SelectDropdown
      data={cardTypeOptions}
      onSelect={(index, value) => setCardType(index)}
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

<View style={styles.imageContainer}>
  {showImage ? (
    <>
      <TouchableOpacity style={styles.closeButton} onPress={removeImage}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
      <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
    </>
  ) : (
    <TouchableOpacity style={styles.uploadButton} onPress={openImagePicker}>
      <Ionicons name="arrow-up-outline" size={24} style={{color: isDarkMode ? '#6E3DFF' : '#4C28BC', marginRight: 10}}/>
      <Text style={styles.uploadText}>Upload ID</Text>
    </TouchableOpacity>
  )}
</View>




        <Divider />

        <View style={styles.inputWrapper}>
        <Ionicons name='people-outline' marginBottom={9} size={20} color="grey" padding={8}/>
        <TextInput style={styles.input} 
        placeholder="NAME OF NEXT OF KIN" 
        keyboardType="email-address" 
        value={nameOfNextOfKin}
        onChangeText={(text) => setNameOfNextOfKin(text)}
        />
        </View>

        <View style={styles.inputWrapper}>
        <Ionicons name='people' marginBottom={9} size={20} color="grey" padding={8}/>
        <View style={styles.dropdown}>
       
        {/* Relationship With Next of Kin */}
        <SelectDropdown
          data={relationshipWithNextOfKinOptions}
          onSelect={(index, value) => setRelationshipWithNextOfKin(index)}
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
  <MaterialIcons name='call' marginBottom={9} size={20} color="grey" padding={8} />
  <TextInput
    style={styles.input}
    placeholder="NEXT OF KIN'S PHONE NUMBER"
    keyboardType="phone-pad"
    value={nextOfKinPhoneNumber} // Set the value to the nextOfKinPhoneNumber variable
    onChangeText={(text) => setNextOfKinPhoneNumber(text)} // Handle text input changes
  />
</View>


      

      
      

      </View>
     
</ScrollView>



<LoadingModal visible={processing} />

      <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={{
              ...styles.primaryButton,
              backgroundColor: isInputsFilled ? '#4C28BC' : 'grey',
            }}
            onPress={handleUpdateKYC}
            disabled={!isInputsFilled}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#fff" marginRight={10} />
            <Text style={styles.primaryButtonText}>Update KYC</Text>
          </TouchableOpacity>

               </View>
     
    </View>
  );
};


const createStyles = (isDarkMode) => {
  return StyleSheet.create({
container: {
flex: 1,
backgroundColor: isDarkMode ? '#140A32' : '#F5F1FF',
},

   header: {
        marginTop: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      backgroundColor: isDarkMode ? 'black' : 'white',
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

  
    icon: {
      marginRight: 15,
      color: isDarkMode ? '#6E3DFF' : '#4C28BC',
     },
  propertyContainer: {
    alignItems: 'center',
    paddingHorizontal: 13,
    flexDirection: 'row',
    backgroundColor: isDarkMode ? '#2B1667' : '#DCD1FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    height: 98, 
    marginBottom: 5,
 
},
icon: {
  marginRight: 15,
  color: isDarkMode ? '#6E3DFF' : '#4C28BC',
 },
statusContainer: {
alignContent: 'center',
alignSelf: 'center',
flex: 1,
  },
 
  propertyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'regular',
    fontFamily: 'karla',
    letterSpacing: -0.4,
    color: isDarkMode ? 'silver' : 'black',
    marginRight: 25,
    },


    statusText: {
      flex: 1,
      fontSize: 14,
      fontWeight: 'regular',
      fontFamily: 'karla-italic',
      letterSpacing: -0.4,
      color: 'green',
      textAlign: 'center',
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
        backgroundColor: isDarkMode ? '#686183' : 'white',
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 14,    
        borderColor: 'silver',
        borderWidth: 0.5,
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
        backgroundColor:  isDarkMode ? '#686183' : '#fff',
        borderColor: 'silver',
        borderWidth: 0.5,
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

    imageContainer: {
      width: screenWidth * 0.80,
      height: 200,
      borderWidth: 2,
      borderStyle: 'dashed', // Add this line
      borderRadius: 9,
      borderColor: '#4C28BC',
      backgroundColor: isDarkMode ? '#200D61' : '#DCD1FF',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginVertical: 5,
      marginLeft: 20,
    },
    
    selectedImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 9,
    },
    
    uploadButton: {
      flexDirection: 'row',
      borderColor: 'silver',
      backgroundColor: isDarkMode ? '#331C82' : '#F5F1FF',
      height: 40,
      width: '40%',
      padding: 10,
      borderWidth: 0.5,
      borderRadius: 9,
      justifyContent: 'center', // Center horizontally
      alignItems: 'center', // Center vertically
    },
    uploadText: {
      fontSize: 16,
      fontFamily: 'karla',
      color: isDarkMode ? 'silver' : '#4C28BC',
      alignSelf: 'center', // Center the text within the button
    },
   
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
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
}

export default KYC;
