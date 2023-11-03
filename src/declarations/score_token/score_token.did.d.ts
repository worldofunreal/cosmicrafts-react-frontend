import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
export interface ApproveRequest {
  'token' : TokenIdentifier,
  'subaccount' : [] | [SubAccount],
  'allowance' : Balance,
  'spender' : Principal,
}
export type Balance = bigint;
export interface BalanceRequest { 'token' : TokenIdentifier, 'user' : User }
export type BalanceResponse = { 'ok' : Balance } |
  { 'err' : CommonError__1 };
export type Balance__1 = bigint;
export type CommonError = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export type CommonError__1 = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export type Extension = string;
export type Memo = Uint8Array | number[];
export type Metadata = {
    'fungible' : {
      'decimals' : number,
      'metadata' : [] | [Uint8Array | number[]],
      'name' : string,
      'image' : string,
      'symbol' : string,
    }
  } |
  { 'nonfungible' : { 'metadata' : [] | [Uint8Array | number[]] } };
export type Result = { 'ok' : Balance__1 } |
  { 'err' : CommonError };
export type Result_1 = { 'ok' : Metadata } |
  { 'err' : CommonError };
export type SubAccount = Uint8Array | number[];
export interface Token {
  'acceptCycles' : ActorMethod<[], undefined>,
  'approve' : ActorMethod<[ApproveRequest], undefined>,
  'availableCycles' : ActorMethod<[], bigint>,
  'balance' : ActorMethod<[BalanceRequest], BalanceResponse>,
  'burn' : ActorMethod<[string, Balance__1], [boolean, string]>,
  'extensions' : ActorMethod<[], Array<Extension>>,
  'getAllScores' : ActorMethod<[], Array<[AccountIdentifier__1, Balance__1]>>,
  'getBalance' : ActorMethod<[BalanceRequest], BalanceResponse>,
  'metadata' : ActorMethod<[TokenIdentifier__1], Result_1>,
  'mint' : ActorMethod<[Principal, Balance__1], [boolean, string]>,
  'supply' : ActorMethod<[TokenIdentifier__1], Result>,
  'transfer' : ActorMethod<[TransferRequest], TransferResponse>,
}
export type TokenIdentifier = string;
export type TokenIdentifier__1 = string;
export interface TransferRequest {
  'to' : User,
  'token' : TokenIdentifier,
  'notify' : boolean,
  'from' : User,
  'memo' : Memo,
  'subaccount' : [] | [SubAccount],
  'amount' : Balance,
}
export type TransferResponse = { 'ok' : Balance } |
  {
    'err' : { 'CannotNotify' : AccountIdentifier } |
      { 'InsufficientBalance' : null } |
      { 'InvalidToken' : TokenIdentifier } |
      { 'Rejected' : null } |
      { 'Unauthorized' : AccountIdentifier } |
      { 'Other' : string }
  };
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface _SERVICE extends Token {}
