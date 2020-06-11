"use strict";

function createParseResult(state, value) {
    let parseResult = {
        state: state,
        value: value,
    };
    return parseResult;
}

function createParseState(tokens, id, pos=0) {
    console.log("tokens: =" + tokens + "=");
    console.log("id: =" + id + "=");
    let ps = {
        tokens: tokens,
        pos: pos,
        id: id
    };
    console.log("ps: " + JSON.stringify(ps));
    let parseState = {
        tokens: tokens,
        pos: pos,
        id: id,
        atEnd() {
            console.log("running atEnd() for id: " + id);
            return this.pos == this.tokens.length;
        },
        take() {
            if (this.atEnd()) {
                return null;
            }
            let next = createParseState(this.tokens, id + ".next", this.pos + 1)
            // let next = new ParseState(this.tokens, this.pos + 1)
            let token = this.tokens[this.pos];
            return ParseResult(next, token);
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

function parseTime(state) {
    let res = state.expect("time");
    if (res == null) {
        return null;
    }
    let value = buildTime(res.value.text);
    return ParseResult(res.state, value);
}

function buildTime(value) {
    console.log("Building time from: " + value);
}

function parseGroup(state) {
    let res = state.expect("groupOpen");
    if (res == null) {
        return null;
    }
    let text = res.value.text;
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
    let value = null;
    let done = false;
    while (!done) {
        let res = parseSimpleTemplate(state);
        console.log("simple template parse returned: " + JSON.stringify(res));
        if (res == null) {
            done = true;
        } else {
            value = buildSequence(value, res.value);
            state = res.state;
        }
    }
    if (value == null) {
        return null;
    } else {
        return ParseResult(state, value)
    }
}

function parseSimpleTemplate(state) {
    // expr := "(" expr ")"
    var res;
    res = parseGroup(state);
    if (res != null) {
        return res;
    }

    // expr := time
    res = parseTime(state);
    if (res != null) {
        return res;
    }

    // expr := "(" expr ")" "," expr
    res = parseGroupFollowedByConjunctedExpression(state);
    if (res != null) {
        return res;
    }

    // expr := time "," expr
    res = parseTimeFollowedByConjunctedExpression(state);
    if (res != null) {
        return res;
    }

    // expr := "(" expr ")" "x" number
    res = parseGroupFollowedByRepetition(state);
    if (res != null) {
        return res;
    }

    // expr := time "x" number
    res = parseTimeFollowedByRepetition(state);
    if (res != null) {
        return res;
    }

    // expr := "(" expr ")" "," expr "x" number
    res = parseGroupFollowedByConjunctedExpressionAndRepetition(state);
    if (res != null) {
        return res;
    }

    // expr := time "," expr "x" number
    res = parseTimeFollowedByConjunctedExpressionAndRepetition(state);
    if (res != null) {
        return res;
    }
}

//////////////////////////////////////////////////////////////////////////

function checkStartButtonStatus() {
    var exprElement = document.getElementById("expr");
    var content = exprElement.value;
    let tokens = tokenize(content);
    var i;

    // try {
        // parse(tokens);
    console.log("tokenz: " + JSON.stringify(tokens));
        let returned = parseWholeTemplate(tokens);
        console.log("returned value = " + returned);
        enableButton();
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
            console.log("fully-parsed response; All done!");
            keepGoing = false;
            enableButton();
        } else {
            console.log("Successfully parsed: " + operationName);
            console.log("result: " + JSON.stringify(result));
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
    let results = [["parseTime", parseTime(string)], ["parseSeparator", parseSeparator(string)], ["parseGroupOpen", parseGroupOpen(string)], ["parseGroupClose", parseGroupClose(string)], ["parseRepetition", parseRepetition(string)]];
    var matchResult;
    var matchOperation;
    var matchConsumedCount;
    foundResult = false;
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

    if (!foundResult) {
        return ["not-found", null, null];
    }

    console.log("returning operation: " + matchOperation);
    return [matchResult, matchConsumedCount, matchOperation];
}
