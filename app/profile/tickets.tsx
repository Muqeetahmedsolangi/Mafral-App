import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getUserTickets } from '@/constants/MockData';
import { Ticket } from '@/components/events/Ticket';

export default function TicketsScreen() {
  const { colors } = useTheme();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const tickets = getUserTickets();

  const handleTicketPress = (ticket: any) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const renderTicketItem = ({ item }: { item: any }) => {
    const eventDate = format(new Date(item.event.date), 'MMM d, yyyy');
    
    return (
      <TouchableOpacity
        style={[styles.ticketItem, { backgroundColor: colors.surfaceVariant }]}
        onPress={() => handleTicketPress(item)}
      >
        <View style={styles.ticketPreview}>
          <View style={styles.ticketPreviewDetails}>
            <Text style={[styles.ticketEventName, { color: colors.text }]} numberOfLines={1}>
              {item.event.title}
            </Text>
            <Text style={[styles.ticketMeta, { color: colors.textSecondary }]}>
              {eventDate} • {item.event.location.name}
            </Text>
            <View style={styles.ticketType}>
              <Text style={[styles.ticketTypeText, { color: colors.primary }]}>
                {item.ticketType}
              </Text>
            </View>
          </View>
          <View style={styles.viewTicketContainer}>
            <Text style={[styles.viewTicketText, { color: colors.primary }]}>View</Text>
            <Feather name="chevron-right" size={16} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      
      <Stack.Screen
        options={{
          title: "My Tickets",
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {tickets.length > 0 ? (
        <FlatList
          data={tickets}
          renderItem={renderTicketItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Feather name="tag" size={64} color={colors.textSecondary} style={styles.emptyIcon} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No tickets yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Your purchased tickets will appear here
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: colors.primary }]}
            onPress={() => router.replace('/events')}
          >
            <Text style={styles.browseButtonText}>Browse Events</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Full Ticket Modal */}
      {selectedTicket && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Ticket Details</Text>
              <View style={{ width: 24 }} /> {/* Spacer for alignment */}
            </View>
            
            <FlatList
              data={[selectedTicket]}
              renderItem={({ item }) => <Ticket ticket={item} />}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  ticketItem: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  ticketPreview: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketPreviewDetails: {
    flex: 1,
  },
  ticketEventName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ticketMeta: {
    fontSize: 14,
    marginBottom: 8,
  },
  ticketType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(101, 37, 131, 0.1)',
  },
  ticketTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewTicketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTicketText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalScrollContent: {
    alignItems: 'center',
  },
});