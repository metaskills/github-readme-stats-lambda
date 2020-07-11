FROM lambci/lambda:build-nodejs12.x
# Version SAM CLI
RUN pip install awscli && \
    pip uninstall --yes aws-sam-cli && \
    pip install aws-sam-cli==0.53.0
WORKDIR /var/task
