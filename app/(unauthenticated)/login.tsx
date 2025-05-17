import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "expo-router";
import Svg, { Polygon } from "react-native-svg";

export default function LoginScreen() {
  const { isAuthenticated, login, get42MeProfile } = useAuthStore();
  const router = useRouter();

  const handleLogin = () => {
    console.log("login");
    login();
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) get42MeProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swifty Companion</Text>
      <Text style={styles.description}>
        Welcome to Swifty Companion, your personal 42 profile explorer. Sign in
        to view your stats, projects, and more!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        activeOpacity={0.85}
      >
        <Svg42 style={styles.buttonLogo} />
        <Text style={styles.buttonText}>Sign in with 42</Text>
      </TouchableOpacity>
    </View>
  );
}

function Svg42(props: any) {
  return (
    <Svg
      viewBox="0 0 928 578"
      width={props.width || 30}
      height={props.height || 40}
      fill="currentColor"
      {...props}
    >
      <Polygon points="32,412.6 362.1,412.6 362.1,578 526.8,578 526.8,279.1 197.3,279.1 526.8,-51.1 362.1,-51.1 32,279.1" />
      <Polygon points="597.9,114.2 762.7,-51.1 597.9,-51.1" />
      <Polygon points="762.7,114.2 597.9,279.1 597.9,443.9 762.7,443.9 762.7,279.1 928,114.2 928,-51.1 762.7,-51.1" />
      <Polygon points="928,279.1 762.7,443.9 928,443.9" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A20",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  description: {
    color: "#b0b0b0",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  logoWrapper: {
    marginBottom: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    color: "#fff",
    width: 96,
    height: 60,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23201e",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonLogo: {
    color: "#fff",
    // width: 32,
    height: 16,
    marginRight: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 0.2,
  },
});
