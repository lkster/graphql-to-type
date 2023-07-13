import { ConsumeWhitespace, isWhitespaceConsumed } from './whitespace.parser';
import { Operation, ParseOperation } from './operation.parser';
import { Expression } from './expression';


/**
 * @param {string} source
 * @returns Expression[]
 */
export type ParseSource<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseSource<ConsumeWhitespace<Source>>
    : Source extends '' ?
        []
    : ParseOperation<Source> extends [infer operation extends Operation, infer tail extends string] ?
        ParseSource<tail> extends infer expressions extends Expression[] ?
            [operation, ...expressions]
        : ParseSource<tail>
    : ParseOperation<Source>;
