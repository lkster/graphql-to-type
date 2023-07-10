export type Head<T extends string> =
    T extends `${infer Head}${string}` ?
        Head
        : '';

export type Tail<T extends string> =
    T extends `${string}${infer Tail}` ?
        Tail
        : '';
