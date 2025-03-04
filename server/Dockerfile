FROM node:22-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 设置 npm 仓库
RUN npm config set registry https://registry.npmmirror.com

# 将 package.json 和 package-lock.json 复制到容器中
COPY ./package*.json ./
RUN chown -R node:node /usr/src/app
# 安装依赖
RUN npm install

# 将所有源代码复制到容器中
COPY ./ .

# 公开 Node.js 服务的端口（3000）
EXPOSE 3000

# 启动后端服务
CMD ["npm", "start"]