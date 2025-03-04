#!/bin/bash

# 项目名称和仓库 URL
REPO_URL="https://github.com/ilpvc/vcard.git"
PROJECT_DIR="vcard"
cd /opt
# 检查 git 是否存在
if ! command -v git &> /dev/null; then
    echo "git 未安装，正在下载代码压缩包..."

    # 下载代码压缩包
    DOWNLOAD_URL="https://github.com/ilpvc/vcard/archive/refs/heads/main.zip"
    ZIP_FILE="vcard-main.zip"

    # 检查 curl 或 wget 是否存在
    if command -v curl &> /dev/null; then
        curl -L -o "$ZIP_FILE" "$DOWNLOAD_URL"
    elif command -v wget &> /dev/null; then
        wget -O "$ZIP_FILE" "$DOWNLOAD_URL"
    else
        echo "错误：未找到 curl 或 wget，请安装其中之一以下载代码。"
        exit 1
    fi

    # 解压压缩包
    if command -v unzip &> /dev/null; then
        unzip "$ZIP_FILE"
        mv "vcard-main" "$PROJECT_DIR"
        rm "$ZIP_FILE"
    else
        echo "错误：未找到 unzip，请安装 unzip 以解压代码。"
        exit 1
    fi
else
    # 如果项目目录已存在，则拉取最新代码
    if [ -d "$PROJECT_DIR" ]; then
        echo "项目目录已存在，正在拉取最新代码..."
        cd "$PROJECT_DIR" || { echo "错误：无法进入项目目录 $PROJECT_DIR"; exit 1; }
        git pull origin main
        if [ $? -ne 0 ]; then
            echo "警告：拉取代码失败，继续使用现有代码。"
        fi
    else
        echo "git 已安装，正在克隆仓库..."
        git clone "$REPO_URL" "$PROJECT_DIR"
    fi
fi

# 进入项目目录
cd "$PROJECT_DIR" || { echo "错误：无法进入项目目录 $PROJECT_DIR"; exit 1; }

# 检查 docker-compose 是否存在
if ! command -v docker-compose &> /dev/null; then
    echo "错误：未找到 docker-compose，请安装 Docker 和 docker-compose。"
    exit 1
fi

# 启动 Docker 容器
echo "正在启动 Docker 容器..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "Docker 容器已成功启动！"
else
    echo "错误：Docker 容器启动失败。"
    exit 1
fi