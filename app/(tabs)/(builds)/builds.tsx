import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { BuildCard } from "@/src/components/BuildCard";
import { BuildFiltersPanel } from "@/src/components/BuildFiltersPanel";
import { EmptyState } from "@/src/components/EmptyState";
import { FilterToolbarButton } from "@/src/components/FilterToolbarButton";
import { RenameBuildModal } from "@/src/components/RenameBuildModal";
import { carsMoch } from "@/src/data/carsMoch";
import {
  BuildFilterCriteria,
  EMPTY_BUILD_FILTERS,
  filterBuilds,
  hasActiveBuildFilters,
} from "@/src/engine/filterBuilds";
import { useBuilds } from "@/src/storage/BuildsProvider";
import { spacing } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";
import { Build } from "@/src/types/build";
import { confirmDestructive } from "@/src/utils/confirm";

export default function BuildsScreen() {
  const theme = useTheme();
  const { builds, ready, renameBuild, deleteBuild } = useBuilds();
  const [panelOpen, setPanelOpen] = useState(false);
  const [criteria, setCriteria] = useState<BuildFilterCriteria>(EMPTY_BUILD_FILTERS);
  const [renaming, setRenaming] = useState<Build | null>(null);

  // Mais recentes primeiro. Editar uma build não muda a data de criação.
  const sorted = useMemo(
    () => [...builds].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [builds],
  );
  const visible = useMemo(
    () => filterBuilds(sorted, criteria, carsMoch),
    [sorted, criteria],
  );

  function handleDelete(build: Build) {
    confirmDestructive(
      "Delete build",
      `"${build.name}" will be removed from this device.`,
      "Delete",
      () => deleteBuild(build.id),
    );
  }

  if (!ready) {
    return <View style={[styles.container, { backgroundColor: theme.background }]} />;
  }

  if (builds.length === 0) {
    return (
      <EmptyState
        title="No builds yet"
        message="Open a car in the Catalog and tap Create build."
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FilterToolbarButton
        onPress={() => setPanelOpen((open) => !open)}
        active={panelOpen || hasActiveBuildFilters(criteria)}
      />

      {visible.length === 0 ? (
        <EmptyState
          title="No builds match"
          message="Change or clear the filters to see your builds."
        />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(build) => build.id}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BuildCard
              build={item}
              car={carsMoch.find((car) => car.info.id === item.carId)}
              onPress={() =>
                router.push({
                  pathname: "/configurator",
                  params: { buildId: item.id },
                })
              }
              onRename={() => setRenaming(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      )}

      <BuildFiltersPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        onClear={() => setCriteria(EMPTY_BUILD_FILTERS)}
        criteria={criteria}
        onChange={setCriteria}
        builds={builds}
        resultCount={visible.length}
      />

      <RenameBuildModal
        visible={renaming !== null}
        currentName={renaming?.name ?? ""}
        onSave={(name) => {
          if (renaming) renameBuild(renaming.id, name);
          setRenaming(null);
        }}
        onClose={() => setRenaming(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  list: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
});
