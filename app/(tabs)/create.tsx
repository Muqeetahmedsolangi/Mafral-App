// app/(tabs)/create.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { H3, Body1, Body2 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { globalStyles } from '@/app/styles/globalStyles';

interface CreateOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

const CreateOption = ({ icon, title, onPress }: CreateOptionProps) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Body1 style={styles.optionText}>{title}</Body1>
      <View style={{ flex: 1 }} />
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default function CreateScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <H3>Create</H3>
      </View>
      
      <Card variant="filled" style={styles.optionsCard}>
        <CreateOption
          icon={<Feather name="image" size={24} color={colors.text} />}
          title="Post"
          onPress={() => {}}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <CreateOption
          icon={<MaterialCommunityIcons name="movie-outline" size={24} color={colors.text} />}
          title="Reel"
          onPress={() => {}}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <CreateOption
          icon={<Feather name="camera" size={24} color={colors.text} />}
          title="Story"
          onPress={() => {}}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <CreateOption
          icon={<Feather name="message-circle" size={24} color={colors.text} />}
          title="Message"
          onPress={() => {}}
        />
      </Card>
      
      <Button
        title="Create New Post"
        variant="primary"
        size="medium"
        icon={<Feather name="plus" size={18} color="#FFF" style={{ marginRight: 8 }} />}
        iconPosition="left"
        onPress={() => {}}
        style={styles.createButton}
      />
      
      <Card style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Feather name="info" size={20} color={colors.info} />
          <Body1 style={[styles.tipsTitle, { color: colors.info }]}>Content Tips</Body1>
        </View>
        <Body2 style={styles.tipText}>Use high-quality images and videos for better engagement.</Body2>
        <Body2 style={styles.tipText}>Write compelling captions to connect with your audience.</Body2>
        <Body2 style={styles.tipText}>Use relevant hashtags to increase your content's visibility.</Body2>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 50,
    marginBottom: 24,
  },
  optionsCard: {
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionText: {
    marginLeft: 16,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  createButton: {
    marginBottom: 24,
  },
  tipsCard: {
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  tipText: {
    marginBottom: 8,
  },
});