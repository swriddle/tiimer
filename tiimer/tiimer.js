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
        return [[hour, minute, second], m[0].length];
    } else {
        console.log("no match - '" + string + "'");
        return [null, null];
    }
}

function parse(string) {
    let parseStart = 0;
    while (keepGoing) {
        let result = parseStep(string);
        if (result == "ambiguous") {
            console.log("ambiguous response");
        } else if (result == "not-found") {
            console.log("not-found response");
        } else {
            console.log("normal handling");
            i    console.log("result: " + JSON.stringify(result));
        }
        blahclose this
}

function parseStep(string) {
    let results = [["parseTime", parseTime(string)]];
    var matchResult;
    var matchOperation;
    foundResult = false;
    var i;
    for (i = 0; i < results.length; i++) {
        let operationStuff = results[i];
        let operationName = operationStuff[0];
        let operationDetails = operationStuff[1];
        matchResult = operationDetails[0];
        matchOperation = operationName;
        let consumedCount = operationDetails[1];

        if (consumedCount != null) {
            // console.log("consumedCount not null");
            if (foundResult) {
                // console.log("definitely ambiguous");
	        return "ambiguous";
            } else {
                // console.log("found one result");
                foundResult = true;
            }
        }
    }

    if (!foundResult) {
        return "not-found";
    }

    console.log(`Made it through with matchResult: ${JSON.stringify(matchResult)} for operation '${matchOperation}'`);
    return matchResult;
}
