import { Field } from '../parser/selection.parser';
import { TypeMap } from '../type-map';
import { NormalizeObject, NullOrUndefined } from '../helpers';


/**
 * @param {Field[]} ast
 * @param {Record<string, any>} currentType
 * @param {TypeMap} types
 *
 * @returns {Record<string, any>}
 */
export type TransformSelectionSet<Ast extends Field[], CurrentType extends Record<string, any>, Types extends TypeMap> =
    Ast extends [] ?
        {}
    : Ast extends [infer field extends Field, ...infer restFields extends Field[]] ?
        NormalizeObject<TransformField<field, CurrentType, Types> & TransformSelectionSet<restFields, CurrentType, Types>>
    : never;


type TransformField<Ast extends Field, CurrentType extends Record<string, any>, Types extends TypeMap> =
    Ast['name'] extends keyof NonNullable<CurrentType> ?
        Ast['alias'] extends string ?
            TransformFieldObject<Ast['alias'], Ast, CurrentType, Types>
        : TransformFieldObject<Ast['name'], Ast, CurrentType, Types>
    : {
        [key in Ast['name']]: unknown
    };

type TransformFieldObject<FieldName extends string, Ast extends Field, CurrentType extends Record<string, any>, Types extends TypeMap>  = {
    [key in FieldName]:
        Ast['selectionSet'] extends undefined ?
            CurrentType[Ast['name']]
        : Ast['selectionSet'] extends Field[] ?
            PickFromTypeWithSelectionSet<Ast['selectionSet'], CurrentType[Ast['name']], Types> | NullOrUndefined<NonNullable<CurrentType>[Ast['name']]>
        : unknown
}

type PickFromTypeWithSelectionSet<Ast extends Field[], CurrentType, Types extends TypeMap> =
    CurrentType extends (infer arrayType)[] ?
        PickFromTypeWithSelectionSet<Ast, arrayType, Types>[]
    : CurrentType extends Record<string, any> ?
        TransformSelectionSet<Ast, CurrentType, Types>
    : CurrentType extends null | undefined ?
        never
    : unknown;

