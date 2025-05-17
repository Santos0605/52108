import antlr4 from 'antlr4';
import fs from 'fs';

// Importa los módulos generados
import gramaticaLexer from './generated/gramaticaLexer.js';
import gramaticaParser from './generated/gramaticaParser.js';
import gramaticaVisitor from './generated/gramaticaVisitor.js';

// 1. Lectura del archivo fuente (input.txt)
const inputFile = 'input.txt';
let input = "";
try {
  input = fs.readFileSync(inputFile, "utf8").trim();
  console.log("Contenido leído de input.txt:\n", input);
} catch (err) {
  console.error(`Error al leer el archivo ${inputFile}:`, err);
  process.exit(1);
}

// Nuevo ErrorListener que acumula errores en vez de ejecutar process.exit()
// para permitir hacer una verificación antes de continuar.
class MyErrorListener extends antlr4.error.ErrorListener {
  constructor(inputText) {
    super();
    if (typeof inputText !== "string" || inputText.trim() === "") {
      throw new Error("El parámetro inputText es inválido. Verifica que el archivo input.txt se esté leyendo correctamente.");
    }
    this.inputLines = inputText.split("\n");
    this.errors = []; // Acumula los errores encontrados
  }

  syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
    const errorMsg = `❌ ERROR en línea ${line}, columna ${column} -> ${msg}`;
    const codeLine = this.inputLines[line - 1] || "No disponible";
    const marker = " ".repeat(column) + "^";
    // Guarda el error en el arreglo
    this.errors.push({ line, column, msg, codeLine, marker });
  }
}

// Instanciar el error listener con el contenido de input.txt
const errorListener = new MyErrorListener(input);

// Configurar el Lexer con el listener (para errores léxicos)
const inputStream = new antlr4.InputStream(input);
const lexer = new gramaticaLexer(inputStream);
lexer.removeErrorListeners();
lexer.addErrorListener(errorListener);

// Crear el token stream a partir del lexer
const tokens = new antlr4.CommonTokenStream(lexer);

// Configurar el Parser con el listener (para errores sintácticos)
// Se ha removido BailErrorStrategy para que se acumulen los errores y podamos detectar
// en forma condicional si hubo algún fallo.
const parser = new gramaticaParser(tokens);
parser.removeErrorListeners();
parser.addErrorListener(errorListener);

// 2. Realizar el análisis sintáctico (utilizando la regla inicial 'programa')
let tree = parser.programa();

// Verificar, antes de continuar, si se capturaron errores en lexing o parsing
if (errorListener.errors.length > 0) {
  errorListener.errors.forEach(error => {
    console.error(`❌ ERROR en línea ${error.line}, columna ${error.column} -> ${error.msg}`);
    console.error(`➡ Código fuente en línea ${error.line}:`);
    console.error(error.codeLine);
    console.error(error.marker);
  });
  console.error("Terminando ejecución del programa.");
  process.exit(1);
}

console.log("Análisis léxico y sintáctico completado: ENTRADA CORRECTA.");
// 2. Generación de la tabla de tokens y lexemas (Formato ASCII)
console.log("\n*** Tabla de Tokens y Lexemas (Formato ASCII) ***");

// Creamos un nuevo InputStream y Lexer para generar la tabla (asociamos el listener también)
const inputStreamForTable = new antlr4.InputStream(input);
const lexerForTable = new gramaticaLexer(inputStreamForTable);
lexerForTable.removeErrorListeners();
lexerForTable.addErrorListener(errorListener);

const tokensList = [];
let tok = lexerForTable.nextToken();
while (tok.type !== antlr4.Token.EOF) {
  tokensList.push(tok);
  tok = lexerForTable.nextToken();
}

