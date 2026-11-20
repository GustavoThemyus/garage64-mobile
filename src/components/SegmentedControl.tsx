import SegmentedControlLib, {
  SegmentedControlProps as NativeSegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";
import { ComponentType } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { radius, typography } from "@/src/theme/tokens";
import { useTheme, useThemeController } from "@/src/theme/useTheme";

// A tipagem da biblioteca não casa com os tipos do React 19 e do RN 0.88 e o TypeScript recusa o componente
// como JSX. O componente funciona; o tipo é dito de novo com as props que a própria biblioteca exporta.
const NativeSegmentedControl =
  SegmentedControlLib as unknown as ComponentType<NativeSegmentedControlProps>;

type SegmentedControlProps<T extends string> = {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
};

// iOS: o UISegmentedControl do sistema (Liquid Glass no iOS 26, não dá pra imitar em JS). Android e web: versão em JS.
export function SegmentedControl<T extends string>(
  props: SegmentedControlProps<T>,
) {
  if (Platform.OS === "ios") return <IosSegmentedControl {...props} />;
  return <JsSegmentedControl {...props} />;
}

function IosSegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  // repassa o esquema do app pra Light/Dark forçado do Settings valer aqui também
  const { scheme } = useThemeController();

  return (
    <NativeSegmentedControl
      values={options.map((option) => option.label)}
      selectedIndex={Math.max(
        0,
        options.findIndex((option) => option.id === value),
      )}
      appearance={scheme}
      onChange={(event) => {
        const next = options[event.nativeEvent.selectedSegmentIndex];
        if (next) onChange(next.id);
      }}
      style={styles.native}
    />
  );
}

function JsSegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View
      style={[styles.track, { backgroundColor: theme.surfaceElevated }]}
      accessibilityRole="radiogroup"
    >
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.segment,
              selected && { backgroundColor: theme.surface },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? theme.textPrimary : theme.textSecondary },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  native: {
    height: 40,
  },
  track: {
    flexDirection: "row",
    borderRadius: radius.pill,
    padding: 3,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingVertical: 9,
  },
  label: {
    ...typography.label,
    fontWeight: "600",
  },
});
