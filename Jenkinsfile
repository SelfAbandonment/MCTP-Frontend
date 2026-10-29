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

        stage('漏洞扫描') {
            steps {
                sh 'npm audit --audit-level=high'
            }
        }

        stage('过期依赖检查') {
            steps {
                sh 'npm outdated || true'
            }
        }
    }
}
