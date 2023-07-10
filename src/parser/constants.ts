export type Whitespace = '\n' | '\r' | '\t' | ' ' | ',';

export type Punctuators = '!' | '$' | '&' | '(' | ')' | '.' | ':' | '=' | '@' | '[' | ']' | '{' | '}' | '|';

export type OperationTypes = 'query' | 'mutation' | 'subscription';

export type IdentifierAllowedStartChars =
    'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' |
    'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' |
    'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' |
    'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' |
    '_';

export type IdentifierAllowedChars =
    IdentifierAllowedStartChars |
    '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';

export type AllowedDelimiter = '(' | ')' | '{' | '}' | '[' | ']' | ',' | ':' | '@' | '#' | '!' | Whitespace;
