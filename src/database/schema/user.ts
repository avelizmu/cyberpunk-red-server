import {
    Generated
} from 'kysely'

export default interface UserTable {
    id: Generated<number>;

    name: string;

    email: string;
}