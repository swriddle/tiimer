"use strict";

/*
const nearley = require("nearley");
const grammar = require("./grammar.js");
*/

// parses "1m30s" to: [[[null,[[["1"]],"m"],[[["3","0"]],"s"]],[]]]

/*
function nearleyParse(text) {
    try {
        let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(text);
        if (parser.results.length == 0) {
            return [false, null];
        } else {
            return [true, parser.results]
        }
    } catch(error) {
        return [false, null];
    }
}
*/

function checkStartButtonStatus() {
    return false;
    /*
    var exprElement = document.getElementById("expr");
    var content = exprElement.value;
    var success, response;

    console.log("parsing: '" + content + "'");
    [success, response] = nearleyParse(content);
    if (success) {
        console.log("Response: " + JSON.stringify(response));
        enableButton();
    } else {
        console.log("Could not parse");
        disableButton();
    }
    */
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

// tokenization below this point.

/*
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
*/

/*
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
*/


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
}

/*
class Duration
  def initialize(hours, minutes, seconds)
    @hours = hours
    @minutes = minutes
    @seconds = seconds
  end

  def to_s
    "#{@hours.nil? ? 0 : @hours}H #{@minutes.nil? ? 0 : @minutes}M #{@seconds.nil? ? 0 : @seconds}S"
  end
end
*/

function ParenthesizedExpression(expr) {
    this.expr = expr;
}

ParenthesizedExpression.prototype.toString = function() {
    return "[ " + this.expr + " ]";
}

/*
class ParenthesizedExpression
  def initialize(expr)
    @expr = expr
  end

  def to_s
    "[ #{@expr} ]"
  end
end
*/

function Number(expr) {
    this.expr = expr;
}

Number.prototype.toString = function() {
    return "## " + this.expr + " ##";
}

/*
class Number
  def initialize(expr)
    @expr = expr
  end

  def to_s
    "## #{@expr} ##"
  end
end
*/

function Repetition(expr, count) {
    this.expr = expr;
    this.count = count;
}

Repetition.prototype.toString = function() {
    return this.expr + " X " + this.count;
}

/*
class Repetition
  def initialize(expr, count)
    @expr = expr
    @count = count
  end

  def to_s
    "#{@expr} X #{@count}"
  end
end
*/

function Conjunction(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
}

Conjunction.prototype.toString = function() {
    return `Conjunction(${this.lhs}, ${this.rhs})`;
}

/*
class Conjunction
  def initialize(lhs, rhs)
    @lhs = lhs
    @rhs = rhs
  end

  def to_s
    "#{@lhs} , #{@rhs}"
  end
end
*/

function parseLeftParen(tokens) {
    console.log("parse left paren");
    console.log("is array?: " + Array.isArray(tokens));
    console.log("length: " + tokens.length);
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.length == 0)) {
        return null;
    }
    console.log("stuff is left");
    console.log("tokens[0]: " + JSON.stringify(tokens[0]));
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
        console.log("XXXXX: " + tokens[0][1]);
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

