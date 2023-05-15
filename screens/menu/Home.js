import React, { useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';


const Home = ({ navigation, firstName, transactionAmount }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
        <View style={styles.container}>
      <Header navigation={navigation} headerText='MYFUND'/>
      <Text style={styles.welcome}><Text style={styles.welcomeText}>Welcome</Text> <Text style={styles.firstNameText}>[firstName],</Text></Text>
      <View style={styles.propertyContainer}>
        <Ionicons name="home-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
        <Text style={styles.propertyText}>You need $9,500.75 to acquire your next property. Keep growing your funds until your rental income is more than your expenses.</Text>
      </View>
      <View style={styles.savingsContainer}>
        <View style={styles.savingsLine1}>
          <Ionicons name="save-outline" size={17} color="#A9A9A9" style={{ marginLeft: 16, marginTop: 6 }} />
          <Text style={styles.greyText}>Total Savings</Text>
        </View>
        <View>
          <Text style={styles.savingsLine2}>$1,930.50</Text>
          </View>
        <View>
          <Text style={styles.rate}>@10% p.a.</Text>
          </View>
        <TouchableOpacity style={styles.quickSaveButton} >
          <Text style={styles.quickSaveText}>QuickSave</Text>
        </TouchableOpacity>
        <View style={styles.navigatorContainer}>
          <View style={styles.navigatorIndicator} ></View>
          <View style={styles.navigatorIndicator}></View>
          <View style={styles.navigatorIndicator}></View>
          <View style={styles.navigatorIndicator}></View>
        </View>
      </View>
      <View style={styles.todoContainer}>
      <Text style={styles.todoList}>To-Do List</Text>
        <View style={styles.todoList1}>
          <TouchableOpacity style={styles.todoButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="save-outline" size={24} color="#000" style={{ marginRight: 15 }} />
          <Text style={styles.todoText}>Turn On AutoSave</Text>
        </TouchableOpacity>

        </View>
        <View>
        <TouchableOpacity style={styles.todoButton}>
          <Ionicons name="person-add-outline" size={24} color="#000" style={{ marginRight: 15 }} />
          <Text style={styles.todoText}>Refer and Earn</Text>
        </TouchableOpacity>
        </View>
      </View>
    
    
      <SafeAreaView style={styles.transactionContainer}>
      <Text style={styles.recentTransaction}>Recent Transactions</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionItem}>
            <Ionicons
              name="car-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>AutoSave</Text>
              <Text style={styles.transactionDate}>05 Mar, 2023, 11:30am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+300.50</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="cash-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>QuickSave</Text>
              <Text style={styles.transactionDate}>03 Mar, 2023, 10:15am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+1000.00</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="wallet-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>
                Withdrawal From Saving
              </Text>
              <Text style={styles.transactionDate}>01 Mar, 2023, 9:30am</Text>
            </View>
            <View style={styles.transactionAmountContainer}>
            <Text style={styles.negativeAmount}>-500.00</Text>
            </View>
          </View>
          </View>
          {/* Add more transaction items here */}
          <View style={styles.transactionsContainer}>
          <View style={styles.transactionItem}>
            <Ionicons
              name="car-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>AutoSave</Text>
              <Text style={styles.transactionDate}>05 Mar, 2023, 11:30am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+300.50</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="cash-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>QuickSave</Text>
              <Text style={styles.transactionDate}>03 Mar, 2023, 10:15am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+1000.00</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="wallet-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>
                Withdrawal From Saving
              </Text>
              <Text style={styles.transactionDate}>01 Mar, 2023, 9:30am</Text>
            </View>
            <View style={styles.transactionAmountContainer}>
            <Text style={styles.negativeAmount}>-500.00</Text>
            </View>
          </View>
          </View>
          </ScrollView>
    </SafeAreaView>
     
</View>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#F5F1FF',
},
headerContainer: {
backgroundColor: 'white',
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginHorizontal: 20,
marginVertical: 10,
},
welcome: {
fontSize: 20,
marginHorizontal: 20,
marginTop: 10,
},
welcomeText: {
  fontSize: 20,
    marginLeft: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
},

firstNameText:{
 fontFamily: 'karla',
 fontSize: 18,
},
headerText: {
  marginTop: 10,
  fontFamily: 'karla',
  marginHorizontal: 20,
  fontSize: 18,
},

profileIcons: {
flexDirection: 'row',
},
propertyContainer: {
flexDirection: 'row',
backgroundColor: '#DCD1FF',
padding: 15,
marginHorizontal: 20,
alignItems: 'center',
borderRadius: 10,
marginTop: 10,
},
propertyIcon: {
marginRight: 10,
},
propertyText: {
flex: 1,
fontSize: 14,
fontWeight: 'regular',
fontFamily: 'karla',
},
savingsContainer: {
flexDirection: 'column',
backgroundColor: '#4C28BC',
padding: 0,
marginHorizontal: 20,
borderRadius: 10,
marginTop: 20,
alignItems: 'center',
height: 150,
},
savingsLine1: {
  flexDirection: 'row',
marginRight: 10,
color: '#8E8E93',
},
greyText: {
flex: 1,
marginLeft: 10,
marginTop:8,
fontSize: 14,
color: '#8E8E93',
fontFamily: 'karla',
},
savingsLine2: {
  fontSize: 70,
  fontFamily: 'karla',
  textAlign: 'center',
  letterSpacing: -4,
  marginRight: 0,
    color: '#fff',
    marginRight: 85,

},
rate: {
fontSize: 13,
color: '#43FF8E',
marginRight: 278,
fontFamily: 'karla',
},
quickSaveButton: {
backgroundColor: '#9D8CD7',
borderRadius: 8,
paddingVertical: 4,
paddingHorizontal: 9,
marginLeft: 260,
marginBottom: 20,

},
quickSaveText: {
fontSize: 14,
color: "white",
fontFamily: 'ProductSans',
},
navigatorContainer: {
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
},
navigatorIndicator: {
height: 3,
width: 10,
borderRadius: 5,
marginHorizontal: 5,
backgroundColor: 'silver',
},


todoContainer: {
borderRadius: 10,
marginHorizontal: 20,
marginTop: 20,

},

todoButton: {
  flexDirection: 'row',
  borderColor: 'silver',
  backgroundColor: 'white',
  height: 40,
  width: '100%',
  padding: 6,
  borderWidth: 1,
  borderRadius: 9,
},

todoList:{
  marginTop: 2,
  fontSize: 18,
  color: 'black',
   fontFamily: 'ProductSansBold',
   marginHorizontal: 3,
  },

todoList1: {
flexDirection: 'row',
alignItems: 'center',
marginBottom: 10,
marginTop:10,
},
toDoListIcon: {
marginRight: 10,
},
todoText: {
  marginTop: 5,
fontSize: 16,
fontFamily: 'karla',
color: 'grey',
},


tabNavigator: {
flexDirection: 'row',
},
toDoListItem: {
flexDirection: 'row',
alignItems: 'center',
paddingVertical: 10,
borderBottomWidth: 1,
borderBottomColor: '#ccc',
},


recentContainer: {
flexDirection: 'row',
marginTop: 5,
borderWidth: 0.3,
borderColor: 'silver',
borderRadius: 8,
width: '100%',
height: 50,
},



todoList: {
  marginTop: 2,
  fontSize: 18,
  color: 'black',
   fontFamily: 'ProductSansBold',
   
},


recentTransaction: {
  marginTop: 2,
  marginLeft:20,
  fontSize: 18,
  color: 'black',
   fontFamily: 'ProductSansBold',
   
},
transactionContainer: {
  marginTop: 25,
  flex: 1,
    },

transactionsContainer: {
  borderRadius: 10,
  marginHorizontal: 20,
  marginTop: 5,
},
transactionItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},
transactionIcon: {
  backgroundColor: '#DEE4FC',
  color: '#4C28BC',
  padding: 8,
  borderRadius: 10,
  marginRight: 10,
},
transactionText: {
  flex: 1,
  alignItems: 'flex-start',

},
transactionDescription: {
  color: '#4C28BC',
  letterSpacing: -1,
  fontSize: 18,
  fontFamily: 'karla',
  marginTop: 3,
  textAlign: 'left',
  alignItems: 'flex-start',
},
transactionDate: {
  fontFamily: 'karla',
  fontSize: 12,
  marginTop: 3,
},
transactionAmount: {
  color: 'green',
  fontSize: 23,
  fontFamily: 'karla',
  letterSpacing: -1,
  marginTop: 10,
  textAlign: 'right',
},

negativeAmount: {
  color: 'red',
  fontSize: 23,
  fontFamily: 'karla',
  letterSpacing: -1,
  marginTop: 10,
  textAlign: 'right',
},

transactionAmountContainer: {
  textAlign: 'right',
  
},
});

export default Home;
