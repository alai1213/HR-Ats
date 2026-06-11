pipeline {
    agent any

    environment {
        VERSION = "${BUILD_NUMBER}-${sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()}"
        REGISTRY = "your-registry.com/hr-ats"
        K8S_NAMESPACE = "hr-ats"
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
                sh '''
                    mvn -f backend/pom.xml clean package -DskipTests
                '''
            }
            post {
                always {
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    sh """
                        docker build -t ${REGISTRY}/backend:${VERSION} ./backend
                        docker tag ${REGISTRY}/backend:${VERSION} ${REGISTRY}/backend:latest
                    """
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo \\\$DOCKER_PASS | docker login ${REGISTRY} -u \\\$DOCKER_USER --password-stdin
                            docker push ${REGISTRY}/backend:${VERSION}
                            docker push ${REGISTRY}/backend:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to K8s') {
            steps {
                script {
                    sh """
                        sed -i 's|image: .*hr-ats-backend.*|image: ${REGISTRY}/backend:${VERSION}|g' k8s/backend.yaml
                        kubectl apply -f k8s/backend.yaml -n ${K8S_NAMESPACE}
                        kubectl rollout status deployment/backend -n ${K8S_NAMESPACE}
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
