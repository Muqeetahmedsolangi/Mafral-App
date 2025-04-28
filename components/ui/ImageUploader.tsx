import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  image: string | null;
  onImageSelected: (uri: string) => void;
  aspectRatio?: number;
  style?: any;
  disabled?: boolean;
}

export function ImageUploader({ 
  image, 
  onImageSelected, 
  aspectRatio = 1, 
  style,
  disabled = false
}: Props) {
  const { colors } = useTheme();
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const pickImage = async () => {
    if (disabled) return;
    
    setError(null);
    
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setError('Permission to access camera roll is required!');
      return;
    }
    
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [aspectRatio === 1 ? 1 : 16, aspectRatio === 1 ? 1 : 9],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        // In a real app, you'd upload to cloud storage here
        // and then set the returned URL
        onImageSelected(result.assets[0].uri);
      }
    } catch (e) {
      setError('Failed to pick image');
      console.error(e);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      {image ? (
        <TouchableOpacity 
          style={styles.imageContainer} 
          onPress={pickImage}
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <Image source={{ uri: image }} style={styles.image} />
          {!disabled && (
            <View style={[styles.editOverlay, { backgroundColor: colors.background + 'CC' }]}>
              <Feather name="edit-2" size={24} color={colors.primary} />
              <Text style={[styles.editText, { color: colors.primary }]}>Change</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[
            styles.uploadButton, 
            { 
              borderColor: colors.border,
              backgroundColor: colors.surfaceVariant
            }
          ]}
          onPress={pickImage}
          disabled={disabled || uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Feather name="upload" size={24} color={colors.primary} />
              <Text style={[styles.uploadText, { color: colors.primary }]}>
                Upload Image
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
      
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  uploadButton: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  }
});