---
name: 'Feature Toggles (Feature Flags)'
description: 'A technique that decouples code deployment from feature release, allowing new functionality to be deployed to production in a disabled state.'
tags:
  - devops
  - release management
  - feature flag
  - methodology
---

# Feature Toggles (Feature Flags)

## Primary Directive

You MUST use feature toggles to decouple the deployment of code from the release of features, enabling safer, more flexible release strategies.

## Process

1.  **Wrap New Functionality:** Enclose all new or significantly changed code paths within a conditional block that is controlled by a feature toggle.
2.  **Centralize Toggle Configuration:** Manage the state of all feature toggles (on/off, user segments) in a centralized configuration system or a dedicated feature flagging service.
3.  **Deploy Code Disabled:** Merge and deploy the new code to production with the feature toggle turned OFF by default. The code is present but inactive.
4.  **Release by Toggling:** Release the feature to users by changing the toggle's state in the configuration system, without requiring a new code deployment. This allows for instant activation or deactivation.
5.  **Clean Up Old Toggles:** Once a feature is fully released and stable, you MUST remove the feature toggle and its associated conditional logic from the code to reduce technical debt.

## Constraints

- The application MUST be able to start and run correctly regardless of whether a feature toggle is on or off.
- Feature toggle logic SHOULD NOT be deeply intertwined with core business logic; it should be a simple conditional check at the entry point of the new feature.
- Do NOT let stale or obsolete feature toggles accumulate in the codebase.
