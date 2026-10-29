pipeline {
    agent any

    tools {
        nodejs 'Nodejs24'
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
    }

    stages {
        stage('安装依赖') {
            steps {
                sh 'NODE_ENV=development npm ci --no-audit --no-fund'
            }
        }

        stage('代码检查') {
            parallel {
                stage('ESLint') {
                    steps {
                        sh 'npm run lint:check'
                    }
                }
                stage('单元测试') {
                    steps {
                        sh 'npm test'
                    }
                }
            }
        }

        stage('依赖安全扫描') {
            steps {
                sh 'npm audit --audit-level=high'
            }
        }

        stage('构建项目') {
            steps {
                sh 'NODE_ENV=production npm run build -- --base=/'
            }
        }

        stage('Lighthouse 性能检测') {
            steps {
                // 注意：Docker Hub 上的 kanti/lighthouse-ci 并不是 GoogleChrome/lighthouse-ci
                // （那是 2019 年另一个同名项目，CLI 叫 lighthouse-ci），镜像里没有 lhci 命令。
                // 这里用 docker/lighthouse-ci.Dockerfile 自建镜像（Chromium + @lhci/cli），
                // 首次构建约 1-2 分钟，之后命中层缓存。
                sh '''
                    set -e
                    IMAGE=mctp/lighthouse-ci:0.15.1

                    if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
                        echo "[lighthouse] 构建镜像 $IMAGE"
                        docker build -t "$IMAGE" -f docker/lighthouse-ci.Dockerfile docker/
                    fi

                    # Jenkins 自身跑在容器里时，$WORKSPACE 只存在于该容器的卷里，
                    # 直接 -v 会挂到宿主机上不存在的路径，因此优先用 --volumes-from。
                    CID="$(hostname)"
                    if ! docker inspect "$CID" >/dev/null 2>&1; then
                        CID="$(grep -oE '[0-9a-f]{64}' /proc/self/cgroup 2>/dev/null | head -1 || true)"
                    fi

                    if [ -n "$CID" ] && docker inspect "$CID" >/dev/null 2>&1; then
                        MOUNT_ARGS="--volumes-from $CID"
                    else
                        MOUNT_ARGS="-v $WORKSPACE:$WORKSPACE"
                    fi

                    docker run --rm $MOUNT_ARGS \
                        -e HOME=/tmp \
                        -e CHROME_PATH=/usr/bin/chromium \
                        -w "$WORKSPACE" \
                        "$IMAGE" \
                        lhci autorun --config=./lighthouserc.cjs
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
            // Lighthouse 的 JSON/HTML 报告，便于回溯评分明细
            archiveArtifacts artifacts: '.lighthouseci/**', allowEmptyArchive: true
        }
        unsuccessful {
            echo '构建未成功：请检查「代码检查」「依赖安全扫描」「Lighthouse 性能检测」阶段日志。'
        }
    }
}
