import { Kysely } from 'kysely'
import Database from "../schema";

export function up(db: Kysely<Database>): Promise<void> {
    return db.schema
        .createTable('Player')
        .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
        .addColumn('userId', 'integer')
        .addColumn('gameId', 'integer')
        .addForeignKeyConstraint(
            'player_user_id', ['userId'],
            'User', ['id']
        )
        .addForeignKeyConstraint(
            'player_game_id', ['gameId'],
            'Game', ['id']
        )
        .execute()
}

export function down(db: Kysely<Database>): Promise<void> {
    return db.schema.dropTable('Player').execute();
}