export type Head<T extends string> =
    T extends `${infer head}${string}` ?
        head
    : '';

export type Tail<T extends string> =
    T extends `${string}${infer tail}` ?
        tail
    : '';

export type UnexpectedCharOrEndOfSource<Source extends string> =
    Source extends '' ?
        'end of source'
    : `"${Head<Source>}"`;
