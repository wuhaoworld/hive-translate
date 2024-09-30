'use client'
import { ChatOptions } from '@/app/adapter/interface'
import { RequestMessage } from '@/app/adapter/interface'
import { YiyanApi } from './api';
import { modelList } from './models';
export function translate(
  fromLanguage: string,
  toLanguage: string,
  text: string,
  model: string,
  onUpdateMessage: (text: string) => void,
  onFinish?: (text: string) => void,
  onError?: (text?: string) => void,
) {
  const apikey = localStorage.getItem('yiyan_api_key') || '';
  const apisecret = localStorage.getItem('yiyan_api_secret') || '';
  const bot = new YiyanApi();
  const modelObj = modelList.filter(item => item.name === model);
  let apiUrl;
  if (modelObj.length > 1) {
    apiUrl = modelObj[0]['apiUrl'];
  } else {
    apiUrl = modelList[0]['apiUrl'];
  }

  let messages: RequestMessage[];
  if (fromLanguage.toLowerCase() === 'auto') {
    messages = [
      {
        'role': 'user', 'content': `Translate the following source text to ${toLanguage}, Output translation directly without any additional text.
Source Text: ${text}
Translated Text:` }]
  } else {
    messages = [
      {
        'role': 'user', 'content': `Translate the following source text from ${fromLanguage} to ${toLanguage}, Output translation directly without any additional text.
Source Text: ${text}.  
Translated Text:` }]
  }

  const options: ChatOptions = {
    messages: messages,
    config: { model: model },
    apiKey: `${apikey}-${apisecret}`,
    apiUrl: apiUrl,
    onUpdate: (message: string) => {
      onUpdateMessage(message)
    },
    onFinish: async (message: string) => {
      if (onFinish) {
        onFinish(message)
      }
    },
    onError: (err: Error) => {
      if (onError) { // 检查 onError 是否已定义
        onError(err.message)
      }
    },
    onController: (controller: AbortController) => {
      // console.log("controller", controller)
    }
  }
  bot.chat(options);
}

