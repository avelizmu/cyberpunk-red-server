import {
    Generated,
} from 'kysely'
import {ColumnType} from "kysely/dist/cjs/util/column-type";

type Stats ='intelligence' |
    'willpower' |
    'cool' |
    'empathy' |
    'technique' |
    'reflexes' |
    'luck' |
    'body' |
    'dexterity' |
    'movement';


type VariableStats = 'humanity' |
    'hitPoints' |
    'luck';
type VariableStatsType = 'BaseMax' | 'Current'

type Skills = 'concentration' |
    'conceal/reveal object' |
    'lip reading' |
    'perception' |
    'tracking' |
    'athletics' |
    'contortionist' |
    'dance' |
    'endurance' |
    'resist torture/drugs' |
    'stealth' |
    'drive land vehicle' |
    'pilot air vehicle' |
    'pilot sea vehicle' |
    'riding' |
    'accounting' |
    'animal handling' |
    'bureaucracy' |
    'business' |
    'composition' |
    'criminology' |
    'cryptography' |
    'deduction' |
    'education' |
    'gamble' |
    'language' |
    'library search' |
    'local expert' |
    'science' |
    'tactics' |
    'wilderness survival' |
    'brawling' |
    'evasion' |
    'martial arts' |
    'melee weapon' |
    'acting' |
    'play instrument' |
    'archery' |
    'autofire' |
    'handgun' |
    'heavy weapons' |
    'shoulder arms' |
    'bribery' |
    'conversation' |
    'human perception' |
    'interrogation' |
    'persuasion' |
    'personal grooming' |
    'streetwise' |
    'trading' |
    'wardrobe & style' |
    'air vehicle tech' |
    'basic tech' |
    'cybertech' |
    'demolitions' |
    'electronics/security tech' |
    'first aid' |
    'forgery' |
    'land vehicle tech' |
    'paint/draw/sculpt' |
    'paramedic' |
    'photography/film' |
    'pick lock' |
    'pick pocket' |
    'sea vehicle tech' |
    'weaponstech';

type StatsListType = {
    [id in `${Stats}Base`]: ColumnType<number,  number | undefined, number | undefined>
}

type VariableStatsListType = {
    [id in `${VariableStats}${VariableStatsType}`]: ColumnType<number,  number | undefined, number | undefined>
}

type SkillsListType = {
    [id in `skillBase ${Skills}`]: ColumnType<number,  number | undefined, number | undefined>
}

export type CombinedListType = StatsListType & VariableStatsListType & SkillsListType

export default interface CharacterTable extends CombinedListType{
    id: Generated<number>;

    name: string;

    ownerId: number;

    gameId: number;
}
