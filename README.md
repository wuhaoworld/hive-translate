这是一个基于 Next.js  和 AI 大模型的翻译小工具，特点：

* 同时调用多个大模型返回的翻译结果，方便对比翻译文本的质量
* 完全客户端调用，API Key  信息存储在本地，没有泄露风险
* 当前支持 Open AI、 Claude、 Moonshot、文心一言

线上预览链接：https://hive-translate.vercel.app/

![Screenshot](https://github.com/user-attachments/assets/0a9b69da-09bc-4216-8eae-d9d8c3c341d7)



## 本地运行

### 开发预览
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
打开 [http://localhost:3000](http://localhost:3000) 即可预览。

### 本地运行

```
npm run build
npm run start
```

## 在 Vercel 上部署
点击下面的按钮，即可部署。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wuhaoworld/hive-translate&project-name=hive-translate)
