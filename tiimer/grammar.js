// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    function parseValue(binding) {
        if (binding == null) {
            return null;
        } else {
            return parseInt(binding, 10);
        }
    }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "expr$ebnf$1", "symbols": []},
    {"name": "expr$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "expr"]},
    {"name": "expr$ebnf$1", "symbols": ["expr$ebnf$1", "expr$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expr", "symbols": ["time", "expr$ebnf$1"], "postprocess": 
        function(data) {
            console.log("*****************");
            console.log("length: " + data.length);
            let initialTime = data[0];
            console.log("initialTime: " + JSON.stringify(initialTime));
            if (data[1].length > 0) {
                if (data[1].length != 2) {
                    console.log("!@#!#!@##@#!@: " + JSON.stringify(data[1]));
                }
                let value = data[1][0];
                console.log("value: " + JSON.stringify(value));
                console.log("value length: " + value.length);
                // console.log("1: " + JSON.stringify(value[0]));
                let nextElement = value[1][0];
                console.log("nextElement: " + JSON.stringify(nextElement));
                // console.log("2: " + JSON.stringify(value[1]));
                // console.log("2 length: " + value[1].length);
            } else {
                console.log("nothing inside");
            }
            //let value = data[1][0];
            // console.log("y: " + JSON.stringify(data[1][0][1]));
            console.log("*****************");
            return data;
            // return [initialTime, nextElement];
        }
          },
    {"name": "expr$ebnf$2", "symbols": []},
    {"name": "expr$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "expr"]},
    {"name": "expr$ebnf$2", "symbols": ["expr$ebnf$2", "expr$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expr", "symbols": [{"literal":"("}, "expr", {"literal":")"}, {"literal":"x"}, "number", "expr$ebnf$2"]},
    {"name": "time", "symbols": ["time1"]},
    {"name": "time", "symbols": ["time2"]},
    {"name": "time", "symbols": ["time3"]},
    {"name": "time", "symbols": ["time4"]},
    {"name": "time", "symbols": ["time5"]},
    {"name": "time", "symbols": ["time6"]},
    {"name": "time", "symbols": ["time7"]},
    {"name": "time1", "symbols": ["number", {"literal":"h"}, "number", {"literal":"m"}, "number", {"literal":"s"}], "postprocess": 
        function(data) {
            var hourBinding, minuteBinding, secondBinding;
            [hourBinding, minuteBinding, secondBinding] = data;
            //return { hours: parseValue(hourBinding), minutes: parseValue(minuteBinding), seconds: parseValue(secondBinding) };
            return "time";
        }
        },
    {"name": "time2", "symbols": ["number", {"literal":"s"}], "postprocess": 
        function(data) {
            var secondBinding;
            [secondBinding] = data;
            //return { hours: 0, minutes: 0, seconds: parseValue(secondBinding) };
            return "time";
        }
        },
    {"name": "time3", "symbols": ["number", {"literal":"m"}], "postprocess": 
        function(data) {
            var minuteBinding;
            [minuteBinding] = data;
            //return { hours: 0, minutes: parseValue(minuteBinding), seconds: 0 };
            return "time";
        }
        },
    {"name": "time4", "symbols": ["number", {"literal":"h"}], "postprocess": 
        function(data) {
            var hourBinding;
            [hourBinding] = data;
            //return { hours: parseValue(hourBinding), minutes: 0, seconds: 0 };
            return "time";
        }
        },
    {"name": "time5", "symbols": ["number", {"literal":"h"}, "number", {"literal":"m"}], "postprocess": 
        function(data) {
            var hourBinding, minuteBinding;
            [hourBinding, minuteBinding] = data;
            //return { hours: parseValue(hourBinding), minutes: parseValue(minuteBinding), seconds: 0 };
            return "time";
        }
        },
    {"name": "time6", "symbols": ["number", {"literal":"h"}, "number", {"literal":"s"}], "postprocess": 
        function(data) {
            var hourBinding, secondBinding;
            [hourBinding, secondBinding] = data;
            //return { hours: parseValue(hourBinding), minutes: 0, seconds: parseValue(secondBinding) };
            return "time";
        }
        },
    {"name": "time7", "symbols": ["number", {"literal":"m"}, "number", {"literal":"s"}], "postprocess": 
        function(data) {
            var minuteBinding, secondBinding;
            [minuteBinding, secondBinding] = data;
            //return { hours: 0, minutes: parseValue(minuteBinding), seconds: parseValue(secondBinding) };
            return "time";
        }
        },
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
