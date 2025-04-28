import React from 'react';
import { View, StyleSheet } from 'react-native';
import RNSlider from '@react-native-community/slider';

interface Props {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
}

export function CustomSlider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 0.1,
  minimumTrackTintColor = '#3f51b5',
  maximumTrackTintColor = '#b6b6b6',
  thumbTintColor = '#3f51b5'
}: Props) {
  return (
    <View style={styles.container}>
      <RNSlider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  }
});