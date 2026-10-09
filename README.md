# Cretes Website & Documentation Portal

Official website, documentation, and interactive playground for the **Cretes Programming Language** (`.cretes`) — engineered for high-throughput automation, zero-copy networking, AI/ML tensor preprocessing, and defensive cybersecurity.

![Cretes Logo](assets/logo-transparent.png)

## Overview

This repository hosts the static web application for Cretes, modeled after premier modern programming language portals (Rust, Go, TypeScript, Mojo, Bun). It features:

- **Header Pages Architecture**:
  - [**Overview / Landing (`index.html`)](index.html)**: Hero section, quick install command, interactive code workbench with live Phase 4 lexer and arena AST parser, feature pillars, and language comparison matrix.
  - [**Documentation (`docs.html`)](docs.html)**: Deep dive into Cretes syntax, variables, borrow semantics with explicit lifetimes (`from`), Result error handling, standard library (`std::io`, `std::bytes`, `std::fs`, `std::net`), and frontend diagnostics.
  - [**Interactive Playground (`playground.html`)](playground.html)**: Browser-based code runner simulating `cretes-front` CLI with real-time token stream inspect and AST arena visualization.
  - [**Community & Governance (`community.html`)](community.html)**: RFC evolution stages, open governance model, engineering standards, and policies.
- **Brand & Aesthetics**:
  - Incorporates the official purple Erlenmeyer flask logo in transparent PNG and scalable SVG formats.
  - Rich dark theme (default) and light theme toggle with local storage persistence.
  - Modern typography powered by Plus Jakarta Sans and JetBrains Mono.
  - Fast keyboard search (`Ctrl+K` / `Cmd+K`) indexing documentation, syntax, and RFCs.
  - Zero third-party runtime JavaScript dependencies.

## Running Locally

To preview the website locally:

```sh
# Using npm
npm start

# Or directly with Node.js
node server.cjs
```

The portal will be accessible at: `http://localhost:3333/`

## Project Structure

```text
├── assets/
│   ├── logo.png               # Original Cretes flask logo
│   ├── logo-transparent.png   # Transparent background logo
│   ├── logo.svg               # Vector SVG logo
│   └── favicon.svg            # Browser favicon
├── css/
│   ├── variables.css          # Design tokens & dark/light theme variables
│   ├── main.css               # Core layout, header, hero, workbench & footer
│   ├── components.css         # Search modal, mobile drawer, toasts, callouts
│   └── pages.css              # Subpage layouts for Docs, Playground, Community
├── js/
│   ├── main.js                # Theme switcher, search (Ctrl+K), tabs, clipboard
│   ├── code-samples.js        # Authentic Phase 4 Cretes code samples & highlighter
│   └── playground.js          # Browser lexer and arena AST parser simulator
├── index.html                 # Main landing & hero page
├── docs.html                  # Documentation header page
├── playground.html            # Interactive playground header page
├── community.html             # Community & governance header page
├── server.cjs                 # Lightweight preview HTTP server
└── package.json
```

## Project Policies

- [Contributing](https://github.com/Cretes-lang/.github/blob/main/CONTRIBUTING.md)
- [Governance](https://github.com/Cretes-lang/.github/blob/main/GOVERNANCE.md)
- [Code of Conduct](https://github.com/Cretes-lang/.github/blob/main/CODE_OF_CONDUCT.md)
- [Security reporting](https://github.com/Cretes-lang/.github/blob/main/SECURITY.md)
- [Engineering standards](https://github.com/Cretes-lang/.github/blob/main/ENGINEERING.md)
- [Versioning](https://github.com/Cretes-lang/.github/blob/main/VERSIONING.md)

Initial maintainer: [@krishanth7](https://github.com/krishanth7). License: [Apache-2.0](LICENSE).
