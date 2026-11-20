import Constants from "expo-constants";
import { ScrollView, StyleSheet, Text } from "react-native";

import { InfoRow } from "@/src/components/detail/InfoRow";
import { SectionCard } from "@/src/components/detail/SectionCard";
import { LinkRow } from "@/src/components/LinkRow";
import { SegmentedControl } from "@/src/components/SegmentedControl";
import {
  CREATOR,
  LINKS,
  PROJECT_DESCRIPTION,
  PROJECT_DISCLAIMER,
} from "@/src/data/creator";
import { ThemePreference } from "@/src/theme/ThemeProvider";
import { spacing, typography } from "@/src/theme/tokens";
import { useTheme, useThemeController } from "@/src/theme/useTheme";

const THEME_OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { preference, setPreference } = useThemeController();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <SectionCard title="Theme">
        <SegmentedControl
          options={THEME_OPTIONS}
          value={preference}
          onChange={setPreference}
        />
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          System follows your device. Light and Dark override it.
        </Text>
      </SectionCard>

      <SectionCard title="About the project">
        <Text style={[styles.paragraph, { color: theme.textPrimary }]}>
          {PROJECT_DESCRIPTION}
        </Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          {PROJECT_DISCLAIMER}
        </Text>
        <InfoRow label="Version" value={version} isLast />
      </SectionCard>

      <SectionCard title="About the creator">
        <Text style={[styles.name, { color: theme.textPrimary }]}>
          {CREATOR.name}
        </Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          {CREATOR.bio}
        </Text>
      </SectionCard>

      <SectionCard title="Links">
        {LINKS.map((link, index) => (
          <LinkRow
            key={link.id}
            label={link.label}
            url={link.url}
            isLast={index === LINKS.length - 1}
          />
        ))}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  hint: {
    ...typography.label,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  paragraph: {
    ...typography.body,
    lineHeight: 22,
    paddingVertical: spacing.sm,
  },
  name: {
    ...typography.headline,
    paddingTop: spacing.md,
  },
});
