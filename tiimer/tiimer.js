"use strict";

const nearley = require("nearley");
const grammar = require("./grammar.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

function nearleyParse(text) {
    parser.feed("foo\n");
    return parser.results;
}

function checkStartButtonStatus() {
    var exprElement = document.getElementById("expr");
    var content = exprElement.value;

    try {
        console.log("parsing: '" + content + "'");
        let response = nearleyParse(content);
        console.log("Response: " + JSON.stringify(response));
        enableButton();
    } catch(error) {
        console.log("Could not parse");
        disableButton();
    }
}

module.exports = {checkStartButtonStatus: checkStartButtonStatus}

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

// tokenization below this point.

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

