import { Directive, ParseDirectives } from '../../src/parser/directives.parser';
import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { Argument } from '../../src/parser/arguments.parser';
import { IntLiteral } from '../../src/parser/literal.parser';


describe('Directives Parser', () => {
    it('should properly parse directive', () => {
        type actual = ParseDirectives<`@directive`>;

        type expected = [
            [Directive<'directive'>],
            '',
        ];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly parse directive with arguments', () => {
        type actual = ParseDirectives<`@directive(arg1: 420)`>;

        type expected = [
            [
                Directive<'directive', [Argument<'arg1', IntLiteral<'420'>>]>,
            ],
            '',
        ];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly parse many directives', () => {
        type actual = ParseDirectives<`@directive1 @directive2  (arg1: 22, arg2: 0)`>;

        type expected = [
            [
                Directive<'directive1'>,
                Directive<'directive2', [Argument<'arg1', IntLiteral<'22'>>, Argument<'arg2', IntLiteral<'0'>>]>,
            ],
            '',
        ];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should return empty array if there are no directives', () => {
        type actual1 = ParseDirectives<``>;
        type actual2 = ParseDirectives<`query {}`>;

        type expected1 = [[], ''];
        type expected2 = [[], 'query {}'];

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
    });
});
