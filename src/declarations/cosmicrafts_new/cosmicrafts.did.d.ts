import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Cosmicrafts {
  'createPlayer' : ActorMethod<[string], [boolean, string]>,
  'getICPBalance' : ActorMethod<[], { 'e8s' : bigint }>,
  'getPlayer' : ActorMethod<[], [] | [Player]>,
  'getPlayerPreferences' : ActorMethod<[], [] | [PlayerPreferences]>,
  'savePlayerChar' : ActorMethod<[string], [boolean, string]>,
  'savePlayerLanguage' : ActorMethod<[bigint], [boolean, string]>,
  'savePlayerName' : ActorMethod<[string], boolean>,
}
export type Level = bigint;
export interface Player {
  'id' : PlayerId,
  'name' : PlayerName,
  'level' : Level,
}
export type PlayerId = Principal;
export type PlayerName = string;
export interface PlayerPreferences {
  'language' : bigint,
  'playerChar' : string,
}
export interface _SERVICE extends Cosmicrafts {}
