import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  Platform,
  Modal,
  Image,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PromoCode } from '@/types/events';

interface PromoCodesManagerProps {
  promoCodes: PromoCode[];
  onPromoCodesChange: (promoCodes: PromoCode[]) => void;
}

const PromoCodesManager: React.FC<PromoCodesManagerProps> = ({
  promoCodes,
  onPromoCodesChange,
}) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingCode, setEditingCode] = useState<Partial<PromoCode> | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPromoCode = () => {
    setEditingCode({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      maxUses: 100,
      usedCount: 0,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    });
  };

  const handleEditPromoCode = (code: PromoCode) => {
    setEditingCode(code);
  };

  const handleSavePromoCode = () => {
    if (!editingCode?.code) {
      Alert.alert('Error', 'Promo code cannot be empty');
      return;
    }

    if (!editingCode.discountValue || editingCode.discountValue <= 0) {
      Alert.alert('Error', 'Discount value must be greater than 0');
      return;
    }

    if (editingCode.discountType === 'percentage' && editingCode.discountValue > 100) {
      Alert.alert('Error', 'Percentage discount cannot exceed 100%');
      return;
    }

    // Simulate submission
    setIsSubmitting(true);
    setTimeout(() => {
      const existingCodeIndex = promoCodes.findIndex(
        (code) => code.code === editingCode!.code
      );

      const newCode = editingCode as PromoCode;
      
      if (existingCodeIndex >= 0) {
        // Update existing code
        const updatedPromoCodes = [...promoCodes];
        updatedPromoCodes[existingCodeIndex] = newCode;
        onPromoCodesChange(updatedPromoCodes);
      } else {
        // Add new code
        onPromoCodesChange([...promoCodes, newCode]);
      }

      setEditingCode(null);
      setIsSubmitting(false);
      setShowSuccessModal(true);
      
      // Auto-hide the success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    }, 1000); // Simulate API call delay
  };

  const handleDeletePromoCode = (code: string) => {
    Alert.alert(
      'Delete Promo Code',
      'Are you sure you want to delete this promo code?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedPromoCodes = promoCodes.filter(
              (promo) => promo.code !== code
            );
            onPromoCodesChange(updatedPromoCodes);
          }
        }
      ]
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate && editingCode) {
      setEditingCode({
        ...editingCode,
        validUntil: selectedDate
      });
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleCodeActive = (code: string, isActive: boolean) => {
    const updatedPromoCodes = promoCodes.map((promo) => 
      promo.code === code ? { ...promo, isActive } : promo
    );
    onPromoCodesChange(updatedPromoCodes);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.headerContainer}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerLeft}>
          <Feather 
            name="tag" 
            size={20} 
            color={colors.primary} 
            style={styles.headerIcon} 
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Promo Codes
          </Text>
          <View style={[styles.countBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.countText, { color: colors.primary }]}>
              {promoCodes.length}
            </Text>
          </View>
        </View>
        
        <Feather 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={colors.textSecondary} 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          {promoCodes.length > 0 ? (
            <ScrollView style={styles.promoCodesList}>
              {promoCodes.map((promo) => (
                <View 
                  key={promo.code}
                  style={[
                    styles.promoCodeItem, 
                    { backgroundColor: colors.surfaceVariant }
                  ]}
                >
                  <View style={styles.promoCodeHeader}>
                    <View style={styles.promoCodeLeft}>
                      <Text style={[styles.promoCodeText, { color: colors.text }]}>
                        {promo.code}
                      </Text>
                      <View style={[
                        styles.discountBadge, 
                        { backgroundColor: promo.isActive ? colors.primary + '20' : colors.textSecondary + '20' }
                      ]}>
                        <Text style={[
                          styles.discountText, 
                          { color: promo.isActive ? colors.primary : colors.textSecondary }
                        ]}>
                          {promo.discountValue}{promo.discountType === 'percentage' ? '%' : '$'} off
                        </Text>
                      </View>
                    </View>
                    
                    <Switch
                      value={promo.isActive}
                      onValueChange={(value) => toggleCodeActive(promo.code, value)}
                      trackColor={{ false: '#767577', true: colors.primary + '70' }}
                      thumbColor={promo.isActive ? colors.primary : '#f4f3f4'}
                    />
                  </View>
                  
                  <View style={styles.promoCodeDetails}>
                    <Text style={[styles.promoCodeDetail, { color: colors.textSecondary }]}>
                      Valid until: {formatDate(promo.validUntil)}
                    </Text>
                    <Text style={[styles.promoCodeDetail, { color: colors.textSecondary }]}>
                      Uses: {promo.usedCount}/{promo.maxUses}
                    </Text>
                    {promo.minimumPurchase && (
                      <Text style={[styles.promoCodeDetail, { color: colors.textSecondary }]}>
                        Min. purchase: ${promo.minimumPurchase}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.promoCodeActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { borderColor: colors.primary }]}
                      onPress={() => handleEditPromoCode(promo)}
                    >
                      <Feather name="edit" size={16} color={colors.primary} />
                      <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, { borderColor: colors.danger }]}
                      onPress={() => handleDeletePromoCode(promo.code)}
                    >
                      <Feather name="trash-2" size={16} color={colors.danger} />
                      <Text style={[styles.actionText, { color: colors.danger }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surfaceVariant }]}>
              <Feather name="tag" size={32} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No promo codes yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Add promo codes to offer discounts to your attendees
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddPromoCode}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Promo Code</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Promo Code Edit Modal */}
      {editingCode && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setEditingCode(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {editingCode.code ? 'Edit Promo Code' : 'New Promo Code'}
                </Text>
                <TouchableOpacity onPress={() => setEditingCode(null)}>
                  <Feather name="x" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    Code
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      { backgroundColor: colors.surfaceVariant, color: colors.text }
                    ]}
                    value={editingCode.code}
                    onChangeText={(text) => setEditingCode({...editingCode, code: text.toUpperCase()})}
                    placeholder="e.g. SUMMER2023"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="characters"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    Discount Type
                  </Text>
                  <View style={[styles.segmentControl, { backgroundColor: colors.surfaceVariant }]}>
                    <TouchableOpacity
                      style={[
                        styles.segmentButton,
                        editingCode.discountType === 'percentage' 
                          ? { backgroundColor: colors.primary }
                          : { backgroundColor: 'transparent' }
                      ]}
                      onPress={() => setEditingCode({...editingCode, discountType: 'percentage'})}
                    >
                      <Text
                        style={[
                          styles.segmentButtonText,
                          { color: editingCode.discountType === 'percentage' ? '#FFFFFF' : colors.text }
                        ]}
                      >
                        Percentage (%)
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.segmentButton,
                        editingCode.discountType === 'fixed' 
                          ? { backgroundColor: colors.primary }
                          : { backgroundColor: 'transparent' }
                      ]}
                      onPress={() => setEditingCode({...editingCode, discountType: 'fixed'})}
                    >
                      <Text
                        style={[
                          styles.segmentButtonText,
                          { color: editingCode.discountType === 'fixed' ? '#FFFFFF' : colors.text }
                        ]}
                      >
                        Fixed Amount ($)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    {editingCode.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount ($)'}
                  </Text>
                  <View style={[
                    styles.prefixedInputContainer,
                    { backgroundColor: colors.surfaceVariant }
                  ]}>
                    <Text style={[styles.inputPrefix, { color: colors.text }]}>
                      {editingCode.discountType === 'percentage' ? '%' : '$'}
                    </Text>
                    <TextInput
                      style={[styles.prefixedInput, { color: colors.text }]}
                      value={editingCode.discountValue?.toString()}
                      onChangeText={(text) => 
                        setEditingCode({
                          ...editingCode, 
                          discountValue: text ? parseFloat(text) : 0
                        })
                      }
                      keyboardType="numeric"
                      placeholder={editingCode.discountType === 'percentage' ? "10" : "5.99"}
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    Maximum Uses
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      { backgroundColor: colors.surfaceVariant, color: colors.text }
                    ]}
                    value={editingCode.maxUses?.toString()}
                    onChangeText={(text) => 
                      setEditingCode({
                        ...editingCode, 
                        maxUses: text ? parseInt(text) : 0
                      })
                    }
                    keyboardType="numeric"
                    placeholder="e.g. 100"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    Valid Until
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      { backgroundColor: colors.surfaceVariant }
                    ]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Feather name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={[styles.dateText, { color: colors.text }]}>
                      {formatDate(editingCode.validUntil)}
                    </Text>
                    <Feather 
                      name="chevron-down" 
                      size={16} 
                      color={colors.textSecondary}
                      style={{ marginLeft: 'auto' }}
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    Minimum Purchase (optional)
                  </Text>
                  <View style={[
                    styles.prefixedInputContainer,
                    { backgroundColor: colors.surfaceVariant }
                  ]}>
                    <Text style={[styles.inputPrefix, { color: colors.text }]}>$</Text>
                    <TextInput
                      style={[styles.prefixedInput, { color: colors.text }]}
                      value={editingCode.minimumPurchase?.toString() || ''}
                      onChangeText={(text) => 
                        setEditingCode({
                          ...editingCode, 
                          minimumPurchase: text ? parseFloat(text) : undefined
                        })
                      }
                      keyboardType="numeric"
                      placeholder="No minimum"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
                
                <View style={styles.switchContainer}>
                  <View>
                    <Text style={[styles.switchLabel, { color: colors.text }]}>
                      Active
                    </Text>
                    <Text style={[styles.switchDescription, { color: colors.textSecondary }]}>
                      Promo code can be used immediately
                    </Text>
                  </View>
                  <Switch
                    value={editingCode.isActive || false}
                    onValueChange={(value) => setEditingCode({...editingCode, isActive: value})}
                    trackColor={{ false: '#767577', true: colors.primary + '70' }}
                    thumbColor={editingCode.isActive ? colors.primary : '#f4f3f4'}
                  />
                </View>
              </ScrollView>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.cancelButton, { borderColor: colors.border }]}
                  onPress={() => setEditingCode(null)}
                  disabled={isSubmitting}
                >
                  <Text style={[
                    styles.cancelButtonText, 
                    { color: isSubmitting ? colors.textSecondary : colors.text }
                  ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.saveButton, 
                    { backgroundColor: isSubmitting ? colors.primary + '70' : colors.primary }
                  ]}
                  onPress={handleSavePromoCode}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      Save Promo Code
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              
              {showDatePicker && (
                <DateTimePicker
                  value={editingCode.validUntil || new Date()}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successModalOverlay}>
          <View style={[styles.successModal, { backgroundColor: colors.card }]}>
            <View style={[styles.successIconContainer, { borderColor: '#4CAF50' }]}>
              <Feather name="check" size={36} color="#4CAF50" />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>
              Promo code added!
            </Text>
            <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
              It will be available for attendees to use when purchasing tickets
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    marginTop: 12,
  },
  promoCodesList: {
    maxHeight: 300,
  },
  promoCodeItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  promoCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promoCodeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promoCodeText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '500',
  },
  promoCodeDetails: {
    marginBottom: 12,
  },
  promoCodeDetail: {
    fontSize: 13,
    marginBottom: 4,
  },
  promoCodeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    maxHeight: 500,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  prefixedInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputPrefix: {
    fontSize: 16,
    marginRight: 4,
  },
  prefixedInput: {
    flex: 1,
    fontSize: 16,
  },
  segmentControl: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    width: '80%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default PromoCodesManager;