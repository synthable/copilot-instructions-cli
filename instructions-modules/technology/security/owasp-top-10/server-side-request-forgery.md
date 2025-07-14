---
name: 'Server-Side Request Forgery (SSRF)'
description: "A set of rules to prevent Server-Side Request Forgery (SSRF) vulnerabilities by validating all user-supplied URLs and restricting the server's ability to make arbitrary network requests."
tags:
  - security
  - owasp
  - ssrf
---

# Server-Side Request Forgery (SSRF)

## Primary Directive

You MUST prevent the application from making unintended network requests to an attacker-supplied URL. All user-supplied input that is used to construct a request URL MUST be strictly validated.

## Process

1.  **Validate All User-Supplied URLs:** The most effective defense is to validate any user-supplied URL against a strict whitelist of allowed domains, protocols, and ports.
2.  **Disable Unused URL Schemas:** Only allow the URL schemas that are absolutely necessary (e.g., `http`, `https`). Disable all others, such as `file://`, `ftp://`, and `gopher://`.
3.  **Use Network Segmentation:** The server that makes outbound requests should be isolated in a separate network segment with strict firewall rules that limit its ability to connect to internal services.
4.  **Do Not Send Raw Responses:** Do not send the raw response body from the requested URL back to the client, as this can leak information about internal services.

## Constraints

- You MUST NOT trust a URL provided by any user, even an authenticated one.
- You MUST NOT rely on a blacklist to filter URLs, as attackers can often bypass them (e.g., using URL shorteners or DNS trickery). A whitelist is required.
- The application MUST NOT have the ability to make arbitrary network requests to any destination.
