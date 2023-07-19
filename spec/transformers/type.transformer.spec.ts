import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { ParseType } from '../../src/parser/type.parser';
import { TransformType } from '../../src/transformer/type.transformer';
import { TypeMap } from '../test-schema';


describe('Type Transformer', () => {
    it('should properly transform required type', () => {
        type type1 = ParseType<'ID!'>[0];
        type actual1 = TransformType<type1, TypeMap>;
        type expected1 = string;

        type type2 = ParseType<'Int!'>[0];
        type actual2 = TransformType<type2, TypeMap>;
        type expected2 = number;

        type type3 = ParseType<'Date!'>[0];
        type actual3 = TransformType<type3, TypeMap>;
        type expected3 = Date;

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
        type test3 = Expect<Equal<actual3, expected3>>;
    });

    it('should properly transform optional type', () => {
        type type1 = ParseType<'ID'>[0];
        type actual1 = TransformType<type1, TypeMap>;
        type expected1 = string | null;

        type type2 = ParseType<'Int'>[0];
        type actual2 = TransformType<type2, TypeMap>;
        type expected2 = number | null;

        type type3 = ParseType<'Date'>[0];
        type actual3 = TransformType<type3, TypeMap>;
        type expected3 = Date | null;

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
        type test3 = Expect<Equal<actual3, expected3>>;
    });

    it('should properly transform required list type with required type', () => {
        type type = ParseType<'[String!]!'>[0];
        type actual = TransformType<type, TypeMap>;
        type expected = string[];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly transform required list type with optional type', () => {
        type type = ParseType<'[String]!'>[0];
        type actual = TransformType<type, TypeMap>;
        type expected = (string | null)[];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly transform optional list type with required type', () => {
        type type = ParseType<'[String!]'>[0];
        type actual = TransformType<type, TypeMap>;
        type expected = string[] | null;

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly transform optional list type with optional type', () => {
        type type = ParseType<'[String]'>[0];
        type actual = TransformType<type, TypeMap>;
        type expected = (string | null)[] | null;

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly transform multi-dimensional lists', () => {
        type type1 = ParseType<'[[[String!]]!]'>[0];
        type actual1 = TransformType<type1, TypeMap>;
        type expected1 = (string[] | null)[][] | null;

        type type2 = ParseType<'[[Int]!]!'>[0];
        type actual2 = TransformType<type2, TypeMap>;
        type expected2 = (number | null)[][];

        type type3 = ParseType<'[[[[Float!]!]!]!]!'>[0];
        type actual3 = TransformType<type3, TypeMap>;
        type expected3 = number[][][][];

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
        type test3 = Expect<Equal<actual3, expected3>>;
    });
});
