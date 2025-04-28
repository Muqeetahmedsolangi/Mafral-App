import React from "react";
import { View, StyleSheet } from 'react-native';
import { WelcomeScreen } from "@/screens/onboarding/WelcomeScreen";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <WelcomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
  }
});