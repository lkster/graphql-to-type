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

export type NormalizeObject<Obj extends Record<any, any>> =
    {
        [key in keyof Obj]: Obj[key]
    } | never;

export type NullOrUndefined<Type> =
    Type extends undefined ?
        Type
    : Type extends null ?
        Type
    : never;
