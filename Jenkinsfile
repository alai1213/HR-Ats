pipeline {
    agent any

    environment {
        // 版本号：构建号 + Git 短哈希
        VERSION = "${BUILD_NUMBER}-${sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()}"
        // Docker 镜像仓库地址，按需修改
        REGISTRY = "your-registry.com/hr-ats"
        // K8s 部署命名空间
        K8S_NAMESPACE = "hr-ats"
        // 前端 API 地址（构建时注入）
        NEXT_PUBLIC_API_URL = "https://hrats.nova.net.cn/api/v1"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                script {
                    // Java 后端 Maven 编译
                    sh '''
                        mvn -f backend/pom.xml clean package -DskipTests
                    '''
                }
            }
            post {
                always {
                    // 收集测试报告（如有）
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        stage('Frontend Build') {
            steps {
                script {
                    // Node 前端编译
                    sh '''
                        cd frontend
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Docker Build') {
            when {
                anyOf {
                    branch 'main'
                    branch 'backend'
                    branch 'frontend'
                }
            }
            steps {
                script {
                    // 构建后端镜像
                    sh """
                        docker build -t ${REGISTRY}/backend:${VERSION} ./backend
                        docker tag ${REGISTRY}/backend:${VERSION} ${REGISTRY}/backend:latest
                    """

                    // 构建前端镜像（传入 NEXT_PUBLIC_API_URL 构建参数）
                    sh """
                        docker build \
                          --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
                          -t ${REGISTRY}/frontend:${VERSION} ./frontend
                        docker tag ${REGISTRY}/frontend:${VERSION} ${REGISTRY}/frontend:latest
                    """
                }
            }
        }

        stage('Docker Push') {
            when {
                anyOf {
                    branch 'main'
                    branch 'backend'
                    branch 'frontend'
                }
            }
            steps {
                script {
                    // 登录镜像仓库并推送（凭据 ID 需提前在 Jenkins 中配置）
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo \\\$DOCKER_PASS | docker login ${REGISTRY} -u \\\$DOCKER_USER --password-stdin
                            docker push ${REGISTRY}/backend:${VERSION}
                            docker push ${REGISTRY}/backend:latest
                            docker push ${REGISTRY}/frontend:${VERSION}
                            docker push ${REGISTRY}/frontend:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to K8s') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // 更新 K8s 镜像版本并部署
                    sh """
                        sed -i 's|image: .*hr-ats-backend.*|image: ${REGISTRY}/backend:${VERSION}|g' k8s/backend.yaml
                        sed -i 's|image: .*hr-ats-frontend.*|image: ${REGISTRY}/frontend:${VERSION}|g' k8s/frontend.yaml
                        kubectl apply -f k8s/ -n ${K8S_NAMESPACE}
                        kubectl rollout status deployment/backend -n ${K8S_NAMESPACE}
                        kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE}
                    """
                }
            }
        }
    }

    post {
        always {
            // 清理工作空间（可选）
            cleanWs()
        }
        success {
            echo "构建成功：${VERSION}"
        }
        failure {
            echo "构建失败，请检查日志"
        }
    }
}
