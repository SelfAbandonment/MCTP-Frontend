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
        // 显式 checkout，便于先清理 PR 工作区并加一次重试
        skipDefaultCheckout()
    }

    parameters {
        booleanParam(name: 'SKIP_LIGHTHOUSE', defaultValue: false, description: '跳过 Lighthouse 性能与无障碍检测')
        booleanParam(name: 'FORCE_LIGHTHOUSE', defaultValue: false, description: '在非 develop/main 构建（含 PR）中强制运行 Lighthouse')
    }

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('checkout') {
            steps {
                script {
                    // PR 工作区先清空，避免旧工作区导致的空目录/脏文件问题
                    if (env.CHANGE_ID) {
                        deleteDir()
                    }
                }
                retry(2) {
                    checkout scm
                }
            }
        }

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
                            rm -f coverage.txt
                            node --test --experimental-test-coverage > coverage.txt 2>&1 || true
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
            // develop/main 与 PR 都跑；PR 结果会回写评论，SKIP_LIGHTHOUSE 可跳过。
            when {
                allOf {
                    expression { !params.SKIP_LIGHTHOUSE }
                    anyOf {
                        branch 'develop'
                        branch 'main'
                        changeRequest()
                        expression { params.FORCE_LIGHTHOUSE }
                    }
                }
            }
            steps {
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
            junit allowEmptyResults: true, testResults: 'junit.xml'
            // 只归档入口与静态资源，避免每个分支任务囤积十几 MB 的视频产物
            archiveArtifacts artifacts: 'dist/index.html,dist/assets/**', allowEmptyArchive: true
            // Lighthouse 的 JSON/HTML 报告，便于回溯评分明细
            archiveArtifacts artifacts: '.lighthouseci/**', allowEmptyArchive: true
            // Node 原生覆盖率报告，先只留档不设阈值
            archiveArtifacts artifacts: 'coverage.txt', allowEmptyArchive: true
            script {
                // 汇总构建描述，并在 PR 上回写一条 CI 评论（Lighthouse/测试/覆盖率）
                def summary = sh(
                    script: 'node scripts/lighthouse-summary.mjs 2>/dev/null || true',
                    returnStdout: true
                ).trim()
                if (summary) {
                    currentBuild.description = summary
                    echo summary
                }
                if (env.CHANGE_ID) {
                    withCredentials([usernamePassword(credentialsId: 'github-MCTP', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
                        withEnv([
                            "LH_SUMMARY=${summary}",
                            "PR_NUMBER=${env.CHANGE_ID}",
                            "GH_REPO=SelfAbandonment/MCTP-Frontend"
                        ]) {
                            sh 'node scripts/pr-comment.mjs'
                        }
                    }
                }
            }
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
