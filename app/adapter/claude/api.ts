import { ChatOptions, LLMApi, LLMModel, LLMUsage } from '@/app/adapter/interface'
// const defaultApiUrl = "https://api.gptsapi.net/v1/messages";
const defaultApiUrl = "https://api.anthropic.com/v1/messages";

export class CladueApi implements LLMApi {
  async chat(options: ChatOptions) {
    let apiUrl: string = ''
    if (options.apiUrl !== '') {
      if (options.apiUrl?.endsWith('/v1/messages')) {
        // do nothing
      }
      if (options.apiUrl?.endsWith('/')) {
        apiUrl = options.apiUrl + 'v1/messages';
      } else {
        apiUrl = options.apiUrl + '/v1/messages';
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
          'x-api-key': `${options.apiKey}`
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
          .map((line) => line.replace(/^data:/, "").trim())
          .filter((line) => line !== "")
          .map((line) => {
            try {
              return JSON.parse(line);
            } catch (error) {
              console.error("JSON parse error:", error, "in line:", line);
              return null;
            }
          })
          .filter((line) => line !== null)
        // 处理错误提示
        if (parsedLines[0]?.error) {
          answer = `Error: ${parsedLines[0].msg}`;
          options.onUpdate(answer);
          options.onFinish(answer);
          return;
        }
        for (const parsedLine of parsedLines) {
          // 修改为支持 Claude API 的处理方式
          if (parsedLine.type === "content_block_delta") {
            const { delta } = parsedLine;
            if (delta.type === 'text_delta') {
              const content = delta.text;
              // 更新 UI
              if (content) {
                answer += content;
                options.onUpdate(answer);
              }
            }
          } else if (parsedLine.type === 'message_stop') {
            options.onFinish(answer);
          } else {
            // 其他处理逻辑
          }
        }
      }
      options.onFinish(answer);
    } catch(error) {
      answer = "接口请求失败，请检查网络连接或接口地址、 Token 是否正确";
      options.onUpdate(answer);
      options.onFinish(answer);
    }
  }

  usage(): Promise<LLMUsage> {
    throw new Error('Method not implemented.');
  }

  models(): Promise<LLMModel[]> {
    throw new Error('Method not implemented.');
  }

}