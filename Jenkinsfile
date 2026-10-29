pipeline {
    agent any

    tools {
        nodejs 'Nodejs24'
    }

    stages {
        stage('安装依赖') {
            steps {
                sh 'npm ci --no-audit'
            }
        }

        stage('构建项目') {
            steps {
                sh 'npm run build' // 必须先构建生成 dist 目录
            }
        }

        // --- 新增的 Lighthouse 阶段 ---
        stage('Lighthouse 性能检测') {
            // 使用专用的 Lighthouse Docker 镜像
            agent { 
                docker { 
                    image 'kanti/lighthouse-ci' 
                    // 让容器内的当前工作目录与 Jenkins 工作区一致
                    reuseNode true 
                } 
            }
            steps {
                // 运行 lhci autorun 读取 lighthouserc.js
                sh 'lhci autorun'
            }
        }
        // -----------------------------
    }

    post {
        always {
            //HTML Publisher 插件 归档报告
            archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
        }
    }
}