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
            agent {
                docker {
                    image 'kanti/lighthouse-ci'
                    reuseNode true
                }
            }
            steps {
                sh 'lhci autorun --config=./lighthouserc.cjs'
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
