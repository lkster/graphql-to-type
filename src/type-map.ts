export interface TypeMap {
    query: Record<string, any>;
    mutation?: Record<string, any>;
    subscription?: Record<string, any>;
    types: Record<string, any>;
}
