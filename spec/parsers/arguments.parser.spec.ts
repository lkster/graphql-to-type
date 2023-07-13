import { Argument, ParseArguments, Variable } from '../../src/parser/arguments.parser';
import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { BooleanLiteral, IntLiteral, ListLiteral, StringLiteral, VariableLiteral } from '../../src/parser/literal.parser';
import { ListType, NamedType } from '../../src/parser/type.parser';
import { ParserError } from '../../src/errors';


describe('Arguments Parser', () => {
    it('should properly parse arguments', () => {
        type actual1 = ParseArguments<'  (arg1: "ok", \narg2: true)'>;
        type expected1 = [
            [
                Argument<'arg1', StringLiteral<'ok'>>,
                Argument<'arg2', BooleanLiteral<'true'>>,
            ],
            '',
        ];

        type actual2 = ParseArguments<'  (ArG1: [true] \narg2: 23)\n\n\t'>;
        type expected2 = [
            [
                Argument<'ArG1', ListLiteral<[BooleanLiteral<'true'>]>>,
                Argument<'arg2', IntLiteral<'23'>>,
            ],
            '\n\n\t',
        ];

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
    });

    it('should properly parse variables', () => {
        type actual1 = ParseArguments<'  ($var1: ID!, \n$  var2   : Int)', true>;
        type expected1 = [
            [
                Variable<VariableLiteral<'var1'>, NamedType<'ID', true>, undefined>,
                Variable<VariableLiteral<'var2'>, NamedType<'Int', false>, undefined>,
            ],
            '',
        ];

        type actual2 = ParseArguments<'  ($VaR1: [String]! \n$var2: Boolean)\n\n\t', true>;
        type expected2 = [
            [
                Variable<VariableLiteral<'VaR1'>, ListType<NamedType<'String', false>, true>, undefined>,
                Variable<VariableLiteral<'var2'>, NamedType<'Boolean', false>, undefined>,
            ],
            '\n\n\t',
        ];

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
    });

    it('should properly parse variables with default values', () => {
        type actual = ParseArguments<'($var1: String = "something", $var2: Int! = 420)', true>;
        type expected = [
            [
                Variable<VariableLiteral<'var1'>, NamedType<'String', false>, StringLiteral<'something'>>,
                Variable<VariableLiteral<'var2'>, NamedType<'Int', true>, IntLiteral<'420'>>,
            ],
            '',
        ];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should return error if parsed arguments are invalid', () => {
        type actual1 = ParseArguments<`(arg1: )`>;
        type expected1 = ParserError<'Expected identifier, got ")"'>;

        type actual2 = ParseArguments<` (arg1: "a"  `>;
        type expected2 = ParserError<'Expected ")", got end of source'>;

        type actual3 = ParseArguments<` (arg1 )`>;
        type expected3 = ParserError<`Expected ":", got ")"`>;

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
        type test3 = Expect<Equal<actual3, expected3>>;
    });

    it('should return error if parsed variables are invalid', () => {
        type actual1 = ParseArguments<`($arg1: )`, true>;
        type expected1 = ParserError<'Expected identifier, got ")"'>;

        type actual2 = ParseArguments<` ($arg1: ID!  `, true>;
        type expected2 = ParserError<'Expected ")", got end of source'>;

        type actual3 = ParseArguments<` ($arg1 )`, true>;
        type expected3 = ParserError<`Expected ":", got ")"`>;

        type actual4 = ParseArguments<` (arg1: String )`, true>;
        type expected4 = ParserError<'Expected variable to start with $'>;

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
        type test3 = Expect<Equal<actual3, expected3>>;
        type test4 = Expect<Equal<actual4, expected4>>;
    });
});
