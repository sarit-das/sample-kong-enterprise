# Sample Application - Kong Enterprise on AWS

This repository hosts code samples that you can use to get started for creating Kong Enterprise Platform on EKS using kong-control-plane, kong-data-plane and kong-core AWS CDK Construct. 

Please let us know if you need more samples by opening an issue here and we would priortize it.

## Sample use cases

|Use Case | Sample Code to refer  |
--- | --- |
|Control Plane on Amazon Linux2 and Data Plane on BottleRocket OS | /src/main.ts|

## Useful commands (without using [Projen](https://github.com/projen/projen))

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Useful commands (using [Projen](https://github.com/projen/projen))

 * `yarn install`       Installs the packages in this sample
 * `npx projen -w`      watch for changes and compile
 * `npx projen deploy`  deploy this stack to your default AWS account/region
