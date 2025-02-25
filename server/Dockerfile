# 使用 Node.js 官方镜像作为基础镜像
FROM node:22-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 将 package.json 和 package-lock.json 复制到容器中
COPY ./server/package*.json ./

# 安装依赖
RUN npm install

# 将所有源代码复制到容器中
COPY ./server .

# 公开 Node.js 服务的端口（3000）
EXPOSE 3000

# 启动后端服务
CMD ["npm", "start"]
