import GameTable from "./game";
import UserTable from "./user";

export default interface Database {
    Game: GameTable,
    User: UserTable
}