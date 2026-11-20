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
// interface: quando o backend (Next.js + LLM, spec fase 4) existir, só a
// implementação abaixo muda, trocando o throw por uma chamada de API.
export interface AssistantService {
  sendMessage(history: ChatMessage[], text: string): Promise<string>;
}

export const assistantService: AssistantService = {
  async sendMessage() {
    throw new AssistantUnavailableError(
      "The assistant is offline for now. It needs the Garage64 backend, which is not live yet.",
    );
  },
};
