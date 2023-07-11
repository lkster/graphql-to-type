import { ParseIdentifier } from '../../src/parser/identifier.parser';
import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { ParserError } from '../../src/errors';


describe('Identifier Parser', () => {
    describe('ParseIdentifier', () => {
        it('should properly parse valid identifiers', () => {
            type actual1 = ParseIdentifier<'someIdentifier'>;
            type expected1 = ['someIdentifier', ''];

            type actual2 = ParseIdentifier<'   someIdentifier, anything else'>;
            type expected2 = ['someIdentifier', ', anything else'];

            type actual3 = ParseIdentifier<' id3nt1f13r '>;
            type expected3 = ['id3nt1f13r', ' '];

            type actual4 = ParseIdentifier<'queryName($variable: String)'>;
            type expected4 = ['queryName', '($variable: String)']

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
            type test3 = Expect<Equal<actual3, expected3>>;
            type test4 = Expect<Equal<actual4, expected4>>;
        });

        it('should return ParserError if provided source does not start with valid identifier', () => {
            type error = 'Expected identifier, got';

            type actual1 = ParseIdentifier<'($variable: String)'>;
            type actual2 = ParseIdentifier<'{ selections }'>;
            type actual3 = ParseIdentifier<'+Date'>;
            type actual4 = ParseIdentifier<'1d3nt1f13r'>;

            type test1 = Expect<Equal<actual1, ParserError<`${error} (`>>>
            type test2 = Expect<Equal<actual2, ParserError<`${error} {`>>>
            type test3 = Expect<Equal<actual3, ParserError<`${error} +`>>>
            type test4 = Expect<Equal<actual4, ParserError<`${error} 1`>>>
        });

        it('should return ParserError if provided source is not valid identifier', () => {
            type error = 'Cannot parse unexpected character';

            type actual1 = ParseIdentifier<'id*3nt'>;
            type actual2 = ParseIdentifier<'ident+ifier'>;
            type actual3 = ParseIdentifier<'id3nt1fi%r'>;

            type test1 = Expect<Equal<actual1, ParserError<`${error} '*'`>>>
            type test2 = Expect<Equal<actual2, ParserError<`${error} '+'`>>>
            type test3 = Expect<Equal<actual3, ParserError<`${error} '%'`>>>
        });
    });
});
