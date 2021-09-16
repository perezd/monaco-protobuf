export const ProtobufSyntax = {
  'keywords': [
    'import',   'public',   'weak', 'option',  'message',    'package',
    'service',  'optional', 'rpc',  'returns', 'true',       'false',
    'syntax',   'group',    'map',  'enum',    'oneof',      'stream',
    'repeated', 'required', 'true', 'false',   'extensions', 'reserved',
    'max',      'extend',   'to'
  ],
  'typeKeywords': [
    'double', 'float', 'int32', 'int64', 'uint32', 'uint64', 'sint32',
    'sint64', 'fixed32', 'fixed64', 'sfixed32', 'sfixed64', 'bool', 'string',
    'bytes'
  ],
  'operators': ['=', ':'],
  'symbols': /[\[\]\(\)=><!~?:&|+\-*\/^%]+/,
  'escapes':
      /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  'tokenizer': {
    'root': [
      [
        /[a-z_$][\w$]*/, {
          'cases': {
            '@typeKeywords': 'typeKeyword',
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }
      ],
      [/[A-Z][\w\$]*/, 'type.identifier'], {'include': '@whitespace'},

      // delimiters and operators
      [/[{}()\[\]]/, '@brackets'], [/[<>](?!@symbols)/, '@brackets'],
      [/@symbols/, {'cases': {'@operators': 'operator', '@default': ''}}],
      // @ annotations.
      [
        /@\s*[a-zA-Z_\$][\w\$]*/,
        {'token': 'annotation', 'log': 'annotation token: $0'}
      ],
      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'], [/\d+/, 'number'],
      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],
      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
      [/"/, {'token': 'string.quote', 'bracket': '@open', 'next': '@string'}],
      // characters
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
      [/'/, 'string.invalid']
    ],
    'comment': [
      [/[^\/*]+/, 'comment'], [/\/\*/, 'comment', '@push'],  // nested comment
      [/\\*\//, 'comment', '@pop'], [/[\/*]/, 'comment']
    ],
    'string': [
      [/[^\\"]+/, 'string'], [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, {'token': 'string.quote', 'bracket': '@close', 'next': '@pop'}]
    ],
    'whitespace': [
      [/[ \t\r\n]+/, 'white'], [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment']
    ]
  }
};
