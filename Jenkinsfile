pipeline {
    agent any

    environment {
        IMAGE_NAME = 'leandraannetfernandez/isec6000-assessment2-22865618'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
    }

    options {
        skipDefaultCheckout(true)
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:16'
                    reuseNode true
                    args '-u 1000:1000 -e HOME=/tmp -e npm_config_cache=/tmp/.npm'
                }
            }

            steps {
                sh 'npm ci'
            }
        }

        stage('Unit Test') {
            agent {
                docker {
                    image 'node:16'
                    reuseNode true
                    args '-u 1000:1000 -e HOME=/tmp -e npm_config_cache=/tmp/.npm'
                }
            }

            steps {
                sh '''
                    npm test > test-output.txt 2>&1
                    status=$?
                    cat test-output.txt
                    exit $status
                '''
            }
        }

        stage('Security Scan') {
            agent {
                docker {
                    image 'node:16'
                    reuseNode true
                    args '-u 1000:1000 -e HOME=/tmp -e npm_config_cache=/tmp/.npm'
                }
            }

            steps {
                sh '''
                    npm audit --audit-level=high > npm-audit.txt 2>&1
                    status=$?
                    cat npm-audit.txt
                    exit $status
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t "$IMAGE_NAME:$IMAGE_TAG" \
                      -t "$IMAGE_NAME:latest" .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" | \
                          docker login \
                          -u "$DOCKERHUB_USER" \
                          --password-stdin

                        docker push "$IMAGE_NAME:$IMAGE_TAG"
                        docker push "$IMAGE_NAME:latest"

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts(
                artifacts: 'test-output.txt,npm-audit.txt',
                allowEmptyArchive: true,
                fingerprint: true
            )
        }

        success {
            echo 'Assessment 2 CI/CD pipeline completed successfully.'
        }
    }
}
