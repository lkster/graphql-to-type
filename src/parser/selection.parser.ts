import { ConsumeWhitespace, isWhitespaceConsumed } from './whitespace.parser';
import { ParserError } from '../errors';
import { Head, UnexpectedCharOrEndOfSource } from '../helpers';
import { ParseIdentifier } from './identifier.parser';
import { Argument, ParseArguments } from './arguments.parser';


export declare class Field<
    Name extends string = string,
    Alias extends string | undefined = string | undefined,
    Arguments extends Argument[] | undefined = Argument[] | undefined,
    SelectionSet extends Field[] | undefined = Field<string, string | undefined, Argument[] | undefined, any[] | undefined>[] | undefined,
> {
    _: 'Field';
    name: Name;
    alias: Alias;
    arguments: Arguments;
    selectionSet: SelectionSet;
}


/**
 * @param {string} source
 *
 * @returns [selections: Field[], sourceTail: string]
 */
export type ParseSelectionSet<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseSelectionSet<ConsumeWhitespace<Source>>
    : Source extends `{${infer tail}` ?
        ConsumeWhitespace<tail> extends `}${string}` ?
            ParserError<`Selection set cannot be empty`>
        : ParseSelectionSetRest<tail> extends [infer selections extends Field[], infer tail2 extends string] ?
            ConsumeWhitespace<tail2> extends `}${infer tail3}` ?
                [selections, tail3]
            : ParserError<`Expected "}", got ${UnexpectedCharOrEndOfSource<ConsumeWhitespace<tail2>>}`>
        : ParseSelectionSetRest<tail>
    : ParserError<`Expected "{", got ${UnexpectedCharOrEndOfSource<Source>}`>;

type ParseSelectionSetRest<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseSelectionSetRest<ConsumeWhitespace<Source>>
    : Source extends `}${string}` ?
        [[], Source]
    : ParseField<Source> extends [infer field extends Field, infer tail extends string] ?
        ParseSelectionSetRest<tail> extends [infer selections extends Field[], infer tail2] ?
            [[field, ...selections], tail2]
        : ParseSelectionSetRest<tail>
    : ParseField<Source>;

type ParseField<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseField<ConsumeWhitespace<Source>>
    : ParseIdentifier<Source> extends [infer identifier extends string, infer tail extends string] ?
        ConsumeWhitespace<tail> extends `:${infer tail2}` ?
            ParseField<tail2> extends [Field<infer fieldName, infer potentialAlias, infer fieldArguments, infer fieldSelectionSet>, infer tail3] ?
                potentialAlias extends string ?
                    ParserError<`Selection can't have multiple aliases`>
                : [Field<fieldName, identifier, fieldArguments, fieldSelectionSet>, tail3]
            : ParseField<tail2>
        : ParseFieldArguments<tail> extends [infer fieldArguments extends Argument[] | undefined, infer tail2 extends string] ?
            ParseFieldSelectionSet<tail2> extends [infer selectionSet extends Field[] | undefined, infer tail3] ?
                [Field<identifier, undefined, fieldArguments, selectionSet>, tail3]
            : ParseFieldSelectionSet<tail2>
        : ParseFieldArguments<tail>
    : ParseIdentifier<Source>;

type ParseFieldSelectionSet<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseFieldSelectionSet<ConsumeWhitespace<Source>>
    : ConsumeWhitespace<Source> extends `{${string}` ?
        ParseSelectionSet<Source>
    : [undefined, Source];

type ParseFieldArguments<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseFieldArguments<ConsumeWhitespace<Source>>
    : Source extends `(${string}` ?
        ParseArguments<Source> extends [infer arguments, infer tail] ?
            arguments extends [] ?
                ParserError<`Arguments cannot be empty`>
            : [arguments, tail]
        : ParseArguments<Source>
    : [undefined, Source];
