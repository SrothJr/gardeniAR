import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

import {
  GestureHandlerRootView,
  PinchGestureHandler,
  RotationGestureHandler,
} from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

type PlantType = 'coconut' | 'tomato' | 'areca';

type Plant = {
  id: number;
  type: PlantType;
  pan: Animated.ValueXY;
  scale: Animated.Value;
  rotate: Animated.Value;
};

export default function ARScreen(): React.JSX.Element {
  const [permission, requestPermission] = useCameraPermissions();
  const [plants, setPlants] = useState<Plant[]>([]);
  const selected = useRef<PlantType>('coconut');

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  /* ---------------- IMAGE MAP (FIXED PATHS) ---------------- */
  const getImage = (type: PlantType) => {
    switch (type) {
      case 'coconut':
        return require('../assets/images/coconut.png');
      case 'tomato':
        return require('../assets/images/tomato.png');
      case 'areca':
        return require('../assets/images/areca-palm.png');
    }
  };

  /* ---------------- FAKE GROUND SYSTEM ---------------- */
  const getGroundY = (y: number) => {
    // snap slightly upward so it feels like ground surface
    return Math.min(y, height - 150);
  };

  const getScaleFromY = (y: number) => {
    const min = 0.6;
    const max = 1.4;
    return min + (y / height) * (max - min);
  };

  /* ---------------- ADD PLANT ---------------- */
  const addPlant = (x: number, y: number) => {
    const fixedY = getGroundY(y);

    const plant: Plant = {
      id: Date.now(),
      type: selected.current,
      pan: new Animated.ValueXY({ x, y: fixedY }),
      scale: new Animated.Value(getScaleFromY(fixedY)),
      rotate: new Animated.Value(0),
    };

    setPlants((p) => [...p, plant]);
  };

  /* ---------------- REMOVE ---------------- */
  const removePlant = (id: number) => {
    setPlants((p) => p.filter((i) => i.id !== id));
  };

  /* ---------------- DRAG ---------------- */
  const pan = (p: Plant) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: p.pan.x, dy: p.pan.y }],
        { useNativeDriver: false }
      ),
    });

  /* ---------------- PINCH ---------------- */
  const pinch = (p: Plant) => (e: any) => {
    const s = e.nativeEvent.scale;
    p.scale.setValue(Math.max(0.5, Math.min(s, 2.5)));
  };

  /* ---------------- ROTATE ---------------- */
  const rotate = (p: Plant) => (e: any) => {
    p.rotate.setValue(e.nativeEvent.rotation);
  };

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

      {/* 👆 TAP LAYER */}
      <View
        style={StyleSheet.absoluteFill}
        onStartShouldSetResponder={() => true}
        onResponderRelease={(e) => {
          addPlant(e.nativeEvent.locationX, e.nativeEvent.locationY);
        }}
      />

      {/* 🌱 PLANTS */}
      {plants.map((p) => {
        const panResponder = pan(p);

        return (
          <RotationGestureHandler key={p.id} onGestureEvent={rotate(p)}>
            <PinchGestureHandler onGestureEvent={pinch(p)}>
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.obj,
                  {
                    transform: [
                      { translateX: p.pan.x },
                      { translateY: p.pan.y },
                      { scale: p.scale },
                      {
                        rotate: p.rotate.interpolate({
                          inputRange: [-3.14, 3.14],
                          outputRange: ['-180deg', '180deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Image
                  source={getImage(p.type)}
                  style={styles.img}
                  resizeMode="contain"
                />

                <TouchableOpacity
                  onPress={() => removePlant(p.id)}
                  style={styles.del}
                >
                  <Text style={{ color: 'white' }}>X</Text>
                </TouchableOpacity>
              </Animated.View>
            </PinchGestureHandler>
          </RotationGestureHandler>
        );
      })}

      {/* 🎮 CONTROL BAR */}
      <View style={styles.bar}>
        <TouchableOpacity onPress={() => (selected.current = 'coconut')} style={styles.btn}>
          <Text style={styles.t}>Coconut</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => (selected.current = 'tomato')} style={styles.btn}>
          <Text style={styles.t}>Tomato</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => (selected.current = 'areca')} style={styles.btn}>
          <Text style={styles.t}>Areca</Text>
        </TouchableOpacity>
      </View>

    </GestureHandlerRootView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  obj: {
    position: 'absolute',
  },

  img: {
    width: 130,
    height: 130,
  },

  del: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
  },

  bar: {
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

  t: {
    color: 'white',
  },
});