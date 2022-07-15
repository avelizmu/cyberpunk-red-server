import GameTable from "./game";
import UserTable from "./user";
import PlayerTable from "./player";

export default interface Database {
    Game: GameTable,
    User: UserTable,
    Player: PlayerTable
}