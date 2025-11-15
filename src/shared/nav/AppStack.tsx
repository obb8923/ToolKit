import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppScreen } from "@domain/App/AppScreen";
const Stack = createNativeStackNavigator<AppStackParamList>();
export type AppStackParamList = {
  App: undefined;

};

export const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="App" component={AppScreen} />
    </Stack.Navigator>
  );
};