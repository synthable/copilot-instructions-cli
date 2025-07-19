---
name: 'Firebase Authentication Best Practices'
description: 'Best practices for implementing and managing user authentication with Firebase Auth.'
tags:
  - firebase
  - authentication
  - security
---

# Firebase Authentication Best Practices

## Primary Directive

You MUST implement Firebase Authentication securely by enabling appropriate sign-in methods, protecting user credentials, and using security rules to control access based on authentication state.

## Process

1.  **Enable Appropriate Providers:** Only enable the sign-in providers (e.g., Google, Email/Password, Apple) that are necessary for your application.
2.  **Use Server-Side Session Cookies for Web:** For traditional websites that need to integrate with Firebase, use session cookies (`firebase-admin.auth().createSessionCookie()`) for server-side authentication and authorization. This is more secure than relying solely on client-side ID tokens.
3.  **Verify ID Tokens on the Server:** When a client sends an ID token to your backend server to authenticate, you MUST verify the token's integrity and signature using the Firebase Admin SDK (`admin.auth().verifyIdToken(idToken)`).
4.  **Implement Email Verification:** For email/password authentication, you MUST require users to verify their email address to ensure they own the account.
5.  **Use Custom Claims for Authorization:** To implement role-based access control, use custom claims. Set custom claims on a user's token via the Admin SDK (e.g., `{admin: true}`). These claims can then be read in your security rules and backend code to grant privileged access.

## Constraints

- Do NOT trust the user's `uid` sent from the client. The authoritative source of the user's identity is the verified ID token (`request.auth.uid` in security rules, or the decoded token on your server).
- Do NOT store sensitive user data in custom claims, as they are readable by the client. Store only authorization-related roles or flags.
- Do NOT disable the "One account per email address" setting unless you have a specific, well-understood reason to allow multiple accounts with the same email.
- The Firebase Admin SDK MUST be initialized with a service account and used only in a trusted server environment, never on the client.
layer: null
