// Based on https://anilist.co/graphiql

export interface Query {
    media: IMedia;
}

export interface Mutation {
    updateMedia: boolean;
}

export interface IMedia {
    id: number;
    title: IMediaTitle | null;
    type: MediaType;
    season: number;
    episodes: number;
    duration: number;
    mediaConnection: IMedia[];
    rank: number[][];
    titleMatrix: IMediaTitle[][][] | null;
    episode: IMediaEpisode;
}

export interface IMediaInput {
    id: number;
    type?: MediaType;
    season?: number;
    episodes?: number;
    duration?: number;
}

export interface IMediaTitle {
    romaji: string | null;
    english: string | null;
}

export interface IMediaEpisode {
    number: number;
    title: string | null;
    duration: number;
    titleMatrix: IMediaTitle[] | null;
}

export enum MediaType {
    ANIME = 'ANIME',
    MANGA = 'MANGA',
}

export type TypeMap = {
    query: Query,
    mutation: Mutation,
    types: {
        Int: number;
        Float: number;
        ID: string;
        String: string;
        Date: Date;
        Media: IMedia,
        MediaTitle: IMediaTitle,
        MediaType: MediaType,
        MediaInput: IMediaInput,
    },
};
