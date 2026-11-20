import { env, hasApi } from "../config/env";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  // Resposta de falha (serviço fora do ar), exibida com outro estilo.
  isError?: boolean;
};

export class AssistantUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssistantUnavailableError";
  }
}

// Ponto único de contato do chat com o mundo de fora. A tela só conhece esta
// interface.
export interface AssistantService {
  sendMessage(history: ChatMessage[], text: string): Promise<string>;
}

// Sem EXPO_PUBLIC_API_URL o assistente fica desligado e o chat avisa isso.
export const offlineAssistantService: AssistantService = {
  async sendMessage() {
    throw new AssistantUnavailableError(
      "The assistant is offline for now. It needs the Garage64 backend, which is not live yet.",
    );
  },
};

const REQUEST_TIMEOUT_MS = 30_000;

// Contrato que a API Next.js (docs/deploy.md, etapa E) precisa cumprir:
//
//   POST {EXPO_PUBLIC_API_URL}/api/assistant
//   corpo:    { "messages": [{ "role": "user" | "assistant", "text": string }] }
//             (o histórico em ordem, terminando na mensagem nova do usuário)
//   resposta: 200 { "reply": string }
//   erro:     qualquer status diferente de 200
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
