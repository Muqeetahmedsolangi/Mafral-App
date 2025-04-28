import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FormSection } from '@/components/ui/FormSection';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextArea } from '@/components/ui/FormTextArea';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { SwitchItem } from '@/components/ui/SwitchItem';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { RestaurantStaff } from '@/types/restaurant';

type Props = {
  staff: RestaurantStaff[];
  onStaffChange: (staff: RestaurantStaff[]) => void;
};

export default function RestaurantStaffSection({ staff, onStaffChange }: Props) {
  const { colors } = useTheme();
  const [editingStaff, setEditingStaff] = useState<string | null>(null);

  const addStaffMember = () => {
    const newStaff: RestaurantStaff = {
      id: `staff_${Date.now()}`,
      name: '',
      position: '',
      bio: '',
      image: '',
    };
    
    onStaffChange([...staff, newStaff]);
    setEditingStaff(newStaff.id);
  };

  const updateStaffField = (staffId: string, field: keyof RestaurantStaff, value: string) => {
    const updatedStaff = staff.map(member => {
      if (member.id === staffId) {
        return { ...member, [field]: value };
      }
      return member;
    });
    onStaffChange(updatedStaff);
  };

  const deleteStaffMember = (staffId: string) => {
    onStaffChange(staff.filter(member => member.id !== staffId));
    setEditingStaff(null);
  };

  const renderStaffEditor = (member: RestaurantStaff) => {
    return (
      <View style={styles.staffEditorContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setEditingStaff(null)}
        >
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Back to Staff List</Text>
        </TouchableOpacity>

        <View style={styles.staffImageContainer}>
          <ImageUploader
            image={member.image ?? null}
            onImageSelected={(url) => updateStaffField(member.id, 'image', url)}
            aspectRatio={1}
            style={styles.staffImageUploader}
          />
        </View>

        <FormInput
          label="Name"
          value={member.name}
          onChangeText={(text) => updateStaffField(member.id, 'name', text)}
          placeholder="Enter staff member's name"
        />

        <FormInput
          label="Position"
          value={member.position}
          onChangeText={(text) => updateStaffField(member.id, 'position', text)}
          placeholder="Enter job position"
        />

        <FormTextArea
          label="Biography"
          value={member.bio || ''}
          onChangeText={(text) => updateStaffField(member.id, 'bio', text)}
          placeholder="Enter a brief bio or description"
          minHeight={120}
        />

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={() => deleteStaffMember(member.id)}
        >
          <Text style={styles.buttonText}>Remove Staff Member</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FormSection title="Staff">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Add key staff members of your restaurant such as chefs, managers, or waitstaff that you want to highlight.
      </Text>

      {editingStaff ? (
        renderStaffEditor(staff.find(member => member.id === editingStaff)!)
      ) : (
        <>
          <View style={styles.staffGrid}>
            {staff.map(member => (
              <TouchableOpacity 
                key={member.id}
                style={[styles.staffCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setEditingStaff(member.id)}
              >
                <View style={styles.staffCardImageContainer}>
                  {member.image ? (
                    <Image source={{ uri: member.image }} style={styles.staffCardImage} />
                  ) : (
                    <View style={[styles.staffPlaceholder, { backgroundColor: colors.background }]}>
                      <Feather name="user" size={32} color={colors.textSecondary} />
                    </View>
                  )}
                </View>
                <View style={styles.staffCardContent}>
                  <Text style={[styles.staffName, { color: colors.text }]}>
                    {member.name || 'New Staff Member'}
                  </Text>
                  <Text style={[styles.staffPosition, { color: colors.textSecondary }]}>
                    {member.position || 'Position Not Set'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.editButton, { backgroundColor: colors.primary + '20' }]}
                  onPress={() => setEditingStaff(member.id)}
                >
                  <Feather name="edit-2" size={16} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={[styles.addStaffCard, { borderColor: colors.border }]}
              onPress={addStaffMember}
            >
              <Feather name="user-plus" size={24} color={colors.primary} />
              <Text style={[styles.addStaffText, { color: colors.primary }]}>
                Add Staff Member
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </FormSection>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    marginBottom: 24,
  },
  staffGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  staffCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  staffCardImageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  staffCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  staffPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  staffCardContent: {
    padding: 12,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  staffPosition: {
    fontSize: 13,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
  },
  addStaffCard: {
    width: '48%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStaffText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  staffEditorContainer: {
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
  staffImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  staffImageUploader: {
    width: 120,
    height: 120,
    borderRadius: 60,
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