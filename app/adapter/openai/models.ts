import { LLMModel } from "@/app/adapter/interface"
export const provider = {
  id: 'openai',
  providerName: 'Open AI',
}

export const modelList: LLMModel[] = [
  {
    'name': 'gpt-4o',
    'displayName': 'GPT 4o',
    provider
  },
  {
    'name': 'gpt-4o-mini',
    'displayName': 'GPT 4o mini',
    provider
  },
  {
    'name': 'gpt-3.5-turbo',
    'displayName': 'GPT 3.5 Turbo',
    provider
  },
  {
    'name': 'gpt-4-turbo-preview',
    'displayName': 'GPT 4 Turbo',
    provider
  },
  {
    'name': 'gpt-4-32k',
    'displayName': 'GPT 4 32k',
    provider
  },
  
]