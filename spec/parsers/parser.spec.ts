import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { Argument, Variable } from '../../src/parser/arguments.parser';
import { IntLiteral, VariableLiteral } from '../../src/parser/literal.parser';
import { Operation } from '../../src/parser/operation.parser';
import { ParseSource } from '../../src/parser/parser';
import { Field } from '../../src/parser/selection.parser';
import { NamedType } from '../../src/parser/type.parser';
import { Directive } from '../../src/parser/directives.parser';


describe('Parser', () => {
    it('should properly parse provided source', () => {
        type actual = ParseSource<`
            query getPlanets($first: Int! = 10) {
                allPlanets(first: $first) {
                    planets {
                        name
                        gravity
                    }
                }
            }

            query getPeople($first: Int! = 10) {
                allPeople(first: $first) {
                    people {
                        name
                        gender
                        eyeColor @deprecated
                        planet {
                            name
                        }
                    }
                }
            }
        `>;

        type expected = [
            Operation<
                'query',
                'getPlanets',
                [
                    Variable<VariableLiteral<'first'>, NamedType<'Int', true>, IntLiteral<'10'>>
                ],
                [
                    Field<'allPlanets', undefined, [Argument<'first', VariableLiteral<'first'>>], [
                        Field<'planets', undefined, undefined, [
                            Field<'name', undefined, undefined, undefined, undefined>,
                            Field<'gravity', undefined, undefined, undefined, undefined>
                        ], undefined>
                    ], undefined>
                ],
                undefined
            >,
            Operation<
                'query',
                'getPeople',
                [
                    Variable<VariableLiteral<'first'>, NamedType<'Int', true>, IntLiteral<'10'>>
                ],
                [
                    Field<'allPeople', undefined, [Argument<'first', VariableLiteral<'first'>>], [
                        Field<'people', undefined, undefined, [
                            Field<'name', undefined, undefined, undefined, undefined>,
                            Field<'gender', undefined, undefined, undefined, undefined>,
                            Field<'eyeColor', undefined, undefined, undefined, [Directive<'deprecated'>]>,
                            Field<'planet', undefined, undefined, [
                                Field<'name', undefined, undefined, undefined, undefined>
                            ], undefined>
                        ], undefined>
                    ], undefined>
                ],
                undefined
            >
        ];

        type test = Expect<Equal<actual, expected>>;
    });
});
