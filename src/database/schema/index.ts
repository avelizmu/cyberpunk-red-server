import GameTable from "./game";
import UserTable from "./user";
import PlayerTable from "./player";
import CharacterTable from "./character";

export default interface Database {
    Game: GameTable,
    User: UserTable,
    Player: PlayerTable,
    Character: CharacterTable
}