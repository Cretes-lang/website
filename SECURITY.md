# Cretes Security Policy
**Canonical URL**: [https://cretes.org/SECURITY.md](https://cretes.org/SECURITY.md)  
**Security Contact**: [security@cretes.org](mailto:security@cretes.org)  
**Advisory Registry**: [GitHub Security Advisories](https://github.com/Cretes-lang/cretes/security/advisories)  
**RFC 9116 Metadata**: [https://cretes.org/.well-known/security.txt](https://cretes.org/.well-known/security.txt)  

The Cretes team prioritizes the security and memory-safety guarantees of the language, compiler toolchain, standard library, and runtime ecosystem. We appreciate the responsible disclosure of any potential vulnerabilities.

---

## 1. Supported Versions

Security updates and patches are provided for active stable releases according to the following schedule:

| Version | Release Date | Support Level | Security Patches |
|:-------:|:------------:|:-------------:|:----------------:|
| **1.0.x** | 2026-10-09 | **Current Stable** | **Supported** (Active) |
| < 1.0.0 | — | Pre-release | End of Life (Unsupported) |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability in the Cretes compiler, standard library, or infrastructure, **please do NOT disclose it publicly in an open GitHub issue or discussion forum.**

### Preferred Reporting Channels:
1. **GitHub Private Security Advisory**:  
   Submit directly via [Cretes Security Advisory Submission](https://github.com/Cretes-lang/cretes/security/advisories/new). This creates an encrypted, private workspace for collaboration between you and the Cretes Security Team.
2. **Encrypted Email**:  
   Email detailed reproduction steps to **`security@cretes.org`**. If sensitive proof-of-concept code is attached, please encrypt using our official security team OpenPGP key (`4F9E 2A7B 81C3 D9E5 0B3F  6A2D 7E4C 9F1B 8A02 5E3C`).

### What to Include:
- A descriptive summary of the vulnerability.
- Minimal reproducible example or Cretes source snippet.
- Target architecture and operating system where the issue manifests.
- Analysis of exploitability (e.g., sound hole in borrow checker, memory unsafety without `unsafe`, buffer overflow in compiler frontend, or denial of service).
- Any proposed remediation or patches.

---

## 3. Vulnerability Response Timeline

Our security team adheres to the following coordinated disclosure SLAs:

- **24 Hours**: Initial acknowledgement of receipt from the triage team.
- **48 Hours**: Triage, severity scoring (CVSS v3.1), and confirmation of reproducibility.
- **7 Days**: Status update with preliminary remediation plan or patch candidate.
- **14–30 Days**: Coordinated release of fixed compiler/library binaries, publication of GitHub Security Advisory (GHSA), and CVE identifier assignment.

---

## 4. Scope

### In Scope:
- The Cretes reference compiler and LLVM backend code generator.
- The standard library (`std`, `core`, `alloc`).
- Language safety guarantees: unexpected memory unsafety occurring purely in safe Cretes code (soundness bugs).
- Official distribution infrastructure (`cretes.org`, binary release artifacts, checksums).

### Out of Scope:
- Memory unsafety intentionally introduced within explicit `unsafe { ... }` blocks where the developer violated safety contracts.
- Distributed Denial of Service (DDoS) against community infrastructure without reproducible software vulnerability.
- Social engineering against project maintainers.

---

## 5. Safe Harbor

Security researchers acting in good faith to test, discover, and disclose vulnerabilities in accordance with this policy are protected under our Safe Harbor commitment:
- We will not initiate or support legal action against researchers for accidental or good-faith violations.
- We will collaborate transparently to understand and resolve the reported issue.
- With your permission, we will publicly credit you in our release notes and Security Hall of Fame.
