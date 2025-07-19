---
name: 'AWS IAM Best Practices'
description: 'A set of security best practices for managing users, groups, roles, and permissions in AWS Identity and Access Management (IAM).'
tags:
  - aws
  - iam
  - security
  - authorization
layer: null
---

# AWS IAM Best Practices

## Primary Directive

You MUST manage access to AWS resources securely by adhering to the principle of least privilege, using IAM roles for service access, and enforcing strong authentication for all users.

## Process

1.  **Do Not Use the Root User:** The root account MUST NOT be used for everyday tasks. Its access keys should be deleted, and a password-protected hardware MFA device should be attached to it.
2.  **Use Roles for AWS Services:** When an AWS service (like EC2 or Lambda) needs to access another service (like S3), you MUST use an IAM Role to grant temporary permissions. Do not store IAM user credentials on an EC2 instance.
3.  **Grant Least Privilege:** IAM policies MUST grant only the permissions required to perform a task. Start with a minimum set of permissions and grant additional permissions as necessary. Do not use overly permissive policies with wildcards (`*`).
4.  **Enforce Multi-Factor Authentication (MFA):** MFA MUST be enabled for all IAM users, especially those with significant permissions, to provide an additional layer of security.
5.  **Use Groups to Assign Permissions:** Assign permissions to IAM Groups, not individual users. Manage user permissions by adding or removing them from groups. This simplifies access management.

## Constraints

- Access keys MUST NOT be shared or committed to a code repository.
- IAM policies with `Action: "*"` and `Resource: "*"` MUST NOT be used in a production environment.
- Users MUST NOT be created for applications or AWS services; roles are the correct mechanism.
- Regularly review and remove unused users, roles, and permissions.
