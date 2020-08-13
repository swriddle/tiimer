"use strict";

function checkButtonStatus() {
    console.log("checking start button status");
    var exprElement = document.getElementById("expr");
    var content = exprElement.value;
    if (parse(content).status == "success") {
        enableStartCancelButton();
        disablePauseResumeButton();
    } else {
        disableStartCancelButton();
        disablePauseResumeButton();
    }
    // return true;
}

function enableStartCancelButton() {
    startCancelButton().classList.add("button-primary");
    startCancelButton().disabled = false;
}

function disableStartCancelButton() {
    startCancelButton().classList.remove("button-primary");
    startCancelButton().disabled = true;
}

function enablePauseResumeButton() {
    pauseResumeButton().classList.add("button-primary");
    pauseResumeButton().disabled = false;
}

function disablePauseResumeButton() {
    pauseResumeButton().classList.remove("button-primary");
    pauseResumeButton().disabled = true;
}

function startCancelButton() {
    return document.getElementById("start_cancel_button");
}

function pauseResumeButton() {
    return document.getElementById("pause_resume_button");
}

function formatTimer(duration) {
    let hours = duration.hours.padStart(2, "0");
    let minutes = duration.minutes.padStart(2, "0");
    let seconds = duration.seconds.padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function pauseResumeButtonClick() {
    if (isTimerRunning()) {
        pauseButtonClick();
    } else {
        resumeButtonClick();
    }
}

function isTimerRunning() {
    // TODO: implement
}

function pauseButtonClick() {
    // TODO: implement
}

function resumeButtonClick() {
    // TODO: implement
}

function startCancelButtonClick() {
    if (isTimerRunning()) {
        cancelButtonClick();
    } else {
        startButtonClick();
    }
}

function cancelButtonClick() {
    // TODO: implement
}

function startButtonClick() {
    let lapsSpan = document.getElementById("laps");
    let timerSpan = document.getElementById("timer");
    var exprElement = document.getElementById("expr");
    var content = exprElement.value;
    console.log(`Raw text box value: *${content}*`);
    let response = parse(content);
    console.log(`Parsed response: ${JSON.stringify(response)}`);
    if (response.status != "success") {
        console.log("shouldn't happen");
        return;
    }
    let result = response.result;
    lapsSpan.innerHTML = `1 of ${result.length}`;
    timerSpan.innerHTML = formatTimer(result[0]);
    startTimer(result);
}

function startTimer(laps) {
    // set start/cancel button to cancel
    // set pause/resume button to pause and enable
    // disable input into text box
    // TODO: implement
}

function Duration(hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
}

Duration.prototype.toString = function() {
    let hourString = this.hours == null ? "0" : this.hours;
    let minuteString = this.minutes == null ? "0" : this.minutes;
    let secondString = this.seconds == null ? "0" : this.seconds;
    return `Duration(${hourString}H${minuteString}M${secondString}S)`;
};

Duration.prototype.json = function() {
    let hoursNum = this.hours == null ? 0 : parseInt(this.hours, 10);
    let minutesNum = this.minutes == null ? 0 : parseInt(this.minutes, 10);
    let secondsNum = this.seconds == null ? 0 : parseInt(this.seconds, 10);
    return [{hours: hoursNum, minutes: minutesNum, seconds: secondsNum}];
};

function ParenthesizedExpression(expr) {
    this.expr = expr;
}

ParenthesizedExpression.prototype.toString = function() {
    return "[ " + this.expr + " ]";
}

ParenthesizedExpression.prototype.json = function() {
    return this.expr.json();
};

function Repetition(expr, count) {
    this.expr = expr;
    this.count = parseInt(count, 10);
}

Repetition.prototype.toString = function() {
    return this.expr + " X " + this.count;
}

Repetition.prototype.json = function() {
    let json = this.expr.json();
    let concatenated = [];
    var i;
    for (i = 0; i < this.count; i++) {
        concatenated = concatenated.concat(json);
    }
    return concatenated;
};

function Conjunction(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
}

Conjunction.prototype.toString = function() {
    return `Conjunction(${this.lhs}, ${this.rhs})`;
}

Conjunction.prototype.json = function() {
    return this.lhs.json().concat(this.rhs.json());
};

function parseLeftParen(tokens) {
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.length == 0)) {
        return null;
    }
    if (tokens[0][0] == "left_paren") {
        return [tokens.slice(1), "left_paren"];
    } else {
        return null;
    }
}

