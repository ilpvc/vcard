# 使用 Node.js 镜像来构建前端
FROM node:22-alpine AS build

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY ./package*.json ./

# 安装前端依赖
RUN npm install

# 复制前端源代码
COPY . .

# 构建前端
RUN npm run build

# 使用 nginx 镜像来运行前端
FROM nginx:alpine

# 复制构建后的前端文件到 nginx 目录
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# 复制自定义的 nginx 配置文件
COPY ./nginx.conf /etc/nginx/nginx.conf

# 公开 nginx 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
