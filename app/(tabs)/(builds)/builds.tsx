import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import { BuildCard } from "@/src/components/BuildCard";
import { EmptyState } from "@/src/components/EmptyState";
import { FilterControl } from "@/src/components/filters/FilterControl";
import { buildBuildFilterModel } from "@/src/components/filters/filterModels";
import { RenameBuildModal } from "@/src/components/RenameBuildModal";
import { useCars } from "@/src/data/CarsProvider";
import {
  BuildFilterCriteria,
  EMPTY_BUILD_FILTERS,
  filterBuilds,
} from "@/src/engine/filterBuilds";
import { useBuilds } from "@/src/storage/BuildsProvider";
import { spacing } from "@/src/theme/tokens";
import { Build } from "@/src/types/build";
import { confirmDestructive } from "@/src/utils/confirm";

export default function BuildsScreen() {
  const { cars, getCar } = useCars();
  const { builds, ready, renameBuild, deleteBuild } = useBuilds();
  const [criteria, setCriteria] = useState<BuildFilterCriteria>(EMPTY_BUILD_FILTERS);
  const [renaming, setRenaming] = useState<Build | null>(null);

  // Mais recentes primeiro. Editar uma build não muda a data de criação.
  const sorted = useMemo(
    () => [...builds].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [builds],
  );
  const visible = useMemo(
    () => filterBuilds(sorted, criteria, cars),
    [sorted, criteria, cars],
  );

  const filterModel = buildBuildFilterModel({
    cars,
    builds,
    criteria,
    onChange: setCriteria,
    onClear: () => setCriteria(EMPTY_BUILD_FILTERS),
    resultCount: visible.length,
  });

  function handleDelete(build: Build) {
    confirmDestructive(
      "Delete build",
      `"${build.name}" will be removed from this device.`,
      "Delete",
      () => deleteBuild(build.id),
    );
  }

  // Ainda lendo do disco: tela vazia na cor de fundo, sem piscar o estado vazio.
  if (!ready) return null;

  if (builds.length === 0) {
    return (
      <EmptyState
        title="No builds yet"
        message="Open a car in the Catalog and tap Create build."
      />
    );
  }

  // Lista como primeiro filho da tela, pelo mesmo motivo do Catalog.
  return (
    <>
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
              car={getCar(item.carId)}
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

      <FilterControl model={filterModel} />

      <RenameBuildModal
        visible={renaming !== null}
        currentName={renaming?.name ?? ""}
        onSave={(name) => {
          if (renaming) renameBuild(renaming.id, name);
          setRenaming(null);
        }}
        onClose={() => setRenaming(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
});
