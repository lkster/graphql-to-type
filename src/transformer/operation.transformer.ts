import { Operation } from '../parser/operation.parser';
import { TypeMap } from '../type-map';
import { TransformSelectionSet } from './selection.transformer';


/**
 * @param {Operation} ast
 * @param {TypeMap} types
 *
 * @returns {Record<string, any>}
 */
export type TransformOperation<Ast extends Operation, Types extends TypeMap> =
    Ast['type'] extends keyof Types ?
        Types[Ast['type']] extends Record<string, any> ?
            TransformSelectionSet<Ast['selectionSet'], Types[Ast['type']], Types>
        : unknown
    : unknown;

