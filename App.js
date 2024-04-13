import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Router from "./src/routes/Router";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1}}>
        <Router />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
