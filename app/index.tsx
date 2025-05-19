import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import NetInfo from "@react-native-community/netinfo";
import { NoInternetScreen } from "../components/NoInternetScreen";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const state = await NetInfo.fetch();
        if (isMounted) {
          setIsConnected(state.isConnected);
          setIsCheckingConnection(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsConnected(false);
          setIsCheckingConnection(false);
        }
      }
    };

    // Initial check
    checkConnection();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (isMounted) {
        setIsConnected(state.isConnected);
      }
    });

    // Cleanup
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleRetry = async () => {
    setIsCheckingConnection(true);
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  if (isCheckingConnection) {
    return null;
  }

  if (!isConnected) {
    return <NoInternetScreen onRetry={handleRetry} />;
  }

  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
} 