import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { ParserError } from '../../src/errors';
import { Argument } from '../../src/parser/arguments.parser';
import { IntLiteral } from '../../src/parser/literal.parser';
import { Field, ParseSelectionSet } from '../../src/parser/selection.parser';


describe('Selection Parser', () => {
    describe('selection set', () => {
        it('should properly parse valid selection set', () => {
            type actual = ParseSelectionSet<`{
                id
                username
                firstName
                fullName
            }`>;
    
            type expected = [
                [
                    Field<'id', undefined, undefined, undefined>,
                    Field<'username', undefined, undefined, undefined>,
                    Field<'firstName', undefined, undefined, undefined>,
                    Field<'fullName', undefined, undefined, undefined>,
                ],
                '',
            ];
    
            type test = Expect<Equal<actual, expected>>;
        });
    
        it('should properly parse nested selection sets', () => {
            type actual = ParseSelectionSet<`{
                id
                body
                comments {
                    author {
                        id
                        username
                    }
                    body
                }
                likesCount
            }`>;
    
            type expected = [
                [
                    Field<'id', undefined, undefined, undefined>,
                    Field<'body', undefined, undefined, undefined>,
                    Field<'comments', undefined, undefined, [
                        Field<'author', undefined, undefined, [
                            Field<'id', undefined, undefined, undefined>,
                            Field<'username', undefined, undefined, undefined>,
                        ]>,
                        Field<'body', undefined, undefined, undefined>,
                    ]>,
                    Field<'likesCount', undefined, undefined, undefined>,
                ],
                '',
            ];
    
            type test = Expect<Equal<actual, expected>>;
        });
    
        it('should properly parse selections with arguments', () => {
            type actual = ParseSelectionSet<`{
                body
                comments(max: 100, offset: 0) {
                    body
                }
            }`>;
    
            type expected = [
                [
                    Field<'body', undefined, undefined, undefined>,
                    Field<'comments', undefined, [
                        Argument<'max', IntLiteral<'100'>>,
                        Argument<'offset', IntLiteral<'0'>>,
                    ], [
                        Field<'body', undefined, undefined, undefined>,
                    ]>,
                ],
                '',
            ];
    
            type test = Expect<Equal<actual, expected>>;
        });
    
        it('should properly parse selections with alias', () => {
            type actual = ParseSelectionSet<`{
                id
                body
                comments {
                    creator: author {
                        id
                        username
                    }
                    body
                }
                likes: likesCount
            }`>;
    
            type expected = [
                [
                    Field<'id', undefined, undefined, undefined>,
                    Field<'body', undefined, undefined, undefined>,
                    Field<'comments', undefined, undefined, [
                        Field<'author', 'creator', undefined, [
                            Field<'id', undefined, undefined, undefined>,
                            Field<'username', undefined, undefined, undefined>,
                        ]>,
                        Field<'body', undefined, undefined, undefined>,
                    ]>,
                    Field<'likesCount', 'likes', undefined, undefined>,
                ],
                '',
            ];
    
            type test = Expect<Equal<actual, expected>>;
        });

        it('should return error if selection set is empty', () => {
            type actual1 = ParseSelectionSet<`{}`>;
            type expected1 = ParserError<'Selection set cannot be empty'>;

            type actual2 = ParseSelectionSet<`{ comment { } }`>;
            type expected2 = ParserError<'Selection set cannot be empty'>;
    
            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should return error if arguments are empty', () => {
            type actual = ParseSelectionSet<`{ comment() { body } }`>;
            type expected = ParserError<'Arguments cannot be empty'>;
    
            type test1 = Expect<Equal<actual, expected>>;
        });


        it('should return error if parsed selection is invalid', () => {
            type actual1 = ParseSelectionSet<`{ id `>;
            type expected1 = ParserError<'Expected identifier, got end of source'>;

            type actual2 = ParseSelectionSet<`{ +@ }`>;
            type expected2 = ParserError<'Expected identifier, got "+"'>;

            type actual3 = ParseSelectionSet<`ident`>;
            type expected3 = ParserError<'Expected "{", got "i"'>;

            type actual4 = ParseSelectionSet<`{ user: as: name }`>;
            type expected4 = ParserError<`Selection can't have multiple aliases`>;
    
            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
            type test3 = Expect<Equal<actual3, expected3>>;
            type test4 = Expect<Equal<actual4, expected4>>;
        });
    });
});
