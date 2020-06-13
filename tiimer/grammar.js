// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "expr$string$1", "symbols": [{"literal":"1"}, {"literal":"m"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "expr", "symbols": ["expr$string$1"]}
]
  , ParserStart: "expr"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
