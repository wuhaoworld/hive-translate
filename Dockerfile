# 使用 Node.js 官方镜像作为基础镜像
FROM node:20-slim AS base

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# 复制所有项目文件
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 设置环境变量
ENV NODE_ENV production

# 暴露应用运行的端口
EXPOSE 3000

# 启动 Next.js 应用
CMD ["npm", "start"]
