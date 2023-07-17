// https://spec.graphql.org/draft/#sec-Response

export type GraphQlRawResponse<Data> = {
    readonly data?: Data | null;
    readonly errors?: GraphQlError[];
    readonly extensions?: Readonly<Record<string, any>>;
}

export type GraphQlError = {
    readonly message: string;
    readonly locations: ReadonlyArray<SourceLocation>;
    readonly path?: ReadonlyArray<string | number>;
    readonly extensions?: Readonly<Record<string, any>>;
}

type SourceLocation = {
    readonly line: number;
    readonly column: number;
}