function parseRightParen(tokens) {
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.length == 0)) {
        return null;
    }
    if (tokens[0][0] == "right_paren") {
        return [tokens.slice(1), "right_paren"];
    } else {
        return null;
    }
}

function parseHour(tokens) {
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.length == 0)) {
        return null;
    }
    if (tokens[0][0] == "hour") {
        return [tokens.slice(1), "hour"];
    } else {
        return null;
    }
}

function parseMinute(tokens) {
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.length == 0)) {
        return null;
    }
    if (tokens[0][0] == "minute") {
        return [tokens.slice(1), "minute"];
    } else {
        return null;
    }
}

function parseSecond(tokens) {
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.length == 0)) {
        return null;
    }
    if (tokens[0][0] == "second") {
        return [tokens.slice(1), "second"];
    } else {
        return null;
    }
}

function parseNumber(tokens) {
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.length == 0)) {
        return null;
    }
    if (tokens[0][0] == "number") {
        return [tokens.slice(1), tokens[0][1]];
    } else {
        return null;
    }
}

function parseConjunction(tokens) {
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.length == 0)) {
        return null;
    }
    if (tokens[0][0] == "conjunction") {
        return [tokens.slice(1), "conjunction"];
    } else {
        return null;
    }
}

function parseRepetition(tokens) {
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.length == 0)) {
        return null;
    }
    if (tokens[0][0] == "times") {
        return [tokens.slice(1), "times"];
    } else {
        return null;
    }
}

function tokenize(expr) {
    // gobble any whitespace
    var lastValue = null;
    var tokens = [];
    while (true) {
        expr = expr.trim();
        if (lastValue == expr) {
            console.log("quiescence detected");
            return;
        }
        if (expr == "") {
            break;
        }
        lastValue = expr;

        if (expr.startsWith("(")) {
            // add left paren token to list
            expr = expr.slice(1);
            tokens.push(["left_paren", null]);
            continue;
        }
        if (expr.startsWith(")")) {
            // add right paren token to list
            expr = expr.slice(1);
            tokens.push(["right_paren", null]);
            continue;
        }
        if (expr.startsWith(",")) {
            // add conjunction token to list
            expr = expr.slice(1);
            tokens.push(["conjunction", null]);
            continue;
        }
        if (expr.startsWith("x")) {
            expr = expr.slice(1);
            tokens.push(["times", null]);
            continue;
        }
        if (expr.startsWith("h")) {
            expr = expr.slice(1);
            tokens.push(["hour", null]);
            continue;
        }
        if (expr.startsWith("m")) {
            expr = expr.slice(1);
            tokens.push(["minute", null]);
            continue;
        }
        if (expr.startsWith("s")) {
            expr = expr.slice(1);
            tokens.push(["second", null]);
            continue;
        }
        let m = expr.match(/^([0-9]+)/);
        if (m) {
            let number = m[0];
            expr = expr.slice(number.length);
            tokens.push(["number", number]);
        }
    }
    return tokens;
}

function parse(expressionString) {
    let tokens = tokenize(expressionString);
    if (tokens) {
        let resultTuple = parseExpression(tokens);
        if (resultTuple) {
            let [tokensLeft, result] = resultTuple;
            if (tokensLeft.length == 0) {
                return {status: "success", result: result.json()};
            } else {
                return {status: "tokens-left"};
            }
        } else {
            return {status: "cannot-parse"};
        }
    } else {
        return {status: "cannot-tokenize"}
    }
}

// all parse_* functions take a list or tuple (iterable) of tokens and
// return [list of remaining tokens, parsed_value], where the list of remaining
// tokens is a subset of the input list (with some elements removed
// from the start of the list being the only difference), and the
// meaning of parsed_value will be dependent on what you're parsing.

