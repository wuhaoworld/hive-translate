import { ChatOptions, LLMApi, LLMModel, LLMUsage } from '@/app/adapter/interface'
import { login } from './login'

interface AuthInfo {
  expires_in: number;
  expires_at?: number;
  refresh_token: string;
  session_key: string;
  access_token: string;
  scope: string;
  session_secret: string;
}

export class YiyanApi implements LLMApi {
  async chat(options: ChatOptions) {
    let answer = "";
    const access_token = await this.getToken();
    const apiUrl = `${options.apiUrl}?access_token=${access_token}`;

    try {
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "stream": true,
          "model": `${options.config.model}`,
          "messages": options.messages,
        })
      });

      if (resp.status < 200 || resp.status > 299) {
        const result = await resp.json();
        if (result.error) {
          if (result.msg) {
            answer = `Error: ${result.msg}`;
          } else if (result.error.message) {
            answer = `Error: ${result.error.message}`;
          }
        } else {
          answer = "接口响应错误，请检查接口地址和 Token 是否正确";
        }
        options.onUpdate(answer);
        options.onFinish(answer);
        return;
      }

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      while (true) {
        if (reader == null) {
          break;
        }
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
          .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
          .map((line) => JSON.parse(line)); // Parse the JSON string

        if (parsedLines[0]?.error_code) {
          answer = `Error: ${parsedLines[0].error_msg}`;
          options.onUpdate(answer);
          options.onFinish(answer);
          return;
        }

        for (const parsedLine of parsedLines) {
          const { is_end, result } = parsedLine;
          if (result) {
            answer += result;
            options.onUpdate(answer);
          }
          if (is_end) {
            break;
          }
        }
      }
      options.onFinish(answer);
    }
    catch (error) {
      answer = "接口请求失败，请检查网络连接或接口地址、 Token 是否正确";
      options.onUpdate(answer);
      options.onFinish(answer);
    }
  }

  async getToken() {
    const yiyan_authinfo_plain = localStorage.getItem('yiyan_authinfo');
    const currentStamp = Math.floor(new Date().getTime() / 1000);
    if (yiyan_authinfo_plain) {
      const yiyan_authinfo: AuthInfo = JSON.parse(localStorage.getItem('yiyan_authinfo') + '');
      if (yiyan_authinfo.expires_at && currentStamp < yiyan_authinfo.expires_at) {
        return yiyan_authinfo.access_token;
      }
    }
    // 处理重新验证
    const savedApikey = localStorage.getItem('yiyan_api_key');
    const savedSecret = localStorage.getItem('yiyan_api_secret');
    if (savedApikey && savedSecret) {
      const result = await login(savedApikey, savedSecret);
      result.expires_at = currentStamp + result.expires_in;
      localStorage.setItem('yiyan_authinfo', JSON.stringify(result));
      const { access_token } = result;
      return access_token;
    } else {
      throw new Error('error: 请先设置 API Key 和 Secret Key');
    }

  }

  usage(): Promise<LLMUsage> {
    throw new Error('Method not implemented.');
  }

  models(): Promise<LLMModel[]> {
    throw new Error('Method not implemented.');
  }

}