if (tokensList.length === 0) {
  console.error("No se han detectado tokens en la entrada.");
} else {
  // Construimos un arreglo con dos columnas: "Lexema" y "Token"
  const tokensTableArray = [];
  tokensList.forEach(token => {
    let tokenName = "";
    if (token.type < gramaticaLexer.literalNames.length &&
        gramaticaLexer.literalNames[token.type] !== null) {
      tokenName = gramaticaLexer.literalNames[token.type];
    } else if (gramaticaLexer.symbolicNames[token.type]) {
      tokenName = gramaticaLexer.symbolicNames[token.type];
    } else {
      tokenName = token.type.toString();
    }
    tokensTableArray.push({
      "Lexema": token.text,
      "Token": tokenName
    });
  });

  // Función para imprimir la tabla en formato ASCII
  function printAsciiTable(data, headers) {
    const colWidths = headers.map(header => {
      const contentWidths = data.map(row => (row[header] ? row[header].toString().length : 0));
      return Math.max(header.length, ...contentWidths);
    });

    function horizontalSeparator() {
      let sep = '+';
      colWidths.forEach(width => {
        sep += '-'.repeat(width + 2) + '+';
      });
      return sep;
    }
    
    const sep = horizontalSeparator();
    console.log(sep);
    
    let headerRow = '|';
    headers.forEach((header, i) => {
      headerRow += ' ' + header.padEnd(colWidths[i]) + ' |';
    });
    console.log(headerRow);
    console.log(sep);
    
    data.forEach(row => {
      let rowData = '|';
      headers.forEach((header, i) => {
        const cellText = row[header] ? row[header].toString() : '';
        rowData += ' ' + cellText.padEnd(colWidths[i]) + ' |';
      });
      console.log(rowData);
    });
    console.log(sep);
  }
  
  printAsciiTable(tokensTableArray, ["Lexema", "Token"]);
}

// 3. Impresión del árbol de derivación en formato texto
console.log("\n*** Árbol de Derivación Sintáctico ***");
console.log(tree.toStringTree(parser.ruleNames));

// 4. Traducción del código fuente a JavaScript y su ejecución
class MyVisitor extends gramaticaVisitor {
  visitPrograma(ctx) {
    return this.visit(ctx.instrucciones());
  }
  
  visitInstrucciones(ctx) {
    let code = "";
    ctx.instruccion().forEach(instr => {
      code += this.visit(instr) + "\n";
    });
    return code;
  }
  
  visitInstruccion(ctx) {
    if (ctx.bucle()) return this.visit(ctx.bucle());
    return "";
  }
  
  visitBucle(ctx) {
    const init = this.visit(ctx.inicializacion());
    const cond = this.visit(ctx.condicion());
    const update = this.visit(ctx.actualizacion());
    
    let body = "";
    ctx.sentencia().forEach(sent => {
      body += this.visit(sent) + "\n";
    });
    
    return `for(${init}; ${cond}; ${update}) {\n${body}}`;
  }
  
  visitInicializacion(ctx) {
    const id = this.visit(ctx.identificador());
    const num = this.visit(ctx.numero());
    return `let ${id} = ${num}`;
  }
  
  visitCondicion(ctx) {
    const id = this.visit(ctx.identificador());
    const op = this.visit(ctx.operador_relacional());
    const num = this.visit(ctx.numero());
    return `${id} ${op} ${num}`;
  }
  
  visitActualizacion(ctx) {
    const id = this.visit(ctx.identificador());
    const op = this.visit(ctx.operador_incremento());
    return `${id}${op}`;
  }
  
  visitSentencia(ctx) {
    if (ctx.terminar()) return this.visit(ctx.terminar());
    if (ctx.salida()) {
      if (Array.isArray(ctx.salida())) {
        return ctx.salida().map(s => this.visit(s)).join("\n");
      } else {
        return this.visit(ctx.salida());
      }
    }
    return "";
  }
  
  visitSalida(ctx) {
    const str = this.visit(ctx.cadena());
    return `console.log(${str});`;
  }
  
  visitTerminar(ctx) {
    return `break;`;
  }
  
  visitIdentificador(ctx) {
    return ctx.getText();
  }
  
  visitNumero(ctx) {
    return ctx.getText();
  }
  
  visitCadena(ctx) {
    return ctx.getText();
  }
  
  visitOperador_relacional(ctx) {
    return ctx.getText();
  }
  
  visitOperador_incremento(ctx) {
    return ctx.getText();
  }
}

const translator = new MyVisitor();
const translatedCode = translator.visit(tree);

console.log("\n*** Código JavaScript Traducido ***");
console.log(translatedCode);

console.log("\n*** Ejecución del Código Traducido ***");
try {
  eval(translatedCode);
} catch (error) {
  console.error("Error durante la ejecución del código traducido:", error);
}
