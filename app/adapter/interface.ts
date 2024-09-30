export abstract class LLMApi {
  abstract chat(options: ChatOptions): Promise<void>;
  abstract usage(): Promise<LLMUsage>;
  abstract models(): Promise<LLMModel[]>;
}

export interface ChatOptions {
  messages: RequestMessage[];
  config: LLMConfig;
  apiUrl?: string;
  apiKey?: string;
  onUpdate: (message: string) => void;
  onFinish: (message: string) => void;
  onError?: (err: Error) => void;
  onController?: (controller: AbortController) => void;
}

// 暂时只支持文本
export interface RequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMConfig {
  model: string;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface LLMUsage {
  used: number;
  total: number;
}

export interface LLMModel {
  name: string;
  displayName: string;
  apiUrl?: string;
  // available: boolean;
  provider: LLMModelProvider;
}

// export interface LLMModel {
//   name: string;
//   available: boolean;
//   provider: LLMModelProvider;
// }

export interface LLMModelProvider {
  id: string;
  providerName: string;
  status?: boolean
  // providerType: string;
}

export default interface TranslaterComponent {
  startTranslate: (question: string, language: string, completeCallback: (result: string) => void) => void;
  stopTranslate: () => void;
  clear: () => void;
}