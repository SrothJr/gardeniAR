import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExplorePlants from './screens/ExplorePlants';
import PlantDetail from './screens/PlantDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Explore" component={ExplorePlants} />
        <Stack.Screen name="PlantDetail" component={PlantDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
