import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Share,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import { format } from 'date-fns';
import { SimpleBarcodeView } from '@/components/SimpleBarcodeView';
import { useTheme } from '@/context/ThemeContext';

// Platform-specific imports - no static imports for native-only modules
let MediaLibrary: any;
if (Platform.OS !== 'web') {
  // Import only on native platforms
  MediaLibrary = require('expo-media-library');
}

const { width } = Dimensions.get('window');
const TICKET_WIDTH = width * 0.85;

interface TicketEventLocation {
  name: string;
  address?: string;
  city?: string;
  country?: string;
}

interface TicketEvent {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  location: TicketEventLocation;
}

interface TicketProps {
  ticket: {
    id: string;
    event: TicketEvent;
    ticketType: string;
    price: number;
    currency: string;
    purchaseDate: string;
    seat?: string;
    qrCode?: string;
    status: string;
  };
  onClose?: () => void;
  showActions?: boolean;
}

export const Ticket: React.FC<TicketProps> = ({ ticket, onClose, showActions = true }) => {
  const { colors } = useTheme();
  const viewShotRef = useRef<ViewShot | null>(null);
  
  // Format date safely - extract just the date part and month name in short form
  const date = new Date(ticket.event.date);
  const eventDate = `${format(date, 'MMMM d, yyyy').split(',')[0]}`;
  const eventTime = format(date, 'h:mm a'); // e.g., "10:00 PM"

  const handleDownloadPress = async () => {
    if (Platform.OS === 'web') {
      alert('Downloading tickets is not supported on web. You can take a screenshot instead.');
      return;
    }

    try {
      // Request permissions first (for Android)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to download the ticket');
        return;
      }

      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        if (!uri) {
          throw new Error('Failed to capture the view');
        }
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('Mafral Tickets', asset, false);
        alert('Ticket saved to gallery');
      }
    } catch (error) {
      console.error('Error saving ticket:', error);
      alert('Failed to save ticket');
    }
  };

  return (
    <>
      {/* Ticket Card */}
      <ViewShot 
        ref={viewShotRef} 
        options={{ format: 'png', quality: 1 }}
        style={styles.viewShot}
      >
        {/* Orange Background */}
        <View style={styles.ticketContainer}>
          {/* Top Image Section with border radius */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: ticket.event.imageUrl }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Ticket Details Section */}
          <View style={styles.detailsContainer}>
            {/* Event Title */}
            <Text style={styles.eventTitle} numberOfLines={2}>
              {ticket.event.title}
            </Text>
            
            {/* Dashed Line Separator */}
            <View style={styles.dashedSeparator}>
              <View style={styles.dashedLine} />
            </View>
            
            {/* Ticket Details Grid */}
            <View style={styles.detailsRow}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{eventDate}</Text>
              </View>
              
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{eventTime}</Text>
              </View>
            </View>
            
            <View style={styles.detailsRow}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Venue</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {ticket.event.location.name}
                </Text>
              </View>
              
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Seat</Text>
                <Text style={styles.detailValue}>{ticket.seat || '05'}</Text>
              </View>
            </View>
            
            {/* Barcode */}
            <View style={styles.barcodeContainer}>
              <SimpleBarcodeView
                value={ticket.id}
                width={TICKET_WIDTH - 80}
                height={50}
              />
            </View>
          </View>
          
          {/* Left Cutout */}
          <View style={[styles.cutout, styles.leftCutout]} />
          
          {/* Right Cutout */}
          <View style={[styles.cutout, styles.rightCutout]} />
        </View>
      </ViewShot>
      
      {/* Download Button */}
      {showActions && (
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={handleDownloadPress}
        >
          <Text style={styles.downloadButtonText}>DOWNLOAD IMAGE</Text>
          <Feather name="download" size={18} color="#FFFFFF" style={styles.downloadIcon} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  viewShot: {
    width: TICKET_WIDTH,
    alignSelf: 'center',
    marginVertical: 20,
  },
  ticketContainer: {
    width: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  dashedSeparator: {
    marginBottom: 16,
  },
  dashedLine: {
    borderWidth: 0.8,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    marginHorizontal: -16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailColumn: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 13,
    color: '#999',
    fontWeight: '400',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  barcodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  cutout: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#F5F5F5', // Same as background color
    borderRadius: 10,
  },
  leftCutout: {
    top: '50%',
    left: -10,
    marginTop: 20, // Position at the middle, slightly lower
  },
  rightCutout: {
    top: '50%',
    right: -10,
    marginTop: 20, // Position at the middle, slightly lower
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    width: TICKET_WIDTH,
    alignSelf: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  downloadIcon: {
    marginLeft: 8,
  }
});