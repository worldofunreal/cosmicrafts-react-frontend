import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

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
  'createPlayer' : ActorMethod<[Player], boolean>,
  'getAllPlayers' : ActorMethod<[], Array<[PlayerId, Player]>>,
  'getMyGameData' : ActorMethod<[], [] | [PlayerGameData]>,
  'getMyPlayer' : ActorMethod<[], [] | [Player]>,
  'getMyPreferences' : ActorMethod<[], [] | [PlayerPreferences]>,
  'getPlayer' : ActorMethod<[Principal], [] | [Player]>,
  'getPlayerGameData' : ActorMethod<[PlayerId], [] | [PlayerGameData]>,
  'getPlayerPreferences' : ActorMethod<[PlayerId], [] | [PlayerPreferences]>,
  'savePlayerGameData' : ActorMethod<[PlayerId, PlayerGameData], boolean>,
  'savePlayerPreferences' : ActorMethod<[PlayerId, PlayerPreferences], boolean>,
}
export type ScoreCC = bigint;
export interface Wallet {
  'principal' : Principal,
  'accountID' : string,
  'walletName' : string,
}
export interface _SERVICE extends PlayersCanister {}
