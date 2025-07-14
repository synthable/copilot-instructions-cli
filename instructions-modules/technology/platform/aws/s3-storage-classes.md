---
name: 'AWS S3 Storage Classes'
description: 'A decision-making guide for selecting the appropriate Amazon S3 storage class based on access frequency and cost considerations.'
tags:
  - aws
  - s3
  - storage
  - performance
  - cost-optimization
---

# AWS S3 Storage Classes

## Primary Directive

You MUST select the most cost-effective S3 storage class for an object based on its access patterns, retrieval frequency, and data retention requirements.

## Process

1.  **Analyze Access Patterns:** Determine how frequently the data will be accessed.
    - **Frequent Access:** Data accessed multiple times a month.
    - **Infrequent Access:** Data accessed once every month or two.
    - **Archival Access:** Data rarely, if ever, accessed but must be retained.
2.  **Choose the Appropriate Storage Class:**
    - **S3 Standard:** Use for frequently accessed data that requires low latency and high throughput (e.g., website assets, active database backups). This is the default.
    - **S3 Standard-Infrequent Access (S3 Standard-IA):** Use for data that is accessed less frequently but requires rapid access when needed (e.g., long-term backups, disaster recovery files).
    - **S3 Glacier Instant Retrieval:** Use for long-lived archive data that is rarely accessed but requires millisecond retrieval times.
    - **S3 Glacier Flexible Retrieval:** Use for long-term archives with retrieval times from minutes to hours. A good balance of cost and retrieval time for archives.
    - **S3 Glacier Deep Archive:** Use for long-term data archiving that is accessed once or twice a year. This is the lowest-cost storage option, with retrieval times of 12 hours or more.
3.  **Implement Lifecycle Policies:** For data with predictable access patterns, you MUST create S3 Lifecycle policies to automatically transition objects to more cost-effective storage classes as they age (e.g., move data from S3 Standard to S3-IA after 30 days, then to Glacier Deep Archive after 180 days).

## Constraints

- Do NOT use S3 Standard for data that is rarely accessed, as this incurs unnecessary cost.
- Do NOT use Glacier Deep Archive for data that might need to be retrieved quickly.
- The cost of retrieval MUST be considered. Infrequent Access and Glacier classes have a per-GB retrieval fee, which can be costly if used for frequently accessed data.
- Lifecycle policies MUST be tested to ensure they are transitioning objects as expected.
