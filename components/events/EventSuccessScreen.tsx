import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

interface EventSuccessScreenProps {
  visible: boolean;
  eventId: string | null;
  onClose?: () => void;
  message?: string;
  showViewEventButton?: boolean;
}

const EventSuccessScreen: React.FC<EventSuccessScreenProps> = ({
  visible,
  eventId,
  onClose,
  message = "It takes less than 24hrs to display events with MAFRAL",
  showViewEventButton = true,
}) => {
  const { colors } = useTheme();
  const [successScreenProgress, setSuccessScreenProgress] = useState(0);
  
  // Reset and start progress animation when the modal becomes visible
  useEffect(() => {
    if (visible) {
      setSuccessScreenProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setSuccessScreenProgress(progress);
        
        if (progress >= 4) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [visible]);

  const handleViewEvent = () => {
    if (onClose) {
      onClose();
    }
    
    if (eventId) {
      router.push(`/events/${eventId}`);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={[styles.successOverlay, { backgroundColor: colors.background }]}>
        <View style={styles.successContent}>
          <View style={styles.successIconContainer}>
            <Feather name="check" size={64} color="#4CAF50" style={styles.successIcon} />
          </View>
          
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Event submitted!
          </Text>
          
          <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
            {message}
          </Text>
          
          <View style={styles.progressDotsContainer}>
            {[0, 1, 2, 3].map((dot) => (
              <View
                key={dot}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      successScreenProgress >= dot ? colors.primary : colors.border,
                  },
                ]}
              />
            ))}
          </View>
          
          <View style={styles.buttonsContainer}>
            {showViewEventButton && eventId ? (
              <TouchableOpacity
                style={[styles.successButton, { backgroundColor: colors.primary }]}
                onPress={handleViewEvent}
              >
                <Text style={styles.successButtonText}>View Event</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.successButton, { backgroundColor: colors.primary }]}
                onPress={handleClose}
              >
                <Text style={styles.successButtonText}>Continue</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  successOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    width: '100%',
    alignItems: 'center',
    padding: 24,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    opacity: 0.9,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  progressDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  successButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventSuccessScreen;