import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';

const FAQ = ({ navigation }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);


  const questions = [
    {
      id: 1,
      question: 'What exactly is MyFund?',
      answer: 'MyFund is a fintech platform that helps you save your money towards buying properties for a lifetime rental income. But in the meantime, you earn up to 20% p.a. dividends on your money every January and July.',
    },
    {
      id: 2,
      question: 'How do I earn income from MyFund?',
      answer: 'You earn into your wallet... \n- 13% p.a. on Savings and 20% p.a. on Sponsorship Investments every January and July, \n- lifetime rental income on properties acquired, \n- 5% commission on sold properies you refer, \n- bonuses on referrals, and \n- as one of the top savers of the month.',
    },
    {
        id: 3,
        question: "If I've cumulatively saved up to N100,000 in my Savings, can I move it to Investment?",
        answer: "Yes. you're encouraged to do so especially because it gives 20% ROI (compared to 10% on your Savings). Simply click the WITHDRAW button and follow the prompt to move your accumulated funds from SAVINGS to INVESTMENT.",
      },
      {
        id: 4,
        question: 'What is Ownership Investment?',
        answer: "It means buying a property to own for rental income. We're setting up rental properties in high traffic areas across the country for you to own a part of. The ongoing investment plan is at Harmony Estate, opposite the Federal University of Agriculture Abeokuta (FUNAAB), Ogun State (41 apartments). Simply go to Invest > Ownership Investment and select Buy Now!",
      },
      {
        id: 5,
        question: 'What is the charge on withdrawals?',
        answer: "Withdrawal from Wallet to any account is free. Immediate withdrawal from Savings and Sponsorship Investment, however, attracts a break fee of 2.5% and 5% respectively. If however you don't want to be charged, the waiting period is 90 days.",
      },
      {
        id: 6,
        question: 'How much do I get on Referrals?',
        answer: "You earn up to... \n- N1000 on referring friends to MyFund, and \n- 5% on all property sales that are completed by your referral.",
      },
      {
        id: 7,
        question: 'Why choose MyFund when there are other piggybank platforms out there?',
        answer: "MyFund helps working and retiring-class people save towards owning properties. Unlike the currently existing piggybank solutions, MyFund offers a lifetime rental/retirement income via our national hostel project.",
      },
    // Add more questions and answers as needed
  ];

  const handleQuestionPress = (id) => {
    setSelectedQuestion(id === selectedQuestion ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>FAQs</Text>
        </View>
      </View>

<Title>FAQs</Title>
<Subtitle>See the answers to top Frequently Asked Questions</Subtitle>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Top Frequently Asked Questions</Text>

        <View style={styles.questionsContainer}>
          {questions.map((q) => (
            <View key={q.id}>
              <TouchableOpacity
                style={[
                  styles.button,
                  selectedQuestion === q.id && styles.buttonSelected,
                ]}
                onPress={() => handleQuestionPress(q.id)}
              >
                <Ionicons name="chatbubbles-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
                <Text style={styles.buttonText}>{q.question}</Text>
              </TouchableOpacity>
              {selectedQuestion === q.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{q.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Chat')}>
                <Ionicons name="chatbubbles-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
                <Text style={styles.primaryButtonText}>Chat Admin Instead</Text>
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
  headerText: {
    flex: 1,
    color: 'silver',
    alignSelf: 'center',
    marginLeft: 15,
    fontFamily: 'karla',
    letterSpacing: 3,
  },
  title: {
    fontSize: 20,
    marginLeft: 25,
    fontFamily: 'proxima',
    color: isDarkMode ? '#6E3DFF' : '#4C28BC',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
  },
  questionsContainer: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    borderColor: 'silver',
    backgroundColor: isDarkMode ? '#2B1667' : '#fff',
    width: '90%',
    padding: 8,
    borderWidth: 1,
    borderRadius: 9,
    marginBottom: 5,
    marginTop: 10,
  },
  buttonSelected: {
    backgroundColor: isDarkMode ? 'black' : '#DCD1FF',
    alignSelf: 'center',
    borderBottomRightRadius: 9,
    borderBottomLeftRadius: 9,

  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'ProductSans',
    color: isDarkMode ? 'silver' : '#4C28BC',
    marginTop: 5,
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4C28BC',
    borderBottomRightRadius: 9,
    borderBottomLeftRadius: 9,
    width: '90%',
    marginBottom: 10,
    marginTop: -3,
    
  },
  
  answerText: {
    fontSize: 16,
    fontFamily: 'ProductSans',
    color: 'white',
    marginTop: 5,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    bottom: 30,
    left: 0,
    right: 0,
    marginTop: 40,
  },
  
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },
   
primaryButtonText: {
  color: '#fff',
  fontSize: 18,
  fontFamily: 'ProductSans',
},

});
}
export default FAQ;
