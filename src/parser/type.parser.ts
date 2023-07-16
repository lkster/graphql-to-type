import { ConsumeWhitespace, isWhitespaceConsumed } from './whitespace.parser';
import { ParserError } from '../errors';
import { Head, UnexpectedCharOrEndOfSource } from '../helpers';
import { ParseIdentifier } from './identifier.parser';
import { Expression } from './expression';


export declare class Type<Kind extends string = string, Required extends boolean = boolean> extends Expression {
    _: 'Type';
    kind: Kind;
    required: Required;
}

export declare class NamedType<Name extends string = string, Required extends boolean = boolean> extends Type<'named', Required> {
    name: Name;
}

export declare class ListType<InnerType extends Type = Type, Required extends boolean = boolean> extends Type<'list', Required> {
    type: InnerType;
}


/**
 * @param {string} source
 *
 * @returns [type: Type, sourceTail: string]
 */
export type ParseType<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseType<ConsumeWhitespace<Source>>
    : Source extends `[${infer tail}` ?
        ParseType<tail> extends [infer innerType extends Type, infer tail2 extends string] ?
            ConsumeWhitespace<tail2> extends `]${infer tail3}` ?
                tail3 extends `!${infer tail4}` ?
                    [ListType<innerType, true>, tail4]
                : [ListType<innerType, false>, tail3]
            : ParserError<`Expected "]", got ${UnexpectedCharOrEndOfSource<tail2>}`>
        : ParseType<tail> // error pass-through
    : ParseIdentifier<Source> extends [infer identifier extends string, infer tail] ?
        tail extends `!${infer tail2}` ?
            [NamedType<identifier, true>, tail2]
        : [NamedType<identifier, false>, tail]
    : ParseIdentifier<Source>; // error pass-through
