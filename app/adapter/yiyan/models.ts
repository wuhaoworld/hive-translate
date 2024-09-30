import { LLMModel } from "@/app/adapter/interface"

export const provider = {
  id: 'yiyan',
  providerName: '文心一言',
}

export const modelList: LLMModel[] = [
  {
    'name': 'ERNIE-Speed',
    'displayName': 'ERNIE-Speed',
    'apiUrl': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed',
    provider
  },
  {
    'name': 'ERNIE-Lite',
    'displayName': 'ERNIE-Lite',
    'apiUrl': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant',
    provider
  },
  {
    'name': 'ERNIE-Bot 4.0',
    'displayName': 'ERNIE-Bot 4.0',
    'apiUrl': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro',
    provider
  },
  {
    'name': 'ERNIE-Bot-8K',
    'displayName': 'ERNIE-Bot-8K',
    'apiUrl': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_bot_8k',
    provider
  },
  {
    'name': 'ERNIE-Bot-turbo',
    'displayName': 'ERNIE-Bot-turbo',
    'apiUrl': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant',
    provider
  }
];