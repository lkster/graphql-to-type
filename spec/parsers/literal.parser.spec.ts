import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { BooleanLiteral, EnumLiteral, FloatLiteral, IntLiteral, ListLiteral, NullLiteral, ObjectLiteral, ObjectLiteralField, ParseLiteral, StringLiteral, VariableLiteral } from '../../src/parser/literal.parser';
import { ParserError } from '../../src/errors';



describe('Literal Parser', () => {
    describe('parsing string', () => {
        it('should properly parse valid string', () => {
            type actual1 = ParseLiteral<'"string"'>;
            type expected1 = [StringLiteral<'string'>, ''];

            type actual2 = ParseLiteral<'   "something \\" with escaped \n\n quote"  anything else'>;
            type expected2 = [StringLiteral<'something \\" with escaped \n\n quote'>, '  anything else'];

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should properly parse valid block string', () => {
            type actual1 = ParseLiteral<'  """block string""" '>;
            type expected1 = [StringLiteral<'block string'>, ' '];

            type actual2 = ParseLiteral<'   """ some block string \\" with escaped \n\n quote"""  anything else'>;
            type expected2 = [StringLiteral<' some block string \\" with escaped \n\n quote'>, '  anything else'];

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should return error if parsed string is invalid', () => {
            type actual1 = ParseLiteral<'  "invalid string'>;
            type expected1 = ParserError<`Expected '"', got end of source`>;

            type actual2 = ParseLiteral<'   """some block string  \n'>;
            type expected2 = ParserError<`Expected '"', got end of source`>;

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });
    });

    describe('parsing number', () => {
        it('should properly parse valid int', () => {
            type actual1 = ParseLiteral<'123'>;
            type expected1 = [IntLiteral<'123'>, ''];

            type actual2 = ParseLiteral<'  4362345  \n'>;
            type expected2 = [IntLiteral<'4362345'>, '  \n'];

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should properly parse valid float', () => {
            type actual1 = ParseLiteral<'123.236'>;
            type expected1 = [FloatLiteral<'123.236'>, ''];

            type actual2 = ParseLiteral<'  0.25  \n'>;
            type expected2 = [FloatLiteral<'0.25'>, '  \n'];

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should return error if parsed number is invalid', () => {
            type actual1 = ParseLiteral<'420lol'>;
            type expected1 = ParserError<`Expected digit, got "l"`>;

            type actual2 = ParseLiteral<'  123.123.123  \n'>;
            type expected2 = ParserError<`Expected digit, got "."`>;

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });
    });

    describe('parsing boolean', () => {
        it('should properly parse valid boolean', () => {
            type actual1 = ParseLiteral<'true  '>;
            type expected1 = [BooleanLiteral<'true'>, '  '];

            type actual2 = ParseLiteral<'\n\nfalse'>;
            type expected2 = [BooleanLiteral<'false'>, ''];

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });
    });

    describe('parsing list', () => {
        it('should properly parse valid list', () => {
            type actual1 = ParseLiteral<'[ true, false 123  ]  '>;
            type expected1 = [ListLiteral<[BooleanLiteral<'true'>, BooleanLiteral<'false'>, IntLiteral<'123'>]>, '  '];

            type actual2 = ParseLiteral<'  [,,,[ false, ]\n]'>;
            type expected2 = [ListLiteral<[ListLiteral<[BooleanLiteral<'false'>]>]>, ''];

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should return error if parsed list is invalid', () => {
            type actual1 = ParseLiteral<'[ true, false 123    '>;
            type expected1 = ParserError<`Expected "]", got end of source`>;

            type test1 = Expect<Equal<actual1, expected1>>;
        });
    });

    describe('parsing object', () => {
        it('should properly parse valid object', () => {
            type actual1 = ParseLiteral<'  { test1: true test2: [true ] }'>;
            type expected1 = [
                ObjectLiteral<[
                    ObjectLiteralField<'test1', BooleanLiteral<'true'>>,
                    ObjectLiteralField<'test2', ListLiteral<[BooleanLiteral<'true'>]>>
                ]>,
                '',
            ];

            type actual2 = ParseLiteral<'\n\n\n{ nested: { nested: { something: false } } }\t'>;
            type expected2 = [
                ObjectLiteral<[
                    ObjectLiteralField<'nested', ObjectLiteral<[
                        ObjectLiteralField<'nested', ObjectLiteral<[
                            ObjectLiteralField<'something', BooleanLiteral<'false'>>
                        ]>>
                    ]>>,
                ]>,
                '\t',
            ];

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should return error if parsed object is invalid', () => {
            type actual1 = ParseLiteral<'  { test1: true test2: [true ] '>;
            type expected1 = ParserError<'Expected identifier, got end of source'>;

            type actual2 = ParseLiteral<'\n\n\n{ nested: }\t'>;
            type expected2 = ParserError<'Expected identifier, got "}"'>;

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });
    });

    describe('parsing variable', () => {
        it('should properly parse valid variable', () => {
            type actual1 = ParseLiteral<'  $var'>;
            type expected1 = [
                VariableLiteral<'var'>,
                '',
            ];

            type actual2 = ParseLiteral<'\n\n\n$v4r14bl3\t'>;
            type expected2 = [
                VariableLiteral<'v4r14bl3'>,
                '\t',
            ];

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should return error if parsed variable is invalid', () => {
            type actual1 = ParseLiteral<'  $0k '>;
            type expected1 = ParserError<'Expected identifier, got "0"'>;

            type actual2 = ParseLiteral<'\n\n\n$\t'>;
            type expected2 = ParserError<'Expected identifier, got end of source'>;

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });
    });

    describe('parsing enum', () => {
        it('should properly parse valid enum', () => {
            type actual1 = ParseLiteral<'  ENUM_VALUE '>;
            type expected1 = [EnumLiteral<'ENUM_VALUE'>, ' '];

            type actual2 = ParseLiteral<'falsea'>;
            type expected2 = [EnumLiteral<'falsea'>, ''];

            type actual3 = ParseLiteral<'nullify'>;
            type expected3 = [EnumLiteral<'nullify'>, ''];

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
            type test3 = Expect<Equal<actual3, expected3>>;
        });

        it('should return error if parsed enum is invalid', () => {
            type actual1 = ParseLiteral<'3NUM'>;
            type expected1 = ParserError<`Expected digit, got "N"`>;

            type actual2 = ParseLiteral<'+Enum'>;
            type expected2 = ParserError<`Expected identifier, got "+"`>;

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });
    });

    describe('parsing null', () => {
        it('should properly parse null', () => {
            type actual = ParseLiteral<'null  '>;
            type expected = [NullLiteral, '  '];

            type test = Expect<Equal<actual, expected>>;
        });
    });
});
