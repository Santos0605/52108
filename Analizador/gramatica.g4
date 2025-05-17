grammar gramatica;

options {
  language = JavaScript;
}

// Regla de entrada
programa
  : instrucciones EOF
  ;

// Lista de instrucciones
instrucciones
  : instruccion+
  ;

instruccion
  : bucle
  ;

// Bucle for
bucle
  : FOR LPAREN inicializacion SEMI condicion SEMI actualizacion RPAREN LBRACE sentencia+ RBRACE
  ;

// Inicialización: id = número
inicializacion
  : identificador ASSIGN numero
  ;

// Condición: id <|<=|>|>=|==|!= número
condicion
  : identificador operador_relacional numero
  ;

// Actualización: id ++|--
actualizacion
  : identificador operador_incremento
  ;

// Salidas y terminación dentro del bloque
sentencia
  : salida+
  | terminar
  ;

// printf("cadena");
salida
  : PRINTF LPAREN cadena RPAREN SEMI
  ;

// break;
terminar
  : BREAK SEMI
  ;

// Identificador: letra (letra | dígito)*
identificador
  : ID
  ;

// Número: secuencia de dígitos
numero
  : NUMBER
  ;

// Cadena de caracteres entre comillas
cadena
  : STRING
  ;

// Operadores relacionales
operador_relacional
  : LT
  | LE
  | GT
  | GE
  | EQ
  | NE
  ;

// Operadores de incremento
operador_incremento
  : INC
  | DEC
  ;

// === LEXER ===

// Palabras reservadas
FOR     : 'for';
PRINTF  : 'printf';
BREAK   : 'break';

// Símbolos
LPAREN  : '(';
RPAREN  : ')';
LBRACE  : '{';
RBRACE  : '}';
SEMI    : ';';
ASSIGN  : '=';
INC     : '++';
DEC     : '--';
LT      : '<';
LE      : '<=';
GT      : '>';
GE      : '>=';
EQ      : '==';
NE      : '!=';

// Identificadores y literales
ID
  : [a-zA-Z] [a-zA-Z0-9]*
  ;

NUMBER
  : [0-9]+
  ;

// Cadena de caracteres (sin salto de línea ni comillas internas)
STRING
  : '"' (~["\r\n])* '"'
  ;

// Espacios en blanco y comentarios
WS
  : [ \t\r\n]+ -> skip
  ;

COMMENT
  : '/*' .*? '*/' -> skip
  ;

LINE_COMMENT
  : '//' ~[\r\n]* -> skip
  ;
