'use client'
import { ChatOptions } from '@/app/adapter/interface'
import { RequestMessage } from '@/app/adapter/interface'
import { CladueApi } from './api';
export function translate(
  fromLanguage: string,
  toLanguage: string,
  text: string,
  model: string,
  onUpdateMessage: (text: string) => void,
  onFinish?: (text: string) => void,
  onError?: (text?: string) => void,
) {
  const apikey = localStorage.getItem('claude_api_key') || '';
  const apiUrl = localStorage.getItem('claude_proxy_url') || '';
  const bot = new CladueApi();
  let messages: RequestMessage[];
  if (fromLanguage.toLowerCase() === 'auto') {
    messages = [
      { 'role': 'system', 'content': `You are a professional, authentic machine translation engine.` },
      {
        'role': 'user', 'content': `Translate the following source text to ${toLanguage}, Output translation directly without any additional text.
Source Text: ${text}
Translated Text:` }]
  } else {
    messages = [
      { 'role': 'system', 'content': `You are a professional, authentic machine translation engine.` },
      {
        'role': 'user', 'content': `Translate the following source text from ${fromLanguage} to ${toLanguage}, Output translation directly without any additional text.
Source Text: ${text}.  
Translated Text:` }]
  }
  const options: ChatOptions = {
    messages: messages,
    config: { model: model },
    apiKey: apikey,
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
