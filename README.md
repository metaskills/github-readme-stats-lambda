# Github Readme Stats (Lambda)

Copy of this project (https://github.com/anuraghazra/github-readme-stats) deployable to AWS Lambda. Includes a few enhancements.

- Pin titles link to the repository.
- Pin titles will use the `owner.login` in the link.

## Setup

Only Docker is needed.

```shell
$ ./bin/bootstrap
$ ./bin/setup
$ ./bin/test
```

## Deploy

Make sure you have an AWS account and a GitHub token. Your GitHub username and token may be in your git config. If not, set these variables manually or via the deploy command.

```shell
export GH_USER=$(git config github.user)
export GH_TOKEN=$(git config github.token)
```

If you do not have an S3 bucket for your CloudFormation artifacts, please create one.

```shell
./bin/run aws s3 mb "s3://cloudformation.${GH_USER}"
```

Now you can deploy the AWS Lambda.

```shell
$ GH_USER=$GH_USER \
  GH_TOKEN=$GH_TOKEN \
  CLOUDFORMATION_BUCKET="cloudformation.${GH_USER}" \
  ./bin/deploy
```

You should see your Lambda's invoke URL in the outputs of the deploy command.

```
Outputs
--------------------------------------------------------------------------------
Key                 GithubReadmeStatsInfoInvokeUrl
Description         Lambda Invoke URL
Value               https://as82ksadfsd.execute-api.us-east-1.amazonaws.com/prod/
```

Using this base URL you can leverage all the options of the existing project. For example, `/prod/api/pin/?username=customink&repo=lamby`.

