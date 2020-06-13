"use strict";

// expr :- time["," expr]*
// expr :- "(" expr ")" "x" number["," expr]*

function createParseResult(state, value) {
    let parseResult = {
        state: state,
        value: value,
    };
    return parseResult;
}

function createParseState(tokens, id, pos=0) {
    let parseState = {
        tokens: tokens,
        pos: pos,
        id: id,
        atEnd() {
            return this.pos == this.tokens.length;
        },
        take() {
            if (this.atEnd()) {
                return null;
            }
            let next = createParseState(this.tokens, this.pos + 1)
            let token = this.tokens[this.pos];
            return createParseResult(next, token);
        },
        expect(expectedTag) {
            let result = this.take();
            if (result == null || result.value.tag != expectedTag) {
                return null;
            } else {
                return result;
            }
        },
        peek() {
            if (this.atEnd()) {
                return null;
            } else {
                return this.tokens[this.pos].tag
            }
        }
    };
    return parseState;
}

function TemplateParseError(message, metadata) {
    const error = new Error(message);
    error.metadata = metadata;
    return error;
}

///////////////////////////////////////////////////////

function parseTime(state) {
    let res = state.expect("parseTime");
    if (res == null) {
        return null;
    }
    let value = buildTime(res.value.text);
    return createParseResult(res.state, value);
}
// def parseCall(state):
//   res = state.expect("call")
//   if res is None:
//     return None
//   value = buildCall(res.value.text)
//   return ParseResult(res.state, value)def parseCall(state):
//   res = state.expect("call")
//   if res is None:
//     return None
//   value = buildCall(res.value.text)
//   return ParseResult(res.state, value)

// function parseTime(state) {
//     console.log("parsing time from state: " + JSON.stringify(state));
//     let res = state.expect("parseTime");
//     if (res == null) {
//         return null;
//     }
//     console.log("What is res? " + JSON.stringify(res));
//     let value = buildTime(res.value[1]);
//     return createParseResult(res.state, value);
// }

function buildTime(value) {
    console.log("Building time from: " + value);
    return "TimeNotParsedYet";
}

function parseGroup(state) {
    let res = state.expect("groupOpen");
    if (res == null) {
        return null;
    }
    let text = res.value[1];
    res = parseExpression(res.state);
    if (res == null) {
        throw TemplateParseError("expected body for expression");
    }

}

function parseGroupFollowedByConjunctedExpression(state) {
    return null;
}

function parseTimeFollowedByConjunctedExpression(state) {
    return null;
}

function parseGroupFollowedByRepetition(state) {
    return null;
}

function parseTimeFollowedByRepetition(state) {
    return null;
}

function parseGroupFollowedByConjunctedExpressionAndRepetition(state) {
    return null;
}

function parseTimeFollowedByConjunctedExpressionAndRepetition(state) {
    return null;
}

function parseWholeTemplate(tokens) {
    let state = createParseState(tokens, "top");
    console.log("");
    // let state = new ParseState(tokens);
    let res = parseTemplate(state);
    if (res == null) {
        throw TemplateParseError("could not parse template");
    }
    if (!res.state.atEnd()) {
        throw TemplateParseError("garbage at end of template");
    }
    return res.value;
}

function parseTemplate(state) {
    console.log("parse the template top top: " + JSON.stringify(state));
    let value = null;
    let done = false;
    while (!done) {
        let res = parseSimpleTemplate(state);
        console.log("simple template parse returned: " + JSON.stringify(res));
        if (res == null) {
            // done = true;
            console.log("parsing was successful");
            if (value == null) {
                return null;
            } else {
                return ParseResult(state, value)
            }
        } else {
            console.log("something went wrong!");
            return null;
            // value = buildSequence(value, res.value);
            // state = res.state;
        }
    }
    // if (value == null) {
    //     return null;
    // } else {
    //     return ParseResult(state, value)
    // }
}

