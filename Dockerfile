# 指定基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制项目文件到工作目录
COPY package.json package-lock.json ./
COPY src .

# 安装项目依赖
RUN npm install

# 构建项目生成静态文件
RUN npm run build

# 设置Nginx配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]