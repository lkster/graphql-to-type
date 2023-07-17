import { LineFeed, Whitespace } from './constants';
import { Head } from '../helpers';


/**
 * @param {string} source
 *
 * @returns {boolean}  whether very first char in provided source is whitespace
 */
export type isWhitespaceConsumed<Source extends string> =
    Head<Source> extends Whitespace ? false : true;

/**
 * @param {string} source
 *
 * @returns {string}
 */
export type ConsumeWhitespace<Source extends string> =
    Source extends `${infer head}${infer tail}` ?
        head extends '#' ?
            ConsumeWhitespace<ParseComment<Source>>
        : head extends Whitespace ?
            ConsumeWhitespace<tail>
        : Source
    : Source;

type ParseComment<Source extends string> =
    Source extends `#${string}${LineFeed}${infer tail}` ?
        tail
    : Source;
