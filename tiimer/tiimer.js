function checkStartButtonStatus() {
    var exprElement = document.getElementById("expr");
    var content = exprElement.value;
    console.log("content = '" + content + "'");
    parse(content);
}

function parseTime(string) {
    const timeRegex = /^((\d+)h)?((\d+)m)?((\d+)s)?/;
    let m = timeRegex.exec(string);
    if (m) {
        console.log("match! - '" + string + "'");
        console.log("m: " + m);
        let hour = m[2];
        let minute = m[4];
        let second = m[6];
        console.log(`time fragment: ${hour} hours, ${minute} minutes, ${second} seconds`);
        if (hour == null && minute == null && second == null) {
            return [null, null];
        }
        return [[hour, minute, second], m[0].length];
    } else {
        console.log("no match - '" + string + "'");
        return [null, null];
    }
}

function parse(string) {
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
