import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  maxTags = 10,
  placeholder = 'Add tags (press space or comma to add)',
}) => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (text: string) => {
    if (tags.length >= maxTags) return;
    
    const trimmedText = text.trim();
    if (trimmedText && !tags.includes(trimmedText)) {
      onTagsChange([...tags, trimmedText]);
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const handleTextChange = (text: string) => {
    const lastChar = text.slice(-1);
    
    if (lastChar === ' ' || lastChar === ',') {
      // Extract the tag before the delimiter
      const newTag = text.slice(0, -1).trim();
      if (newTag) {
        handleAddTag(newTag);
        setInputValue('');
      }
    } else {
      setInputValue(text);
    }
  };

  const handleKeyPress = ({ nativeEvent }: any) => {
    if (nativeEvent.key === 'Backspace' && !inputValue && tags.length > 0) {
      handleRemoveTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      handleAddTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tagsScrollView}
        contentContainerStyle={styles.tagsContainer}
      >
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tag, { backgroundColor: colors.primary + '20' }]}
            onPress={() => handleRemoveTag(index)}
          >
            <Text style={[styles.tagText, { color: colors.primary }]}>
              {tag}
            </Text>
            <Feather name="x" size={14} color={colors.primary} style={styles.tagIcon} />
          </TouchableOpacity>
        ))}
        
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={inputValue}
          onChangeText={handleTextChange}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          placeholderTextColor={colors.textSecondary}
        />
      </ScrollView>
      
      {tags.length >= maxTags && (
        <Text style={[styles.maxTagsReached, { color: colors.textSecondary }]}>
          Maximum tags reached ({maxTags})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  tagsScrollView: {
    maxHeight: 80,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 14,
    marginRight: 4,
  },
  tagIcon: {
    marginLeft: 2,
  },
  input: {
    fontSize: 14,
    padding: 8,
    minWidth: 100,
    flex: 1,
  },
  maxTagsReached: {
    marginTop: 6,
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default TagInput;