import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { OAuthWebView } from "../../components/OAuthWebView";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../../stores/authStore";
import { getRefreshToken } from "@/api/api";

export default function LoginScreen() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    error: authError,
    login,
    get42MeProfile,
    authenticateWithCode,
    clearError,
  } = useAuthStore();

  const [webViewVisible, setWebViewVisible] = useState(false);
  const [authUrl, setAuthUrl] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          await get42MeProfile();
        }
      } catch (e) {
        clearError();
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLogin = async () => {
    setError(null);

    try {
      const result = await login();
      if (result && result.type === "webview_needed") {
        setAuthUrl(result.authUrl || "");
        setRedirectUri(result.redirectUri || "");
        setWebViewVisible(true);
      }
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  };

  const handleAuthSuccess = async (code: string) => {
    setError(null);

    try {
      await authenticateWithCode(code);
    } catch (e: any) {
      setError(e.message || "Authentication failed");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>42</Text>
        <Text style={styles.title}>Swifty Companion</Text>
        <Text style={styles.subtitle}>View your 42 profile information</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Sign in with 42</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* WebView for OAuth flow on Android */}
      <OAuthWebView
        url={authUrl}
        redirectUri={redirectUri}
        visible={webViewVisible}
        onClose={() => setWebViewVisible(false)}
        onSuccess={handleAuthSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#8e8e93",
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007aff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
