import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { carsMoch } from "@/src/data/carsMoch";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type CarPickerModalProps = {
  visible: boolean;
  excludeCarId: number;
  selectedCarId: number | null;
  onSelect: (carId: number) => void;
  onClose: () => void;
};

// Lista de carros pra escolher o adversário do Compare. Fica dentro da própria
// tela de detalhes (Modal) pra devolver a escolha sem passar estado entre rotas.
export function CarPickerModal({
  visible,
  excludeCarId,
  selectedCarId,
  onSelect,
  onClose,
}: CarPickerModalProps) {
  const theme = useTheme();
  const cars = carsMoch.filter((car) => car.info.id !== excludeCarId);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.sheet, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Choose a car
          </Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={[styles.cancel, { color: theme.accentText }]}>
              Cancel
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={cars}
          keyExtractor={(car) => String(car.info.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const selected = item.info.id === selectedCarId;
            return (
              <Pressable
                onPress={() => onSelect(item.info.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[styles.row, { backgroundColor: theme.surface }]}
              >
                <Image
                  source={{ uri: item.info.image }}
                  style={[styles.thumb, { backgroundColor: theme.border }]}
                />
                <View style={styles.rowText}>
                  <Text
                    style={[styles.brand, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
                    {item.info.brand} · {item.info.year}
                  </Text>
                  <Text
                    style={[styles.model, { color: theme.textPrimary }]}
                    numberOfLines={1}
                  >
                    {item.info.model}
                  </Text>
                </View>
                {selected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={theme.accentText}
                  />
                ) : null}
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  title: {
    ...typography.headline,
    fontSize: 20,
  },
  cancel: {
    ...typography.headline,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderCurve: "continuous",
  },
  thumb: {
    width: 76,
    height: 52,
    borderRadius: radius.sm,
    borderCurve: "continuous",
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  brand: {
    ...typography.caption,
  },
  model: {
    ...typography.headline,
  },
});
