import AboutScreen from "@/screens/AboutScreen";
import GameScreen from "@/screens/GameScreen";
import HomeScreen from "@/screens/HomeScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import StatisticScreen from "@/screens/StatisticScreen";
import SupportScreen from "@/screens/SupportScreen";
import WinScreen from "@/screens/WinScreen";
import { RootStackParamList } from "@/types/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" id="RootStack">
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "15 Puzzles" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Settings" }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: "Про гру" }}
        />
        <Stack.Screen
          name="Support"
          component={SupportScreen}
          options={{ title: "Describe your problems" }}
        />

        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={({ route }) => ({ title: `Рівень ${route.params.level}` })}
        />

        <Stack.Screen
          name="Win"
          component={WinScreen}
          options={{ headerShown: false }}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen
          name="Statistic"
          component={StatisticScreen}
          options={{ title: "Моя Статистика" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
