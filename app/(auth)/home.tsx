import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import ProjectListCard from "../../components/ProjectListCard";
import ProjectListItem from "../../components/ProjectListItem";
import { useAuthStore } from "../../stores/authStore";

const BG_IMAGE = require("../../assets/images/bg.png");

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#000', fontSize: 18 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{user.login}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user.name}</Text>
        </View>
        <View style={styles.centered}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₳ {user.currency}</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Ev.P {user.evp}</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Score {user.score}</Text>
            </View>
          </View>
          <View style={styles.progressBlock}>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${user.progress}%` },
                ]}
              />
            </View>
            <View style={styles.progressHeader}>
              <Text style={styles.level}>Lvl {user.level}</Text>
              <Text style={styles.progressText}>
                {Math.round(user.progress)}%
              </Text>
            </View>
          </View>
          {user.projects && user.projects.length > 0 && (
            <View style={styles.projectsSection}>
              <ProjectListCard>
                <View style={styles.projectsHeaderRow}>
                  <Text style={styles.projectsTitleCard}>Projects</Text>
                  <TouchableOpacity
                    style={styles.pillButton}
                    onPress={() => router.push("/projects")}
                  >
                    <Text style={styles.pillButtonText}>View all</Text>
                  </TouchableOpacity>
                </View>
                {(() => {
                  // Sort: finished first, in_progress last
                  const sortedProjects = [...user.projects].sort((a, b) => {
                    if (a.status === 'in_progress' && b.status !== 'in_progress') return 1;
                    if (a.status !== 'in_progress' && b.status === 'in_progress') return -1;
                    return 0;
                  });
                  return sortedProjects.slice(0, 5).map((project, idx, arr) => (
                    project.status !== 'in_progress' ? (
                      <ProjectListItem
                        key={project.id}
                        title={project.name}
                        duration={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}
                        percent={project.finalMark ?? 0}
                        isValidated={project.validated}
                        isLast={idx === Math.min(4, sortedProjects.length - 1)}
                      />
                    ) : 
                    (
                      <View key={project.id} style={{ paddingVertical: 18 }}>
                        <Text style={styles.skillName}>{project.name}</Text>
                        {project.status === 'in_progress' && (
                          <Text style={{ color: '#b0b0b0', fontSize: 13, marginTop: 2 }}>In progress</Text>
                        )}
                        {idx !== Math.min(4, sortedProjects.length - 1) && <View style={{ height: 1, backgroundColor: '#eee' }} />}
                      </View>
                    )
                  ));
                })()}
              </ProjectListCard>
            </View>
          )}
          {user.skills && user.skills.length > 0 && (
            <View style={styles.skillsSection}>
              <ProjectListCard>
                <Text style={styles.projectsTitleCard}>Skills</Text>
                {user.skills.map((skill) => (
                  <View key={skill.id} style={styles.skillRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.skillName}>{skill.name}</Text>
                      <View style={styles.skillBarContainer}>
                        <View
                          style={[
                            styles.skillBarFill,
                            { width: `${skill.percent}%` },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.skillInfo}>
                      <Text style={styles.skillLevel}>Lvl {Math.floor(skill.level)}</Text>
                      <Text style={styles.skillPercent}>{skill.percent}%</Text>
                    </View>
                  </View>
                ))}
              </ProjectListCard>
            </View>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Profile Info</Text>
            <View style={styles.infoBlock}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#b0b0b0" />
                <Text style={styles.infoText}>{user.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={18}
                  color="#b0b0b0"
                />
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesome5 name="calendar-alt" size={16} color="#b0b0b0" />
                <Text style={styles.infoText}>{user.date}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingTop: 32,
    marginBottom: 8,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  infoBlock: {
    marginTop: 12,
    marginBottom: 8,
    width: "100%",
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
    justifyContent: "center",
  },
  infoText: {
    color: "#b0b0b0",
    fontSize: 14,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#19e3d2",
    backgroundColor: "#222",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23272f",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: -16,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#19e3d2",
    marginRight: 6,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  centered: {
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 24,
  },
  name: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 8,
  },
  title: {
    color: "#b0b0b0",
    fontSize: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#19e3d2",
    marginHorizontal: 6,
  },
  progressBlock: {
    width: "100%",
    marginBottom: 16,
  },
  progressBarContainer: {
    width: "100%",
    height: 12,
    backgroundColor: "#23272f",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#19e3d2",
    borderRadius: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  level: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  rank: {
    color: "#b0b0b0",
    fontSize: 14,
  },
  progressText: {
    color: "#fff",
    fontWeight: "600",
    alignSelf: "flex-end",
    marginTop: 2,
    fontSize: 13,
  },
  alumniBlock: {
    alignItems: "center",
    marginTop: 16,
  },
  alumniTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 2,
  },
  alumniDate: {
    color: "#19e3d2",
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 2,
  },
  alumniCountdown: {
    color: "#e07be0",
    fontSize: 15,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#23272f",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  modalTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  projectsSection: {
    marginTop: 24,
    width: "100%",
  },
  projectsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  projectsTitleCard: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  pillButton: {
    backgroundColor: "#11cfcf",
    borderRadius: 32,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  pillButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  skillsSection: {
    marginTop: 28,
    width: "100%",
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  skillName: {
    color: "#b0b0b0",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  skillBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#23272f",
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 6,
    overflow: "hidden",
  },
  skillBarFill: {
    height: "100%",
    backgroundColor: "#11cfcf",
    borderRadius: 6,
  },
  skillInfo: {
    alignItems: "flex-end",
    marginLeft: 12,
    minWidth: 54,
  },
  skillLevel: {
    color: "#fff",
    fontWeight: "medium",
    fontSize: 13,
  },
  skillPercent: {
    color: "#11cfcf",
    fontWeight: "medium",
    fontSize: 13,
  },
});