function parseSimpleTemplate(state) {
    // expr := "(" expr ")"
    var res;
    res = parseGroup(state);
    if (res != null) {
        console.log("PARSED group");
        return res;
    }

    // expr := time
    console.log("a");
    res = parseTime(state);
    if (res != null) {
        console.log("PARSED time");
        return res;
    }

    // expr := "(" expr ")" "," expr
    res = parseGroupFollowedByConjunctedExpression(state);
    if (res != null) {
        console.log("PARSED group + conjuncted");
        return res;
    }

    // expr := time "," expr
    res = parseTimeFollowedByConjunctedExpression(state);
    if (res != null) {
        console.log("PARSED time + conjuncted");
        return res;
    }

    // expr := "(" expr ")" "x" number
    res = parseGroupFollowedByRepetition(state);
    if (res != null) {
        console.log("PARSED group + repetition");
        return res;
    }

    // expr := time "x" number
    res = parseTimeFollowedByRepetition(state);
    if (res != null) {
        console.log("PARSED time + repetition");
        return res;
    }

    // expr := "(" expr ")" "," expr "x" number
    res = parseGroupFollowedByConjunctedExpressionAndRepetition(state);
    if (res != null) {
        console.log("PARSED group + conjuncted + repetition");
        return res;
    }

    // expr := time "," expr "x" number
    res = parseTimeFollowedByConjunctedExpressionAndRepetition(state);
    if (res != null) {
        console.log("PARSED time + conjuncted + repetition");
        return res;
    }
}

function nearleyParse() {
    const nearley = require("nearley");
    const grammar = require("./grammar.js");

    // Create a Parser object from our grammar.
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    // Parse something!
    parser.feed("1ms30\n");

    // parser.results is an array of possible parsings.
    console.log(parser.results); // [[[[ "foo" ],"\n" ]]]
}

        




//////////////////////////////////////////////////////////////////////////

function checkStartButtonStatus() {
    var exprElement = document.getElementById("expr");
    var content = exprElement.value;
    // let tokens = tokenize(content);
    // var i;

    nearleyParse(content);

    // try {
        // parse(tokens);
    // console.log("tokenz: " + JSON.stringify(tokens));
    //     let returned = parseWholeTemplate(tokens);
    //     console.log("returned value = " + returned);
    //     enableButton();
    // } catch(err) {
    //     console.log("got error: " + err);
    //     disableButton();
    // }
}

function enableButton() {
    button().classList.add("button-primary");
    button().disabled = false;
}

function disableButton() {
    button().classList.remove("button-primary");
    button().disabled = true;
}

function button() {
    return document.getElementById("start_button");
}

function buttonClick() {
    console.log("click!");
}

// function parseGroupOpen(string) {
//     const groupOpenRegex = /^\(/;
//     let m = groupOpenRegex.exec(string);
//     if (m) {
//         return [true, 1];
//     } else {
//         return [null, null];
//     }
// }

// function parseGroupClose(string) {
//     const groupCloseRegex = /^\)/;
//     let m = groupCloseRegex.exec(string);
//     if (m) {
//         return [true, 1];
//     } else {
//         return [null, null];
//     }
// }

// function parseRepetition(string) {
//     const repetitionRegex = /^x(\d+)/;
//     let m = repetitionRegex.exec(string);
//     if (m) {
//         console.log(JSON.stringify(m));
//         return [m[1], m[0].length];
//     } else {
//         return [null, null];
//     }
// }

// function parseSeparator(string) {
//     const separatorRegex = /^,/;
//     let m = separatorRegex.exec(string);
//     if (m) {
//         return [true, 1];
//     } else {
//         return [null, null];
//     }
// }

// function parseTime(string) {
//     const timeRegex = /^((\d+)h)?((\d+)m)?((\d+)s)?/;
//     let m = timeRegex.exec(string);
//     if (m) {
//         let hour = m[2];
//         let minute = m[4];
//         let second = m[6];
//         if (hour == null && minute == null && second == null) {
//             return [null, null];
//         }
//         if (hour == null) {
//             hour = 0;
//         } else {
//             hour = parseInt(hour, 10);
//         }
//         if (minute == null) {
//             minute = 0;
//         } else {
//             minute = parseInt(minute, 10);
//         }
//         if (second == null) {
//             second = 0;
//         } else {
//             second = parseInt(second, 10);
//         }
//         return [[hour, minute, second], m[0].length];
//     } else {
//         return [null, null];
//     }
// }

