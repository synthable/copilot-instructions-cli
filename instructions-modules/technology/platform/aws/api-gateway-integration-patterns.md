---
name: 'API Gateway Integration Patterns'
description: 'A guide to different integration patterns for API Gateway, such as Lambda Proxy integration, HTTP integration, and AWS service integration.'
tags:
  - aws
  - api-gateway
  - serverless
  - architecture
layer: null
---

# API Gateway Integration Patterns

## Primary Directive

You MUST choose the appropriate API Gateway integration pattern based on the backend service and the desired level of control over the request and response.

## Process

1.  **Use Lambda Proxy Integration (Default for Serverless):**
    - This is the preferred method for integrating with a Lambda function.
    - The entire client request (headers, body, path, etc.) is passed to the Lambda function as a single event object.
    - The Lambda function's return value MUST be an object that defines the HTTP response (statusCode, headers, body).
    - Use this for most serverless APIs as it is simple and flexible.
2.  **Use AWS Service Integration (Direct Service Access):**
    - Use this pattern to expose other AWS services directly through API Gateway without writing any Lambda code. For example, you can create an API endpoint that puts a message directly onto an SQS queue or starts a Step Functions execution.
    - This requires mapping the incoming request to the format required by the target AWS service's API.
3.  **Use HTTP Proxy Integration (Connecting to Existing HTTP Endpoints):**
    - Use this to proxy requests to an existing public HTTP endpoint (e.g., a service running on EC2, ECS, or an external API).
    - API Gateway forwards the entire request and response, allowing you to add features like caching, throttling, and authentication to an existing HTTP API.
4.  **Use VPC Link Integration (Private Backend Services):**
    - When your backend service (e.g., an Application Load Balancer or ECS service) is in a private VPC, you MUST use a VPC Link to securely connect API Gateway to it without exposing it to the public internet.

## Constraints

- Do NOT use the older, non-proxy "Lambda Custom" integration unless you have a specific need to use API Gateway's mapping templates to transform the request or response. Lambda Proxy is simpler and more powerful for most use cases.
- When using AWS Service Integration, the IAM role for API Gateway MUST have the minimum necessary permissions to call the target service's API.
- Sensitive data transformation logic MUST NOT be placed in API Gateway mapping templates; it should be handled in a Lambda function for better security and maintainability.
