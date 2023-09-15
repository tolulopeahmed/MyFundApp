import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const Header = ({ navigation, headerText,  }) => {
  const { toggleDrawer } = useNavigation();
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  // useEffect(() => {
  //   // Replace this with logic to fetch new notifications and update the count.
  //   const newNotifications = fetchNewNotifications();
  //   setNewNotificationCount(newNotifications.length);
  // }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons name="menu-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{headerText}</Text>

        <TouchableOpacity style={styles.bell} onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={22} color="#4C28BC" />
          {newNotificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{newNotificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
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
    fontFamily: 'nexa',
    letterSpacing: 3,
    fontSize: 13,
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
    notificationBadge: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: 'red',
      borderRadius: 15,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
  
    notificationText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },

  });

export default Header;
