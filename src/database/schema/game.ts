import {
    Generated,
} from 'kysely'

export default interface GameTable {
    id: Generated<number>;

    name: string;

    owner: number;
}