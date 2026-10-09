/**
 * Cretes Language Frontend Simulator (Phase 4 Syntax)
 * Emulates cretes-front lex and cretes-front parse in browser
 */

(function() {
  function lexCretes(code) {
    const tokens = [];
    let line = 1;
    let col = 1;
    let i = 0;

    const keywords = new Set(['import', 'fn', 'return', 'let', 'var', 'if', 'else', 'for', 'in', 'enum', 'struct', 'from', 'discard', 'mut']);

    while (i < code.length) {
      const ch = code[i];

      if (ch === '\n') {
        line++;
        col = 1;
        i++;
        continue;
      }

      if (/\s/.test(ch)) {
        col++;
        i++;
        continue;
      }

      if (ch === '/' && code[i + 1] === '/') {
        let comment = '';
        while (i < code.length && code[i] !== '\n') {
          comment += code[i++];
        }
        tokens.push({ line, col, type: 'Comment', val: comment });
        continue;
      }

      if (ch === '"') {
        let str = '';
        const startCol = col;
        i++; col++;
        while (i < code.length && code[i] !== '"') {
          if (code[i] === '\\' && i + 1 < code.length) {
            str += code[i++]; col++;
          }
          str += code[i++]; col++;
        }
        if (i < code.length && code[i] === '"') {
          i++; col++;
        }
        tokens.push({ line, col: startCol, type: 'StringLiteral', val: `"${str}"` });
        continue;
      }

      if (/[0-9]/.test(ch)) {
        let num = '';
        const startCol = col;
        while (i < code.length && /[0-9\.]/.test(code[i])) {
          num += code[i++]; col++;
        }
        tokens.push({ line, col: startCol, type: 'NumberLiteral', val: num });
        continue;
      }

      if (/[a-zA-Z_]/.test(ch)) {
        let ident = '';
        const startCol = col;
        while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
          ident += code[i++]; col++;
        }
        if (keywords.has(ident)) {
          tokens.push({ line, col: startCol, type: 'Keyword', val: ident });
        } else {
          tokens.push({ line, col: startCol, type: 'Identifier', val: ident });
        }
        continue;
      }

      // Multi-character symbols
      const two = code.slice(i, i + 2);
      if (two === '::' || two === '->' || two === '!=' || two === '==' || two === '<=' || two === '>=') {
        tokens.push({ line, col, type: 'Operator', val: two });
        i += 2; col += 2;
        continue;
      }

      // Single-character symbols
      tokens.push({ line, col, type: 'Symbol', val: ch });
      i++; col++;
    }

    return tokens;
  }

  function formatLexerOutput(tokens) {
    let out = "== Cretes Lexer (Phase 4 Frontend Token Stream) ==\n\n";
    tokens.forEach(t => {
      out += `[line ${String(t.line).padStart(2, ' ')}:${String(t.col).padStart(2, ' ')}]  Token::${t.type.padEnd(14, ' ')} => ${t.val}\n`;
    });
    out += `\nSuccess: Lexed ${tokens.length} tokens without lexical errors.\nExit Code: 0`;
    return out;
  }

  function mockParseAst(code) {
    const lines = code.trim().split('\n');
    let out = "== Cretes Phase 4 Arena AST Dump (AST Arena Tree) ==\n\n";
    out += "RootProgram {\n";
    out += "  source: \"main.cretes\",\n";
    out += "  arena_capacity: 1024,\n";
    out += "  declarations: [\n";

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('import ')) {
        const mod = line.replace('import ', '').replace(';', '');
        out += `    ImportDecl {\n      module_path: "${mod}"\n    },\n`;
      } else if (line.startsWith('enum ')) {
        const name = line.split(' ')[1];
        out += `    EnumDecl {\n      identifier: "${name}",\n      variants: [Truncated, Unsupported]\n    },\n`;
      } else if (line.startsWith('fn ')) {
        const match = line.match(/fn\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*(?:->\s*([^\{]+))?/);
        if (match) {
          const fnName = match[1];
          const args = match[2] || '';
          const retType = (match[3] || '()').trim();
          out += `    FunctionDecl {\n      name: "${fnName}",\n      parameters: "${args}",\n      return_type: "${retType}",\n      safety: CompileTimeMemoryVerified\n    },\n`;
        }
      }
    });

    out += "  ],\n";
    out += "  diagnostics: [\n";
    out += "    { level: \"Info\", code: \"C001\", message: \"Syntax valid Phase 4 specification candidate\" }\n";
    out += "  ]\n";
    out += "}\n\nSuccess: Parsed AST successfully with arena allocation.\nExit Code: 0";
    return out;
  }

  window.CretesFrontend = {
    lex: lexCretes,
    formatLex: formatLexerOutput,
    parseAst: mockParseAst
  };
})();
