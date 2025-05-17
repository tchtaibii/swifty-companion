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
      <Stack.Screen name="projects" />
      <Stack.Screen name="profile/[id]" />
      <Stack.Screen name="profile/projects" />
      <Stack.Screen name="search" />
    </Stack>
  );
}
