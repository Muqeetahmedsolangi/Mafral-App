import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SimpleBarcodeProps {
  value: string;
  width: number;
  height: number;
}

export const SimpleBarcodeView = ({ value, width, height }: SimpleBarcodeProps) => {
  const hash = hashCode(value);
  // More bars for a more realistic barcode
  const bars = generateBars(hash, 80);
  
  return (
    <View style={[styles.container, { width, height }]}>
      {bars.map((barWidth, index) => {
        // Skip rendering bars with zero width (spaces)
        if (barWidth === 0) return null;
        
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                width: barWidth,
                height: height * 0.85,
              },
            ]}
          />
        );
      })}
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
  return Math.abs(hash);
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
  
  const random = seedRandom(hash);
  
  // Start with a few thin bars
  bars.push(1);
  bars.push(0); // space
  bars.push(1);
  
  // Generate the main part of the barcode
  for (let i = 3; i < count - 3; i++) {
    // Generate bars with different widths (1-2 pixels)
    // and make some bars "white" (spaces) by setting them to zero width
    const r = random();
    
    if (i % 3 === 0) {
      // Every third position is a space of varying width
      bars.push(0); // zero width means the bar won't render (space)
    } else {
      // Calculate the width - thinner bars are more common
      const width = r > 0.8 ? 2 : 1;
      bars.push(width);
    }
  }
  
  // End with a few thin bars
  bars.push(1);
  bars.push(0); // space
  bars.push(1);
  
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
    marginHorizontal: 0.5,
  },
});