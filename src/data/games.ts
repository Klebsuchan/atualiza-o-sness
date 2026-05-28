import { Game } from "./types";
import { games_part1 } from "./games_part1";
import { games_part2 } from "./games_part2";
import { additional_games } from "./additional_games";

export * from "./types";
export const GAMES: Game[] = [...games_part1, ...games_part2, ...additional_games];
