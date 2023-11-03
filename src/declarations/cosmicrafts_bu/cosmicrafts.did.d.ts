import type { Principal } from '@dfinity/principal';
export type Balance = bigint;
export type BalanceResponse = { 'ok' : Balance } |
  { 'err' : CommonError };
export type CommonError = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export interface Cosmicrafts {
  'cancelGame' : (arg_0: bigint) => Promise<boolean>,
  'createGame' : (
      arg_0: string,
      arg_1: string,
      arg_2: bigint,
      arg_3: Array<bigint>,
      arg_4: bigint,
      arg_5: bigint,
      arg_6: bigint,
      arg_7: string,
      arg_8: bigint,
      arg_9: string,
      arg_10: string,
    ) => Promise<GameStatus>,
  'createPlayer' : (arg_0: string, arg_1: string, arg_2: string) => Promise<
      boolean
    >,
  'findGame' : (
      arg_0: string,
      arg_1: string,
      arg_2: bigint,
      arg_3: Array<bigint>,
      arg_4: bigint,
      arg_5: bigint,
      arg_6: bigint,
      arg_7: string,
      arg_8: bigint,
    ) => Promise<GameStatus>,
  'getClientLastAlive' : (arg_0: bigint) => Promise<bigint>,
  'getGameInProgressData' : (arg_0: bigint) => Promise<GameStatus>,
  'getGameMatchStatus' : (arg_0: bigint) => Promise<GameStatus>,
  'getMasterLastAlive' : (arg_0: bigint) => Promise<bigint>,
  'getPlayer' : () => Promise<[] | [Player]>,
  'getPlayerPreferences' : () => Promise<[] | [PlayerPreferences]>,
  'getPlayerScore' : () => Promise<BalanceResponse>,
  'getUserMatchData' : (arg_0: bigint) => Promise<P2Status>,
  'principalToString' : () => Promise<Principal>,
  'saveMatchLastAlive' : (arg_0: bigint, arg_1: bigint) => Promise<boolean>,
  'savePlayerCharacter' : (arg_0: bigint) => Promise<boolean>,
  'savePlayerLanguage' : (arg_0: bigint) => Promise<boolean>,
  'savePlayerPreferences' : (arg_0: string) => Promise<boolean>,
  'savePlayerScore' : (arg_0: bigint) => Promise<[boolean, string]>,
  'setGameInProgressData' : (
      arg_0: string,
      arg_1: bigint,
      arg_2: bigint,
      arg_3: string,
      arg_4: bigint,
      arg_5: ScoreCC,
    ) => Promise<boolean>,
  'setGameWinner' : (arg_0: bigint, arg_1: bigint, arg_2: bigint) => Promise<
      boolean
    >,
  'setPlayerAlive' : (arg_0: bigint, arg_1: bigint) => Promise<boolean>,
  'setUserInProgressData' : (
      arg_0: string,
      arg_1: bigint,
      arg_2: bigint,
      arg_3: string,
      arg_4: ScoreCC,
    ) => Promise<P2Status>,
}
export interface GameStatus {
  'status' : string,
  'masterAvatar' : bigint,
  'clientXp' : bigint,
  'masterXp' : bigint,
  'clientDeck' : Array<bigint>,
  'clientIcon' : bigint,
  'gameId' : bigint,
  'clientScore' : ScoreCC__1,
  'gameStartTime' : string,
  'masterScore' : ScoreCC__1,
  'player2Name' : string,
  'clientAvatar' : bigint,
  'masterDeck' : Array<bigint>,
  'player1' : string,
  'player2' : string,
  'masterIcon' : bigint,
  'gameWinner' : bigint,
  'gameStep' : bigint,
  'clientLvl' : bigint,
  'masterLastAlive' : bigint,
  'clientLastAlive' : bigint,
  'player1Name' : string,
  'gameLastUpdate' : string,
  'userStatus' : string,
  'masterLvl' : bigint,
}
export type Level = bigint;
export type LinkedWallets = Array<Wallet>;
export interface P2Status {
  'status' : string,
  'clientScore' : ScoreCC__1,
  'lastAlive' : bigint,
  'gameLastUpdate' : string,
}
export interface Player {
  'id' : PlayerId,
  'aid' : string,
  'linkedWallets' : LinkedWallets,
  'level' : Level,
  'playerName' : PlayerName,
}
export type PlayerId = Principal;
export type PlayerName = string;
export interface PlayerPreferences {
  'gamePlayerData' : string,
  'language' : bigint,
  'playerChar' : string,
  'playerCharID' : bigint,
}
export type ScoreCC = bigint;
export type ScoreCC__1 = bigint;
export type TokenIdentifier = string;
export interface Wallet {
  'principal' : Principal,
  'accountID' : string,
  'walletName' : string,
}
export interface _SERVICE extends Cosmicrafts {}
