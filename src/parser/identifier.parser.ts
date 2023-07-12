import { ConsumeWhitespace, isWhitespaceConsumed } from './whitespace.parser';
import { AllowedDelimiter, IdentifierAllowedChars, IdentifierAllowedStartChars } from './constants';
import { ParserError } from '../errors';
import { Head, UnexpectedCharOrEndOfSource } from '../helpers';


/**
 * @param {string} source
 * @returns [identifier: string, sourceTail: string]
 */
export type ParseIdentifier<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseIdentifier<ConsumeWhitespace<Source>>
    : Source extends `${infer char extends IdentifierAllowedStartChars}${string}` ?
        ParseIdentifierRest<Source>
    : ParserError<`Expected identifier, got ${UnexpectedCharOrEndOfSource<Source>}`>

type ParseIdentifierRest<Source extends string> =
    Source extends `${infer char extends IdentifierAllowedChars}${infer tail}` ?
        ParseIdentifierRest<tail> extends [infer identifierRest extends string, infer tail2] ?
            [`${char}${identifierRest}`, tail2]
        : ParseIdentifierRest<tail> // error pass-through
    : Source extends `${AllowedDelimiter}${string}` | '' ?
        ['', Source]
    : ParserError<`Cannot parse unexpected character '${Head<Source>}'`>;
