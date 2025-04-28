import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import { FormSection } from '@/components/ui/FormSection';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextArea } from '@/components/ui/FormTextArea';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { SuccessStory } from '@/types/restaurant';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  stories: SuccessStory[];
  onStoriesChange: (stories: SuccessStory[]) => void;
};

export default function RestaurantSuccessStoriesSection({ stories, onStoriesChange }: Props) {
  const { colors } = useTheme();
  const [editingStory, setEditingStory] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateForStory, setDateForStory] = useState<string | null>(null);

  const addStory = () => {
    const newStory: SuccessStory = {
      id: `story_${Date.now()}`,
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      image: ''
    };
    
    onStoriesChange([...stories, newStory]);
    setEditingStory(newStory.id);
  };

  const updateStoryField = (storyId: string, field: keyof SuccessStory, value: string) => {
    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        return { ...story, [field]: value };
      }
      return story;
    });
    onStoriesChange(updatedStories);
  };

  const deleteStory = (storyId: string) => {
    onStoriesChange(stories.filter(story => story.id !== storyId));
    setEditingStory(null);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate && dateForStory) {
      const dateString = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      updateStoryField(dateForStory, 'date', dateString);
    }
  };

  const openDatePicker = (storyId: string) => {
    setDateForStory(storyId);
    setShowDatePicker(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const renderStoryEditor = (story: SuccessStory) => {
    return (
      <View style={styles.storyEditorContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setEditingStory(null)}
        >
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Back to Stories</Text>
        </TouchableOpacity>

        <FormInput
          label="Success Story Title"
          value={story.title}
          onChangeText={(text) => updateStoryField(story.id, 'title', text)}
          placeholder="e.g., Award Winner 2023, Celebrity Visit"
          required
        />

        <FormTextArea
          label="Description"
          value={story.description}
          onChangeText={(text) => updateStoryField(story.id, 'description', text)}
          placeholder="Share details about this accomplishment or special moment"
          minHeight={120}
          required
        />

        <View style={styles.dateContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Date
          </Text>
          <TouchableOpacity 
            style={[styles.dateButton, { borderColor: colors.border }]}
            onPress={() => openDatePicker(story.id)}
          >
            <Text style={{ color: colors.text }}>
              {formatDate(story.date)}
            </Text>
            <Feather name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {showDatePicker && dateForStory === story.id && (
            <DateTimePicker
              value={new Date(story.date)}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Image</Text>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Upload an image related to this success story or achievement
        </Text>
        <ImageUploader
          image={story.image ?? null}
          onImageSelected={(url) => updateStoryField(story.id, 'image', url)}
          aspectRatio={16/9}
          style={styles.imageUploader}
        />

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={() => deleteStory(story.id)}
        >
          <Text style={styles.buttonText}>Delete Story</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FormSection title="Success Stories">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Share your restaurant's achievements, awards, special events, or notable moments to build credibility and attract customers.
      </Text>

      {editingStory ? (
        renderStoryEditor(stories.find(story => story.id === editingStory)!)
      ) : (
        <View style={styles.storiesGrid}>
          {stories.map(story => (
            <TouchableOpacity 
              key={story.id}
              style={[styles.storyCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setEditingStory(story.id)}
            >
              {story.image ? (
                <Image source={{ uri: story.image }} style={styles.storyImage} />
              ) : (
                <View style={[styles.storyPlaceholder, { backgroundColor: colors.background }]}>
                  <Feather name="award" size={32} color={colors.textSecondary} />
                </View>
              )}
              
              <View style={styles.cardContent}>
                <Text style={[styles.storyTitle, { color: colors.text }]} numberOfLines={1}>
                  {story.title || 'New Success Story'}
                </Text>
                
                <Text style={[styles.storyDate, { color: colors.textSecondary }]}>
                  {formatDate(story.date)}
                </Text>
                
                {story.description && (
                  <Text style={[styles.storyDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {story.description}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: colors.primary + '20' }]}
                onPress={() => setEditingStory(story.id)}
              >
                <Feather name="edit-2" size={16} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            style={[styles.addCard, { borderColor: colors.border }]}
            onPress={addStory}
          >
            <Feather name="plus" size={24} color={colors.primary} />
            <Text style={[styles.addText, { color: colors.primary }]}>
              Add Success Story
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </FormSection>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    marginBottom: 24,
  },
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  storyCard: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  storyImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  storyPlaceholder: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  storyDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
  },
  addCard: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  storyEditorContainer: {
    marginTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  dateContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  imageUploader: {
    height: 200,
    marginBottom: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  deleteButton: {
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
});