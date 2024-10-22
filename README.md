# Datafi Edge Deployment in AWS

This repository contains an AWS CDK App to self-host the Datafi edge stack in a customer-hosted AWS environment. The edge servers are a crucial component of the Datafi deployment, handling connections to customer data. Once deployed, end users access data through these hosted edge servers, ensuring that data does not flow through Datafi's cloud network.

## Overview

- This is a template repository that should be forked for each deployment.
- After forking, create a private repository for your specific deployment.
- The deployment process involves updating configuration files, setting environment variables, and using AWS CDK to deploy the stack.

## Architecture Overview

The AWS CDK App is designed to create the following key components:

1. **Edge Servers**: One or more edge servers deployed in AWS Fargate.
2. **Application Load Balancer (ALB)**: A shared ALB for all edge servers.
3. **Hosted Zone**: A shared hosted zone for DNS management.
4. **Lambda Functions**: One Lambda function per long-running edge server for version updates.

## Stack Structure

The stack is organized into several key directories and files:

### `/bin`

- `datafi-edge.ts`: The entry point for the CDK app. It creates the main stack and sets up the AWS environment.

### `/lib`

- `index.ts`: Defines the main `DatafiEdgeStack` class, which orchestrates the creation of all resources.
- `/utils`: Contains utility functions for creating various components of the stack.

### `/assets`

- `lambda-code-update-api/`: Contains the code for the Lambda functions used to update edge server versions.
- `lambda-code-update-api-base/`: Base code for the update API Lambda functions.

### Root Directory

- `types.ts`: Defines TypeScript types for the stack configuration.
- `config.example.ts` and `config.ts`: Configuration files for the stack.
- `env.example.sh`: Template for environment variables.

## Steps to Deploy

1. Fork this repository and create a private copy.
2. Clone your newly created repository locally.
3. Ensure Node.js and AWS CDK are installed, then run `npm install` to install dependencies.
4. Update the `config.ts` file with your specific configurations (see Configuration section below).
5. Create an `env.sh` file from the `env.example.sh` template and update it with your secrets.
6. Run `source env.sh` to load the environment variables.
7. If not already done, run `cdk bootstrap` to prepare your AWS environment.
8. Run `cdk deploy` to deploy the stack to your AWS account.

## Configuration

### config.ts

The `config.ts` file contains the main configuration for your Datafi edge deployment. Key sections include:

- AWS account and region settings
- Load balancer configuration
- DNS settings (including domain, certificates, and hosted zone options)
- Edge server configurations (both long-running and serverless)

Refer to the `types.ts` file for detailed descriptions of each configuration option.

### env.sh

Create this file from `env.example.sh`. It should contain sensitive information such as:

- Edge server keys
- Update API secrets

Example:

```bash
export ES1_KEY=your_edge_server_key
export ES1_UPDATE_API_SECRET=your_edge_server_update_api_secret
```

To generate these values:

- For ES1_KEY: `docker run --rm -e ENDPOINT=https://es.datafi-edge.yourdomain.com datafi/es`
- For ES1_UPDATE_API_SECRET: `openssl rand -base64 32`

## Architecture Details

1. **Edge Servers**

   - Deployed as Fargate tasks in an ECS cluster.
   - Configuration defined in `config.ts` under `edgeServers.longRunning`.
   - Each server can have its own memory, CPU, and desired count settings.
   - S3 bucket can be enabled for each server for data storage.

2. **Application Load Balancer**

   - Shared among all edge servers.
   - Configured with a custom timeout (default 3600 seconds).
   - Handles both HTTP and gRPC traffic.

3. **DNS and Hosted Zone**

   - Uses a root domain specified in the configuration.
   - Can create a new hosted zone or use an existing one.
   - Manages SSL certificates for secure communications.

4. **Update API (Lambda)**

   - One Lambda function created for each long-running edge server.
   - Provides an API endpoint to update the version of the edge server.
   - Secured with an API secret.

5. **Networking**

   - Uses a VPC with public and private subnets.
   - Security groups to control access to resources.

6. **Service Discovery**
   - Optional namespace creation for service discovery.
   - Useful when hosting additional Datafi services that interact with each other.

## Security Considerations

- Edge server keys and update API secrets are managed through environment variables.
- SSL certificates are used for secure communications.
- Security groups control access to AWS resources.

## Scalability

- Multiple edge servers can be deployed and managed within the same stack.
- Each edge server can have multiple instances (controlled by `desiredCount`).
- Fargate allows for easy scaling of compute resources.

## Important Notes

- The stack creates AWS resources as defined in the configuration. Ensure you have the necessary AWS permissions.
- Set `allowDeleteResources` in `config.ts` to `true` if you want to allow deletion of data resources (e.g., S3 buckets) when the stack is deleted.
- Carefully manage the `env.sh` file as it contains sensitive information. Do not commit this file to your repository.

## Useful Commands

- `npm run build`: Compile TypeScript to JavaScript
- `npm run watch`: Watch for changes and compile
- `npm run test`: Perform Jest unit tests
- `npx cdk deploy`: Deploy the stack to your default AWS account/region
- `npx cdk diff`: Compare deployed stack with current state
- `npx cdk synth`: Emit the synthesized CloudFormation template

## Support

For any issues or questions regarding deployment, please contact Datafi support or refer to the official documentation.
