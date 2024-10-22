export type StackConfig = {
  disableStack?: boolean; // If this is true, the stack will not be created
  aws: {
    accountId: string;
    region: string;
  };
  dns: {
    rootDomain: string; // Root domain for the hosted zone
    certificateArn?: string; // Certificate ARN for the domain, if not provided, the stack will create a new certificate eg: "arn:aws:acm:us-west-1:2323232:certificate/xxx"
    enableHostedZone: boolean; // If this is true, the stack will create a new hosted zone if not provided and manage certificates
    enableNameSpace?: boolean; // If this is true, the stack will create a new namespace in the service discovery, this is required only if you are hosting additional Datafi services which interacts each other.
    hostedZoneId: string; // If useHostedZone is true and you want to use an existing hosted zone, provide the ARN here
  };
  loadBalancer?: {
    timeout?: number; // Load balancer idle connection timeout in seconds, default is 180
  };
  edgeServers: {
    longRunning: EdgeServerConfig[]; // Long running edge server configurations
    serverless: never[]; // Serverless edge server configurations
  };
  allowDeleteResources: boolean; // If this is true, the stack will delete the data resources when the stack is deleted (eg: data uploaded to S3 though the edge server)
};

export type EdgeServerConfig = {
  name: string;
  s3Enabled: boolean;
  s3BucketSuffix?: string; // s3BucketSuffix - can be used if you get the error that says bucket name already exists
  esContainerTag?: string; // Container tag for the edge server , default is latest
  memory: number;
  cpu: number;
  desiredCount?: number; // Number of instance of the same container you want to run in parallel , default is 1
  priority?: number; // used to set the priority of the listener rules when multiple edge servers are present
  envVars: {
    MEMORY?: string; // default is 2048
    LOG_LEVEL: string; // default is INFO
    TIMEOUT?: string; // default is 60 for long running and 28 for serverless
    CACHE_LIFE?: string; // cache life in seconds, default is 0
    KEY: string;
  };
  updateApiSecret: string; // This API secret should be added to datafi webhook to update the edge server on a new release
};