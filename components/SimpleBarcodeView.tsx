import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SimpleBarcodeProps {
  value: string;
  width: number;
  height: number;
}

export const SimpleBarcodeView = ({ value, width, height }: SimpleBarcodeProps) => {
  const hash = hashCode(value);
  const bars = generateBars(hash, 40); // 40 bars
  
  return (
    <View style={[styles.container, { width, height }]}>
      {bars.map((barWidth, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              width: barWidth,
              height: height * 0.8,
              marginHorizontal: 1,
            },
          ]}
        />
      ))}
    </View>
  );
};

// Simple hash function to generate a number from a string
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Generate bars of varying widths based on the hash
const generateBars = (hash: number, count: number) => {
  const bars = [];
  const seedRandom = (seed: number) => {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  };
  
  const random = seedRandom(Math.abs(hash));
  
  for (let i = 0; i < count; i++) {
    const width = Math.max(1, Math.floor(random() * 4) + 1);
    bars.push(width);
  }
  
  return bars;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    backgroundColor: '#000',
  },
});