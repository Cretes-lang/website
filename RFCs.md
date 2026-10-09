# Cretes RFC Index (Request for Comments)
**Repository**: [https://github.com/Cretes-lang/rfcs](https://github.com/Cretes-lang/rfcs)  
**Process Status**: Active  
**Canonical Plaintext**: [https://cretes.org/rfcs.txt](https://cretes.org/rfcs.txt)  
**Machine-Readable JSON**: [https://cretes.org/rfcs.json](https://cretes.org/rfcs.json)  

The Cretes RFC (Request for Comments) process provides a transparent, consensus-driven mechanism for proposing substantial changes to the Cretes programming language, compiler internals, standard library APIs, tooling, and governance.

---

## RFC Lifecycle Stages

1. **Proposed (Draft)**: Author drafts an RFC using the standard template and opens a Pull Request on `Cretes-lang/rfcs`.
2. **Under Review**: Relevant sub-team (Language Design, Compiler, Tools) leads community discussion and technical evaluation.
3. **Final Comment Period (FCP)**: A 10-day period during which the team issues an intent to merge or close with disposition.
4. **Accepted**: RFC is merged into the repository; implementation may proceed behind a feature gate.
5. **Stabilized**: Implementation is completed, thoroughly tested, and made default in a stable compiler release.
6. **Closed / Deferred**: RFC was withdrawn, superseded, or rejected with documented rationale.

---

## Active & Historical RFCs

| RFC # | Title | Category | Status | Date Stabilized / Accepted |
|:-----:|:------|:---------|:------:|:--------------------------:|
| [RFC 0001](https://github.com/Cretes-lang/rfcs/blob/main/text/0001-rfc-process.md) | Cretes RFC and Evolution Governance Process | Governance | **Stabilized** | 2026-01-15 |
| [RFC 0002](https://github.com/Cretes-lang/rfcs/blob/main/text/0002-linear-ownership.md) | Affine Ownership & Non-Lexical Lifetimes | Language Core | **Stabilized** | 2026-03-22 |
| [RFC 0003](https://github.com/Cretes-lang/rfcs/blob/main/text/0003-pattern-matching.md) | First-Class Algebraic Data Types & Exhaustive Match | Language Core | **Stabilized** | 2026-05-10 |
| [RFC 0004](https://github.com/Cretes-lang/rfcs/blob/main/text/0004-async-runtime.md) | Zero-Cost Async/Await & Structured Concurrency | Runtime / Lib | **Stabilized** | 2026-07-04 |
| [RFC 0005](https://github.com/Cretes-lang/rfcs/blob/main/text/0005-package-manager.md) | Package Registry & Deterministic Module Resolution | Tooling | **Stabilized** | 2026-08-18 |
| [RFC 0006](https://github.com/Cretes-lang/rfcs/blob/main/text/0006-c-abi-ffi.md) | Direct C ABI Interoperability & Unsafe Blocks | Language Core | **Stabilized** | 2026-09-01 |
| [RFC 0007](https://github.com/Cretes-lang/rfcs/blob/main/text/0007-trait-generics.md) | Trait-Based Generics with Static Monomorphization | Language Core | **Stabilized** | 2026-09-25 |
| [RFC 0008](https://github.com/Cretes-lang/rfcs/blob/main/text/0008-const-eval.md) | Compile-Time Constant Evaluation Engine (`const fn`) | Compiler | **Accepted** | 2026-10-02 |
| [RFC 0009](https://github.com/Cretes-lang/rfcs/blob/main/text/0009-simd-intrinsics.md) | Portable SIMD Vector Primitives | Standard Lib | **Under Review** | — |

---

## How to Submit an RFC

1. Fork the [Cretes RFC Repository](https://github.com/Cretes-lang/rfcs).
2. Copy `0000-template.md` to `text/0000-my-feature.md`.
3. Fill in all sections: Motivation, Detailed Design, Drawbacks, Rationale and Alternatives, Prior Art, and Unresolved Questions.
4. Submit a Pull Request. Community feedback will begin immediately on GitHub Discussions and in PR comments.
