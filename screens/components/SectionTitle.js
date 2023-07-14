import React from 'react';
import { Text, StyleSheet } from 'react-native';

const SectionTitle = ({ children }) => {
  return <Text style={styles.sectionTitle}>{children}</Text>;
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginLeft: 20,
    marginTop: 2,
    color: 'grey',
    fontFamily: 'karla',
    letterSpacing: 2,
    marginBottom: 2,
  },
});

export default SectionTitle;
