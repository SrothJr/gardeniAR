import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

import {
  GestureHandlerRootView,
  PinchGestureHandler,
  RotationGestureHandler,
} from 'react-native-gesture-handler';

const SCREEN = Dimensions.get('window');

type ARType = 'coconut' | 'tomato' | 'areca';

type ARObject = {
  id: number;
  type: ARType;
  pan: Animated.ValueXY;
  scale: Animated.Value;
  rotate: Animated.Value;
};

export default function ARScreen(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [objects, setObjects] = useState<ARObject[]>([]);
  const selectedType = useRef<ARType>('coconut');

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  /* ---------------- IMAGE LOADER (FIXED PATHS) ---------------- */
  const getImage = (type: ARType) => {
    switch (type) {
      case 'coconut':
        return require('../../assets/images/coconut.png');
      case 'tomato':
        return require('../../assets/images/tomato.png');
      case 'areca':
        return require('../../assets/images/areca-palm.png');
    }
  };

  /* ---------------- ADD OBJECT ---------------- */
  const placeObject = (x: number, y: number) => {
    const newObj: ARObject = {
      id: Date.now(),
      type: selectedType.current,
      pan: new Animated.ValueXY({ x, y }),
      scale: new Animated.Value(1),
      rotate: new Animated.Value(0),
    };

    setObjects((prev) => [...prev, newObj]);
  };

  /* ---------------- REMOVE OBJECT ---------------- */
  const removeObject = (id: number) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
  };

  /* ---------------- DRAG ---------------- */
  const createPan = (obj: ARObject) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: obj.pan.x, dy: obj.pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        obj.pan.extractOffset();
      },
    });

  /* ---------------- PINCH ---------------- */
  const onPinch = (obj: ARObject) => (e: any) => {
    const scale = e.nativeEvent.scale;
    obj.scale.setValue(Math.max(0.5, Math.min(scale, 3)));
  };

  /* ---------------- ROTATE ---------------- */
  const onRotate = (obj: ARObject) => (e: any) => {
    obj.rotate.setValue(e.nativeEvent.rotation);
  };

  /* ---------------- PERMISSION ---------------- */
  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#e6eef3', marginBottom: 20 }}>{t('ar.permission_required')}</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>{t('ar.allow_camera')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      {/* 📷 CAMERA */}
      <CameraView style={StyleSheet.absoluteFill} />

      {/* 👆 TAP TO PLACE (FIXED + STABLE) */}
      <View
        style={StyleSheet.absoluteFill}
        onStartShouldSetResponder={() => true}
        onResponderRelease={(e) => {
          const { locationX, locationY } = e.nativeEvent;
          placeObject(locationX, locationY);
        }}
      />

      {/* 🌱 OBJECTS */}
      {objects.map((obj) => {
        const panResponder = createPan(obj);

        return (
          <RotationGestureHandler key={obj.id} onGestureEvent={onRotate(obj)}>
            <PinchGestureHandler onGestureEvent={onPinch(obj)}>

              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.object,
                  {
                    transform: [
                      { translateX: obj.pan.x },
                      { translateY: obj.pan.y },
                      { scale: obj.scale },
                      {
                        rotate: obj.rotate.interpolate({
                          inputRange: [-3.14, 3.14],
                          outputRange: ['-180deg', '180deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Image
                  source={getImage(obj.type)}
                  style={styles.image}
                  resizeMode="contain"
                />

                <TouchableOpacity
                  onPress={() => removeObject(obj.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="close-circle" size={24} color="#f43f5e" />
                </TouchableOpacity>

              </Animated.View>

            </PinchGestureHandler>
          </RotationGestureHandler>
        );
      })}

      {/* 🎮 CONTROLS */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => (selectedType.current = 'coconut')} style={[styles.btn, selectedType.current === 'coconut' && styles.btnActive]}>
          <Text style={styles.txt}>{t('ar.coconut')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => (selectedType.current = 'tomato')} style={[styles.btn, selectedType.current === 'tomato' && styles.btnActive]}>
          <Text style={styles.txt}>{t('ar.tomato')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => (selectedType.current = 'areca')} style={[styles.btn, selectedType.current === 'areca' && styles.btnActive]}>
          <Text style={styles.txt}>{t('ar.areca')}</Text>
        </TouchableOpacity>
      </View>

    </GestureHandlerRootView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#071024',
  },
  permissionBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: '#051013',
    fontWeight: '900',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    color: '#e6eef3',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  object: {
    position: 'absolute',
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
  deleteBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 15,
  },
  btnActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  txt: {
    color: '#e6eef3',
    fontWeight: '800',
    fontSize: 14,
  },
});
