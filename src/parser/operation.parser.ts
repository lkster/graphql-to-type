import { Field, ParseSelectionSet } from './selection.parser';
import { ParseArguments, Variable } from './arguments.parser';
import { ConsumeWhitespace, isWhitespaceConsumed } from './whitespace.parser';
import { AllowedDelimiter, IdentifierAllowedStartChars, OperationTypes } from './constants';
import { ParseIdentifier } from './identifier.parser';
import { ParserError } from '../errors';
import { Expression } from './expression';


export declare class Operation<
    Type extends string = string, Name extends string | undefined = string | undefined,
    Variables extends Variable[] | undefined = Variable[] | undefined,
    SelectionSet extends Field[] = Field[],
> extends Expression {
    _: 'Operation';
    name: Name;
    type: Type;
    variables: Variables;
    selectionSet: SelectionSet;
}

/**
 * @param {string} source
 *
 * @returns {[operation: Operation, sourceTail: string]}
 */
export type ParseOperation<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseOperation<ConsumeWhitespace<Source>>
    : Source extends `{${string}` ?
        ParseSelectionSet<Source> extends [infer operationSelections extends Field[], infer tail extends string] ?
            [Operation<'query', undefined, undefined, operationSelections>, tail]
        : ParseSelectionSet<Source>
    : ParseOperationType<Source> extends [infer operationType extends OperationTypes, infer tail extends string] ?
        ParseOperationName<tail> extends [infer operationName extends string | undefined, infer tail2 extends string] ?
            ParseOperationVariables<tail2> extends [infer operationVariables extends Variable[] | undefined, infer tail3 extends string] ?
                ParseSelectionSet<tail3> extends [infer operationSelections extends Field[], infer tail4 extends string] ?
                    [Operation<operationType, operationName, operationVariables, operationSelections>, tail4]
                : ParseSelectionSet<tail3>
            : ParseOperationVariables<tail2>
        : ParseOperationName<tail>
    : ParseOperationType<Source>;

type ParseOperationType<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseOperationType<ConsumeWhitespace<Source>>
    : Source extends `${OperationTypes}${string}` ? // can't do infer Type extends OperationTypes as then it just compares only one char
        ParseIdentifier<Source>
    : ParserError<`Unknown operation type`>;

type ParseOperationName<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseOperationName<ConsumeWhitespace<Source>>
    : Source extends `${IdentifierAllowedStartChars}${string}` ?
        ParseIdentifier<Source>
    : [undefined, Source];

type ParseOperationVariables<Source extends string> =
    isWhitespaceConsumed<Source> extends false ?
        ParseOperationVariables<ConsumeWhitespace<Source>>
    : Source extends `(${string}` ?
        ParseArguments<Source, true>
    : [undefined, Source];
