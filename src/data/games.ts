import { Game } from "./types";
import { games_part1 } from "./games_part1";
import { games_part2 } from "./games_part2";
import { additional_games } from "./additional_games";
import { sega_games } from "./sega_games";
import { ssega_games_part1 } from "./ssega_games_part1";
import { ssega_games_part2 } from "./ssega_games_part2";

export * from "./types";
export const GAMES: Game[] = [...games_part1, ...games_part2, ...additional_games, ...sega_games, ...ssega_games_part1, ...ssega_games_part2];
