import type { Principal } from '@dfinity/principal';
export type GamesPlayed = bigint;
export type GamesWon = bigint;
export type Highscore = bigint;
export type Level = bigint;
export type LinkedWallets = Array<Wallet>;
export interface Player {
  'id' : PlayerId__1,
  'aid' : string,
  'linkedWallets' : LinkedWallets,
  'level' : Level,
  'playerName' : PlayerName,
}
export interface PlayerGameData {
  'id' : PlayerId__1,
  'gamesPlayed' : GamesPlayed,
  'score' : ScoreCC,
  'gamesWon' : GamesWon,
  'highscore' : Highscore,
}
export type PlayerId = Principal;
export type PlayerId__1 = Principal;
export type PlayerName = string;
export interface PlayerPreferences {
  'gamePlayerData' : string,
  'language' : bigint,
  'playerChar' : string,
  'playerCharID' : bigint,
}
export interface PlayersCanister {
  'createPlayer' : (arg_0: Player) => Promise<boolean>,
  'getAllPlayers' : () => Promise<Array<[PlayerId, Player]>>,
  'getMyGameData' : () => Promise<[] | [PlayerGameData]>,
  'getMyPlayer' : () => Promise<[] | [Player]>,
  'getMyPreferences' : () => Promise<[] | [PlayerPreferences]>,
  'getPlayer' : (arg_0: Principal) => Promise<[] | [Player]>,
  'getPlayerGameData' : (arg_0: PlayerId) => Promise<[] | [PlayerGameData]>,
  'getPlayerPreferences' : (arg_0: PlayerId) => Promise<
      [] | [PlayerPreferences]
    >,
  'savePlayerGameData' : (arg_0: PlayerId, arg_1: PlayerGameData) => Promise<
      boolean
    >,
  'savePlayerPreferences' : (
      arg_0: PlayerId,
      arg_1: PlayerPreferences,
    ) => Promise<boolean>,
}
export type ScoreCC = bigint;
export interface Wallet {
  'principal' : Principal,
  'accountID' : string,
  'walletName' : string,
}
export interface _SERVICE extends PlayersCanister {}
