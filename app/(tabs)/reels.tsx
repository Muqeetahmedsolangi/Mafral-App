// app/(tabs)/reels.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { H3, H4, Body2, Caption1 } from '@/components/ui/Typography';
import { globalStyles } from '@/app/styles/globalStyles';

const { height } = Dimensions.get('window');

interface ReelActionProps {
  icon: React.ReactNode;
  count?: string | number;
  onPress: () => void;
}

const ReelAction = ({ icon, count, onPress }: ReelActionProps) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      {icon}
      {count !== undefined && (
        <Caption1 style={{ color: colors.text, marginTop: 4 }}>{count}</Caption1>
      )}
    </TouchableOpacity>
  );
};

export default function ReelsScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <View style={styles.header}>
        <H3 style={{ color: '#FFF' }}>Reels</H3>
        <TouchableOpacity>
          <Feather name="camera" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.reelContainer}>
        <View style={styles.contentPlaceholder}>
          <Feather name="play-circle" size={60} color="rgba(255,255,255,0.8)" />
          <Body2 style={{ color: '#FFF', marginTop: 16 }}>Reels content would appear here</Body2>
        </View>
        
        <View style={styles.userInfo}>
          <View style={styles.userInfoContent}>
            <H4 style={{ color: '#FFF' }}>username</H4>
            <Caption1 style={{ color: '#FFF', marginTop: 4 }}>Original Audio</Caption1>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <ReelAction
            icon={<Feather name="heart" size={28} color="#FFF" />}
            count="0"
            onPress={() => {}}
          />
          <ReelAction
            icon={<Feather name="message-circle" size={28} color="#FFF" />}
            count="0"
            onPress={() => {}}
          />
          <ReelAction
            icon={<Feather name="send" size={28} color="#FFF" />}
            onPress={() => {}}
          />
          <ReelAction
            icon={<Feather name="more-vertical" size={28} color="#FFF" />}
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  reelContainer: {
    flex: 1,
    position: 'relative',
  },
  contentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    position: 'absolute',
    left: 16,
    bottom: 100,
    right: 80,
  },
  userInfoContent: {
    flexDirection: 'column',
  },
  actionsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
});