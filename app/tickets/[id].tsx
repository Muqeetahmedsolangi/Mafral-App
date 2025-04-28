import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTicketById } from '@/constants/MockData';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import { SimpleBarcodeView } from '@/components/SimpleBarcodeView';

// Platform-specific imports - no static imports for native-only modules
let MediaLibrary;
let FileSystem;
let Sharing;

if (Platform.OS !== 'web') {
  // Import only on native platforms
  MediaLibrary = require('expo-media-library');
  FileSystem = require('expo-file-system');
  Sharing = require('expo-sharing');
}

const { width } = Dimensions.get('window');
const TICKET_WIDTH = width * 0.85;

export default function TicketViewScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const ticket = getTicketById(id as string);
  const viewShotRef = useRef<ViewShot>(null);

  const handleBackPress = () => {
    router.back();
  };

  const handleSharePress = async () => {
    if (Platform.OS === 'web') {
      alert('Sharing is not available on web');
      return;
    }

    try {
      if (viewShotRef.current) {
        let uri: string | undefined;
        if (viewShotRef.current?.capture) {
          uri = await viewShotRef.current.capture();
        } else {
          throw new Error('ViewShot reference or capture method is undefined');
        }
        if (uri) {
          await Share.share({ url: uri });
        }
      }
    } catch (error) {
      console.error('Error sharing ticket:', error);
    }
  };

  const handleDownloadPress = async () => {
    if (Platform.OS === 'web') {
      alert('Downloading tickets is not supported on web. You can take a screenshot instead.');
      return;
    }

    try {
      // Dynamic import for native platforms only
      const MediaLibrary = require('expo-media-library');
      
      // Request permissions first (for Android)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to download the ticket');
        return;
      }

      if (viewShotRef.current) {
        const uri = viewShotRef.current && viewShotRef.current.capture ? await viewShotRef.current.capture() : null;
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

  if (!ticket) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Ticket not found</Text>
      </SafeAreaView>
    );
  }

  const eventDate = format(new Date(ticket.event.date), 'MMMM dd, yyyy');
  const eventTime = format(new Date(ticket.event.date), 'h:mm a');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tickets</Text>
        
        <TouchableOpacity onPress={handleSharePress} style={styles.shareButton}>
          <Feather name="share" size={22} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="more-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket Card */}
        <ViewShot 
          ref={viewShotRef} 
          options={{ format: 'png', quality: 1 }}
          style={styles.viewShot}
        >
          <View style={styles.ticketContainer}>
            {/* Orange Background with Gradient */}
            <LinearGradient
              colors={['#FF7A00', '#FF5100']}
              style={styles.ticketBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Top Part of Ticket - Image */}
              <View style={styles.ticketImageContainer}>
                <Image 
                  source={{ uri: ticket.event.imageUrl }}
                  style={styles.ticketImage}
                  resizeMode="cover"
                />
                
                {/* Left Cutout */}
                <View style={[styles.cutout, styles.cutoutLeft]} />
                
                {/* Right Cutout */}
                <View style={[styles.cutout, styles.cutoutRight]} />
              </View>
              
              {/* Bottom Part of Ticket - Details */}
              <View style={styles.ticketDetailsContainer}>
                <Text style={styles.eventTitle} numberOfLines={2}>
                  {ticket.event.title}
                </Text>
                
                <View style={styles.ticketDetailsRow}>
                  <View style={styles.ticketDetailColumn}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{eventDate}</Text>
                  </View>
                  
                  <View style={styles.ticketDetailColumn}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{eventTime}</Text>
                  </View>
                </View>
                
                <View style={styles.ticketDetailsRow}>
                  <View style={styles.ticketDetailColumn}>
                    <Text style={styles.detailLabel}>Venue</Text>
                    <Text style={styles.detailValue}>{ticket.event.location.name}</Text>
                  </View>
                  
                  <View style={styles.ticketDetailColumn}>
                    <Text style={styles.detailLabel}>Seat</Text>
                    <Text style={styles.detailValue}>{ticket.seat || 'General Admission'}</Text>
                  </View>
                </View>
                
                {/* Barcode */}
                <View style={styles.barcodeContainer}>
                    <SimpleBarcodeView
                      value={ticket.id}
                      width={TICKET_WIDTH - 40}
                      height={70}
                    />
                </View>
                
                {/* Left Bottom Cutout */}
                <View style={[styles.cutout, styles.cutoutBottomLeft]} />
                
                {/* Right Bottom Cutout */}
                <View style={[styles.cutout, styles.cutoutBottomRight]} />
              </View>
            </LinearGradient>
          </View>
        </ViewShot>
        
        {/* Download Button */}
        <TouchableOpacity 
          style={[styles.downloadButton, { backgroundColor: colors.surfaceVariant }]}
          onPress={handleDownloadPress}
        >
          <Text style={[styles.downloadButtonText, { color: colors.text }]}>
            DOWNLOAD IMAGE
          </Text>
          <Feather name="download" size={20} color={colors.text} style={styles.downloadIcon} />
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
    marginLeft: 'auto',
    marginRight: 8,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  viewShot: {
    width: TICKET_WIDTH,
    marginVertical: 20,
  },
  ticketContainer: {
    width: TICKET_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  ticketBackground: {
    width: '100%',
  },
  ticketImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
    borderColor: '#FFFFFF',
    borderWidth: 5,
    borderRadius: 12,
  },
  cutout: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#FFF',
    bottom: -12,
    borderRadius: 12,
  },
  cutoutLeft: {
    left: -12,
  },
  cutoutRight: {
    right: -12,
  },
  cutoutBottomLeft: {
    left: -12,
    bottom: -12,
  },
  cutoutBottomRight: {
    right: -12,
    bottom: -12,
  },
  ticketDetailsContainer: {
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'white',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    position: 'relative',
    marginTop: -5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  ticketDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ticketDetailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  barcodeContainer: {
    marginTop: 8,
    marginBottom: 4,
    alignItems: 'center',
    paddingVertical: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    width: TICKET_WIDTH,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  downloadIcon: {
    marginLeft: 8,
  },
});