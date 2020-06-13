expr ->
  time ("," expr):*
  | "(" expr ")" "x" number ("," expr):*
time -> (number "h"):? (number "m"):? (number "s"):?
number -> [0-9]:+ {%
    function(data) {
        return data[0].join("");
    }
%}
