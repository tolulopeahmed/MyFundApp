import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAQ = ({ navigation }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = [
    {
      id: 1,
      question: 'What exactly is MyFund?',
      answer: 'MyFund is a fintech platform that helps you save your money towards buying properties for a lifetime rental income. But in the meantime you earn dividends on your savings every January and July.',
    },
    {
      id: 2,
      question: 'How do I earn income from MyFund?',
      answer: '1. You earn 10% p.a. on Savings and 20% p.a. on Sponsorship Investments every January and July. 2. You earn lifetime rental income on properties acquired. 3. You earn 5% commission on properies sold. 4. You earn bonuses on referrals. and 5. You earn as one of the top savers',
    },
    {
        id: 3,
        question: "If I've cumulatively saved up to N60,000 in my Savings, can I move it to Investment?",
        answer: "Yes. you're encouraged to do so or a multiple of it especially since it gives 20% ROI compared to 10% from Savings. This also means you'll start making your savings afresh.",
      },
      {
        id: 4,
        question: 'What is Onwership Investment?',
        answer: "It means buying a property to own for rental income. We're building hostels and housing across campuses and high traffic areas in the country. The ongoing investment plan is at Harmony Estate, opposite the Federal University of Agriculture Abeokuta (FUNAAB), Ogun State...with 41 apartments. Others under construction.",
      },
      {
        id: 5,
        question: 'What is the charge on withdrawals?',
        answer: "Withdrawal from Wallet is free. Immediate withdrawal from Savings and Sponsorship Investment, however, attracts a break fee of 2.5% and 5% respectively. If however you don't want to be charged, the waiting period is 90 days.",
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
                <TouchableOpacity style={styles.primaryButton} >
                <Ionicons name="chatbubbles-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
                <Text style={styles.primaryButtonText}>Chat Admin Instead</Text>
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
    color: '#4C28BC',
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
    backgroundColor: 'white',
    width: '90%',
    padding: 8,
    borderWidth: 1,
    borderRadius: 9,
    marginBottom: 5,
    marginTop: 10,
  },
  buttonSelected: {
    backgroundColor: '#DCD1FF',
    alignSelf: 'center',
    borderBottomRightRadius: 9,
    borderBottomLeftRadius: 9,

  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'ProductSans',
    color: '#4C28BC',
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
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
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

export default FAQ;
