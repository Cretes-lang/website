# Cretes Language Specification
**Edition**: 2026  
**Version**: 1.0.0 (Codename: *Aura*)  
**Status**: Stable Reference Specification  
**Canonical URL**: [https://cretes.org/SPECIFICATION.md](https://cretes.org/SPECIFICATION.md)  
**Plaintext Mirror**: [https://cretes.org/spec.txt](https://cretes.org/spec.txt)  
**License**: Apache-2.0  

---

## 1. Introduction and Scope

Cretes is a statically typed, compiled systems programming language engineered for high throughput, memory safety without garbage collection, and deterministic low-latency execution. This specification establishes the authoritative rules governing syntax, lexical analysis, the type system, ownership and lifetime analysis, the concurrency execution model, and ABI compatibility for conforming implementations of the Cretes compiler.

### 1.1 Normative References
- **ISO/IEC 9899:2018 (C17)**: Systems ABI and C foreign function interoperability.
- **LLVM Intermediate Representation (IR) 19.x**: Target code-generation primitives.
- **Unicode Standard Version 15.0+**: Source text encoding and identifier validation.
- **RFC 2119**: Key words for use in RFCs to Indicate Requirement Levels (`MUST`, `SHOULD`, `MAY`).

---

## 2. Lexical Structure

### 2.1 Source Encoding
Conforming Cretes source files (`.cr` or `.cretes`) MUST be encoded in UTF-8. A Byte Order Mark (BOM) is stripped if present at byte offset 0.

### 2.2 Whitespace and Comments
- **Whitespace**: Space (`U+0020`), Horizontal Tab (`U+0009`), Line Feed (`U+000A`), and Carriage Return (`U+000D`) act as token separators and are discarded outside literals.
- **Line Comments**: Begin with `//` and continue to the end of the line.
- **Block Comments**: Delimited by `/*` and `*/`. Block comments MAY be nested arbitrarily.
- **Doc Comments**: Begin with `///` (item documentation) or `//!` (module documentation) and are preserved for documentation AST generation.

### 2.3 Identifiers
An identifier matches the regular expression:
```regex
[a-zA-Z_][a-zA-Z0-9_]*
```
Raw identifiers prefixing a reserved keyword with `r#` (e.g., `r#match`) are permitted to allow interoperation with external libraries.

### 2.4 Reserved Keywords
The following tokens are reserved keywords:
```
as, async, await, break, const, continue, crate, dyn, else, enum,
extern, false, fn, for, if, impl, in, let, loop, match, mod,
mut, pub, ref, return, Self, self, static, struct, trait, true,
type, unsafe, use, where, while
```

---

## 3. Type System

Cretes is strongly, statically typed. All types are evaluated and verified at compile time.

### 3.1 Primitive Types
1. **Integers**:
   - Signed: `i8`, `i16`, `i32`, `i64`, `i128`, `isize` (pointer width)
   - Unsigned: `u8`, `u16`, `u32`, `u64`, `u128`, `usize` (pointer width)
2. **Floating-point**:
   - `f32` (IEEE 754-2008 binary32), `f64` (IEEE 754-2008 binary64)
3. **Boolean**:
   - `bool`: either literal `true` or `false` (occupies 1 byte, values restricted to 0 or 1)
4. **Characters**:
   - `char`: a 32-bit Unicode scalar value.
5. **Strings**:
   - `str`: an unsized slice of valid UTF-8 byte sequences.
   - `&str`: an immutable borrowed string view.
6. **Never Type**:
   - `!`: represents the return type of expressions that cannot return normally (e.g., `panic!()` or non-terminating loops).

### 3.2 Compound and User-Defined Types
- **Tuples**: Ordered heterogeneous sequences, e.g., `(T1, T2, ..., Tn)`. The unit type is `()`.
- **Arrays**: Fixed-length homogeneous buffers, declared as `[T; N]`.
- **Slices**: Dynamically-sized views into contiguous sequences, denoted `[T]`.
- **Structs**: Nominal product types:
  ```cretes
  pub struct Node<T> {
      pub value: T,
      next: Option<Box<Node<T>>>,
  }
  ```
- **Enums (Algebraic Data Types)**: Nominal sum types supporting payload data:
  ```cretes
  pub enum Result<T, E> {
      Ok(T),
      Err(E),
  }
  ```

---

## 4. Ownership, Lifetimes, and Memory Safety

Cretes achieves zero-overhead memory safety without an automated garbage collector through an affine type system and compile-time borrow checker.

### 4.1 Ownership Invariants
1. Each value in memory has exactly one owner binding at any point in execution.
2. When the owner binding goes out of scope, the value's destructor is executed and memory is reclaimed.
3. Assigning or passing an owned value performs a move operation, invalidating the previous binding unless the type implements the `Copy` trait.

### 4.2 Borrowing and References
- References to values are represented as `&T` (shared immutable) or `&mut T` (exclusive mutable).
- **Rule of Exclusive Access**: At any program point, a value MAY have:
  - Any number of shared references (`&T`), OR
  - Exactly one mutable reference (`&mut T`), but never both.
- Non-lexical lifetimes (NLL) determine the live range of references based on the control flow graph rather than syntactic lexical scopes.

---

## 5. Concurrency and Async Runtime

### 5.1 Structured Concurrency
Cretes guarantees data race freedom at compile time via the `Send` and `Sync` marker traits:
- `Send`: Indicates ownership of the type can be safely transferred across thread boundaries.
- `Sync`: Indicates references to the type (`&T`) can be safely shared across concurrent execution contexts.

### 5.2 Async / Await Model
- Functions declared with `async fn` compile into discrete, stackless state machines implementing the `Future<Output = T>` trait.
- Invoking `.await` suspends execution and yields control to the asynchronous executor without blocking the host thread.
- Memory allocation for futures is deterministic and zero-cost when sized at compile time.

---

## 6. ABI and Interoperability

### 6.1 Foreign Function Interface (FFI)
Cretes declares direct interoperability with external C libraries via `extern "C"` blocks:
```cretes
extern "C" {
    fn write(fd: i32, buf: *const u8, count: usize) -> isize;
}
```
All raw pointer dereferencing (`*const T`, `*mut T`) and FFI invocations MUST occur inside an explicit `unsafe { ... }` block.

### 6.2 Target Code Generation
The reference compiler lowers verified Cretes Abstract Syntax Trees (AST) and Mid-level Intermediate Representation (MIR) directly into LLVM IR (version 19.1+), guaranteeing compatibility with standard platform linkers (`lld`, `ld64`, `link.exe`).

---

## 7. Compliance and Conformance

A compiler implementation conforms to the Cretes Language Specification 1.0.0 if and only if:
1. It parses all valid UTF-8 source text conforming to the grammar without spurious errors.
2. It rejects all programs containing ownership or lifetime invariant violations.
3. It complies with the deterministic memory reclamation semantics defined in Section 4.
4. It passes 100% of the canonical test suite published in the official `Cretes-lang/spec` test suite.
