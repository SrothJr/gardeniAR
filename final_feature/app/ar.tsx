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
        return require('../assets/images/coconut.png');
      case 'tomato':
        return require('../assets/images/tomato.png');
      case 'areca':
        return require('../assets/images/areca-palm.png');
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
        <Text>Camera permission required</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Allow Camera</Text>
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
                  <Text style={{ color: 'white' }}>X</Text>
                </TouchableOpacity>

              </Animated.View>

            </PinchGestureHandler>
          </RotationGestureHandler>
        );
      })}

      {/* 🎮 CONTROLS */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => (selectedType.current = 'coconut')} style={styles.btn}>
          <Text style={styles.txt}>Coconut</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => (selectedType.current = 'tomato')} style={styles.btn}>
          <Text style={styles.txt}>Tomato</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => (selectedType.current = 'areca')} style={styles.btn}>
          <Text style={styles.txt}>Areca</Text>
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
  },

  object: {
    position: 'absolute',
  },

  image: {
    width: 130,
    height: 130,
  },

  deleteBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 10,
  },

  btn: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
  },

  txt: {
    color: 'white',
  },
});