import React, { useState } from 'react';
import { View, Text, Image, Linking, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Resources = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleBuyNowClick = () => {
    const buyNowUrl = 'https://bit.ly/f9steps';
    Linking.openURL(buyNowUrl);
  };

  const handleBuyNowClick2 = () => {
    const buyNowUrl = 'https://flutterwave.com/pay/fhis21?_ga=2.157473722.1833356926.1651484081-1989222362.1651484081';
    Linking.openURL(buyNowUrl);
  };

  const handleBuyNowClick3 = () => {
    const buyNowUrl = 'https://drive.google.com/drive/folders/1Gg25GSiQ09of4iQ54if6PlWSTnp5Pft0?usp=share_link';
    Linking.openURL(buyNowUrl);
  };

  const handleBuyNowClick4 = () => {
    const buyNowUrl = 'https://www.youtube.com/watch?v=WqqPwfSjIsI';
    Linking.openURL(buyNowUrl);
  };

  

  return (
    <>
    <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
    </TouchableOpacity>
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>WEALTHMAP RESOURCES</Text>
     
      </View>
  </View>              
  
  <Text style={styles.title}>Wealth Leadership Academy Resources</Text>

      <ScrollView style={styles.container}>



            <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('./9stepsbook.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText2}>9 Steps to Fin. Freedom</Text>
        <Text style={styles.subText1}>Identify and learn what to do to move up the 9 steps to financial freedom especially how to earn, save and acquire properties for rental income. {'\n'} {'\n'}It comes with bonus materials (audios and video links inside) and an opportunity to share profit. Enjoy!
</Text>
       
        <Text style={styles.rate}><Text style={{textDecorationLine: 'line-through', color: 'black', fontSize: 12,}}>N6000</Text>{'\n'}N4000</Text>
        <TouchableOpacity style={styles.button} onPress={handleBuyNowClick}>
          <Text style={styles.buttonText}>Buy Now!</Text>
        </TouchableOpacity>
      </View>
      </View>

      <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('./wla1.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText2}>Wealth Leadership Academy (Season 1)</Text>
        <Text style={styles.subText1}>Enjoy the Multiple Skills of Income Session of the Wealth Leadership Academy Season 1</Text>
       
        <Text style={styles.rate}><Text style={{textDecorationLine: 'line-through', color: 'black', fontSize: 12,}}>N20000</Text>{'\n'}N4000</Text>
        <TouchableOpacity style={styles.button} onPress={handleBuyNowClick2}>
          <Text style={styles.buttonText}>Buy Now!</Text>
        </TouchableOpacity>
      </View>
      </View>


      <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('./fmc.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText2}>Financial Mentoring Class</Text>
        <Text style={styles.subText1}>A straightforward practical guide on how to Earn, Save and Invest (videos)</Text>
       
<Text style={styles.rate}><Text style={{textDecorationLine: 'line-through', color: 'black', fontSize: 12,}}>N40000</Text>{'\n'}Free</Text>
        <TouchableOpacity style={styles.button} onPress={handleBuyNowClick3}>
          <Text style={styles.buttonText}>Get!</Text>
        </TouchableOpacity>
      </View>
      </View>

      <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('./fmc-earning.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText2}>5 Ways to Earn (MyFund)</Text>
        <Text style={styles.subText1}>Here are ways you probably didn't know you can earn with MyFund. 
{'\n'} {'\n'}The fifth way is long-term but it's permanent income. </Text>
       
<Text style={styles.rate}><Text style={{textDecorationLine: 'line-through', color: 'black', fontSize: 12,}}>N40000</Text>{'\n'}Free</Text>
        <TouchableOpacity style={styles.button} onPress={handleBuyNowClick4}>
          <Text style={styles.buttonText}>Watch!</Text>
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
    flex: 0.5,
    backgroundColor: '#E5DDFF',
    borderRadius: 10,
    borderWidth: 0.3,
    alignItems: 'center',
    alignSelf: 'center',
    height: '25%',
    width: '90%',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 15,
  },

  imageContainer: {
    width: '50%',
    padding: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,

  },

  detailsContainer: {
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
    width: 180,
    marginTop: 13,
    marginBottom: 9,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },

  subText1: {
    fontSize: 11,
    width: '95%',
    fontFamily: 'karla',
    marginBottom: 3,
    width: 170,
    letterSpacing: -0.3,
  },

  subText2: {
    fontSize: 11,
    width: '95%',
    width: '95%',
    color: '#808080',
  },

  rate: {
    fontSize: 16,
    fontFamily: 'karla',
    color: 'green',
    marginTop: 10,
    marginBottom: 1,
    letterSpacing: -0.5,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },

  button: {
    backgroundColor: '#4C28BC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 7,
    paddingHorizontal: 6,
    width: '45%',
    borderRadius: 10,
    marginRight: 9,
    marginBottom: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 7,
    paddingHorizontal: 8,
    width: '55%',
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 10,
    borderWidth: 0.5,
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

export default Resources;
