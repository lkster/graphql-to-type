import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { ParserError } from '../../src/errors';
import { Argument, Variable } from '../../src/parser/arguments.parser';
import { IntLiteral, VariableLiteral } from '../../src/parser/literal.parser';
import { Operation, ParseOperation } from '../../src/parser/operation.parser';
import { Field } from '../../src/parser/selection.parser';
import { NamedType } from '../../src/parser/type.parser';


describe('Operation Parser', () => {
    it('should properly parse default operation', () => {
        type actual = ParseOperation<`
            {
                user(id: 2) {
                    id
                    username
                    posts {
                        id
                    }
                }
            }
        `>;

        type expected = [
            Operation<
                'query',
                undefined,
                undefined,
                [
                    Field<'user', undefined, [
                        Argument<'id', IntLiteral<'2'>>
                    ], [
                        Field<'id', undefined, undefined, undefined>,
                        Field<'username', undefined, undefined, undefined>,
                        Field<'posts', undefined, undefined, [
                            Field<'id', undefined, undefined, undefined>
                        ]>,  
                    ]>
                ]
            >,
            '\n        ',
        ];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly parse operation with variables', () => {
        type actual = ParseOperation<`
            query ($userId: ID!, $var2: String) {
                user(id: $userId) {
                    username
                }
            }
        `>;

        type expected = [
            Operation<
                'query',
                undefined,
                [
                    Variable<VariableLiteral<'userId'>, NamedType<'ID', true>>,
                    Variable<VariableLiteral<'var2'>, NamedType<'String', false>>
                ],
                [
                    Field<'user', undefined, [
                        Argument<'id', VariableLiteral<'userId'>>
                    ], [
                        Field<'username', undefined, undefined, undefined>
                    ]>,
                ]
            >,
            '\n        ',
        ];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should return error if variables are provided without operation type specified', () => {
        type actual = ParseOperation<`
            ($var1: ID!, $var2: String) {
                id
            }
        `>;

        type expected = ParserError<'Unknown operation type'>;

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly parse operation with name', () => {
        type actual = ParseOperation<`
            query getUser {
                username
            }
        `>;

        type expected = [
            Operation<
                'query',
                'getUser',
                undefined,
                [
                    Field<'username', undefined, undefined, undefined>,
                ]
            >,
            '\n        ',
        ];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should return error if name is provided without operation type specified', () => {
        type actual = ParseOperation<`
            getUser {
                username
            }
        `>;

        type expected = ParserError<'Unknown operation type'>;

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly parse operation with name and variables', () => {
        type actual = ParseOperation<`
            query getUser ($userId: ID!, $var2: String) {
                user(id: $userId) {
                    username
                }
            }
        `>;

        type expected = [
            Operation<
                'query',
                'getUser',
                [
                    Variable<VariableLiteral<'userId'>, NamedType<'ID', true>>,
                    Variable<VariableLiteral<'var2'>, NamedType<'String', false>>
                ],
                [
                    Field<'user', undefined, [
                        Argument<'id', VariableLiteral<'userId'>>
                    ], [
                        Field<'username', undefined, undefined, undefined>
                    ]>,
                ]
            >,
            '\n        ',
        ];

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly parse all valid operation types', () => {
        type actual1 = ParseOperation<`
            query {
                id
            }
        `>;
        type expected1 = [
            Operation<
                'query',
                undefined,
                undefined,
                [
                    Field<'id', undefined, undefined, undefined>
                ]
            >,
            '\n        '
        ];

        type actual2 = ParseOperation<`
            mutation {
                id
            }
        `>;
        type expected2 = [
            Operation<
                'mutation',
                undefined,
                undefined,
                [
                    Field<'id', undefined, undefined, undefined>
                ]
            >,
            '\n        '
        ];

        type actual3 = ParseOperation<`
            subscription {
                id
            }
        `>;
        type expected3 = [
            Operation<
                'subscription',
                undefined,
                undefined,
                [
                    Field<'id', undefined, undefined, undefined>
                ]
            >,
            '\n        '
        ];

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
        type test3 = Expect<Equal<actual3, expected3>>;
    });
});
