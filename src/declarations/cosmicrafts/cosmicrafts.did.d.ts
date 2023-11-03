import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Balance = bigint;
export type BalanceResponse = { 'ok' : Balance } |
  { 'err' : CommonError };
export type CommonError = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export interface Cosmicrafts {
  'cancelGame' : ActorMethod<[bigint], boolean>,
  'createGame' : ActorMethod<
    [
      string,
      string,
      bigint,
      Array<bigint>,
      bigint,
      bigint,
      bigint,
      string,
      bigint,
      string,
      string,
    ],
    GameStatus
  >,
  'createPlayer' : ActorMethod<[string, string, string], boolean>,
  'findGame' : ActorMethod<
    [
      string,
      string,
      bigint,
      Array<bigint>,
      bigint,
      bigint,
      bigint,
      string,
      bigint,
    ],
    GameStatus
  >,
  'getClientLastAlive' : ActorMethod<[bigint], bigint>,
  'getGameInProgressData' : ActorMethod<[bigint], GameStatus>,
  'getGameMatchStatus' : ActorMethod<[bigint], GameStatus>,
  'getICPBalance' : ActorMethod<[], { 'e8s' : bigint }>,
  'getMasterLastAlive' : ActorMethod<[bigint], bigint>,
  'getPlayer' : ActorMethod<[], [] | [Player]>,
  'getPlayerPreferences' : ActorMethod<[], [] | [PlayerPreferences]>,
  'getPlayerScore' : ActorMethod<[], BalanceResponse>,
  'getUserMatchData' : ActorMethod<[bigint], P2Status>,
  'isPlayerWinner' : ActorMethod<[bigint], bigint>,
  'principalToString' : ActorMethod<[], Principal>,
  'saveMatchLastAlive' : ActorMethod<[bigint, bigint], boolean>,
  'savePlayerCharacter' : ActorMethod<[bigint], boolean>,
  'savePlayerLanguage' : ActorMethod<[bigint], boolean>,
  'savePlayerPreferences' : ActorMethod<[string], boolean>,
  'savePlayerScore' : ActorMethod<[bigint], [boolean, string]>,
  'setGameInProgressData' : ActorMethod<
    [string, bigint, bigint, string, bigint, ScoreCC],
    boolean
  >,
  'setGameWinner' : ActorMethod<[bigint, bigint, bigint], boolean>,
  'setPlayerAlive' : ActorMethod<[bigint, bigint], boolean>,
  'setUserInProgressData' : ActorMethod<
    [string, bigint, bigint, string, ScoreCC],
    P2Status
  >,
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
