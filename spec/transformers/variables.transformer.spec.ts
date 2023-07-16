import { Expect, Equal } from 'hotscript/dist/internals/helpers';
import { ParseArguments } from '../../src/parser/arguments.parser';
import { TransformVariables } from '../../src/transformer/variables.transformer';
import { IMediaInput, TypeMap } from '../test-schema';


describe('Variables Transformer', () => {
    it('should properly transform variables with required types', () => {
        type variables = ParseArguments<`($id: ID!, $episodes: Int!)`, true>[0];
        type actual = TransformVariables<variables, TypeMap>;
        type expected = {
            id: string;
            episodes: number;
        };

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly transform variables with optional types', () => {
        type variables = ParseArguments<`($data: MediaInput!, $id: ID, $episodes: Int)`, true>[0];
        type actual = TransformVariables<variables, TypeMap>;
        type expected = {
            data: IMediaInput,
            id?: string | null;
            episodes?: number | null;
        };

        type test = Expect<Equal<actual, expected>>;
    });

    it('should properly transform variables with default values', () => {
        type variables = ParseArguments<`($data: MediaInput, $id: ID! = "some id", $episodes: Int = 20)`, true>[0];
        type actual = TransformVariables<variables, TypeMap>;
        type expected = {
            data?: IMediaInput | null;
            id?: string;
            episodes?: number | null;
        };

        type test = Expect<Equal<actual, expected>>;
    });
});