function tokenize(string) {
    if (string == "") {
        disableButton();
        return [];
    }

    let elements = [];

    const watchdog = 5;
    let watchdogTimer = 0;
    let parseStart = 0;
    let keepGoing = true;
    while (keepGoing) {
        watchdogTimer += 1;
        if (watchdogTimer >= watchdog) {
            console.log("stopped via watchdog");
            keepGoing = false;
        }
        var result, parseStartCandidate, operationName;
        [result, parseStartCandidate, operationName] = parseStep(string.substring(parseStart));
        if (result == "ambiguous") {
            console.log("ambiguous response");
            keepGoing = false;
            disableButton();
        } else if (result == "not-found") {
            console.log("not-found response");
            keepGoing = false;
            disableButton();
        } else if (result == "fully-parsed") {
            console.log("fully-tokenized response; All done!");
            keepGoing = false;
            enableButton();
        } else {
            // console.log("Successfully parsed: " + operationName);
            // console.log("result: " + JSON.stringify(result));
            parseStart += parseStartCandidate;
        }
        elements.push([operationName, result]);
    }

    return elements;
}

function parseStep(string) {
    if (string.length == 0) {
        return ["fully-parsed", null, null]
    }
    console.log("x");
    let results = [["parseTime", parseTokenTime(string)], ["parseSeparator", parseTokenSeparator(string)], ["parseGroupOpen", parseTokenGroupOpen(string)], ["parseGroupClose", parseTokenGroupClose(string)], ["parseRepetition", parseTokenRepetition(string)]];
    var matchResult;
    var matchOperation;
    var matchConsumedCount;
    var foundResult = false;
    var i;
    for (i = 0; i < results.length; i++) {
        let operationStuff = results[i];
        let operationName = operationStuff[0];
        let operationDetails = operationStuff[1];
        let consumedCount = operationDetails[1];

        console.log(`opName="${operationName}", matchResult="${matchResult}" consumedCount=${consumedCount}`);

        if (consumedCount != null) {
            if (foundResult) {
                console.log("x1");
	        return ["ambiguous", null, null];
            } else {
                console.log("x33");
                matchResult = operationDetails[0];
                matchOperation = operationName;
                matchConsumedCount = consumedCount;
                foundResult = true;
            }
        }
    }
    console.log("y");

    if (!foundResult) {
        return ["not-found", null, null];
    }

    console.log("returning operation: " + matchOperation);
    return [matchResult, matchConsumedCount, matchOperation];
}

function parseTokenGroupOpen(string) {
    const groupOpenRegex = /^\(/;
    let m = groupOpenRegex.exec(string);
    if (m) {
        return [true, 1];
    } else {
        return [null, null];
    }
}

function parseTokenGroupClose(string) {
    const groupCloseRegex = /^\)/;
    let m = groupCloseRegex.exec(string);
    if (m) {
        return [true, 1];
    } else {
        return [null, null];
    }
}

function parseTokenRepetition(string) {
    const repetitionRegex = /^x(\d+)/;
    let m = repetitionRegex.exec(string);
    if (m) {
        console.log(JSON.stringify(m));
        return [m[1], m[0].length];
    } else {
        return [null, null];
    }
}

function parseTokenSeparator(string) {
    const separatorRegex = /^,/;
    let m = separatorRegex.exec(string);
    if (m) {
        return [true, 1];
    } else {
        return [null, null];
    }
}

function parseTokenTime(string) {
    const timeRegex = /^((\d+)h)?((\d+)m)?((\d+)s)?/;
    let m = timeRegex.exec(string);
    if (m) {
        let hour = m[2];
        let minute = m[4];
        let second = m[6];
        if (hour == null && minute == null && second == null) {
            return [null, null];
        }
        if (hour == null) {
            hour = 0;
        } else {
            hour = parseInt(hour, 10);
        }
        if (minute == null) {
            minute = 0;
        } else {
            minute = parseInt(minute, 10);
        }
        if (second == null) {
            second = 0;
        } else {
            second = parseInt(second, 10);
        }
        return [[hour, minute, second], m[0].length];
    } else {
        return [null, null];
    }
}

