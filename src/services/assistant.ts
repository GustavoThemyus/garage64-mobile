import { env, hasApi } from "../config/env";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  isError?: boolean;
};

export class AssistantUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssistantUnavailableError";
  }
}

export interface AssistantService {
  sendMessage(history: ChatMessage[], text: string): Promise<string>;
}

export const offlineAssistantService: AssistantService = {
  async sendMessage() {
    throw new AssistantUnavailableError(
      "The assistant is offline for now. It needs the Garage64 backend, which is not live yet.",
    );
  },
};

const REQUEST_TIMEOUT_MS = 30_000;

// Contrato da API (docs/deploy.md, etapa E): POST {EXPO_PUBLIC_API_URL}/api/assistant
//   corpo     { messages: [{ role: "user" | "assistant", text }] }, o histórico em ordem terminando na mensagem nova
//   resposta  200 { reply: string }; qualquer outro status é erro
export function createHttpAssistantService(baseUrl: string): AssistantService {
  return {
    async sendMessage(history, text) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(`${baseUrl}/api/assistant`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...history
                .filter((message) => !message.isError)
                .map(({ role, text: content }) => ({ role, text: content })),
              { role: "user", text },
            ],
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new AssistantUnavailableError(
            "The assistant could not answer right now. Try again in a moment.",
          );
        }

        const data: unknown = await response.json();
        const reply =
          typeof data === "object" && data !== null
            ? (data as { reply?: unknown }).reply
            : undefined;
        if (typeof reply !== "string" || reply.length === 0) {
          throw new AssistantUnavailableError(
            "The assistant sent an answer the app could not read.",
          );
        }
        return reply;
      } catch (error) {
        if (error instanceof AssistantUnavailableError) throw error;
        throw new AssistantUnavailableError(
          "Could not reach the assistant. Check your connection and try again.",
        );
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

export const assistantService: AssistantService = hasApi
  ? createHttpAssistantService(env.apiUrl)
  : offlineAssistantService;
