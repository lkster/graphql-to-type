import { Variable } from '../parser/arguments.parser';
import { TypeMap } from '../type-map';
import { NormalizeObject } from '../helpers';
import { TransformType } from './type.transformer';


/**
 * @param {Variable[]} ast
 * @param {TypeMap} types
 *
 * @returns {Record<string, any>}
 */
export type TransformVariables<Ast extends Variable[], Types extends TypeMap> =
    Ast extends [] ?
        {}
    : Ast extends [infer variable extends Variable, ...infer restVariables extends Variable[]] ?
        NormalizeObject<TransformVariable<variable, Types> & TransformVariables<restVariables, Types>>
    : unknown;

type TransformVariable<Ast extends Variable, Types extends TypeMap> =
    Ast['type']['required'] extends false ?
        {
            [key in Ast['name']['name']]?: TransformType<Ast['type'], Types>
        }
    : Ast['defaultValue'] extends undefined ?
        {
            [key in Ast['name']['name']]: TransformType<Ast['type'], Types>;
        }
    : {
        [key in Ast['name']['name']]?: TransformType<Ast['type'], Types>
    };
