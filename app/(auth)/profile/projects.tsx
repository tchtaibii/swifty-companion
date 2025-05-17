import { Text, StyleSheet, ScrollView, View } from "react-native";
import ProjectListCard from "../../../components/ProjectListCard";
import ProjectListItem from "../../../components/ProjectListItem";
import { useProfileStore } from "../../../stores/profileStore";

export default function ProjectsPage() {
  const { profile } = useProfileStore();
  if (!profile || !profile.projects) return null;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#181A20" }}
      contentContainerStyle={{ paddingVertical: 32 }}
    >
      <ProjectListCard>
        <Text style={styles.projectsTitleCard}>Projects</Text>
        {(() => {
          // Sort: finished first, in_progress last
          const sortedProjects = [...profile.projects].sort((a, b) => {
            if (a.status === "in_progress" && b.status !== "in_progress")
              return 1;
            if (a.status !== "in_progress" && b.status === "in_progress")
              return -1;
            return 0;
          });
          return sortedProjects.map((project, idx) =>
            project.status !== "in_progress" ? (
              <ProjectListItem
                key={project.id}
                title={project.name}
                duration={
                  project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString()
                    : ""
                }
                percent={project.finalMark ?? 0}
                isValidated={project.validated}
                isLast={idx === Math.min(4, sortedProjects.length - 1)}
              />
            ) : (
              <View key={project.id} style={{ paddingVertical: 18 }}>
                <Text style={styles.skillName}>{project.name}</Text>
                {project.status === "in_progress" && (
                  <Text
                    style={{ color: "#b0b0b0", fontSize: 13, marginTop: 2 }}
                  >
                    In progress
                  </Text>
                )}
                {idx !== Math.min(4, sortedProjects.length - 1) && (
                  <View style={{ height: 1, backgroundColor: "#eee" }} />
                )}
              </View>
            )
          );
        })()}
      </ProjectListCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  projectsTitleCard: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  skillName: {
    color: "#b0b0b0",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
});
