/**
 * Cretes Documentation Search Index
 * Contains searchable tokens, descriptions, categories, and target URLs.
 */

window.CRETES_SEARCH_INDEX = [
  // 1. Language Specification
  {
    title: "Language Specification: Scope & Overview",
    section: "Specification",
    url: "/SPECIFICATION.md#1-introduction-and-scope",
    desc: "Cretes language edition 2026, version 1.0.0 (Aura), design invariants, LLVM IR backend, and ISO C17 references.",
    keywords: ["specification", "intro", "architecture", "llvm", "standard", "aura"]
  },
  {
    title: "Lexical Structure & Keywords",
    section: "Specification",
    url: "/SPECIFICATION.md#2-lexical-structure",
    desc: "UTF-8 encoding, token syntax, raw identifiers, comments, and reserved keywords (fn, let, mut, struct, async, await).",
    keywords: ["syntax", "keywords", "lexical", "tokens", "identifiers", "comments"]
  },
  {
    title: "Primitive & Compound Types",
    section: "Specification",
    url: "/SPECIFICATION.md#3-type-system",
    desc: "Fixed-size integers (i8-i128, u8-u128), floats (f32, f64), bool, char, slices, tuples, structs, and enums.",
    keywords: ["types", "primitives", "integers", "floats", "slices", "structs", "enums", "never type"]
  },
  {
    title: "Affine Ownership & Borrow Checker",
    section: "Specification",
    url: "/SPECIFICATION.md#4-ownership-lifetimes-and-memory-safety",
    desc: "Single-owner rule, non-lexical lifetimes (NLL), mutable vs shared reference exclusivity, and deterministic zero-GC cleanup.",
    keywords: ["ownership", "borrowing", "borrow checker", "lifetimes", "memory safety", "move semantics"]
  },
  {
    title: "Structured Concurrency & Async Runtime",
    section: "Specification",
    url: "/SPECIFICATION.md#5-concurrency-and-async-runtime",
    desc: "Zero-cost async/await state machines, Send and Sync thread safety invariants, and cooperative task scheduling.",
    keywords: ["async", "await", "concurrency", "tasks", "send", "sync", "threads"]
  },
  {
    title: "Foreign Function Interface (FFI) & C ABI",
    section: "Specification",
    url: "/SPECIFICATION.md#6-abi-and-interoperability",
    desc: "Direct C ABI compatibility via extern \"C\" blocks, raw pointers (*const T, *mut T), and unsafe scopes.",
    keywords: ["ffi", "c abi", "interop", "unsafe", "pointers", "extern"]
  },
  {
    title: "Plaintext Language Specification Mirror",
    section: "Specification",
    url: "/spec.txt",
    desc: "Raw ASCII/UTF-8 plaintext specification mirror formatted for automated ingestion and command-line viewing.",
    keywords: ["spec.txt", "raw spec", "plaintext", "terminal"]
  },

  // 2. RFC Index
  {
    title: "RFC Process & Catalog",
    section: "RFCs",
    url: "/RFCs.md",
    desc: "Request for Comments process, stages (Draft, Under Review, FCP, Accepted, Stabilized), and template guidelines.",
    keywords: ["rfcs", "rfc index", "proposals", "evolution", "process", "fcp"]
  },
  {
    title: "RFC 0001: RFC Evolution Process",
    section: "RFCs",
    url: "/RFCs.md#active--historical-rfcs",
    desc: "Foundational charter establishing consensus-driven evolution and decision-making for language RFCs.",
    keywords: ["rfc 0001", "governance rfc", "process"]
  },
  {
    title: "RFC 0002: Affine Ownership & Non-Lexical Lifetimes",
    section: "RFCs",
    url: "/RFCs.md#active--historical-rfcs",
    desc: "Specification of compile-time borrow rules and NLL graph analysis in the Cretes MIR.",
    keywords: ["rfc 0002", "ownership", "lifetimes", "nll"]
  },
  {
    title: "RFC 0003: Algebraic Data Types & Exhaustive Match",
    section: "RFCs",
    url: "/RFCs.md#active--historical-rfcs",
    desc: "First-class enums with payload data, pattern destructuring, and compile-time exhaustiveness checking.",
    keywords: ["rfc 0003", "pattern matching", "adt", "enums"]
  },
  {
    title: "RFC 0004: Zero-Cost Async/Await Runtime",
    section: "RFCs",
    url: "/RFCs.md#active--historical-rfcs",
    desc: "Compiler transformation of async fn into zero-allocation stackless generators with cooperative polling.",
    keywords: ["rfc 0004", "async", "await", "runtime", "futures"]
  },
  {
    title: "RFC 0005: Package Registry & Module Resolution",
    section: "RFCs",
    url: "/RFCs.md#active--historical-rfcs",
    desc: "Deterministic dependency resolution, hermetic lockfiles, and package indexing.",
    keywords: ["rfc 0005", "package manager", "modules", "crates"]
  },
  {
    title: "RFC 0006: Direct C ABI Interoperability",
    section: "RFCs",
    url: "/RFCs.md#active--historical-rfcs",
    desc: "Unsafe blocks, foreign library bindings, and platform-standard calling conventions.",
    keywords: ["rfc 0006", "c abi", "ffi", "unsafe"]
  },
  {
    title: "RFC 0007: Trait-Based Generics & Monomorphization",
    section: "RFCs",
    url: "/RFCs.md#active--historical-rfcs",
    desc: "Static dispatch with zero runtime indirection through compiler monomorphization.",
    keywords: ["rfc 0007", "generics", "traits", "monomorphization"]
  },
  {
    title: "RFC 0008: Compile-Time Constant Evaluation (const fn)",
    section: "RFCs",
    url: "/RFCs.md#active--historical-rfcs",
    desc: "Compile-time evaluation of pure functions and deterministic static memory initialization.",
    keywords: ["rfc 0008", "const eval", "const fn", "comptime"]
  },

  // 3. Governance, Security, & Contribution
  {
    title: "Contributing Guidelines",
    section: "Community",
    url: "/CONTRIBUTING.md",
    desc: "Development setup, Conventional Commits, code formatting, running unit tests, and PR submission rules.",
    keywords: ["contributing", "development", "pr", "pull request", "tests", "commit"]
  },
  {
    title: "Community Contribution Paths",
    section: "Community",
    url: "/contribute.txt",
    desc: "Entry points for new contributors: good first issues, compiler, docs, stdlib, tooling, and RFC stewardship.",
    keywords: ["community", "get involved", "contribute", "issues", "entry points"]
  },
  {
    title: "Project Governance & Team Charter",
    section: "Governance",
    url: "/GOVERNANCE.md",
    desc: "Core Team leadership, Language Design Team, Compiler Team, consensus model, and voting guidelines.",
    keywords: ["governance", "teams", "leadership", "core team", "consensus"]
  },
  {
    title: "Security Policy (RFC 9116)",
    section: "Security",
    url: "/SECURITY.md",
    desc: "Vulnerability reporting, response SLAs, CVSS scoring, PGP encryption key, and Safe Harbor provisions.",
    keywords: ["security", "vulnerabilities", "disclosure", "pgp", "cve", "security.txt"]
  },
  {
    title: "Contributor Code of Conduct",
    section: "Community",
    url: "/CODE_OF_CONDUCT.md",
    desc: "Contributor Covenant v2.1 community pledge, standards of behavior, and confidential enforcement.",
    keywords: ["code of conduct", "pledge", "standards", "community", "conduct"]
  },

  // 4. Releases & Machine-Readable Feeds
  {
    title: "Machine-Readable Releases (JSON)",
    section: "Releases",
    url: "/releases.json",
    desc: "JSON metadata listing release 1.0.0 (Aura), LLVM target, download tarballs, and SHA256 checksums.",
    keywords: ["releases", "releases.json", "downloads", "artifacts", "v1.0.0"]
  },
  {
    title: "Release Checksums (SHA256)",
    section: "Releases",
    url: "/CHECKSUMS.txt",
    desc: "Cryptographic SHA256 hashes and verification commands for Linux, macOS, and Windows compiler archives.",
    keywords: ["checksums", "sha256", "verification", "hashes", "integrity"]
  },
  {
    title: "SLSA Provenance Attestation",
    section: "Security",
    url: "/provenance.json",
    desc: "SLSA v1.0 Level 3 supply-chain build provenance attestation verifying compiler reproducibility.",
    keywords: ["provenance", "slsa", "supply chain", "build verification"]
  },
  {
    title: "AI & LLM Ingestion Guide (llms.txt)",
    section: "AI / Docs",
    url: "/llms.txt",
    desc: "Curated plaintext documentation summary for LLM context windows and autonomous assistants.",
    keywords: ["llms.txt", "ai", "llm", "context", "crawler"]
  },
  {
    title: "AI Crawler Policy (ai.txt)",
    section: "AI / Policy",
    url: "/ai.txt",
    desc: "Spawning-standard permissions allowing AI model training, code assistance, and RAG under Apache-2.0.",
    keywords: ["ai.txt", "crawler policy", "spawning", "ai permissions"]
  },
  {
    title: "Terms of Use",
    section: "Legal",
    url: "/terms",
    desc: "Terms governing access to and use of the official Cretes website, documentation, and services.",
    keywords: ["terms", "terms of use", "legal", "acceptable use", "disclaimer", "license"]
  }
];
