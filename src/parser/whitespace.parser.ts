import { LineFeed, Whitespace } from './constants';
import { Head } from '../helpers';


export type isWhitespaceConsumed<Source extends string> =
    Head<Source> extends Whitespace ? false : true;

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
