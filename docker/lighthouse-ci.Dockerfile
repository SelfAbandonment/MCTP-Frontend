# Jenkinsfile 里「Lighthouse 性能检测」阶段使用的运行镜像。
#
# 官方没有提供开箱即用的 Lighthouse CI 镜像（Docker Hub 上的 kanti/lighthouse-ci
# 是另一个同名旧项目，不含 lhci 命令），因此自建：
#   - node:22-bookworm 提供 npm/npx
#   - Debian 自带 chromium 供 lighthouse 启动无头浏览器
#   - 固定 @lhci/cli 版本，保证 CI 结果可复现
#
# 构建：docker build -t mctp/lighthouse-ci:0.15.1 -f docker/lighthouse-ci.Dockerfile docker/
# 运行：docker run --rm -v "$PWD:$PWD" -w "$PWD" mctp/lighthouse-ci:0.15.1 lhci autorun

FROM node:22-bookworm

ENV CHROME_PATH=/usr/bin/chromium \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        chromium \
        ca-certificates \
        fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @lhci/cli@0.15.1 \
    && lhci --version

WORKDIR /app
