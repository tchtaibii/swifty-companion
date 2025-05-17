import { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../stores/authStore";
import { useSearchStore } from "../stores/searchStore";


export default function Navbar() {
  const router = useRouter();
  const segments = useSegments();
  const isHome = segments[segments.length - 1] === "home";
  const canGoBack = router.canGoBack();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<TextInput>(null);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  const clearSearch = useSearchStore((state) => state.clearSearch);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearching]);

  const handleSearchSubmit = () => {
    setSearchQuery(search.trim());
    if (search.trim() && segments[segments.length - 1] !== "search") {
      router.push("/search");
    }
    setSearch("");
  };

  if (isSearching) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setIsSearching(false);
            setSearch("");
            clearSearch();
          }}
          style={styles.iconButton}
        >
          <Ionicons name="close" size={28} color="#222" />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
          placeholderTextColor="#888"
          returnKeyType="search"
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity
          onPress={handleSearchSubmit}
          style={styles.iconButton}
        >
          <Ionicons name="search" size={26} color="#11cfcf" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isHome && canGoBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
      )}
      {!isHome && !canGoBack && (
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          style={styles.iconButton}
        >
          <Ionicons name="home-outline" size={28} color="#222" />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={() => setIsSearching(true)}
        style={styles.iconButton}
      >
        <Ionicons name="search" size={26} color="#3E3E3E" />
      </TouchableOpacity>
      <TouchableOpacity onPress={logout} style={styles.iconButton}>
        <Ionicons name="log-out-outline" size={28} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconButton: {
    padding: 4,
  },
  searchInput: {
    flex: 1,
    height: 36,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#222",
    fontSize: 16,
    marginHorizontal: 8,
  },
});
