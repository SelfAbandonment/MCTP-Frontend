pipeline {
    agent any

    tools {
        nodejs 'Nodejs24'
    }

    options {
        timestamps()
        timeout(time: 25, unit: 'MINUTES')
        disableConcurrentBuilds(abortPrevious: true)
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '3'))
    }

    parameters {
        booleanParam(name: 'SKIP_LIGHTHOUSE', defaultValue: false, description: '跳过 Lighthouse 性能与无障碍检测')
        booleanParam(name: 'FORCE_LIGHTHOUSE', defaultValue: false, description: '在非 develop/main 构建（含 PR）中强制运行 Lighthouse')
    }

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('环境信息') {
            steps {
                sh 'node --version && npm --version'
            }
        }

        stage('安装依赖') {
            steps {
                sh 'npm ci --no-audit --no-fund'
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
                        sh '''
                            set +e
                            npm test -- --test-reporter=junit --test-reporter-destination=junit.xml
                            status=$?
                            if [ -f junit.xml ]; then
                                node scripts/junit-normalize.mjs junit.xml
                            fi
                            exit $status
                        '''
                    }
                }
            }
        }

        // npm audit 已移到 MCTP-FE-Dependency 每周巡检，主流水线只做构建门禁
        stage('构建项目') {
            steps {
                sh 'NODE_ENV=production npm run build -- --base=/'
            }
        }

        stage('Lighthouse 性能检测') {
            // 只在 develop/main 跑；功能分支与 PR 默认跳过（PR 太慢），
            // 需要时用 FORCE_LIGHTHOUSE 参数手动触发。
            when {
                allOf {
                    expression { !params.SKIP_LIGHTHOUSE }
                    anyOf {
                        branch 'develop'
                        branch 'main'
                        expression { params.FORCE_LIGHTHOUSE }
                    }
                }
            }
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
                script {
                    // 把断言摘要写进构建描述，失败/警告不用翻日志就能看到
                    def summary = sh(script: 'node scripts/lighthouse-summary.mjs', returnStdout: true).trim()
                    currentBuild.description = summary
                    echo summary
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'junit.xml'
            // 只归档入口与静态资源，避免每个分支任务囤积十几 MB 的视频产物
            archiveArtifacts artifacts: 'dist/index.html,dist/assets/**', allowEmptyArchive: true
            // Lighthouse 的 JSON/HTML 报告，便于回溯评分明细
            archiveArtifacts artifacts: '.lighthouseci/**', allowEmptyArchive: true
            script {
                // PR 工作区用完即清，避免 node_modules/dist 在 2 个执行器的磁盘上堆积
                // 用 env.CHANGE_ID 判断：changeRequest() 在分支构建里也可能返回真值
                if (env.CHANGE_ID) {
                    cleanWs()
                }
            }
        }
        success {
            script {
                // main 通过后自动触发生产部署（GitHub Pages 只是 main 预览）
                if (env.BRANCH_NAME == 'main') {
                    echo 'main 构建通过，触发生产部署 MCTP-Deploy'
                    build job: 'MCTP-Deploy', wait: false, parameters: [string(name: 'BRANCH', value: 'main')]
                }
            }
        }
        unsuccessful {
            echo '构建未成功：请检查「代码检查」「构建项目」「Lighthouse 性能检测」阶段日志。'
        }
    }
}
