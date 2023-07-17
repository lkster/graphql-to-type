import { ParserError } from '../errors';
import { Head, UnexpectedCharOrEndOfSource } from '../helpers';
import { AllowedDelimiter } from './constants';
import { ConsumeWhitespace, isWhitespaceConsumed } from './whitespace.parser';
import { ParseIdentifier } from './identifier.parser';
import { Expression } from './expression';


export declare class Literal<Type extends string = string> extends Expression {
    _: 'Literal';
    type: Type;
}

export declare class ValueLiteral<Type extends string = string, Value extends string = string> extends Literal<Type> {
    value: Value;
}

export declare class StringLiteral<Value extends string = string> extends ValueLiteral<'string', Value> {}
export declare class IntLiteral<Value extends string = string> extends ValueLiteral<'int', Value> {}
export declare class FloatLiteral<Value extends string = string> extends ValueLiteral<'float', Value> {}
export declare class BooleanLiteral<Value extends string = string> extends ValueLiteral<'boolean', Value> {}
export declare class EnumLiteral<Value extends string = string> extends ValueLiteral<'enum', Value> {}
export declare class NullLiteral extends Literal<'null'> {}

export declare class VariableLiteral<Name extends string = string> extends Literal<'variable'> {
    name: Name;
}

export declare class ListLiteral<Values extends Literal[] = Literal[]> extends Literal<'list'> {
    values: Values;
}

export declare class ObjectLiteral<Fields extends ObjectLiteralField[] = ObjectLiteralField[]> extends Literal<'object'> {
    fields: Fields;
}

export declare class ObjectLiteralField<Name extends string = string, Value extends Literal = Literal> {
    _: 'ObjectLiteralField';
    name: Name;
    value: Value;
}

/**
 * @param {string} source
 *
 * @returns {[value: Literal, sourceTail: string]}
 */
export type ParseLiteral<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseLiteral<ConsumeWhitespace<Source>>
    : Source extends `${number}${string}` ?
        ParseNumberLiteral<Source>
    : Source extends `"${string}` ?
        ParseStringLiteral<Source>
    : Source extends `${boolean}${string}` ?
        ParseBooleanLiteral<Source>
    : Source extends `$${string}` ?
        ParseVariableLiteral<Source>
    : Source extends `[${string}` ?
        ParseListLiteral<Source>
    : Source extends `{${string}` ?
        ParseObjectLiteral<Source>
    : Source extends `null${string}` ?
        ParseNullLiteral<Source>
    : ParseEnumLiteral<Source>;

type ParseNumberLiteral<Source extends string> =
    Source extends `${number}${string}` ?
        ParseIntLiteral<Source> extends [infer intLiteral extends IntLiteral, infer tail] ?
            tail extends `.${infer tail2}` ?
                ParseNumberLiteral<tail2> extends [infer intLiteral2 extends IntLiteral, infer tail3] ?
                    [FloatLiteral<`${intLiteral['value']}.${intLiteral2['value']}`>, tail3]
                : ParseNumberLiteral<tail2> extends [FloatLiteral, string] ?
                    ParserError<`Expected digit, got "."`>
                : ParseNumberLiteral<tail2>
            : [intLiteral, tail]
        : ParseIntLiteral<Source> // error
    : ParserError<`Expected number, got "${Head<Source>}"`>;

type ParseIntLiteral<Source extends string> =
    Source extends `${AllowedDelimiter}${string}` | '' ? // needs to be checked first as space is considered number in condition below (TS bug?)
        [IntLiteral<''>, Source]
    : Source extends `${infer parsedNumber extends number}${infer tail}` ?
        ParseIntLiteral<tail> extends [infer intLiteral extends IntLiteral, infer tail2] ?
            [IntLiteral<`${parsedNumber}${intLiteral['value']}`>, tail2]
        : ParseIntLiteral<tail> // error
    : ParserError<`Expected digit, got "${Head<Source>}"`>;

type ParseStringLiteral<Source extends string> =
    Source extends `"""${infer tail}` ?
        ParseStringLiteralBody<tail> extends [infer stringBody extends string, infer tail2] ?
            tail2 extends `"""${infer tail3}` ?
                [StringLiteral<stringBody>, tail3]
            : ParserError<`Expected '"', got end of source`>
        : ParseStringLiteralBody<tail>
    : Source extends `"${infer tail}` ?
        ParseStringLiteralBody<tail> extends [infer stringBody extends string, infer tail2] ?
            tail2 extends `"${infer tail3}` ?
                [StringLiteral<stringBody>, tail3]
            : ParserError<`Expected '"', got end of source`>
        : ParseStringLiteralBody<tail>
    : ParserError<`Expected string, got "${Head<Source>}"`>

