import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import NetInfo from "@react-native-community/netinfo";
import { NoInternetScreen } from "../components/NoInternetScreen";
import axios from "axios";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        // First check with NetInfo
        const netInfoState = await NetInfo.fetch();
        
        if (!netInfoState.isConnected) {
          if (isMounted) {
            setIsConnected(false);
            setIsCheckingConnection(false);
          }
          return;
        }

        // Make a real network request to verify connectivity
        try {
          await axios.get('https://www.google.com', { timeout: 5000 });
          if (isMounted) {
            setIsConnected(true);
            setIsCheckingConnection(false);
          }
        } catch (error) {
          if (isMounted) {
            setIsConnected(false);
            setIsCheckingConnection(false);
          }
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
      if (isMounted && state.isConnected) {
        // When network state changes to connected, verify with a real request
        checkConnection();
      } else if (isMounted) {
        setIsConnected(false);
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
      // Make a real network request to verify connectivity
      await axios.get('https://www.google.com', { timeout: 5000 });
      setIsConnected(true);
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