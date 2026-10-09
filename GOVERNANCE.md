# Cretes Project Governance

**Canonical URL**: [https://cretes.org/GOVERNANCE.md](https://cretes.org/GOVERNANCE.md)  
**Plaintext Mirror**: [https://cretes.org/governance.txt](https://cretes.org/governance.txt)  
**Effective Date**: January 1, 2026  

The Cretes Programming Language Project operates under an open, consensus-driven governance model designed to ensure long-term stability, community participation, and technical excellence.

---

## 1. Guiding Principles

1. **Memory Safety & Performance First**: The foundational invariants of Cretes—zero-overhead memory safety without garbage collection—are non-negotiable.
2. **Stability Without Stagnation**: Backwards compatibility is preserved across stable editions while continuing to evolve through the RFC process.
3. **Open Collaboration**: All design decisions, RFC deliberations, and compiler development occur transparently in public repositories.
4. **Inclusive Community**: We foster a welcoming, professional, and respectful environment governed by our [Code of Conduct](https://cretes.org/CODE_OF_CONDUCT.md).

---

## 2. Team Structure

### 2.1 The Core Team
The Core Team oversees the overall direction, release cadence, cross-team alignment, infrastructure security, and final arbitration for the Cretes ecosystem.
- Sets high-level roadmaps and edition milestones.
- Approves additions or removals of sub-teams.
- Holds final decision-making authority when sub-team consensus cannot be reached.

### 2.2 Sub-Teams
Technical development is distributed across specialized sub-teams:

1. **Language Design Team**:
   - Oversees language syntax, type system semantics, borrow checker rules, and grammar evolution.
   - Stewards the [RFC Process](https://cretes.org/RFCs.md) for proposed language features.
2. **Compiler & Runtime Team**:
   - Maintains the reference compiler implementation, intermediate representations (AST/MIR), LLVM backend, and asynchronous runtime.
   - Monitors compiler performance, memory footprint, and code generation optimizations.
3. **Library & Ecosystem Team**:
   - Maintains the standard library (`std`, `core`, `alloc`), standard collections, and core ecosystem packages.
   - Oversees API stability guarantees and ergonomics.
4. **Security & Infrastructure Team**:
   - Triage of reported vulnerabilities per [SECURITY.md](https://cretes.org/SECURITY.md).
   - Manages binary distribution pipelines, build provenance, signing keys, and CI/CD automation.

---

## 3. Decision-Making Process

### 3.1 Consensus Seeking
All technical teams operate on a **rough consensus** model. Discussions proceed openly until concerns are addressed or alternatives evaluated.

### 3.2 Final Comment Period (FCP)
When a team reaches agreement on a substantial change or RFC:
1. A team member initiates a **Final Comment Period (FCP)** lasting at least **10 business days**.
2. The disposition (merge, postpone, or close) is broadcast publicly.
3. If no significant new concerns arise during the FCP, the decision is finalized and recorded.

### 3.3 Voting
If an issue cannot reach consensus after extended discussion:
- The sub-team may call for a formal vote. A two-thirds supermajority of active team members is required to pass.
- In deadlocked cases, the matter is escalated to the Core Team for definitive arbitration.

---

## 4. Team Membership & Lifecycle

- **Becoming a Member**: Active contributors who demonstrate sustained technical capability, sound judgment, and adherence to our community values may be nominated for team membership by any existing team member.
- **Stepping Down & Emeritus Status**: Members may step down voluntarily at any time with gratitude and transition to **Emeritus** status, retaining lifetime credit in our project records.

---

## 5. Amendments to this Document
Amendments to this Governance charter require a supermajority vote (75%) of the Core Team following an open 14-day community review period.
