# Cretes Dependency & Security Scanning Specification
**Canonical URL**: [https://cretes.org/SECURITY-SCANNING.md](https://cretes.org/SECURITY-SCANNING.md)  
**Plaintext Mirror**: [https://cretes.org/security-scanning.txt](https://cretes.org/security-scanning.txt)  
**Status**: Active Production Standard  

The Cretes Language Project maintains a multi-layered automated scanning pipeline to detect vulnerabilities, supply-chain contamination, secret leaks, and insecure dependencies before any code reaches production.

---

## 1. Automated Scanning Architecture

```
+-------------------------------------------------------------+
|                      Continuous Integration                 |
+-------------------------------------------------------------+
  |
  +---> [1] GitHub CodeQL SAST Analysis (Weekly + on PR/Push)
  |         * Detects code injection, memory corruption, unsound FFI
  |
  +---> [2] Dependency Review & Vulnerability Auditing
  |         * Blocks PRs introducing High or Critical CVEs
  |
  +---> [3] Gitleaks / Secret Scanning
  |         * Scans entire Git commit history for API keys and certificates
  |
  +---> [4] Dependabot Automated Patching
            * Weekly vulnerability assessment and automated pull requests
```

---

## 2. Scanner Configurations & Tools

| Tool | Focus Area | Schedule / Trigger | Action on Detection |
|:-----|:-----------|:-------------------|:--------------------|
| **GitHub CodeQL** | Semantic SAST, taint tracking | Every push, PR, and weekly Monday cron | Fails CI check, generates Security Advisory alert |
| **Dependency Review** | Transitive and direct dependency CVEs | Every Pull Request touching dependencies | Blocks PR merge if severity >= High |
| **Dependabot** | Automated dependency upgrade PRs | Weekly check | Generates automated PR with changelog |
| **Gitleaks** | Cryptographic secrets, tokens, PGP keys | Every PR and commit push | Immediate build termination and secret revoking |

---

## 3. Reporting and Attestation
- All scanner results are ingested into GitHub Security Center.
- Zero known critical vulnerabilities are permitted in any production release artifact.
- For reporting zero-day vulnerabilities, consult [SECURITY.md](https://cretes.org/SECURITY.md).
