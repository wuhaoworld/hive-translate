import { LLMModel } from "@/app/adapter/interface"
export const provider = {
  id: 'claude',
  providerName: 'Claude AI',
}

export const modelList: LLMModel[] = [
  {
    'name': 'claude-3-5-sonnet-20240620',
    'displayName': 'Claude 3.5 Sonnet',
    provider
  },
  {
    'name': 'claude-3-sonnet-20240229',
    'displayName': 'Claude 3 Sonnet',
    provider
  },
  {
    'name': 'claude-3-opus-20240229',
    'displayName': 'Claude 3 Opus',
    provider
  },

  {
    'name': 'claude-3-haiku-20240307',
    'displayName': 'Claude 3 Haiku',
    provider
  }
]