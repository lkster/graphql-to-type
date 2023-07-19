import { Expect, Equal, Not } from 'hotscript/dist/internals/helpers';
import { TransformSelectionSet } from '../../src/transformer/selection.transformer';
import { ParseSelectionSet } from '../../src/parser/selection.parser';
import { IMedia, TypeMap } from '../test-schema';


describe('Selection Set Transformer', () => {
    it('should properly transform selection set', () => {
        type selectionSet = ParseSelectionSet<`{
            media(id: 2) {
                id
                title {
                    english
                }
                season
            }
        }`>[0];

        type actual = TransformSelectionSet<selectionSet, TypeMap['query'], TypeMap>;
        type expected = {
            media: {
                id: number;
                title: {
                    english: string | null;
                } | null
                season: number;
            };
        };

        type test = Expect<Equal<actual, expected>>;
    });

    it('should set field to unknown type if it does not exist in provided type map', () => {
        type selectionSet1 = ParseSelectionSet<`{
            doesNotExist {
                thatsSad
            }
        }`>[0];
        type actual1 = TransformSelectionSet<selectionSet1, TypeMap['query'], TypeMap>;
        type expected1 = {
            doesNotExist: unknown;
        };

        type selectionSet2 = ParseSelectionSet<`{
            media(id: 2) {
                id
                title {
                    english
                }
                sesaon
            }
        }`>[0];
        type actual2 = TransformSelectionSet<selectionSet2, TypeMap['query'], TypeMap>;
        type expected2 = {
            media: {
                id: number;
                title: {
                    english: string | null;
                } | null
                sesaon: unknown;
            };
        };

        type test1 = Expect<Equal<actual1, expected1>>;
        type test2 = Expect<Equal<actual2, expected2>>;
    });

    // Actually should never happen because of 'selection set cannot be empty' parser error
    it('should return empty object if there are no fields to transform', () => {
        type actual = TransformSelectionSet<[], TypeMap['query'], TypeMap>;
        type expected = {};

        type test = Expect<Equal<actual, expected>>;
    });

    it('should return normalized object', () => {
        type selectionSet = ParseSelectionSet<`{
            field1
            field2
            field3
            field4
            field5
        }`>[0];

        type actual = TransformSelectionSet<selectionSet, TypeMap['query'], TypeMap>;
        type expected = { field1: unknown } & { field2: unknown } & { field3: unknown } & { field4: unknown } & { field5: unknown };

        type test = Expect<Not<Equal<actual, expected>>>;
    });

    it('should corretly transform array types', () => {
        type selectionSet = ParseSelectionSet<`{
            media(id: 2) {
                mediaConnection {
                    id
                    season
                    title {
                        romaji
                    }
                }
                titleMatrix {
                    english
                    romaji
                }
                rank
            }
        }`>[0];

        type actual = TransformSelectionSet<selectionSet, TypeMap['query'], TypeMap>;
        type expected = {
            media: {
                mediaConnection: {
                    id: number;
                    season: number;
                    title: {
                        romaji: string | null;
                    } | null;
                }[];
                rank: number[][];
                titleMatrix: {
                    romaji: string | null;
                    english: string | null;
                }[][][] | null;
            };
        };

        type test = Expect<Equal<actual, expected>>;
    });

    it('should set unknown type if field of primitive type has assigned selection set', () => {
        type selectionSet = ParseSelectionSet<`{
            media(id: 2) {
                id {
                    id
                }
                season
            }
        }`>[0];

        type actual = TransformSelectionSet<selectionSet, TypeMap['query'], TypeMap>;
        type expected = {
            media: {
                id: unknown;
                season: number;
            };
        };

        type test = Expect<Equal<actual, expected>>;
    });

    it('should correctly use aliases', () => {
        type selectionSet = ParseSelectionSet<`{
            media(id: 2) {
                firstEpisode: episode(number: 1) {
                    title
                    duration
                    titleMatrix {
                        romaji
                    }
                }
                secondEpisode: episode(number: 2) {
                    number
                    title
                    titleMatrix {
                        english
                    }
                }
            }
        }`>[0];

        type actual = TransformSelectionSet<selectionSet, TypeMap['query'], TypeMap>;
        type expected = {
            media: {
                firstEpisode: {
                    title: string | null;
                    duration: number;
                    titleMatrix: {
                        romaji: string | null;
                    }[] | null;
                };
                secondEpisode: {
                    number: number;
                    title: string | null;
                    titleMatrix: {
                        english: string | null;
                    }[] | null;
                };
            };
        };

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly map null or undefined field', () => {
        type query = {
            media: {
                title: string | null;
                episodes: number | undefined;
                season?: number;
                duration: number;
            };
        };

        type selectionSet = ParseSelectionSet<`{
            media {
                title
                episodes
                season
            }
        }`>[0];

        type actual = TransformSelectionSet<selectionSet, query, { query: query, types: {} }>;
        type expected = {
            media: {
                title: string | null;
                episodes: number | undefined;
                season: number | undefined;
            };
        };

        type test = Expect<Equal<actual, expected>>;
    });
});
