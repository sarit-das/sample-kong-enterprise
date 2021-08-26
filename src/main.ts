import { InstanceClass, InstanceSize, InstanceType, IVpc } from '@aws-cdk/aws-ec2';
import { EndpointAccess, KubernetesVersion, MachineImageType } from '@aws-cdk/aws-eks';
import * as eks from '@aws-cdk/aws-eks';
import { PostgresEngineVersion } from '@aws-cdk/aws-rds';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as KongCP from '../../kong-control-plane/src/eks-index';
import * as KongDP from '../../kong-data-plane/src/eks-index';

export class KongCpEks extends Stack {

  public readonly control_plane: eks.Cluster;
  public readonly cluster_dns: String;
  public readonly telemetry_dns: String;
  public readonly private_ca_arn : string;

  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const kong_control_plane = new KongCP.KongEks(this, 'KongEksCp', {
      controlPlaneClusterProps: {
        clusterName: 'kong-cp',
        version: KubernetesVersion.V1_20,
        defaultCapacity: 0,
        endpointAccess: EndpointAccess.PUBLIC_AND_PRIVATE,
      },
      controlPlaneNodeProps: {
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
        machineImageType: MachineImageType.AMAZON_LINUX_2,
        minCapacity: 2,
      },
      rdsProps: {
        postgresversion: PostgresEngineVersion.VER_12_7,
        databasename: 'kongdb',
        username: 'kongadmin',
      },
    });

    this.telemetry_dns = kong_control_plane.telemetry_dns;
    this.cluster_dns = kong_control_plane.cluster_dns;
    this.control_plane = kong_control_plane.control_plane;
    this.private_ca_arn = kong_control_plane.private_ca_arn;
    // define resources here...
  }
}


interface KongDpEksStackProps extends StackProps {
  vpc: IVpc;
  cluster_dns: String;
  telemetry_dns: String;
  private_ca_arn: string;

}
export class KongDpEks extends Stack {
  constructor(scope: Construct, id: string, props: KongDpEksStackProps) {
    super(scope, id, props);

    new KongDP.KongEks(this, 'KongEksDp', {
      dataPlaneClusterProps: {
        clusterName: 'kong-dp',
        version: KubernetesVersion.V1_20,
        defaultCapacity: 0,
        endpointAccess: EndpointAccess.PUBLIC_AND_PRIVATE,
        vpc: props.vpc,
      },
      dataPlaneNodeProps: {
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
        machineImageType: MachineImageType.AMAZON_LINUX_2,
        minCapacity: 2,
      },
      cluster_dns: props.cluster_dns,
      telemetry_dns: props.telemetry_dns,
      private_ca_arn: props.private_ca_arn,
    });

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-west-2',
  // process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const kong_control_plane = new KongCpEks(app, 'kong-cp', { env: devEnv });
new KongDpEks(app, 'kong-dp', {
  env: devEnv,
  cluster_dns: kong_control_plane.cluster_dns,
  vpc: kong_control_plane.control_plane.vpc,
  telemetry_dns: kong_control_plane.telemetry_dns,
  private_ca_arn: kong_control_plane.private_ca_arn,
});
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();