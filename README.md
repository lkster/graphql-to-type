# graphql-to-type [![npm version badge](https://img.shields.io/npm/v/graphql-to-type.svg)](https://www.npmjs.com/package/graphql-to-type)

(almost) Fully functional GraphQL request parser written completely using TypeScript's typing system. 
At first, I just wanted to see if it's even possible but turned out it can be actually useful in the end.

https://github.com/ThaFog/graphql-to-type/assets/10232371/12515523-5ddd-479e-8562-b2760cfe1a68

## Support progress

- Transforming operation's selection set to object type
- Transforming operation's variables to object type
- Extracting operation type and name
- Fields' aliases
- Consuming comments
- Directives (not functional, ignored in transformer)

Not yet supported:
- Fragments and fragment spreads

  Not yet implemented to be parsable. It's probably possible to have them working though if some conditions are met.


I'm thinking also about implementing generator for `TypeMap` (more about `TypeMap` below). It could be used when schema changes only.

## Instalation

```
$ npm i graphql-to-type -D
```

## How to use

Usage is simple. First of all, just write GraphQL request in some variable and pass inferred type to either `GraphQlOperation` or `GraphQlResponse` type. Be sure variable / property is const as inferred type should be exact string.

> **Note**
> For now type consumes only one and first operation from provided string. Every other operation will be just ignored. Also as of now fragments are not yet recognizable and will cause parser error.

```ts
const query = `
    query {
        company {
            ceo
            employees
            infoLinks {
                elon_twitter
            }
        }
    }
`;

type queryResponse = GraphQlResponse<typeof query, TypeMap>;
/*
    {
        data?: {
            company: {
                ceo: string;
                employees: number;
                infoLinks: {
                    elon_twitter: string;
                };
            };
        };
        errors?: GraphQlError[];
        extendsions? Record<string, any>;
    }
*/
```

Second thing is providing `TypeMap` object, as it's seen above. This thing should include every query, mutation, scalar and other types to properly map properties to their associated types. It's safe to write it once and store in some separate file. `TypeMap` consists of `types` property and optional `query`, `mutation` and `subscription` properties. `types` should have every GraphQL type mapped to it's TypeScript type. Every operation property should have assigned types to all existing operations.

Having SpaceX API as an example, minimal effort `TypeMap` to have query above properly mapped should look like this one:

```ts
// Based on SpaceX GraphQL schema

export interface Info {
    ceo: string;
    employees: number;
    infoLinks: InfoLinks;
}

export interface InfoLinks {
    elon_twitter: string;
    flickr: string;
    twitter: string;
    website: string;
}

export type TypeMap = {
    query: {
        company: Info;
    };
    types: {
        Info: Info;
        InfoLinks: InfoLinks;
    };
};
```

In case parser won't be able to find associated type, it assigns `unknown` instead.

If you just want to map selection set without response object, you can use `GraphQlOperation` type instead:

```ts
const query = `
    query {
        company {
            ceo
            employees
            infoLinks {
                elon_twitter
            }
        }
    }
`;

type queryOperation = GraphQlOperation<typeof query, TypeMap>;
/*
    {
        company: {
            ceo: string;
            employees: number;
            infoLinks: {
                elon_twitter: string;
            };
        };
    };
    }
*/
```

### Typing variables

Extracting variables works in the same way as it is with selection set with a difference this time the type returns object with typed variables:

```ts
const query = `
    query ($find: CoresFind, $limit: Int, $offset: Int, $order: String, $sort: String) {
        cores(find: $find, limit: $limit, offset: $offset, order: $order, sort: $sort) {
            block
            missions {
                name
                flight
            }
            original_launch
        }
    }
`;

type queryVariables = GraphQlVariables<typeof query, TypeMap>;
/*
    {
        find: CoreFind;
        limit: number;
        offset: number;
        order: string;
        sort: string;
    }
*/
```

where `TypeMap` with minimal effort looks like this:

```ts
// Based on SpaceX GraphQL schema

export interface CoresFind {
    asds_attempts: number;
    asds_landings: number;
    block: number;
    id: string;
    missions: string;
    original_launch: Date;
    reuse_count: number;
    rtls_attempts: number;
    rtls_landings: number;
    status: string;
    water_landing: boolean;
}

export type TypeMap = {
    types: {
        String: string;
        Int: number;
        Float: number;
        Boolean: boolean;
        CoresFind: CoresFind;
    };
};
```

### Types Aliases

To simplify life, you can create alias for these types so you won't need to provide `TypeMap` everytime:

```ts
import type { GraphQlResponse, GraphQlOperation, GraphQlVariables } from 'graphql-to-type';
import type { TypeMap } from './type-map';

export type GqlResponse<GraphQl extends string> = GraphQlResponse<GraphQl, TypeMap>;
export type GqlOperation<GraphQl extends string> = GraphQlOperation<GraphQl, TypeMap>;
export type GqlVariables<GraphQl extends string> = GraphQlVariables<GraphQl, TypeMap>;
```

## Available Types

### GraphQlOperation

Extracts selection set from operation and transforms it into record type

```ts
type GraphQlOperation<GraphQl extends string, Types extends TypeMap>
```

### GraphQlVariables

Extracts variables from operation and transforms them into record type

```ts
type GraphQlVariables<GraphQl extends string, Types extends TypeMap>
```

### GraphQlOperationName

Extracts name of the operation. Returns `undefined` if operation has no name set

```ts
type GraphQlOperationName<GraphQl extends string>
```

### GraphQlOperationType

Extracts type of the operation. Returns `query` if no operation type is provided based on GraphQL spec.

```ts
type GraphQlOperationType<GraphQl extends string>
```


### GraphQlResponse

Extracts selection set from operation, transforms it into record type and encloses it in graphQl-compatible response type

```ts
type GraphQlResponse<GraphQl extends string, Types extends TypeMap>
```

### GraphQlError

Describes potential error returned by GraphQL

```ts
export type GraphQlError = {
    readonly message: string;
    readonly locations: ReadonlyArray<SourceLocation>;
    readonly path?: ReadonlyArray<string | number>;
    readonly extensions?: Readonly<Record<string, any>>;
}
```
