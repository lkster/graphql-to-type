import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { ListType, NamedType, ParseType } from '../../src/parser/type.parser';
import { ParserError } from '../../src/errors';


describe('Type Parser', () => {
    it('should properly parse named type', () => {
        type actual1 = ParseType<'ID'>;
        type expected1 = [NamedType<'ID', false>, ''];

        type actual2 = ParseType<'  String'>;
        type expected2 = [NamedType<'String', false>, ''];

        type actual3 = ParseType<'\nInt\n   '>;
        type expected3 = [NamedType<'Int', false>, '\n   '];

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
        type test3 = Expect<Equal<actual3, expected3>>;
    });

    it('should properly parse list type', () => {
        type actual1 = ParseType<'[ ID ]'>;
        type expected1 = [ListType<NamedType<'ID', false>, false>, ''];

        type actual2 = ParseType<'\n\t[[String]]\n'>;
        type expected2 = [ListType<ListType<NamedType<'String', false>, false>, false>, '\n'];

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
    });

    it('should return ParserError if list has not been closed', () => {
        type actual1 = ParseType<'[ID'>;
        type expected1 = ParserError<'Expected ]'>;

        type test1 = Expect<Equal<actual1, expected1>>;
    });

    it('should properly mark required types', () => {
        type actual1 = ParseType<'ID!'>;
        type expected1 = [NamedType<'ID', true>, ''];

        type actual2 = ParseType<'  [String]!'>;
        type expected2 = [ListType<NamedType<'String', false>, true>, ''];

        type actual3 = ParseType<`
            [
                [
                    Float!
                ]!
            ]!
        `>;
        type expected3 = [ListType<ListType<NamedType<'Float', true>, true>, true>, '\n        '];

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
        type test3 = Expect<Equal<actual3, expected3>>;
    });
});
