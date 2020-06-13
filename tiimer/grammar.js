// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "expr$ebnf$1", "symbols": []},
    {"name": "expr$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "expr"]},
    {"name": "expr$ebnf$1", "symbols": ["expr$ebnf$1", "expr$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expr", "symbols": ["time", "expr$ebnf$1"]},
    {"name": "expr$ebnf$2", "symbols": []},
    {"name": "expr$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "expr"]},
    {"name": "expr$ebnf$2", "symbols": ["expr$ebnf$2", "expr$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expr", "symbols": [{"literal":"("}, "expr", {"literal":")"}, {"literal":"x"}, "number", "expr$ebnf$2"]},
    {"name": "time$ebnf$1$subexpression$1", "symbols": ["number", {"literal":"h"}]},
    {"name": "time$ebnf$1", "symbols": ["time$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "time$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "time$ebnf$2$subexpression$1", "symbols": ["number", {"literal":"m"}]},
    {"name": "time$ebnf$2", "symbols": ["time$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "time$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "time$ebnf$3$subexpression$1", "symbols": ["number", {"literal":"s"}]},
    {"name": "time$ebnf$3", "symbols": ["time$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "time$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "time", "symbols": ["time$ebnf$1", "time$ebnf$2", "time$ebnf$3"]},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": ["number$ebnf$1"], "postprocess": 
        function(data) {
            return data[0].join("");
        }
        }
]
  , ParserStart: "expr"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
