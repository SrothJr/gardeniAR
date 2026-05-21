import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, Image, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '../../config';
import { useTheme } from '../../hooks/useTheme';

// Local Asset Mapping
const WEED_IMAGES = {
  "Dandelion": require('../../assets/dandelion.png'),
  "Crabgrass": require('../../assets/crabgrass.png'),
  "White Clover": require('../../assets/clover.png'),
};

export default function IdentifyScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState('auto'); // 'auto' | 'manual'
  const [cameraRef, setCameraRef] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [weeds, setWeeds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    // Fetch weeds for manual mode
    fetch(`${BACKEND_URL}/api/weeds`)
      .then(res => res.json())
      .then(data => setWeeds(data))
      .catch(err => console.error(err));
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={requestPermission}>
            <Text style={[styles.btnText, { color: "#000" }]}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({ base64: true, quality: 0.5 });
        setImgSrc(photo.uri);
        identifyPlant(photo);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const identifyPlant = async (photo) => {
    setLoading(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        name: 'plant.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(`${BACKEND_URL}/api/weeds/identify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        throw new Error(data.message || 'Identification failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not identify plant. Please try again.');
      setImgSrc(null); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setImgSrc(null);
    setResult(null);
  };

  // Manual Mode Logic
  const nextWeed = () => setCurrentIndex((prev) => (prev + 1) % weeds.length);
  const prevWeed = () => setCurrentIndex((prev) => (prev - 1 + weeds.length) % weeds.length);
  
  const selectManualWeed = () => {
    const selected = weeds[currentIndex];
    setResult({
      name: selected.name,
      scientificName: selected.scientificName,
      confidence: "Manual Match",
      description: selected.description,
      isWeed: true, // Assuming manual list contains weeds
      isPlant: true,
      removalInstructions: selected.removalInstructions,
      manual: true
    });
  };

  return (
    <View style={styles.container}>
      {!imgSrc ? (
        <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} ref={ref => setCameraRef(ref)} />
            
            {/* Top Bar: Back & Mode Toggle */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                
                <View style={styles.toggleContainer}>
                    <TouchableOpacity 
                        style={[styles.toggleBtn, mode === 'auto' && { backgroundColor: colors.primary }]}
                        onPress={() => setMode('auto')}
                    >
                        <Text style={[styles.toggleText, mode === 'auto' && { color: "#000" }]}>AI Scan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.toggleBtn, mode === 'manual' && { backgroundColor: colors.primary }]}
                        onPress={() => setMode('manual')}
                    >
                        <Text style={[styles.toggleText, mode === 'manual' && { color: "#000" }]}>Manual AR</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Manual Mode Overlay */}
            {mode === 'manual' && weeds.length > 0 && (
                <View style={styles.manualOverlay}>
                    <View style={styles.ghostContainer}>
                        <Image 
                          source={
                            WEED_IMAGES[weeds[currentIndex].name] || 
                            { uri: `${BACKEND_URL}${weeds[currentIndex].imageUrl}` }
                          } 
                          style={styles.ghostImage} 
                        />
                        <Text style={styles.guideText}>Align plant with overlay</Text>
                    </View>
                    
                    <View style={styles.manualControls}>
                        <TouchableOpacity onPress={prevWeed} style={styles.navBtn}>
                            <Ionicons name="chevron-back" size={30} color="white" />
                        </TouchableOpacity>
                        <View style={styles.weedLabel}>
                            <Text style={styles.weedName}>{weeds[currentIndex].name}</Text>
                            <TouchableOpacity style={[styles.matchBtn, { backgroundColor: colors.primary }]} onPress={selectManualWeed}>
                                <Text style={[styles.matchBtnText, { color: "#000" }]}>It's a Match!</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={nextWeed} style={styles.navBtn}>
                            <Ionicons name="chevron-forward" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Auto Mode Controls */}
            {mode === 'auto' && !loading && (
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                        <View style={styles.captureInner} />
                    </TouchableOpacity>
                </View>
            )}

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.primary }]}>Analyzing...</Text>
                </View>
            )}
        </View>
      ) : (
        // Preview Image (for AI mode debug or just transition)
        <View style={styles.previewContainer}>
            <Image source={{ uri: imgSrc }} style={styles.previewImage} />
            {loading && (
                 <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.primary }]}>Analyzing...</Text>
                 </View>
            )}
        </View>
      )}

      {/* Result Modal */}
      <Modal visible={!!result} animationType="slide" transparent={true} onRequestClose={resetScan}>
        <View style={styles.modalOverlay}>
            <View style={[styles.resultCard, { backgroundColor: colors.surface }]}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.resultHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.resultName, { color: colors.text }]}>{result?.name || "Unknown"}</Text>
                            <Text style={[styles.resultScientific, { color: colors.textMuted }]}>{result?.scientificName}</Text>
                        </View>
                        <View style={[styles.confidenceBadge, { backgroundColor: colors.background }]}>
                            <Text style={[styles.confidenceText, { color: colors.primary }]}>{result?.confidence}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>🌱 Description</Text>
                    <Text style={[styles.bodyText, { color: colors.textMuted }]}>{result?.description}</Text>
                    
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>⚠️ Is it a Weed?</Text>
                    <Text style={[styles.bodyText, { color: colors.textMuted }]}>
                        {result?.isPlant === false ? "No plant detected." : 
                         result?.isWeed ? "Yes, this is considered a weed." : 
                         "No, this might be a beneficial plant."}
                    </Text>

                    {result?.isWeed && (
                        <>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>🛠️ Removal Instructions</Text>
                            <Text style={[styles.bodyText, { color: colors.textMuted }]}>{result?.removalInstructions}</Text>
                        </>
                    )}

                    {result?.warning && (
                        <>
                            <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>☣️ Warning</Text>
                            <Text style={[styles.bodyText, { color: '#ef4444' }]}>{result?.warning}</Text>
                        </>
                    )}

                    <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.primary }]} onPress={resetScan}>
                        <Text style={[styles.closeBtnText, { color: "#000" }]}>
                            {mode === 'auto' ? "Scan Another" : "Back to AR"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraContainer: { flex: 1 },
  message: { textAlign: 'center', paddingBottom: 10, color: '#fff', fontSize: 16 },
  camera: { flex: 1 },
  
  topBar: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      zIndex: 10,
  },
  backBtn: {
      padding: 8,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
      marginRight: 20,
  },
  toggleContainer: {
      flexDirection: 'row',
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 25,
      padding: 4,
  },
  toggleBtn: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
  },
  toggleText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
  },

  bottomBar: {
      position: 'absolute',
      bottom: 50,
      alignSelf: 'center',
  },
  captureBtn: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(255,255,255,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: '#fff',
  },
  captureInner: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: '#fff',
  },

  loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: 'bold',
  },

  previewContainer: { flex: 1, backgroundColor: '#000' },
  previewImage: { flex: 1, resizeMode: 'contain' },

  // Manual Mode Styles
  manualOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'space-between',
      paddingTop: 120, // below top bar
      paddingBottom: 40,
  },
  ghostContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.5,
  },
  ghostImage: {
      width: 300,
      height: 400,
      resizeMode: 'contain',
  },
  guideText: {
      color: '#fff',
      fontSize: 16,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 8,
      borderRadius: 8,
      marginTop: 10,
  },
  manualControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
  },
  navBtn: {
      padding: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 30,
  },
  weedLabel: {
      alignItems: 'center',
  },
  weedName: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10
  },
  matchBtn: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
  },
  matchBtnText: {
      fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'flex-end',
  },
  resultCard: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '85%',
  },
  resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  resultName: {
      fontSize: 24,
      fontWeight: 'bold',
  },
  resultScientific: {
      fontSize: 16,
      fontStyle: 'italic',
  },
  confidenceBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
  },
  confidenceText: {
      fontSize: 12,
      fontWeight: 'bold',
  },
  divider: {
      height: 1,
      marginVertical: 15,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
  },
  bodyText: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 10,
  },
  closeBtn: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
  },
  closeBtnText: {
      fontWeight: 'bold',
      fontSize: 16,
  },
  btn: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 40,
    justifyContent: 'center',
  },
  btnText: {
    fontWeight: 'bold',
  }
});
