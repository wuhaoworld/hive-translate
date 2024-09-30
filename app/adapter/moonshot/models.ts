import { LLMModel } from "@/app/adapter/interface"
export const provider = {
  id: 'moonshot',
  providerName: 'Moonshot AI',
}

export const modelList: LLMModel[] = [
  {
    'name': 'moonshot-v1-8k',
    'displayName': 'Moonshot v1 8K',
    provider
  },
  {
    'name': 'moonshot-v1-32k',
    'displayName': 'Moonshot v1 32K',
    provider
  },
  {
    'name': 'moonshot-v1-128k',
    'displayName': 'Moonshot v1 128K',
    provider
  },
]