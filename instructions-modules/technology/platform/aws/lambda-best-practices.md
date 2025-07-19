---
name: 'AWS Lambda Best Practices'
description: 'A set of best practices for writing, configuring, and deploying efficient, secure, and cost-effective AWS Lambda functions.'
tags:
  - aws
  - lambda
  - serverless
  - performance
  - cost-optimization
layer: null
---

# AWS Lambda Best Practices

## Primary Directive

You MUST develop and configure AWS Lambda functions to be small, single-purpose, and optimized for performance and cost, following security best practices.

## Process

1.  **Single Responsibility Principle:** Each Lambda function MUST perform a single, well-defined task. Do not create monolithic functions that handle multiple, unrelated events.
2.  **Optimize for Performance:**
    - Initialize heavyweight dependencies (like database connections or SDK clients) outside of the main handler function. This allows them to be reused across invocations in the same execution environment.
    - Configure the memory size appropriately. Memory is correlated with CPU power, so increasing memory can decrease execution time.
3.  **Manage Dependencies:** Package only the necessary dependencies with your function. Avoid including the entire AWS SDK, as it is already available in the Lambda execution environment.
4.  **Implement Secure Permissions:** The Lambda function's IAM execution role MUST adhere to the `Principle of Least Privilege`. Grant it only the specific permissions it needs to interact with other AWS services.
5.  **Handle Errors and Retries:** Implement idempotent logic to safely handle retries for asynchronous invocations. Use a Dead-Letter Queue (DLQ), typically an SQS queue or SNS topic, to capture and analyze failed events.

## Constraints

- Do NOT place secrets or credentials directly in the Lambda function's code. Use AWS Secrets Manager or Parameter Store.
- Do NOT use a single, overly permissive IAM role for all your Lambda functions.
- The function's timeout MUST be configured to be slightly longer than its expected maximum execution time, but not excessively long, to avoid unnecessary costs.
- Do NOT use Lambda for long-running, computationally intensive tasks; use AWS Fargate or EC2 for those workloads.
