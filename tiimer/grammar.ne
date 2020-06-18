expr ->
  time ("," expr):* {%
      function(data) {
          console.log("*****************");
          console.log("length: " + data.length);
          let initialTime = data[0];
          console.log("initialTime: " + JSON.stringify(initialTime));
          if (data[1].length > 0) {
              if (data[1].length != 2) {
                  console.log("!@#!#!@##@#!@: " + JSON.stringify(data[1]));
              }
              let value = data[1][0];
              console.log("value: " + JSON.stringify(value));
              console.log("value length: " + value.length);
              // console.log("1: " + JSON.stringify(value[0]));
              let nextElement = value[1][0];
              console.log("nextElement: " + JSON.stringify(nextElement));
              // console.log("2: " + JSON.stringify(value[1]));
              // console.log("2 length: " + value[1].length);
          } else {
              console.log("nothing inside");
          }
          //let value = data[1][0];
          // console.log("y: " + JSON.stringify(data[1][0][1]));
          console.log("*****************");
          return data;
          // return [initialTime, nextElement];
      }
  %}
  | "(" expr ")" "x" number ("," expr):*


@{%
    function parseValue(binding) {
        if (binding == null) {
            return null;
        } else {
            return parseInt(binding, 10);
        }
    }
%}

time -> time1 | time2 | time3 | time4 | time5 | time6 | time7

time1 -> number "h" number "m" number "s" {%
    function(data) {
        var hourBinding, minuteBinding, secondBinding;
        [hourBinding, minuteBinding, secondBinding] = data;
        //return { hours: parseValue(hourBinding), minutes: parseValue(minuteBinding), seconds: parseValue(secondBinding) };
        return "time";
    }
%}

time2 -> number "s" {%
    function(data) {
        var secondBinding;
        [secondBinding] = data;
        //return { hours: 0, minutes: 0, seconds: parseValue(secondBinding) };
        return "time";
    }
%}
time3 -> number "m" {%
    function(data) {
        var minuteBinding;
        [minuteBinding] = data;
        //return { hours: 0, minutes: parseValue(minuteBinding), seconds: 0 };
        return "time";
    }
%}
time4 -> number "h" {%
    function(data) {
        var hourBinding;
        [hourBinding] = data;
        //return { hours: parseValue(hourBinding), minutes: 0, seconds: 0 };
        return "time";
    }
%}
time5 -> number "h" number "m" {%
    function(data) {
        var hourBinding, minuteBinding;
        [hourBinding, minuteBinding] = data;
        //return { hours: parseValue(hourBinding), minutes: parseValue(minuteBinding), seconds: 0 };
        return "time";
    }
%}
time6 -> number "h" number "s" {%
    function(data) {
        var hourBinding, secondBinding;
        [hourBinding, secondBinding] = data;
        //return { hours: parseValue(hourBinding), minutes: 0, seconds: parseValue(secondBinding) };
        return "time";
    }
%}
time7 -> number "m" number "s" {%
    function(data) {
        var minuteBinding, secondBinding;
        [minuteBinding, secondBinding] = data;
        //return { hours: 0, minutes: parseValue(minuteBinding), seconds: parseValue(secondBinding) };
        return "time";
    }
%}

number -> [0-9]:+ {%
    function(data) {
        return data[0].join("");
    }
%}
