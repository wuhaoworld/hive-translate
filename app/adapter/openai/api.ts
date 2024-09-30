import { ChatOptions, LLMApi, LLMModel, LLMUsage } from '@/app/adapter/interface'
// const defaultApiUrl = "https://api.nextapi.fun/openai/v1/chat/completions";
const defaultApiUrl = "https://api.openai.com/v1/chat/completions";

export class ChatGPTApi implements LLMApi {
  async chat(options: ChatOptions) {
    let apiUrl: string = ''
    if (options.apiUrl !== '') {
      if (options.apiUrl?.endsWith('/v1/chat/completions')) {
        // do nothing
      }
      if (options.apiUrl?.endsWith('/')) {
        apiUrl = options.apiUrl + 'v1/chat/completions';
      } else {
        apiUrl = options.apiUrl + '/v1/chat/completions';
      }
    } else {
      apiUrl = defaultApiUrl;
    }
    let answer = "";
    try {
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${options.apiKey}`
        },
        body: JSON.stringify({
          "stream": true,
          "model": `${options.config.model}`,
          "messages": options.messages,
        })
      });

      if (!resp.ok) {
        try {
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
        } catch {
          answer = "接口响应错误，请检查接口地址和 Token 是否正确";
        }

        // options.onError?.(result);
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
          .map((line) => line.replace(/^data: /, "").trim())
          .filter((line) => line !== "" && line !== "[DONE]")
          .map((line) => {
            try {
              return JSON.parse(line);
            } catch (error) {
              console.error("JSON parse error:", error, "in line:", line);
              return null;
            }
          })
          .filter((line) => line !== null);

        // 处理错误提示
        if (parsedLines[0]?.error) {
          answer = `Error: ${parsedLines[0].msg}`;
          options.onUpdate(answer);
          options.onFinish(answer);
          return;
        }

        for (const parsedLine of parsedLines) {
          if (parsedLine.msg) {
            answer = parsedLine.msg;
            options.onError?.(parsedLine.msg);
            options.onUpdate(answer);
            options.onFinish(answer);
            return;
          }

          // 检查 choices 是否存在且非空
          if (parsedLine.choices && parsedLine.choices.length > 0) {
            const { delta } = parsedLine.choices[0];
            const { content } = delta;
            // 更新 UI
            if (content) {
              answer += content;
              options.onUpdate(answer);
            }
          } else {
            console.warn("没有可用的 choices");
          }
        }
      }
      options.onFinish(answer);
    } catch (error) {
      answer = "接口请求失败，请检查网络连接或接口地址、 Token 是否正确";
      options.onUpdate(answer);
      options.onFinish(answer);
    }
  }

  // async autoGenerateTitle(options: ChatOptions) {

  // }

  usage(): Promise<LLMUsage> {
    throw new Error('Method not implemented.');
  }

  models(): Promise<LLMModel[]> {
    throw new Error('Method not implemented.');
  }

}

interface Options2 {
  apikey: string;
  apiUrl?: string;
  messages: Array<{ role: string, content: string }>;
  model: string;
};

interface CompleteCallback {
  (title: string): void;
}