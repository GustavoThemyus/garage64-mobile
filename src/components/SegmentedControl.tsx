import SegmentedControlLib, {
  SegmentedControlProps as NativeSegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";
import { ComponentType } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { radius, typography } from "@/src/theme/tokens";
import { useTheme, useThemeController } from "@/src/theme/useTheme";

// A tipagem da biblioteca descreve uma classe com um mixin de NativeMethods que
// não casa mais com os tipos do React 19 e do React Native 0.88, e o TypeScript
// recusa o componente como JSX. O componente funciona; só o tipo precisa ser dito
// de novo, com as props que a própria biblioteca exporta.
const NativeSegmentedControl =
  SegmentedControlLib as unknown as ComponentType<NativeSegmentedControlProps>;

type SegmentedControlProps<T extends string> = {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
};

// Controle segmentado. No iOS é o UISegmentedControl do próprio sistema, que no
// iOS 26 é Liquid Glass: trilho de vidro e a cápsula do item ativo deslizando
// com a animação nativa. Não dá pra imitar isso em JS, então no iOS usa o nativo.
// No Android e na web usa uma versão em JS com o mesmo desenho básico.
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
  // O controle nativo segue o esquema do sistema por padrão. Passamos o esquema
  // do app, pra a escolha Light/Dark do Settings valer também aqui.
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
