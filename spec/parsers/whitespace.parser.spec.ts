import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { isWhitespaceConsumed, ConsumeWhitespace } from '../../src/parser/whitespace.parser';


describe('Whitespace Parser', () => {
    describe('isWhitespaceConsumed', () => {
        it('should return true if whitespace is consumed', () => {
            type actual = isWhitespaceConsumed<'query'>;

            type test = Expect<Equal<actual, true>>;
        });

        it('should return false if whitespace is not consumed', () => {
            type actual1 = isWhitespaceConsumed<' query'>;
            type actual2 = isWhitespaceConsumed<'\nquery'>;
            type actual3 = isWhitespaceConsumed<'\r\nquery'>;
            type actual4 = isWhitespaceConsumed<'\tquery'>;
            type actual5 = isWhitespaceConsumed<`
                query
            `>;

            type test1 = Expect<Equal<actual1, false>>;
            type test2 = Expect<Equal<actual2, false>>;
            type test3 = Expect<Equal<actual3, false>>;
            type test4 = Expect<Equal<actual4, false>>;
            type test5 = Expect<Equal<actual5, false>>;
        });
    });

    describe('ConsumeWhitespace', () => {
        it('should consume whitespace in provided source', () => {
            type actual1 = ConsumeWhitespace<' query'>;
            type actual2 = ConsumeWhitespace<'\n\n\nquery'>;
            type actual3 = ConsumeWhitespace<'\r\n\n\tquery'>;
            type actual4 = ConsumeWhitespace<`
                query`>;

            type test1 = Expect<Equal<actual1, 'query'>>;
            type test2 = Expect<Equal<actual2, 'query'>>;
            type test3 = Expect<Equal<actual3, 'query'>>;
            type test4 = Expect<Equal<actual4, 'query'>>;
        });
    });
});
