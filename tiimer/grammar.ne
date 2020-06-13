expr -> time ("," expr):*
expr -> "(" expr ")" "x" number ("," expr):*
time -> (number "h"):? (number "m"):? (number "s"):?
number -> [0-9]:+