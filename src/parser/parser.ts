import { ConsumeWhitespace, isWhitespaceConsumed } from './whitespace.parser';
import { Operation, ParseOperation } from './operation.parser';


/**
 * @param {string} source
 * @returns any[]
 */
export type ParseSource<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseSource<ConsumeWhitespace<Source>>
    : Source extends '' ?
        []
    : ParseOperation<Source> extends [infer operation extends Operation, infer tail extends string] ?
        ParseSource<tail> extends infer entities extends any[] ?
            [operation, ...entities]
        : ParseSource<tail>
    : ParseOperation<Source>;
