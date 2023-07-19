import { TypeMap } from './type-map';
import { Operation, ParseOperation } from './parser/operation.parser';
import { TransformOperation } from './transformer/operation.transformer';
import { TransformVariables } from './transformer/variables.transformer';
import { Variable } from './parser/arguments.parser';
import { GraphQlError, GraphQlRawResponse } from './graphql';
import { NormalizeObject } from './helpers';


export type GraphQlOperation<GraphQl extends string, Types extends TypeMap> =
    ParseOperation<GraphQl> extends [infer Ast extends Operation, any] ?
        TransformOperation<Ast, Types>
    : ParseOperation<GraphQl>;

export type GraphQlVariables<GraphQl extends string, Types extends TypeMap> =
    ParseOperation<GraphQl> extends [infer Ast extends Operation, any] ?
        Ast['variables'] extends infer variablesAst extends Variable[] ?
            TransformVariables<variablesAst, Types>
        : {}
    : ParseOperation<GraphQl>;

export type GraphQlOperationName<GraphQl extends string> =
    ParseOperation<GraphQl> extends [infer Ast extends Operation, any] ?
        Ast['name']
    : ParseOperation<GraphQl>;

export type GraphQlOperationType<GraphQl extends string> =
    ParseOperation<GraphQl> extends [infer Ast extends Operation, any] ?
        Ast['type']
    : ParseOperation<GraphQl>;

export type GraphQlResponse<GraphQl extends string, Types extends TypeMap> = 
    NormalizeObject<GraphQlRawResponse<GraphQlOperation<GraphQl, Types>>>;

export type { GraphQlError } from './graphql';
