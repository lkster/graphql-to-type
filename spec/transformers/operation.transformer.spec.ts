import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { TransformOperation } from '../../src/transformer/operation.transformer';
import { ParseOperation } from '../../src/parser/operation.parser';
import { MediaType, TypeMap } from '../test-schema';


describe('Operation Transformer', () => {
    it('should properly transform operation to type', () => {
        const operation = `
            query getMedia($id: Int!) {
                media(id: $id) {
                    id
                    titles: title {
                        english
                        romaji
                    }
                    type,
                    episodes,
                },
                secondMedia: media(id: 2) {
                    episodes,
                }
            }
        `;

        type operationAst = ParseOperation<typeof operation>[0];
        type actual = TransformOperation<operationAst, TypeMap>;
        type expected = {
            media: {
                id: number;
                titles: {
                    english: string | null;
                    romaji: string | null;
                } | null;
                type: MediaType;
                episodes: number;
            };
            secondMedia: {
                episodes: number;
            };
        };

        type test = Expect<Equal<actual, expected>>;
    });
});
