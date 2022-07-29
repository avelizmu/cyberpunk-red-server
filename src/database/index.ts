import Database from "./schema";
import {Kysely, Migration, Migrator, MysqlDialect} from 'kysely'
import * as path from 'path'
import {readdirSync} from 'fs'
import {createPool} from 'mysql2';
import {fileURLToPath} from "url";
import 'dotenv/config'

async function handleMigrations(database: Kysely<Database>) {
    let __dirname = path.dirname(fileURLToPath(import.meta.url))
    const migrator = new Migrator({
        db: database,
        provider: {
            async getMigrations(): Promise<Record<string, Migration>> {
                const migrationFiles = readdirSync(path.join(__dirname, 'migrations'))
                    .filter(fileName => fileName.endsWith('.js'));

                const migrations: {[key: string]: Migration} = {};
                for(let fileName of migrationFiles) {
                    migrations[fileName.substring(0, fileName.length - 3)] = (
                        await import(
                            'file://' + path.join(
                                path.dirname(fileURLToPath(import.meta.url)),
                                'migrations',
                                fileName
                            ))
                    );
                }
                return migrations;
            }
        }
    });

    console.log('Handling database migrations...');

    let migrations = await migrator.getMigrations();
    const toExecute = migrations.filter(m => !m.executedAt);

    if(toExecute.length) {
        console.log(`${toExecute.length} migrations to execute. Handling now...`);

        await migrator.migrateToLatest();

        console.log('Migrations executed successfully.');
    }
    else {
        console.log(`0 migrations to execute. Skipping migrations process.`);
    }
}

function initDatabase(): Kysely<Database> {
    const pool = createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return new Kysely<Database>({
        dialect: new MysqlDialect({
            pool
        })
    });
}

const database = initDatabase();
await handleMigrations(database);

export default database;