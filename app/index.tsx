import { Redirect } from "expo-router";
import { useAuthStore } from "../stores/authStore";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirect to the appropriate page based on auth status
  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
} 