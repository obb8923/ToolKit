import './global.css'
import 'intl-pluralrules';
import '@lib/i18n';
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';
import { AppStack } from '@/shared/nav/AppStack';
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PortalProvider>
          <View style={{flex:1}}>
                <NavigationContainer>
                  {/* <StatusBar barStyle="dark-content" translucent={true}/> */}
                  <AppStack/>
                </NavigationContainer>
          </View>
        </PortalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}