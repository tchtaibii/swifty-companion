import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useSearchStore } from "../../stores/searchStore";
import { api } from "../../api/api";

const BG_IMAGE = require("../../assets/images/bg.png");


export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { searchQuery} = useSearchStore();
  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (searchQuery.includes("@")) {
        params.append("filter[email]", searchQuery);
      }
      else if (searchQuery.includes(" ")) {
        const [firstName, lastName] = searchQuery.split(" ");
        params.append("filter[first_name]", firstName);
        params.append("filter[last_name]", lastName);
      }
      else {
        params.append("filter[login]", searchQuery);
      }
      const response = await api.get(`/users?${params.toString()}`);
      setSearchResults(response.data);
    } catch (err) {
      setError("Failed to search users. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        router.push(`/profile/${item.id}`);
      }}
    >
      <Image
        source={{ uri: item.image?.link || "https://via.placeholder.com/50" }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.displayname}</Text>
        <Text style={styles.userLogin}>{item.login}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#b0b0b0" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={BG_IMAGE}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(57,57,57,0.26)" },
          ]}
        />
        <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
      </ImageBackground>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#19e3d2" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 32,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#23272f",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  userLogin: {
    color: "#b0b0b0",
    fontSize: 14,
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    color: "#b0b0b0",
    fontSize: 16,
    textAlign: "center",
  },
});
