import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type RenameBuildModalProps = {
  visible: boolean;
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

// Alert.prompt só existe no iOS; este modal funciona nas três plataformas.
export function RenameBuildModal({
  visible,
  currentName,
  onSave,
  onClose,
}: RenameBuildModalProps) {
  const theme = useTheme();
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (visible) setName(currentName);
  }, [visible, currentName]);

  const canSave = name.trim().length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.overlay, { backgroundColor: theme.scrim }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Rename build
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            autoFocus
            selectTextOnFocus
            maxLength={60}
            returnKeyType="done"
            onSubmitEditing={() => canSave && onSave(name)}
            accessibilityLabel="Build name"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { backgroundColor: theme.surfaceElevated, color: theme.textPrimary },
            ]}
          />
          <View style={styles.actions}>
            <Pressable onPress={onClose} accessibilityRole="button">
              <Text style={[styles.action, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onSave(name)}
              disabled={!canSave}
              accessibilityRole="button"
              style={{ opacity: canSave ? 1 : 0.4 }}
            >
              <Text style={[styles.action, { color: theme.accentText }]}>Save</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    ...typography.headline,
    fontSize: 20,
  },
  input: {
    ...typography.body,
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 46,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.xl,
  },
  action: {
    ...typography.headline,
  },
});
