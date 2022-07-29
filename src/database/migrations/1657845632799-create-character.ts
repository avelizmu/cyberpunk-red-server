import { Kysely } from 'kysely'
import Database from "../schema";

const stats = [
    'intelligence',
    'willpower',
    'cool',
    'empathy',
    'technique',
    'reflexes',
    'luck',
    'body',
    'dexterity',
    'movement'
]

const variableStats = [
    'humanity',
    'hitPoints',
    'luck'
]

const skills = [
    'concentration',
    'conceal/reveal object',
    'lip reading',
    'perception',
    'tracking',
    'athletics',
    'contortionist',
    'dance',
    'endurance',
    'resist torture/drugs',
    'stealth',
    'drive land vehicle',
    'pilot air vehicle',
    'pilot sea vehicle',
    'riding',
    'accounting',
    'animal handling',
    'bureaucracy',
    'business',
    'composition',
    'criminology',
    'cryptography',
    'deduction',
    'education',
    'gamble',
    'language',
    'library search',
    'local expert',
    'science',
    'tactics',
    'wilderness survival',
    'brawling',
    'evasion',
    'martial arts',
    'melee weapon',
    'acting',
    'play instrument',
    'archery',
    'autofire',
    'handgun',
    'heavy weapons',
    'shoulder arms',
    'bribery',
    'conversation',
    'human perception',
    'interrogation',
    'persuasion',
    'personal grooming',
    'streetwise',
    'trading',
    'wardrobe & style',
    'air vehicle tech',
    'basic tech',
    'cybertech',
    'demolitions',
    'electronics/security tech',
    'first aid',
    'forgery',
    'land vehicle tech',
    'paint/draw/sculpt',
    'paramedic',
    'photography/film',
    'pick lock',
    'pick pocket',
    'sea vehicle tech',
    'weaponstech'
]

const classes = [
    'rockerboy',
    'solo',
    'netrunner',
    'tech',
    'medtech',
    'media',
    'exec',
    'lawman',
    'fixer',
    'nomad'
]

export function up(db: Kysely<Database>): Promise<void> {
    const query = db.schema
        .createTable('Character')
        .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
        .addColumn('ownerId', 'integer')
        .addColumn('gameId', 'integer')
        .addColumn('name', 'varchar(255)');

    for(let stat of stats) {
        query.addColumn(`${stat}Base`, 'integer', (col) => col.defaultTo(0));
    }
    for(let variableStat of variableStats) {
        query.addColumn(`${variableStat}BaseMax`, 'integer', (col) => col.defaultTo(0))
            .addColumn(`${variableStat}Current`, 'integer', (col) => col.defaultTo(0));
    }
    for(let skill of skills) {
        query.addColumn(`skillBase ${skill}`, 'integer', (col) => col.defaultTo(0))
    }
    for(let className of classes) {
        query.addColumn(`${className}Levels`, 'boolean', (col) => col.defaultTo(false))
    }

    return query
        .addForeignKeyConstraint(
            'character_owner_id', ['ownerId'],
            'User', ['id']
        )
        .addForeignKeyConstraint(
            'character_game_id', ['gameId'],
            'Game', ['id']
        )
        .execute()
}

export function down(db: Kysely<Database>): Promise<void> {
    return db.schema.dropTable('Character').execute();
}