function parseExpression(tokens) {
    var parenCase;
    var numberCase;
    var numberValue;
    var exprCase;
    var tokens;
    var repr;
    var exprRepr;
    var exprMatch;
    var closeParenCase;
    var lhs = null;
    var number;
    var hourCase, minuteCase, secondCase;
    var hourValue, minuteValue, secondValue;
    var repetitionCase, conjunctionCase;
    var numberMatch;

    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.count)) {
        return null;
    }
    
    parenCase = parseLeftParen(tokens);
    numberCase = parseNumber(tokens);
    if (parenCase) {
        [tokens, repr] = parenCase;
        exprCase = parseExpression(tokens);
        if (exprCase) {
            [tokens, exprRepr] = exprCase;
            closeParenCase = parseRightParen(tokens);
            if (closeParenCase) {
                [tokens, repr] = closeParenCase;
                lhs = new ParenthesizedExpression(exprRepr);
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else if (numberCase) {
        // parse entire duration here...don't let it go 'til you've got the whole thing
        [tokens, repr] = numberCase;
        number = repr;
        hourCase = parseHour(tokens);
        minuteCase = parseMinute(tokens);
        secondCase = parseSecond(tokens);
        if (hourCase) {
            hourValue = number;
            [tokens, repr] = hourCase;
            numberCase = parseNumber(tokens);
            if (numberCase) {
                [tokens, repr] = numberCase;
                numberValue = repr;
                // see about minute and second
                minuteCase = parseMinute(tokens);
                secondCase = parseSecond(tokens);
                if (minuteCase) {
                    minuteValue = numberValue;
                    [tokens, repr] = minuteCase;
                    numberCase = parseNumber(tokens);
                    if (numberCase) {
                        [tokens, repr] = numberCase;
                        numberValue = repr;
                        // number_value is number of seconds
                        secondCase = parseSecond(tokens);
                        if (secondCase) {
                            [tokens, repr] = secondCase;
                            secondValue = numberValue;
                            lhs = new Duration(hourValue, minuteValue, secondValue);
                        } else {
                            return null;
                        }
                    } else {
                        lhs = new Duration(hourValue, minuteValue, null);
                    }
                } else if (second_case) {
                    [tokens, repr] = secondCase;
                    secondValue = numberValue;
                    lhs = new Duration(hourValue, null, secondValue);
                }
            } else {
                lhs = new Duration(hourValue, null, null);
            }
        } else if (minuteCase) {
            minuteValue = number;
            [tokens, expr] = minuteCase;
            numberCase = parseNumber(tokens);
            if (numberCase) {
                [tokens, repr] = numberCase;
                numberValue = repr;
                secondCase = parseSecond(tokens);
                if (secondCase) {
                    [tokens, repr] = secondCase;
                    secondValue = numberValue;
                    lhs = new Duration(null, minuteValue, secondValue);
                } else {
                    return null;
                }
            } else {
                lhs = new Duration(null, minuteValue, null)
            }
        } else if (secondCase) {
            secondValue = number;
            [tokens, repr] = secondCase;
            lhs = new Duration(null, null, secondValue);
        } else {
            return null;
        }

    } else {
        console.log("error!");
        return null;
    }
  
  
    repetitionCase = parseRepetition(tokens);
    conjunctionCase = parseConjunction(tokens);
  
    if (!repetitionCase && !conjunctionCase) {
        return [tokens, lhs];
    }
  
    while (repetitionCase || conjunctionCase) {
        if (repetitionCase) {
            [tokens, repr] = repetitionCase;
            numberMatch = parseNumber(tokens);
            if (numberMatch) {
                [tokens, repr] = numberMatch;
                numberValue = repr;
                lhs = new Repetition(lhs, numberValue);
            } else {
                return null;
            }
        } else if (conjunctionCase) {
            [tokens, repr] = conjunctionCase;
            exprMatch = parseExpression(tokens);
            if (exprMatch) {
                [tokens, repr] = exprMatch;
                lhs = new Conjunction(lhs, repr);
            } else {
                return null;
            }
        }
    
        repetitionCase = parseRepetition(tokens);
        conjunctionCase = parseConjunction(tokens);
    }
    return [tokens, lhs];
}
