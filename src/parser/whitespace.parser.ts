import { Whitespace } from './constants';
import { Head } from '../helpers';


export type isWhitespaceConsumed<T extends string> =
    Head<T> extends Whitespace ? false : true;

export type ConsumeWhitespace<T extends string> =
    T extends `${infer Head}${infer Tail}` ?
        Head extends Whitespace ?
            ConsumeWhitespace<Tail>
        : T
    : T;
