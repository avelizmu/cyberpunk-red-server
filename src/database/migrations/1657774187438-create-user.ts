import { Kysely } from 'kysely'
import Database from "../schema";

export function up(db: Kysely<Database>): Promise<void> {
    return db.schema
        .createTable('User')
        .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
        .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
        .addColumn('name', 'varchar(255)')
        .execute()
}

export function down(db: Kysely<Database>): Promise<void> {
    return db.schema.dropTable('User').execute();
}