/**
 * Cretes Programming Language - Authentic Code Samples
 * Sourced from Cretes Phase 4 Syntax Specifications & Examples
 */

const CRETES_SAMPLES = {
  hello: {
    title: "01-hello-world.cretes",
    description: "Standard entry point with Result error handling and std::io",
    code: `import std::io;

fn main() -> Result[i32, io::Error] {
    io::println("Hello, Cretes!")?;
    return Result::Ok(0);
}`
  },
  packet: {
    title: "12-packet-validation.cretes",
    description: "Defensive zero-copy network packet parsing with borrow semantics",
    code: `import std::bytes;

enum PacketError { 
    Truncated, 
    Unsupported, 
}

fn version(packet: &Bytes) -> Result[u8, PacketError] {
    if bytes::len(packet) < 1 {
        return Result::Err(PacketError::Truncated());
    }
    let value: u8 = (*packet)[0];
    if value != 1 {
        return Result::Err(PacketError::Unsupported());
    }
    return Result::Ok(value);
}`
  },
  borrowing: {
    title: "10-borrowing.cretes",
    description: "Compile-time memory safety, mutable references and explicit lifetimes",
    code: `fn first(values: &Seq[i64]) -> &i64 from values {
    return &(*values)[0];
}

fn increment(value: &mut i64) -> () {
    *value = *value + 1;
}

fn main() -> i32 {
    var count: i64 = 0;
    increment(&mut count);
    let values: Seq[i64] = [count];
    let view = first(&values);
    discard(*view, "Inspect borrowed value before exit");
    return 0;
}`
  },
  numeric: {
    title: "13-numeric-preprocessing.cretes",
    description: "High-performance numeric iterations for AI & ML tensor preprocessing",
    code: `fn sum(values: &Seq[f64]) -> f64 {
    var total: f64 = 0.0;
    for value in values {
        total = total + *value;
    }
    return total;
}

fn normalize(values: &mut Seq[f64], factor: f64) -> () {
    for val in values {
        *val = *val / factor;
    }
}`
  },
  automation: {
    title: "11-automation.cretes",
    description: "Systems file automation with safe streaming I/O",
    code: `import std::fs;

fn main() -> Result[i32, fs::Error] {
    let data = fs::read_bytes("input.bin")?;
    fs::write_bytes("output.bin", &data)?;
    return Result::Ok(0);
}`
  }
};

/**
 * Syntax highlighter for Cretes source code
 */
function highlightCretes(code) {
  const lines = code.split('\n');
  return lines.map((line, idx) => {
    let highlighted = escapeHtml(line);

    // Comments
    highlighted = highlighted.replace(/(\/\/.*)$/g, '<span class="cmt">$1</span>');

    // Strings
    highlighted = highlighted.replace(/(&quot;.*?&quot;|".*?")/g, '<span class="str">$1</span>');

    // Numbers
    highlighted = highlighted.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="num">$1</span>');

    // Keywords
    const keywords = ['import', 'fn', 'return', 'let', 'var', 'if', 'else', 'for', 'in', 'enum', 'struct', 'from', 'discard', 'mut', 'pub'];
    keywords.forEach(kw => {
      const reg = new RegExp(`\\b(${kw})\\b`, 'g');
      highlighted = highlighted.replace(reg, '<span class="kwd">$1</span>');
    });

    // Primitive Types & Results
    const types = ['Result', 'Ok', 'Err', 'Seq', 'Bytes', 'i32', 'i64', 'u8', 'u16', 'u32', 'u64', 'f32', 'f64', 'bool', 'String'];
    types.forEach(t => {
      const reg = new RegExp(`\\b(${t})\\b`, 'g');
      highlighted = highlighted.replace(reg, '<span class="typ">$1</span>');
    });

    // Function calls / definitions
    highlighted = highlighted.replace(/fn\s+([a-zA-Z0-9_]+)/g, 'fn <span class="fn">$1</span>');
    highlighted = highlighted.replace(/\b([a-zA-Z0-9_]+)\(/g, '<span class="fn">$1</span>(');

    // Namespaces (e.g. std::io)
    highlighted = highlighted.replace(/([a-zA-Z0-9_]+)::/g, '<span class="typ">$1</span>::');

    return `<div class="code-line"><span class="line-no">${idx + 1}</span><span class="line-code">${highlighted}</span></div>`;
  }).join('');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

window.CRETES_SAMPLES = CRETES_SAMPLES;
window.highlightCretes = highlightCretes;
window.escapeHtml = escapeHtml;
