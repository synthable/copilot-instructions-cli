---
name: 'VPC Network Security'
description: 'A guide to securing an AWS Virtual Private Cloud (VPC) using security groups, network ACLs, and public/private subnets.'
tags:
  - aws
  - vpc
  - networking
  - security
---

# VPC Network Security

## Primary Directive

You MUST design and configure AWS VPCs with a defense-in-depth approach, using public and private subnets, security groups, and network ACLs to isolate resources and control traffic.

## Process

1.  **Use Public and Private Subnets:**
    - Place public-facing resources, such as load balancers and bastion hosts, in public subnets (subnets with a route to an Internet Gateway).
    - Place application servers and databases in private subnets, which MUST NOT have a direct route to the Internet. Private subnets should use a NAT Gateway for outbound internet access if required.
2.  **Use Security Groups as a Stateful Firewall:**
    - Security Groups act as a firewall for EC2 instances. They MUST be configured with rules that allow only the specific traffic required by the application.
    - Use the principle of least privilege. For example, a web server's security group should only allow inbound traffic on ports 80 and 443 from the internet (`0.0.0.0/0`). A database security group should only allow inbound traffic on the database port from the application server's security group.
3.  **Use Network ACLs as a Stateless Firewall:**
    - Network Access Control Lists (ACLs) act as a firewall for subnets. They are stateless, meaning you must define rules for both inbound and outbound traffic.
    - Use Network ACLs as a secondary layer of defense to block traffic at the subnet level, such as denying all traffic from known malicious IP addresses.
4.  **Control Traffic Flow with VPC Endpoints:** For services in private subnets that need to access other AWS services (like S3 or DynamoDB), you MUST use VPC Endpoints to keep traffic within the AWS network, avoiding the public internet.

## Constraints

- Databases MUST NOT be placed in a public subnet.
- Security groups MUST NOT have wide-open inbound rules (e.g., allowing all traffic from `0.0.0.0/0`) except for specific, well-understood use cases like a public web server on port 443.
- The default Network ACL allows all traffic. It MUST be modified to provide a layer of defense.
- Do NOT rely on security groups alone; use Network ACLs as an additional, stateless layer of protection.