type ParseStringLiteralBody<Source extends string> =
    Source extends `"${string}` ?
        ['', Source]
    : Source extends `${infer head}${infer tail}` ?
        head extends '\\' ?
            tail extends `${infer escapedChar}${infer tail2}` ?
                ParseStringLiteralBody<tail2> extends [infer stringRest extends string, infer tail3] ?
                    [`\\${escapedChar}${stringRest}`, tail3]
                : ParseStringLiteralBody<tail2> // error
            : never
        : ParseStringLiteralBody<tail> extends [infer stringRest extends string, infer tail3] ?
            [`${head}${stringRest}`, tail3]
        : ParseStringLiteralBody<tail>
    : never;

type ParseBooleanLiteral<Source extends string> =
    Source extends `true${infer tail}` ?
        tail extends `${AllowedDelimiter}${string}` | '' ?
            [BooleanLiteral<'true'>, tail]
        : ParseEnumLiteral<Source>
    : Source extends `false${infer tail}` ?
        tail extends `${AllowedDelimiter}${string}` | '' ?
            [BooleanLiteral<'false'>, tail]
        : ParseEnumLiteral<Source>
    : ParserError<`Expected boolean value`>;

type ParseVariableLiteral<Source extends string> =
    Source extends `$${infer tail}` ?
        ParseIdentifier<tail> extends [infer identifier extends string, infer tail2 extends string] ?
            [VariableLiteral<identifier>, tail2]
        : ParseIdentifier<tail>
    : ParserError<`Expected "$", got ${UnexpectedCharOrEndOfSource<Source>}`>;

type ParseListLiteral<Source extends string> =
    Source extends `[${infer tail}` ?
        ParseListLiteralBody<ConsumeWhitespace<tail>> extends [infer literals extends Literal[], infer tail2 extends string] ?
            ConsumeWhitespace<tail2> extends `]${infer tail3}` ?
                [ListLiteral<literals>, tail3]
            : ParserError<`Expected "]", got end of source`>
        : ParseListLiteralBody<tail>
    : ParserError<`Expected "[", got "${Head<Source>}"`>

type ParseListLiteralBody<Source extends string> =
    Source extends `]${string}` | '' ?
        [[], Source]
    : ParseLiteral<Source> extends [infer literal extends Literal, infer tail extends string] ?
        ParseListLiteralBody<ConsumeWhitespace<tail>> extends [infer restLiterals extends Literal[], infer tail2] ?
            [[literal, ...restLiterals], tail2]
        : ParseListLiteralBody<tail>
    : ParseLiteral<Source>;

type ParseObjectLiteral<Source extends string> =
    Source extends `{${infer tail}` ?
        ParseObjectLiteralBody<tail> extends [infer objectLiteralFields extends ObjectLiteralField[], infer tail2 extends string] ?
            ConsumeWhitespace<tail2> extends `}${infer tail3}` ?
                [ObjectLiteral<objectLiteralFields>, tail3]
            : ParserError<`Expected "}", got end of source`>
        : ParseObjectLiteralBody<tail>
    : ParserError<`Expected "{", got "${Head<Source>}"`>;

type ParseObjectLiteralBody<Source extends string> =
    ConsumeWhitespace<Source> extends `}${string}` ?
        [[], Source]
    : ParseIdentifier<Source> extends [infer identifier extends string, infer tail extends string] ?
        ConsumeWhitespace<tail> extends `:${infer tail2}` ?
            ParseLiteral<tail2> extends [infer literal extends Literal, infer tail3 extends string] ?
                ParseObjectLiteralBody<tail3> extends [infer restObjectLiteralFields extends ObjectLiteralField[], infer tail4 extends string] ?
                    [[ObjectLiteralField<identifier, literal>, ...restObjectLiteralFields], tail4]
                : ParseObjectLiteralBody<tail3>
            : ParseLiteral<tail2>
        : ParserError<`Expected ":", got ${UnexpectedCharOrEndOfSource<tail>}`>
    : ParseIdentifier<Source>;

type ParseEnumLiteral<Source extends string> =
    ParseIdentifier<Source> extends [infer identifier extends string, infer tail extends string] ?
        [EnumLiteral<identifier>, tail]
    : ParseIdentifier<Source>;

type ParseNullLiteral<Source extends string> =
    ParseIdentifier<Source> extends [infer identifier extends string, infer tail extends string] ?
        identifier extends 'null' ?
            [NullLiteral, tail]
        : ParseEnumLiteral<Source>
    : ParseIdentifier<Source>
