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

module.exports = {checkStartButtonStatus: checkStartButtonStatus, buttonClick: buttonClick}

function Duration(hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
}

Duration.prototype.toString = function() {
    let hourString = this.hours == null ? "0" : this.hours;
    let minuteString = this.minutes == null ? "0" : this.minutes;
    let secondString = this.seconds == null ? "0" : this.seconds;
    return hourString + "H " + minuteString + "M " + secondString + "S";
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
    return this.lhs + " , " + this.rhs;
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

def parse_left_paren(tokens)
    return nil if tokens.empty?
    return nil unless tokens[0][0] == :left_paren

    [tokens[1..], :left_paren]
end

def parse_right_paren(tokens)
    return nil if tokens.empty?
    return nil unless tokens[0][0] == :right_paren

    [tokens[1..], :right_paren]
end

def parse_hour(tokens)
    return nil if tokens.empty?
    return nil unless tokens[0][0] == :hour

    [tokens[1..], :hour]
end

def parse_minute(tokens)
    return nil if tokens.empty?
    return nil unless tokens[0][0] == :minute

    [tokens[1..], :minute]
end

def parse_second(tokens)
    return nil if tokens.empty?
    return nil unless tokens[0][0] == :second

    [tokens[1..], :second]
end

def parse_number(tokens)
  return nil if tokens.empty?
  return nil unless tokens[0][0] == :number

  [tokens[1..], tokens[0][1]]
end

def parse_conjunction(tokens)
    return nil if tokens.empty?
    return nil unless tokens[0][0] == :conjunction

    [tokens[1..], :conjunction]
end

function parseRepetition(tokens) {
    if (!Array.isArray() || (Array.isArray(tokens) && tokens.length)) {
        return null;
    }
    if (tokens[0][0] == "times") {
        return [tokens.slice(1), "times"];
    } else {
        return null;
    }
}

function tokenize(expr) {
    # gobble any whitespace
    last_value = nil
    tokens = []
    while true
        expr = expr.strip
        if last_value == expr
            puts "quiescence detected"
            return
        end
        if expr == ""
            break
        end
        last_value = expr

        if expr.start_with?("(")
            # add left paren token to list
            expr = expr[1..]
            tokens << [:left_paren, nil]
            next
        end
        if expr.start_with?(")")
            # add right paren token to list
            expr = expr[1..]
            tokens << [:right_paren, nil]
            next
        end
        if expr.start_with?(",")
            # add conjunction token to list
            expr = expr[1..]
            tokens << [:conjunction, nil]
            next
        end
        if expr.start_with?("x")
            expr = expr[1..]
            tokens << [:times, nil]
            next
        end
        if expr.start_with?("h")
            expr = expr[1..]
            tokens << [:hour, nil]
            next
        end
        if expr.start_with?("m")
            expr = expr[1..]
            tokens << [:minute, nil]
            next
        end
        if expr.start_with?("s")
            expr = expr[1..]
            tokens << [:second, nil]
            next
        end
        m = /^([0-9]+)/.match(expr)
        if m
            number = m[0]
            expr = expr[number.length..]
            tokens << [:number, number]
        end
    end
    tokens
end

def parse_expression_top_level(tokens)
    parse_expression(tokens, "")
end

def prefix_print(prefix, string)
    puts "#{prefix}#{string}"
end

// all parse_* functions take a list or tuple (iterable) of tokens and
// return [list of remaining tokens, parsed_value], where the list of remaining
// tokens is a subset of the input list (with some elements removed
// from the start of the list being the only difference), and the
// meaning of parsed_value will be dependent on what you're parsing.

def parse_expression(tokens, prefix)
    prefix_print(prefix, "tart")
    return nil if tokens.empty?
    
    prefix_print(prefix, "tokens at start of parse is: #{tokens.inspect}")
  
    puts "parsing top level"
  
    prefix_print(prefix, "1")
    paren_case = parse_left_paren(tokens)
    prefix_print(prefix, "2")
    prefix_print(prefix, "3")
    number_case = parse_number(tokens)
    prefix_print(prefix, "4")
    prefix_print(prefix, "5")
    if paren_case
        prefix_print(prefix, "6")
        tokens, repr = paren_case
        prefix_print(prefix, "7, tokens is now: #{tokens.inspect}")
        expr_case = parse_expression(tokens, "#{prefix}  ")
        prefix_print(prefix, "8")
        if expr_case
            prefix_print(prefix, "9")
            tokens, expr_repr = expr_case
            prefix_print(prefix, "10: tokens is now - #{tokens.inspect}")
            close_paren_case = parse_right_paren(tokens)
            prefix_print(prefix, "11")
            if close_paren_case
                prefix_print(prefix, "12")
                tokens, repr = close_paren_case
                prefix_print(prefix, "13=tokens is now :: #{tokens.inspect}")
                lhs = ParenthesizedExpression.new(expr_repr)
                prefix_print(prefix, "set lhs parenthesized")
            else
                prefix_print(prefix, "14")
                return nil
            end
        else
            prefix_print(prefix, "15")
            return nil
        end
        prefix_print(prefix, "16")
    elsif number_case
        # parse entire duration here...don't let it go 'til you've got the whole thing
        prefix_print(prefix, "23")
        tokens, repr = number_case
        prefix_print(prefix, "adding #{repr} leaving tokens: #{tokens.inspect}")
        # return [tokens, Tag(repr)]
        # lhs = Number.new(repr)
        number = repr
        hour_case = parse_hour(tokens)
        minute_case = parse_minute(tokens)
        second_case = parse_second(tokens)
        if hour_case
            hour_value = number
            tokens, repr = hour_case
            number_case = parse_number(tokens)
            if number_case
                tokens, repr = number_case
                number_value = repr
                # see about minute and second
                minute_case = parse_minute(tokens)
                second_case = parse_second(tokens)
                if minute_case
                    minute_value = number_value
                    tokens, repr = minute_case
                    number_case = parse_number(tokens)
                    if number_case
                        tokens, repr = number_case
                        number_value = repr
                        # number_value is number of seconds
                        second_case = parse_second(tokens)
                        if second_case
                            tokens, repr = second_case
                            second_value = number_value
                            lhs = Duration.new(hour_value, minute_value, second_value)
                        else
                            return nil
                        end
                    else
                        lhs = Duration.new(hour_value, minute_value, nil)
                    end
                elsif second_case
                    tokens, repr = second_case
                    second_value = number_value
                    #number_case = parse_number(tokens)
                    lhs = Duration.new(hour_value, nil, second_value)
                end
            else
                lhs = Duration.new(hour_value, nil, nil)
            end
        elsif minute_case
            minute_value = number
            tokens, expr = minute_case
            number_case = parse_number(tokens)
            if number_case
                tokens, repr = number_case
                number_value = repr
                second_case = parse_second(tokens)
                if second_case
                    tokens, repr = second_case
                    second_value = number_value
                    lhs = Duration.new(nil, minute_value, second_value)
                else
                    return nil
                end
            else
                lhs = Duration.new(nil, minute_value, nil)
            end
        elsif second_case
            second_value = number
            tokens, repr = second_case
            lhs = Duration.new(nil, nil, second_value)
            # TODO: Just seconds
        else
            return nil
        end

        prefix_print(prefix, "set lhs tag")
    else
        prefix_print(prefix, "24")
        puts "error!"
        return nil
    end
  
    prefix_print(prefix, "25")
  
    repetition_case = parse_repetition(tokens)
    conjunction_case = parse_conjunction(tokens)
  
    # disjunction_case = parse_disjunction(tokens)
    # prefix_print(prefix, "26")
    # conjunction_case = parse_conjunction(tokens)
    # prefix_print(prefix, "27")
  
    prefix_print(prefix, "lhs: #{lhs}")
    return [tokens, lhs] unless repetition_case || conjunction_case
  
    while repetition_case || conjunction_case
        prefix_print(prefix, "28")
        prefix_print(prefix, "c || d")
        if repetition_case
            prefix_print(prefix, "29")
            prefix_print(prefix, "dis")
            tokens, repr = repetition_case
            prefix_print(prefix, "t: #{tokens.inspect}, r: #{repr}")
            prefix_print(prefix, "30")
            number_match = parse_number(tokens)
            #expr_match = parse_expression(tokens, "#{prefix}  ")
            #prefix_print(prefix, "raw expr_match: #{expr_match.inspect}")
            prefix_print(prefix, "31")
            if number_match
                prefix_print(prefix, "32")
                tokens, repr = number_match
                number_value = repr
                prefix_print(prefix, "got interior expr: #{repr} leaving tokens: #{tokens.inspect}")
                lhs = Repetition.new(lhs, number_value)
                prefix_print(prefix, "set lhs disjunct")
            else
                prefix_print(prefix, "33")
                return nil
            end
        elsif conjunction_case
            prefix_print(prefix, "34")
            prefix_print(prefix, "con")
            tokens, repr = conjunction_case
            prefix_print(prefix, "35")
            expr_match = parse_expression(tokens, "#{prefix}  ")
            prefix_print(prefix, "36")
            if expr_match
                prefix_print(prefix, "37")
                tokens, repr = expr_match
                prefix_print(prefix, "q: #{tokens.inspect}, t: #{repr}")
                prefix_print(prefix, "38")
                lhs = Conjunction.new(lhs, repr)
                prefix_print(prefix, "set lhs conjunct")
            else
                prefix_print(prefix, "39")
                return nil
            end
        end
    
        prefix_print(prefix, "40: tokens: #{tokens.inspect}")
        repetition_case = parse_repetition(tokens)
        prefix_print(prefix, "41")
        conjunction_case = parse_conjunction(tokens)
        prefix_print(prefix, "42")
    end
    prefix_print(prefix, "43")
    [tokens, lhs]
end

