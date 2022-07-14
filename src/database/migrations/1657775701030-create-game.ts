import { Kysely } from 'kysely'
import Database from "../schema";

export function up(db: Kysely<Database>): Promise<void> {
    return db.schema
        .createTable('Game')
        .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
        .addColumn('name', 'varchar(255)')
        .addColumn('owner', 'integer')
        .addForeignKeyConstraint(
            'game_owner_player', ['owner'],
            'User', ['id']
        )
        .execute()
}

export function down(db: Kysely<Database>): Promise<void> {
    return db.schema.dropTable('Game').execute();
}