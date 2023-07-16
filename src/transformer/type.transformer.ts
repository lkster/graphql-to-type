import { TypeMap } from '../type-map';
import { ListType, NamedType, Type } from '../parser/type.parser';


export type TransformType<Ast extends Type, Types extends TypeMap> =
    Ast extends ListType ?
        TransformType<Ast['type'], Types>[] | RequiredOrOptional<Ast>
    : Ast extends NamedType ?
        Ast['name'] extends keyof Types['types'] ?
            Types['types'][Ast['name']] | RequiredOrOptional<Ast>
        : unknown
    : unknown;

type RequiredOrOptional<Ast extends Type> =
    Ast['required'] extends true ?
        never
    : null;
