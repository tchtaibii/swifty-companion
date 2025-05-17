import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import NetInfo from "@react-native-community/netinfo";
import { NoInternetScreen } from "../components/NoInternetScreen";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsCheckingConnection(false);
    });

    checkConnection();

    return () => {
      unsubscribe();
    };
  }, []);

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
    setIsCheckingConnection(false);
  };

  if (isCheckingConnection) {
    return null;
  }

  if (!isConnected) {
    return <NoInternetScreen onRetry={checkConnection} />;
  }

  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
} 