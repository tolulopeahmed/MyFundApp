import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Home = ({ navigation, firstName }) => {
  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={30} color="#000" />
        </TouchableOpacity>
        <View style={styles.profileIcons}>
          <TouchableOpacity > 
            <Ionicons name="person-outline" size={24} color="#000" style={{ marginRight: 15 }} onPress={() => navigation.navigate('Profile')}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      </View>
      <Text style={styles.welcome}><Text style={styles.welcomeText}>Welcome</Text> <Text style={styles.firstNameText}>[firstName],</Text></Text>
      <View style={styles.propertyContainer}>
        <Ionicons name="home-outline" size={24} color="#000" style={{ marginRight: 15 }} />
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
        <TouchableOpacity style={styles.quickSaveButton}>
          <Text style={styles.quickSaveText}>Quick Save</Text>
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
          <TouchableOpacity style={styles.todoButton}>
          <Ionicons name="save-outline" size={24} color="#000" style={{ marginRight: 15 }} />
          <Text style={styles.todoText}>Turn On Autosave</Text>
        </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity style={styles.todoButton}>
          <Ionicons name="person-add-outline" size={24} color="#000" style={{ marginRight: 15 }} />
          <Text style={styles.todoText}>Refer and Earn</Text>
        </TouchableOpacity>
        </View>
      </View>
      <View style={styles.transactionsContainer}>
        <View style={styles.transactionItem}>
        <View>
          <Text style={styles.todoList}>Recent Transactions</Text>
          </View>
          <View style={styles.recentContainer}>
          <View style={styles.transactionText}>
            <Text style={styles.transactionDescription}>Autosave</Text>
            <Text style={styles.transactionDate}>05 Mar, 2023, 11:30am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+300.50</Text>
          </View>
          </View>
        </View>
      </View>
      <View style={styles.tabNavigator}>
        <TouchableOpacity style={styles.tabButton}>
          <Ionicons name="home-outline" size={24} color="#000" />
          <Text style={styles.activeTab}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabButton}>
      <Ionicons name="wallet-outline" size={24} color="#000" />
      <Text style={styles.tabText}>Save</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabButton}>
      <Ionicons name="trending-up-outline" size={24} color="#000" />
      <Text style={styles.tabText}>Invest</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabButton}>
      <Ionicons name="cash-outline" size={24} color="#000" />
      <Text style={styles.tabText}>Withdraw</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabButton}>
      <Ionicons name="ellipsis-horizontal-outline" size={24} color="#000" />
      <Text style={styles.tabText}>More</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#F5F1FF',
marginTop: 50,
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
 color: '#4C28BC',
 fontFamily: 'ProductSansBold',
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
borderRadius: 10,
marginTop: 20,
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
fontSize: 60,
fontFamily: 'ProductSans',
textAlign: 'left',
marginRight: 85,
  color: '#fff',
},
rate: {
fontSize: 13,
color: 'orange',
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


transactionsContainer: {
  borderRadius: 10,
  marginHorizontal: 20,
  marginTop: 20,
  
},
transactionItem: {
flexDirection: 'column',
alignItems: 'flex-start',
paddingVertical: 10,
borderBottomWidth: 1,
borderBottomColor: '#ccc',
},
transactionIcon: {
backgroundColor: '#4C28BC',
color: '#fff',
padding: 10,
borderRadius: 25,
marginRight: 10,
},
transactionDescription: {
color: '#44D47D',
fontSize: 20,
fontFamily: 'karla',
marginTop: 3,
marginLeft: 10,
},
transactionDate: {
fontFamily: 'karla',
fontSize: 12,
marginTop: 3,
marginLeft: 10,
},
transactionAmount: {
  color: '#44D47D',
  fontSize: 25,
  fontFamily: 'ProductSans',
  marginTop: 10,
  marginLeft: 130,
},
transactionTime: {
color: '#ccc',
},


tabNavigator: {
flexDirection: 'row',
justifyContent: 'space-around',
alignItems: 'center',
backgroundColor: '#fff',
top: 40,
flex: 0.6,
},
tabButton: {
alignItems: 'center',
fontFamily: 'karla',
},
tabButtonTitle: {
fontSize: 12,
marginTop: 8,
fontFamily: 'karla',
},
activeTab: {
color: 'purple',
fontWeight: 'bold',
},
});

export default Home;
