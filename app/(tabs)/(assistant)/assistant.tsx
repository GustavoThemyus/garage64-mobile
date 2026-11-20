import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Composer } from "@/src/components/chat/Composer";
import { MessageBubble } from "@/src/components/chat/MessageBubble";
import {
  assistantService,
  AssistantUnavailableError,
  ChatMessage,
} from "@/src/services/assistant";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

const SUGGESTIONS = [
  "What makes the Skyline GT-R R34 special?",
  "Which car here is the lightest?",
  "How does a turbo change a Civic?",
];

let nextId = 0;
const newId = () => `m${(nextId += 1)}`;

export default function AssistantScreen() {
  const theme = useTheme();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || pending) return;

    const userMessage: ChatMessage = { id: newId(), role: "user", text };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setPending(true);

    try {
      const reply = await assistantService.sendMessage(messages, text);
      setMessages([...history, { id: newId(), role: "assistant", text: reply }]);
    } catch (error) {
      const text =
        error instanceof AssistantUnavailableError
          ? error.message
          : "Something went wrong. Try again in a moment.";
      setMessages([
        ...history,
        { id: newId(), role: "assistant", text, isError: true },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(message) => message.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => <MessageBubble message={item} />}
        ListEmptyComponent={
          <View style={styles.intro}>
            <Text style={[styles.introTitle, { color: theme.textPrimary }]}>
              Ask me about cars
            </Text>
            <Text style={[styles.introText, { color: theme.textSecondary }]}>
              Specs, history and what a change does to a build.
            </Text>
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  onPress={() => send(suggestion)}
                  accessibilityRole="button"
                  style={[
                    styles.suggestion,
                    { backgroundColor: theme.surface },
                  ]}
                >
                  <Text style={[styles.suggestionText, { color: theme.textPrimary }]}>
                    {suggestion}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListFooterComponent={
          pending ? (
            <View style={styles.pending}>
              <ActivityIndicator color={theme.accentText} />
            </View>
          ) : undefined
        }
      />

      <Composer
        value={input}
        onChange={setInput}
        onSend={() => send(input)}
        disabled={pending}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  intro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
  },
  introTitle: {
    ...typography.title,
  },
  introText: {
    ...typography.body,
    textAlign: "center",
  },
  suggestions: {
    alignSelf: "stretch",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  suggestion: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing.lg,
  },
  suggestionText: {
    ...typography.body,
  },
  pending: {
    alignSelf: "flex-start",
    padding: spacing.md,
  },
});
