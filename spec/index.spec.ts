import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { GraphQlError, GraphQlOperation, GraphQlOperationName, GraphQlOperationType, GraphQlResponse, GraphQlVariables } from '../src';
import { TypeMap } from './test-schema';


const query = `
    query getMedia($id: Int!, $season: Int) {
        media(id: $id, season: $season) {
            title {
                english
            }
            season
            episodes
            episode1: episode(id: 1) {
                title
                duration
            }
            episode2: episode(id: 2) {
                title
                duration
            }
        }
    }
`;

const mutation = `
    mutation updateMedia($id: Int!, $season: Int) {
        updateMedia(id: $id, season: $season)
    }
`;

describe('Index Types', () => {
    describe('GraphQlOperation', () => {
        it('should return correct type according to the provided GraphQL', () => {
            type actual1 = GraphQlOperation<typeof query, TypeMap>;
            type expected1 = {
                media: {
                    title: {
                        english: string | null;
                    } | null;
                    season: number;
                    episodes: number;
                    episode1: {
                        title: string | null;
                        duration: number;
                    };
                    episode2: {
                        title: string | null;
                        duration: number;
                    };
                };
            };

            type actual2 = GraphQlOperation<typeof mutation, TypeMap>;
            type expected2 = {
                updateMedia: boolean;
            };

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });
    });

    describe('GraphQlVariables', () => {
        it('should return correct variables type according to the provided GraphQL', () => {
            type actual = GraphQlVariables<typeof query, TypeMap>;
            type expected = {
                id: number;
                season?: number | null;
            };

            type test = Expect<Equal<actual, expected>>;
        });
    });

    describe('GraphQlOperationName', () => {
        it('should properly return operation name', () => {
            type actual1 = GraphQlOperationName<typeof query>;
            type expected1 = 'getMedia';

            type actual2 = GraphQlOperationName<typeof mutation>;
            type expected2 = 'updateMedia';

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should return undefined if name is not provided', () => {
            type actual = GraphQlOperationName<`
                query {
                    ok
                }
            `>;
            type expected = undefined;

            type test = Expect<Equal<actual, expected>>;
        });
    });

    describe('GraphQlOperationType', () => {
        it('should properly return operation name', () => {
            type actual1 = GraphQlOperationType<typeof query>;
            type expected1 = 'query';

            type actual2 = GraphQlOperationType<typeof mutation>;
            type expected2 = 'mutation';

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });

        it('should return query type as default', () => {
            type actual = GraphQlOperationType<`
                {
                    ok
                }
            `>;
            type expected = 'query';

            type test = Expect<Equal<actual, expected>>;
        });
    });

    describe('GrapgQlResponse', () => {
        it('should return correct type according to the provided GraphQL', () => {
            type actual1 = GraphQlResponse<typeof query, TypeMap>;
            type expected1 = {
                readonly data?: {
                    media: {
                        title: {
                            english: string | null;
                        } | null;
                        season: number;
                        episodes: number;
                        episode1: {
                            title: string | null;
                            duration: number;
                        };
                        episode2: {
                            title: string | null;
                            duration: number;
                        };
                    };
                } | null;
                readonly errors?: GraphQlError[];
                readonly extensions?: Readonly<Record<string, any>>;
            };

            type actual2 = GraphQlResponse<typeof mutation, TypeMap>;
            type expected2 = {
                readonly data?: {
                    updateMedia: boolean;
                } | null;
                readonly errors?: GraphQlError[];
                readonly extensions?: Readonly<Record<string, any>>;
            };

            type test1 = Expect<Equal<actual1, expected1>>;
            type test2 = Expect<Equal<actual2, expected2>>;
        });
    });
});
