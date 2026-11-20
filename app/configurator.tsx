import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionButton } from "@/src/components/ActionButton";
import { CompatibilityPanel } from "@/src/components/configurator/CompatibilityPanel";
import { OptionPicker } from "@/src/components/configurator/OptionPicker";
import { OutputPanel } from "@/src/components/configurator/OutputPanel";
import { SliderControl } from "@/src/components/configurator/SliderControl";
import { SwitchControl } from "@/src/components/configurator/SwitchControl";
import { ControlCard } from "@/src/components/configurator/ControlCard";
import { EmptyState } from "@/src/components/EmptyState";
import { useCars } from "@/src/data/CarsProvider";
import { dictionary } from "@/src/data/dictionary";
import {
  ASPIRATIONS,
  ASPIRATION_IDS,
  FACTORY_ID,
  getPartOptions,
} from "@/src/data/partsCatalog";
import { getConfigRanges, getFactoryConfig, isFactoryAwd } from "@/src/engine/config";
import { evaluateBuild } from "@/src/engine/evaluate";
import { useBuilds } from "@/src/storage/BuildsProvider";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";
import { AspirationId, Build, BuildConfig, PartField } from "@/src/types/build";
import { Car } from "@/src/types/car";

const PART_TITLES: Record<PartField, string> = {
  transmission: dictionary.specs.transmission,
  wheels: dictionary.specs.wheels,
  steering: dictionary.specs.steering,
  brakes: dictionary.specs.brakes,
};

export default function ConfiguratorScreen() {
  const { carId, buildId } = useLocalSearchParams<{
    carId?: string;
    buildId?: string;
  }>();
  const { ready, getBuild } = useBuilds();
  const { getCar, ready: carsReady } = useCars();

  // buildId edita uma build salva; sem ele, cria uma nova a partir do carId
  const existing = buildId ? getBuild(buildId) : undefined;
  const car = getCar(existing ? existing.carId : Number(carId));

  if ((buildId && !existing && !ready) || (!car && !carsReady)) {
    return <EmptyState title="Loading build" />;
  }

  if (!car) {
    return (
      <>
        <Stack.Screen options={{ title: "Build" }} />
        <EmptyState
          title="Build not found"
          message="The car or the saved build no longer exists."
        />
      </>
    );
  }

  return <ConfiguratorForm car={car} existing={existing} />;
}

function ConfiguratorForm({ car, existing }: { car: Car; existing?: Build }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { saveBuild } = useBuilds();

  const factoryConfig = useMemo(() => getFactoryConfig(car), [car]);
  const ranges = useMemo(() => getConfigRanges(car), [car]);
  const factory = useMemo(
    () => evaluateBuild(car, factoryConfig),
    [car, factoryConfig],
  );

  const [config, setConfig] = useState<BuildConfig>(
    existing?.config ?? factoryConfig,
  );
  const [name, setName] = useState(existing?.name ?? `${car.info.model} build`);

  const result = useMemo(() => evaluateBuild(car, config), [car, config]);

  function update<K extends keyof BuildConfig>(key: K, value: BuildConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function partOptions(field: PartField) {
    return getPartOptions(car, field).map((option) => ({
      id: option.id,
      label: option.label,
      isFactory: option.id === FACTORY_ID,
    }));
  }

  const aspirationOptions = ASPIRATION_IDS.map((id) => ({
    id,
    label: ASPIRATIONS[id].label,
    isFactory: id === factoryConfig.aspiration,
  }));

  function handleSave() {
    saveBuild({
      id: existing?.id,
      carId: car.info.id,
      name: name.trim() || `${car.info.model} build`,
      config,
      computed: result.performance,
      warnings: result.warnings,
    });
    router.dismissTo("/builds");
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xxl },
      ]}
    >
      <Stack.Screen options={{ title: existing ? "Edit build" : "New build" }} />

      <View style={styles.carRow}>
        <Image
          source={{ uri: car.info.image }}
          style={[styles.thumb, { backgroundColor: theme.surface }]}
        />
        <View style={styles.carText}>
          <Text style={[styles.carBrand, { color: theme.accentText }]}>
            {car.info.brand}
          </Text>
          <Text style={[styles.carModel, { color: theme.textPrimary }]}>
            {car.info.model}
          </Text>
          <Text style={[styles.carHint, { color: theme.textSecondary }]}>
            Every control starts at the factory value.
          </Text>
        </View>
      </View>

      <SliderControl
        title={dictionary.specs.displacement}
        range={ranges.displacement}
        value={config.displacement}
        decimals={1}
        unit="L"
        onChange={(value) => update("displacement", value)}
      />

      {ranges.valves ? (
        <SliderControl
          title={dictionary.specs.valves}
          range={ranges.valves}
          value={config.valves}
          decimals={0}
          onChange={(value) => update("valves", value)}
        />
      ) : (
        <ControlCard
          title={dictionary.specs.valves}
          hint="Rotary engines have no valves, so there is nothing to change."
        />
      )}

      <OptionPicker
        title={dictionary.specs.aspiration}
        options={aspirationOptions}
        value={config.aspiration}
        onChange={(id) => update("aspiration", id as AspirationId)}
      />

      <OptionPicker
        title={PART_TITLES.transmission}
        options={partOptions("transmission")}
        value={config.transmission}
        onChange={(id) => update("transmission", id)}
      />

      <OptionPicker
        title={PART_TITLES.wheels}
        options={partOptions("wheels")}
        value={config.wheels}
        onChange={(id) => update("wheels", id)}
      />

      <OptionPicker
        title={PART_TITLES.brakes}
        options={partOptions("brakes")}
        value={config.brakes}
        onChange={(id) => update("brakes", id)}
      />

      <OptionPicker
        title={PART_TITLES.steering}
        options={partOptions("steering")}
        value={config.steering}
        onChange={(id) => update("steering", id)}
      />

      <SwitchControl
        title="All-wheel drive"
        hint={
          isFactoryAwd(car)
            ? "Factory: all-wheel drive."
            : "Factory: not all-wheel drive."
        }
        value={config.awd}
        onChange={(value) => update("awd", value)}
      />

      <SwitchControl
        title="Nitrous oxide (NOS)"
        hint="A short, strong power boost."
        value={config.nos}
        onChange={(value) => update("nos", value)}
      />

      <OutputPanel result={result} factory={factory} />

      <CompatibilityPanel warnings={result.warnings} />

      <View style={styles.saveBlock}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Build name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={`${car.info.model} build`}
          placeholderTextColor={theme.textSecondary}
          maxLength={60}
          returnKeyType="done"
          accessibilityLabel="Build name"
          style={[
            styles.input,
            { backgroundColor: theme.surface, color: theme.textPrimary },
          ]}
        />
        <ActionButton
          label={existing ? "Save changes" : "Save build"}
          onPress={handleSave}
        />
        <ActionButton
          label="Reset to factory"
          variant="secondary"
          onPress={() => setConfig(factoryConfig)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  carRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  thumb: {
    width: 96,
    height: 64,
    borderRadius: radius.md,
    borderCurve: "continuous",
  },
  carText: {
    flex: 1,
    gap: 2,
  },
  carBrand: {
    ...typography.eyebrow,
  },
  carModel: {
    ...typography.headline,
    fontSize: 22,
  },
  carHint: {
    ...typography.label,
  },
  saveBlock: {
    gap: spacing.md,
  },
  label: {
    ...typography.eyebrow,
    paddingHorizontal: spacing.xs,
  },
  input: {
    ...typography.body,
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
});
