# Contributing to the Cretes Language Project

Thank you for your interest in contributing to the **Cretes Programming Language**! Cretes is an open-source, community-driven language committed to memory safety, high throughput, and developer ergonomics.

Please take a few moments to review these contribution guidelines before submitting code, documentation, or RFC proposals.

---

## 1. Code of Conduct

All contributors and community participants are expected to adhere to our [Code of Conduct](https://cretes.org/CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [conduct@cretes.org](mailto:conduct@cretes.org).

---

## 2. Ways to Contribute

You can contribute in several ways:
- **Core Compiler**: Improve type checking, lifetime borrow checking, MIR optimizations, or LLVM codegen.
- **Standard Library**: Implement and optimize data structures, algorithms, or I/O primitives.
- **Tooling & Language Server**: Enhance the language server protocol (LSP), package manager, or debugger integrations.
- **Documentation & Website**: Fix typos, add documentation guides, tutorials, or improve web performance.
- **Language Design**: Propose improvements via the [Cretes RFC Process](https://cretes.org/RFCs.md).

---

## 3. Development Workflow

### 3.1 Branching Strategy
1. Fork the respective Cretes repository (e.g., `Cretes-lang/cretes` or `Cretes-lang/website`).
2. Create a focused feature branch from the latest `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or for bugfixes:
   git checkout -b fix/issue-description
   ```

### 3.2 Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat: add non-lexical lifetime inference pass`
- `fix: resolve compiler panic when matching uninhabited types`
- `docs: update async runtime specification`
- `test: add regression test for borrow checker sound hole`
- `refactor: simplify token streaming in lexical scanner`

### 3.3 Pull Request Lifecycle
1. Ensure your code passes all linting, formatting, and unit test suites:
   ```bash
   # Run tests
   cargo test --all
   # Format code
   cargo fmt --check
   # Linting
   cargo clippy --all-targets -- -D warnings
   ```
2. Open a Pull Request against the `main` branch with a clear title and description referencing any related issues (e.g., `Closes #123`).
3. Maintainers and automated CI workflows will review your submission. Address review comments promptly.

---

## 4. Submitting Language Changes (RFCs)

Substantial changes to the Cretes language syntax, semantics, type system, standard library surface, or breaking changes **MUST** go through the [Cretes RFC Process](https://cretes.org/RFCs.md) before code implementation will be merged.

For minor bug fixes, compiler performance improvements, internal refactors, and documentation updates, open a standard Pull Request directly.

---

## 5. Security Vulnerabilities

If you believe you have discovered a security or memory-safety vulnerability in the Cretes compiler or standard library, **do not open a public issue**. Follow our coordinated disclosure process in [SECURITY.md](https://cretes.org/SECURITY.md) or email [security@cretes.org](mailto:security@cretes.org).
