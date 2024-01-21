import { Expression } from './expression';
import { ConsumeWhitespace, isWhitespaceConsumed } from './whitespace.parser';
import { ParseIdentifier } from './identifier.parser';
import { Argument, ParseArguments } from './arguments.parser';


export declare class Directive<
    Name extends string = string,
    Arguments extends Argument[] = [],
> extends Expression {
    _: 'Directive';
    name: Name;
    arguments: Arguments;
}

/**
 * @param {string} source
 *
 * @returns {[selections: Directive[], sourceTail: string]}
 */
export type ParseDirectives<Source extends string> =
    ParseDirective<Source> extends [infer directive extends Directive<string, Argument[]> | null, infer tail extends string] ?
        directive extends null ?
            [[], tail]
        : ParseDirectives<tail> extends [infer restDirectives extends Directive<string, Argument[]>[], infer tail2 extends string] ?
            [[directive, ...restDirectives], tail2]
        : ParseDirectives<tail>
    : ParseDirective<Source>;

type ParseDirective<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseDirective<ConsumeWhitespace<Source>>
    : Source extends `@${infer tail}` ?
        ParseIdentifier<tail> extends [infer identifier extends string, infer tail2 extends string] ?
            ConsumeWhitespace<tail2> extends `(${string}` ?
                ParseArguments<tail2> extends [infer arguments extends Argument[], infer tail3 extends string] ?
                    [Directive<identifier, arguments>, tail3]
                : ParseArguments<tail2>
            : [Directive<identifier>, tail2]
        : ParseIdentifier<tail>
    : [null, Source];
