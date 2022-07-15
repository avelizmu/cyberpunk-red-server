import {
    Generated,
} from 'kysely'

export default interface PlayerTable {
    id: Generated<number>;

    userId: number;

    gameId: number;
}