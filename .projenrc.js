const { AwsCdkTypeScriptApp, CdkApprovalLevel } = require('projen');
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.121.0',
  defaultReleaseBranch: 'main',
  name: 'sample-kong-enterprise',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-eks',
    '@aws-cdk/aws-rds',
    '@aws-cdk/aws-route53',
    '@aws-cdk/aws-autoscaling',

  ],
  requireApproval: CdkApprovalLevel.NEVER,

  // cdkDependencies: undefined,        /* Which AWS CDK modules (those that start with "@aws-cdk/") this app uses. */
  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
});
project.synth();