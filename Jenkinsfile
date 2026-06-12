pipeline {
    agent any

    environment {
        VERSION = "${BUILD_NUMBER}-${sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()}"
        REGISTRY = "your-registry.com/hr-ats"
        K8S_NAMESPACE = "hr-ats"
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

        stage('Frontend Build') {
            steps {
                sh '''
                    cd frontend
                    npm ci
                    npm run build
                '''
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            mkdir -p ~/.docker
                            AUTH=\$(echo -n "\${DOCKER_USER}:\${DOCKER_PASS}" | base64 | tr -d '\\n')
                            echo "{\\"auths\\":{\\"\${REGISTRY}\\":{\\"auth\\":\\"\${AUTH}\\"}}}" > ~/.docker/config.json

                            echo "Jenkins env NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"
                            buildctl \\
                              --addr tcp://buildkitd.jenkins.svc.cluster.local:1234 \\
                              build \\
                              --frontend dockerfile.v0 \\
                              --local context=frontend \\
                              --local dockerfile=frontend \\
                              --opt build-arg:NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL} \\
                              --import-cache type=registry,ref=\${REGISTRY}/buildcache:frontend \\
                              --export-cache type=registry,ref=\${REGISTRY}/buildcache:frontend,mode=max \\
                              --output type=image,name=\${REGISTRY}/frontend:\${VERSION},push=true

                            buildctl \
                              --addr tcp://buildkitd.jenkins.svc.cluster.local:1234 \\
                              build \\
                              --frontend dockerfile.v0 \\
                              --local context=frontend \\
                              --local dockerfile=frontend \\
                              --opt build-arg:NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL} \\
                              --import-cache type=registry,ref=\${REGISTRY}/buildcache:frontend \\
                              --export-cache type=registry,ref=\${REGISTRY}/buildcache:frontend,mode=max \\
                              --output type=image,name=\${REGISTRY}/frontend:latest,push=true
                        """
                    }
                }
            }
        }

        stage('Deploy to K8s') {
            steps {
                script {
                    sh """
                        sed -i 's|image: .*hr-ats-frontend.*|image: \${REGISTRY}/frontend:\${VERSION}|g' k8s/frontend.yaml
                        kubectl apply -f k8s/frontend.yaml -n \${K8S_NAMESPACE}
                        kubectl rollout status deployment/frontend -n \${K8S_NAMESPACE}
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
