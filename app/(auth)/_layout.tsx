import { Stack } from "expo-router";
import Navbar from "../../components/Navbar";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <Navbar  />,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
