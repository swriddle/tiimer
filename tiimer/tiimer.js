class ParseResult {
    var state;
    var value;
    constructor(state, value) {
        this.state = state;
        this.value = value;
    }
}

class ParseState {
    var tokens;
    var pos;
    constructor(tokens, pos=0) {
        this.tokens = tokens;
        this.pos = pos;
    }
    atEnd() {
        return this.pos == this.tokens.length;
    }
    take() {
        if (this.atEnd()) {
            return null;
        }
        let next = new ParseState(this.tokens, this.pos + 1)
        let token = this.tokens[this.pos];
        return ParseResult(next, token);
    }

    expect(expectedTag) {
        let result = this.take();
        if (result == null || result.value.tag != expectedTag) {
            return null;
        } else {
            return result;
        }
    }

    peek() {
        if (this.atEnd()) {
            return null;
        } else {
            return this.tokens[this.pos].tag 
        }
    }
}

// class TemplateParseException(Exception) {
// }
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
    let state = new ParseState(tokens);
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
        let returned = parseWholeTemplate(tokens);
        console.log("returned value = " + returned);
        enableButton();
    // } catch(err) {
    //     console.log("got error: " + err);
    //     disableButton();
    // }
}

// class ParseState {
//     function ParseState(
//         // TODO: continueHere
// }

// function parse(tokens) {
//     for (i = 0; i < tokens.length - 1; i++) {
//         var opName;
//         [opName, result] = tokens[i];
//         console.log(`${i + 1}. ${opName} (details: ${JSON.stringify(result)})`);
//     }

//     tokens = tokens.slice(0, tokens.length - 1);
//     var newIndex, newTokens;
//     [newTokens, newIndex] = parseTokens(tokens, 0);
//     if (newIndex + 1 == tokens.length) {
//         console.log("+ Got expected new index returned");
//     } else {
//         console.log("Got newIndex: " + newIndex + " and " + tokens.length + " tokens");
//         throw new Error("stuff-leftover");
//     }
//    console.log("-----" + JSON.stringify(newTokens));
// }

// // expr = "(" + expr + ")"
// // expr = expr "," expr
// // expr = expr "xNUM"
// // expr = timespec

// // returns [parsedRepresentation, newStartIndex]
// function parseTokens(tokens, startIndex) {
//     let subTokens = tokens.slice(startIndex);
//     var newIndex;
//     var parsedRepresentation;
//     var parsedRepresentation2;
//     if (subTokens[0][0] == "parseTime") {
//         let timeRepresentation = subTokens[0][0];
//         if (subTokens.length > 1) {
//             if (subTokens[1][0] == "parseSeparator") {
//                 [parsedPresentation, newIndex] = parseTokens(tokens, startIndex + 2);
//                 return [[timeRepresentation].concat(parsedPresentation), newIndex];
//             } else if (subTokens[1][0] == "parseRepetition") {
//                 let count = parseInt(subTokens[1][1], 10);
//                 let representation = [];
//                 var i;
//                 for (i = 0; i < count; i++) {
//                     representation.push(timeRepresentation);
//                 }
//                 return [representation, startIndex + 1];
//             } else {
//                 return [[timeRepresentation], startIndex + 1];
//             }
//         } else {
//             return [[timeRepresentation], startIndex + 1];
//         }
//     } else if (subTokens[0][0] == "parseGroupOpen") {
//         [parsedRepresentation, newIndex] = parseTokens(tokens, startIndex + 1);
//         if (tokens.length > newIndex) {
//             if (tokens[newIndex][0] != "parseGroupClose") {
//                 throw new Error("group-not-closed");
//             } else {
//                 newIndex += 1;
//                 if (tokens[newIndex][0] == "parseSeparator") {
//                     [parsedRepresentation2, newIndex] = parseTokens(tokens, newIndex + 1);
//                     return [parsedRepresentation.concat(parsedPresentation2), newIndex];
//                 }
//                 else if (tokens[newIndex][0] == "parseRepetition") {
//                     let count = parseInt(subTokens[1][1], 10);
//                     let representation = [];
//                     var i;
//                     for (i = 0; i < count; i++) {
//                         representation = representation.concat(parsedRepresentation)
//                         representation.push(timeRepresentation);
//                     }
//                     return [representation, startIndex + 1];
//                 }
//                 return newIndex + 1;
//             }
//         } else {
//             throw new Error("not-long-enough");
//         }
//     } else if (subTokens[0][0] == "parseGroupClosed") {
//         throw new Error("unexpected-token");
//     } else if (subTokens[0][0] == "parseRepetition") {
//         throw new Error("unexpected-token");
//     } else if (subTokens[0][0] == "parseSeparator") {
//         throw new Error("unexpected-token");
//     } else {
//         console.log("zeroth subtoken: " + JSON.stringify(subTokens[0]));
//         console.log("all subtokens: " + JSON.stringify(subTokens));
//         throw new Error("unexpected-token-type: " + JSON.stringify(subTokens[0][0]));
//     }
// }

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

function parseGroupOpen(string) {
    const groupOpenRegex = /^\(/;
    let m = groupOpenRegex.exec(string);
    if (m) {
        return [true, 1];
    } else {
        return [null, null];
    }
}

function parseGroupClose(string) {
    const groupCloseRegex = /^\)/;
    let m = groupCloseRegex.exec(string);
    if (m) {
        return [true, 1];
    } else {
        return [null, null];
    }
}

function parseRepetition(string) {
    const repetitionRegex = /^x(\d+)/;
    let m = repetitionRegex.exec(string);
    if (m) {
        console.log(JSON.stringify(m));
        return [m[1], m[0].length];
    } else {
        return [null, null];
    }
}

function parseSeparator(string) {
    const separatorRegex = /^,/;
    let m = separatorRegex.exec(string);
    if (m) {
        return [true, 1];
    } else {
        return [null, null];
    }
}

function parseTime(string) {
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

function tokenize(string) {
    if (string == "") {
        disableButton();
        return;
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

    // for (i = 0; i < elements.length - 1; i++) {
    //     var opName;
    //     [opName, result] = elements[i];
    //     console.log(`${i + 1}. ${opName} (details: ${JSON.stringify(result)})`);
    // }
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
        // matchResult = operationDetails[0];
        // matchOperation = operationName;
        let consumedCount = operationDetails[1];
        // matchConsumedCount = consumedCount;
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
