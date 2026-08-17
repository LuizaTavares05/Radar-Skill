import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import Dashboard from "./src/pages/Dashboard";
import Toaster, { toast } from "./src/components/Toast";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { obterLembrarPersistidoAsync } from "./src/auth";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function BootScreen() {
  const { colors } = useTheme();
  return <View style={[styles.boot, { backgroundColor: colors.background }]} />;
}

function RootNavigator() {
  const { email, pronto } = useAuth();
  const { definirTema } = useTheme();

  const handleLogout = () => {
    obterLembrarPersistidoAsync().then((lembrar) => {
      if (!lembrar) definirTema("light");
    });
    toast.info("Sessão encerrada", "Até logo!");
  };

  if (!pronto) {
    return <BootScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!email ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : (
        <Stack.Screen name="Dashboard">
          {() => <Dashboard onLogout={handleLogout} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { pronto } = useTheme();
  const { pronto: authPronto } = useAuth();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded || !pronto || !authPronto) {
    return <BootScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Toaster />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
  },
});
