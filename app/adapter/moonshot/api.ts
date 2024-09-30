import { ChatOptions, LLMApi, LLMModel, LLMUsage } from '@/app/adapter/interface'
const url = "https://api.moonshot.cn/v1/chat/completions";

export class MoonshotApi implements LLMApi {
  async chat(options: ChatOptions) {
    const apiUrl = options.apiUrl || url;
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
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          // Update the UI with the new content
          if (content) {
            answer += content;
            options.onUpdate(answer);
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
export async function getGptResponse2(options: Options2, callback: Function, completeCallback: CompleteCallback) {
  // console.log(options)
  let apiUrl = "";
  if (options.apiUrl) {
    apiUrl = options.apiUrl;
  } else {
    apiUrl = url;
  }
  const resp = await Promise.race([fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${options.apikey}`
    },
    body: JSON.stringify({
      "stream": true,
      "model": `${options.model}`,
      "messages": options.messages
    })
  }),

  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Response('{"error": true, "msg": "request timeout"}', { status: 504, statusText: "timeout" }));
    }, 10000);
  })

  ]) as Response;

  let answer = "";

  // 判断响应状态码是否失败
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
    callback(answer);
    completeCallback(answer);
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
    // const parsedLines = lines
    //   .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
    //   .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
    //   .map((line) => JSON.parse(line)); // Parse the JSON string

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
      callback(answer);
      completeCallback(answer);
      return;
    }

    for (const parsedLine of parsedLines) {
      const { choices } = parsedLine;
      const { delta } = choices[0];
      const { content } = delta;
      // Update the UI with the new content
      if (content) {
        answer += content;
        // console.log(answer);
        callback(answer);
      }
    }
  }
  completeCallback(answer);
};