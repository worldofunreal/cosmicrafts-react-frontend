import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CanisterOutputCertifiedMessages {
  'messages' : Array<CanisterOutputMessage>,
  'cert' : Uint8Array | number[],
  'tree' : Uint8Array | number[],
}
export interface CanisterOutputMessage {
  'key' : string,
  'content' : Uint8Array | number[],
  'client_key' : ClientKey,
}
export interface CanisterWsCloseArguments { 'client_key' : ClientKey }
export type CanisterWsCloseResult = { 'Ok' : null } |
  { 'Err' : string };
export interface CanisterWsGetMessagesArguments { 'nonce' : bigint }
export type CanisterWsGetMessagesResult = {
    'Ok' : CanisterOutputCertifiedMessages
  } |
  { 'Err' : string };
export interface CanisterWsMessageArguments { 'msg' : WebsocketMessage }
export type CanisterWsMessageResult = { 'Ok' : null } |
  { 'Err' : string };
export interface CanisterWsOpenArguments { 'client_nonce' : bigint }
export type CanisterWsOpenResult = { 'Ok' : null } |
  { 'Err' : string };
export interface ClientKey {
  'client_principal' : ClientPrincipal,
  'client_nonce' : bigint,
}
export type ClientPrincipal = Principal;
export interface MatchData {
  'status' : MatchmakingStatus,
  'gameId' : bigint,
  'player1' : PlayerInfo,
  'player2' : [] | [PlayerInfo],
}
export type MatchmakingStatus = { 'Ended' : null } |
  { 'Reserved' : null } |
  { 'Searching' : null } |
  { 'Accepted' : null } |
  { 'InGame' : null } |
  { 'Accepting' : null };
export interface PlayerInfo {
  'id' : UserId,
  'elo' : bigint,
  'characterSelected' : bigint,
  'matchAccepted' : boolean,
}
export interface PlayersCanister {
  'acceptMatch' : ActorMethod<[bigint], [boolean, string]>,
  'addPlayerSearching' : ActorMethod<[], [boolean, bigint]>,
  'assignPlayer2' : ActorMethod<[bigint], [boolean, string]>,
  'cancelMatchmaking' : ActorMethod<[], [boolean, string]>,
  'getMatchData' : ActorMethod<[bigint], [] | [MatchData]>,
  'getMatchSearching' : ActorMethod<[], [SearchStatus, bigint, string]>,
  'rejectMatch' : ActorMethod<[], [boolean, string]>,
  'setGameOver' : ActorMethod<[], [boolean, string]>,
  'ws_close' : ActorMethod<[CanisterWsCloseArguments], CanisterWsCloseResult>,
  'ws_get_messages' : ActorMethod<
    [CanisterWsGetMessagesArguments],
    CanisterWsGetMessagesResult
  >,
  'ws_message' : ActorMethod<
    [CanisterWsMessageArguments],
    CanisterWsMessageResult
  >,
  'ws_open' : ActorMethod<[CanisterWsOpenArguments], CanisterWsOpenResult>,
}
export type SearchStatus = { 'Available' : null } |
  { 'NotAvailable' : null } |
  { 'Assigned' : null };
export type UserId = Principal;
export interface WebsocketMessage {
  'sequence_num' : bigint,
  'content' : Uint8Array | number[],
  'client_key' : ClientKey,
  'timestamp' : bigint,
  'is_service_message' : boolean,
}
export interface _SERVICE extends PlayersCanister {}
