function checkStartButtonStatus() {
    var exprElement = document.getElementById("expr");
    var content = exprElement.value;
    parse(content);
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

function parseSeparator(string) {
    console.log("parsing separator from string: **" + string + "**");
    const separatorRegex = /^,/;
    let m = separatorRegex.exec(string);
    if (m) {
        console.log("wait what it worked?");
        return [true, 1];
    } else {
        console.log("no go!");
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

function parse(string) {
    if (string == "") {
        disableButton();
        return;
    }
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
        var result, parseStartCandidate;
        [result, parseStartCandidate] = parseStep(string.substring(parseStart));
        if (result == "ambiguous") {
            console.log("ambiguous response");
            keepGoing = false;
        } else if (result == "not-found") {
            console.log("not-found response");
            keepGoing = false;
        } else {
            console.log("normal handling");
            console.log("result: " + JSON.stringify(result));
            parseStart += parseStartCandidate;
        }
    }
}

function parseStep(string) {
    let results = [["parseTime", parseTime(string)]];
    var matchResult;
    var matchOperation;
    var matchConsumedCount;
    foundResult = false;
    var i;
    for (i = 0; i < results.length; i++) {
        let operationStuff = results[i];
        let operationName = operationStuff[0];
        let operationDetails = operationStuff[1];
        matchResult = operationDetails[0];
        matchOperation = operationName;
        let consumedCount = operationDetails[1];
        matchConsumedCount = consumedCount;

        if (consumedCount != null) {
            // console.log("consumedCount not null");
            if (foundResult) {
                // console.log("definitely ambiguous");
	        return ["ambiguous", null];
            } else {
                // console.log("found one result");
                foundResult = true;
            }
        }
    }

    if (!foundResult) {
        return ["not-found", null];
    }

    console.log(`Made it through with matchResult: ${JSON.stringify(matchResult)} for operation '${matchOperation}'`);
    return [matchResult, matchConsumedCount];
}
