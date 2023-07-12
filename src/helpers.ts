export type Head<T extends string> =
    T extends `${infer Head}${string}` ?
        Head
        : '';

export type Tail<T extends string> =
    T extends `${string}${infer Tail}` ?
        Tail
        : '';

export type UnexpectedCharOrEndOfSource<Source extends string> =
    Source extends '' ?
        'end of source'
    : `"${Head<Source>}"`;
