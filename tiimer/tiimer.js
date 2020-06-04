function checkStartButtonStatus() {
    var exprElement = document.getElementById("expr");
    var content = exprElement.value;
    let tokens = tokenize(content);
    var i;

    parse(tokens);
}

function parse(tokens) {
    for (i = 0; i < tokens.length - 1; i++) {
        var opName;
        [opName, result] = tokens[i];
        console.log(`${i + 1}. ${opName} (details: ${JSON.stringify(result)})`);
    }

    var newIndex, newTokens;
    [newTokens, newIndex] = parseTokens(tokens, 0);
    if (newIndex + 1 == tokens.length) {
        console.log("+ Got expected new index returned");
    } else {
        console.log("- Unexpected new index returned: " + newIndex);
    }
   console.log("-----" + JSON.stringify(newTokens));
}

// expr = "(" + expr + ")"
// expr = expr "," expr
// expr = expr "xNUM"
// expr = timespec

// class Parser {
//     constructor(tokens) {
//         this.tokens = tokens;
//         this.index = 0;
//     }

//     parse() {
//         if 
//     }
// }

// expr = "(" + expr + ")"
// expr = expr "," expr
// expr = expr "xNUM"
// expr = timespec
// returns [parsedRepresentation, newStartIndex]
function parseTokens(tokens, startIndex) {
    console.log("1LP - " + JSON.stringify(tokens));
    let subTokens = tokens.slice(startIndex);
    var newIndex;
    var parsedRepresentation;
    var parsedRepresentation2;
    if (subTokens[0][0] == "parseTime") {
        let timeRepresentation = subTokens[0][0];
        console.log("1LP: time: " + JSON.stringify(subTokens[0]));

        // deal with separator, if present, after this time
        console.log("checking for separator");
        if (subTokens[1][0] == "parseSeparator") {
            console.log("found separator");
            [parsedPresentation, newIndex] = parseTokens(tokens, startIndex + 2);
            return [[timeRepresentation].concat(parsedPresentation), newIndex];
        // } else {
        //     console.log("no separator");
        }

        // deal with cardinality, if present, after this time
        else if (subTokens[1][0] == "parseRepetition") {
            console.log("2LP: repetition: " + JSON.stringify(subTokens[1]));
            let count = parseInt(subTokens[1][1], 10);
            let representation = [];
            var i;
            for (i = 0; i < count; i++) {
                representation.push(timeRepresentation);
            }
            return [representation, startIndex + 1];
        } else {
            console.log("next token not separator or repetition");
            return [[timeRepresentation], startIndex + 1];
        }
    } else if (subTokens[0][0] == "parseGroupOpen") {
        [parsedRepresentation, newIndex] = parseTokens(tokens, startIndex + 1);
        console.log("about to check whether token at " + newIndex + " is close group");
        if (tokens[newIndex][0] != "parseGroupClose") {
            console.log("group not closed!");
            return "group-not-closed";
        } else {
            newIndex += 1;
            if (tokens[newIndex][0] == "parseSeparator") {
                [parsedRepresentation2, newIndex] = parseTokens(tokens, newIndex + 1);
                return [parsedRepresentation.concat(parsedPresentation2), newIndex];
            }
            else if (tokens[newIndex][0] == "parseRepetition") {
                console.log("2LP': repetition: " + JSON.stringify(tokens[newIndex + 1]));
                let count = parseInt(subTokens[1][1], 10);
                let representation = [];
                var i;
                for (i = 0; i < count; i++) {
                    representation = representation.concat(parsedRepresentation)
                    representation.push(timeRepresentation);
                }
                    return [representation, startIndex + 1];

            }
            // deal with separator, if present, after this group
            // TODO: deal with
            // deal with cardinality, if present, after this time
            // TODO: deal with
            return newIndex + 1;
        }
    } else if (subTokens[0][0] == "parseGroupClosed") {
        console.log("didn't expect to see a group close there");
    } else if (subTokens[0][0] == "parseRepetition") {
        console.log("didn't expect to see a repetition there");
    } else if (subTokens[0][0] == "parseSeparator") {
        console.log("didn't expect to see a separator there");
    } else {
        console.log("unexpected token type: " + JSON.stringify(subTokens[0]));
    }
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