function performDaTest() {
    // let tokens = tokenize("(1m30s)x4,1h");
    let tokens = tokenize("(1h2m3s)x4,8m");
    let [tokensLeft, response] = parseExpressionTopLevel(tokens);
    if (tokensLeft.length > 0) {
        console.log("tokens left!");
    }
    console.log("Response: " + response);
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

function parseExpressionTopLevel(tokens) {
    return parseExpression(tokens, "");
}

function prefixPrint(prefix, string) {
    console.log(prefix + string);
}

// all parse_* functions take a list or tuple (iterable) of tokens and
// return [list of remaining tokens, parsed_value], where the list of remaining
// tokens is a subset of the input list (with some elements removed
// from the start of the list being the only difference), and the
// meaning of parsed_value will be dependent on what you're parsing.

function parseExpression(tokens, prefix) {
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

    prefixPrint(prefix, "tart")
    if (!Array.isArray(tokens) || (Array.isArray(tokens) && tokens.count)) {
        return null;
    }
    
    prefixPrint(prefix, `tokens at start of parse is: ${JSON.stringify(tokens)}`);
  
    prefixPrint(prefix, "1");
    parenCase = parseLeftParen(tokens);
    prefixPrint(prefix, "2");
    prefixPrint(prefix, "3");
    numberCase = parseNumber(tokens);
    prefixPrint(prefix, "4");
    prefixPrint(prefix, "5");
    prefixPrint(prefix, `5.5 - parenCase: ${parenCase}, numberCase: ${numberCase}`);
    if (parenCase) {
        prefixPrint(prefix, "6");
        [tokens, repr] = parenCase;
        prefixPrint(prefix, `7, tokens is now: ${JSON.stringify(tokens)}`);
        exprCase = parseExpression(tokens, `${prefix}  `);
        prefixPrint(prefix, "8");
        if (exprCase) {
            prefixPrint(prefix, "9");
            [tokens, exprRepr] = exprCase;
            prefixPrint(prefix, `10: tokens is now - ${tokens.inspect}`);
            closeParenCase = parseRightParen(tokens);
            prefixPrint(prefix, "11");
            if (closeParenCase) {
                prefixPrint(prefix, "12");
                [tokens, repr] = closeParenCase;
                prefixPrint(prefix, `13=tokens is now :: ${tokens.inspect}`);
                lhs = new ParenthesizedExpression(exprRepr);
                prefixPrint(prefix, "set lhs parenthesized");
            } else {
                prefixPrint(prefix, "14");
                return null;
            }
        } else {
            prefixPrint(prefix, "15");
            return null;
        }
        prefixPrint(prefix, "16");
    } else if (numberCase) {
        // parse entire duration here...don't let it go 'til you've got the whole thing
        prefixPrint(prefix, "23");
        [tokens, repr] = numberCase;
        prefixPrint(prefix, `adding ${repr} leaving tokens: ${JSON.stringify(tokens)}`);
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

        prefixPrint(prefix, "set lhs tag");
    } else {
        prefixPrint(prefix, "24");
        console.log("error!");
        return null;
    }
  
    prefixPrint(prefix, "25");
  
    repetitionCase = parseRepetition(tokens);
    conjunctionCase = parseConjunction(tokens);
  
    prefixPrint(prefix, "lhs: #{lhs}")
    if (!repetitionCase && !conjunctionCase) {
        return [tokens, lhs];
    }
  
    while (repetitionCase || conjunctionCase) {
        prefixPrint(prefix, "28");
        prefixPrint(prefix, "c || d");
        if (repetitionCase) {
            prefixPrint(prefix, "29");
            prefixPrint(prefix, "dis");
            [tokens, repr] = repetitionCase;
            prefixPrint(prefix, `t: ${JSON.stringify(tokens)}, r: ${repr}`);
            prefixPrint(prefix, "30");
            numberMatch = parseNumber(tokens);
            //expr_match = parseExpression(tokens, `${prefix}  `);
            //prefixPrint(prefix, `raw expr_match: ${JSON.stringify(expr_match)}`);
            prefixPrint(prefix, "31");
            if (numberMatch) {
                prefixPrint(prefix, "32");
                [tokens, repr] = numberMatch;
                numberValue = repr;
                prefixPrint(prefix, `got interior expr: ${repr} leaving tokens: ${JSON.stringify(tokens)}`);
                lhs = new Repetition(lhs, numberValue);
                prefixPrint(prefix, "set lhs disjunct");
            } else {
                prefixPrint(prefix, "33");
                return null;
            }
        } else if (conjunctionCase) {
            prefixPrint(prefix, "34");
            prefixPrint(prefix, "con");
            [tokens, repr] = conjunctionCase;
            prefixPrint(prefix, "35")
            exprMatch = parseExpression(tokens, `${prefix}  `);
            prefixPrint(prefix, "36");
            if (exprMatch) {
                prefixPrint(prefix, "37");
                [tokens, repr] = exprMatch;
                prefixPrint(prefix, `q: ${JSON.stringify(tokens)}, t: ${repr}`);
                prefixPrint(prefix, "38");
                lhs = new Conjunction(lhs, repr);
                prefixPrint(prefix, "set lhs conjunct");
            } else {
                prefixPrint(prefix, "39");
                return null;
            }
        }
    
        prefixPrint(prefix, `40: tokens: ${JSON.stringify(tokens)}`);
        repetitionCase = parseRepetition(tokens);
        prefixPrint(prefix, "41");
        conjunctionCase = parseConjunction(tokens);
        prefixPrint(prefix, "42");
    }
    prefixPrint(prefix, "43");
    return [tokens, lhs];
}

// module.exports = {checkStartButtonStatus: checkStartButtonStatus, buttonClick: buttonClick, performDaTest: performDaTest}
