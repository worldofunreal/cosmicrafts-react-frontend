export const idlFactory = ({ IDL }) => {
  const MatchmakingStatus = IDL.Variant({
    'Ended' : IDL.Null,
    'Reserved' : IDL.Null,
    'Searching' : IDL.Null,
    'Accepted' : IDL.Null,
    'InGame' : IDL.Null,
    'Accepting' : IDL.Null,
  });
  const UserId = IDL.Principal;
  const PlayerInfo = IDL.Record({
    'id' : UserId,
    'elo' : IDL.Nat,
    'characterSelected' : IDL.Nat,
    'matchAccepted' : IDL.Bool,
  });
  const MatchData = IDL.Record({
    'status' : MatchmakingStatus,
    'gameId' : IDL.Nat,
    'player1' : PlayerInfo,
    'player2' : IDL.Opt(PlayerInfo),
  });
  const SearchStatus = IDL.Variant({
    'Available' : IDL.Null,
    'NotAvailable' : IDL.Null,
    'Assigned' : IDL.Null,
  });
  const ClientPrincipal = IDL.Principal;
  const ClientKey = IDL.Record({
    'client_principal' : ClientPrincipal,
    'client_nonce' : IDL.Nat64,
  });
  const CanisterWsCloseArguments = IDL.Record({ 'client_key' : ClientKey });
  const CanisterWsCloseResult = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : IDL.Text,
  });
  const CanisterWsGetMessagesArguments = IDL.Record({ 'nonce' : IDL.Nat64 });
  const CanisterOutputMessage = IDL.Record({
    'key' : IDL.Text,
    'content' : IDL.Vec(IDL.Nat8),
    'client_key' : ClientKey,
  });
  const CanisterOutputCertifiedMessages = IDL.Record({
    'messages' : IDL.Vec(CanisterOutputMessage),
    'cert' : IDL.Vec(IDL.Nat8),
    'tree' : IDL.Vec(IDL.Nat8),
  });
  const CanisterWsGetMessagesResult = IDL.Variant({
    'Ok' : CanisterOutputCertifiedMessages,
    'Err' : IDL.Text,
  });
  const WebsocketMessage = IDL.Record({
    'sequence_num' : IDL.Nat64,
    'content' : IDL.Vec(IDL.Nat8),
    'client_key' : ClientKey,
    'timestamp' : IDL.Nat64,
    'is_service_message' : IDL.Bool,
  });
  const CanisterWsMessageArguments = IDL.Record({ 'msg' : WebsocketMessage });
  const CanisterWsMessageResult = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : IDL.Text,
  });
  const CanisterWsOpenArguments = IDL.Record({ 'client_nonce' : IDL.Nat64 });
  const CanisterWsOpenResult = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : IDL.Text,
  });
  const PlayersCanister = IDL.Service({
    'acceptMatch' : IDL.Func([IDL.Nat], [IDL.Bool, IDL.Text], []),
    'addPlayerSearching' : IDL.Func([], [IDL.Bool, IDL.Nat], []),
    'assignPlayer2' : IDL.Func([IDL.Nat], [IDL.Bool, IDL.Text], []),
    'cancelMatchmaking' : IDL.Func([], [IDL.Bool, IDL.Text], []),
    'getMatchData' : IDL.Func([IDL.Nat], [IDL.Opt(MatchData)], ['query']),
    'getMatchSearching' : IDL.Func(
        [],
        [SearchStatus, IDL.Nat, IDL.Text],
        ['query'],
      ),
    'rejectMatch' : IDL.Func([], [IDL.Bool, IDL.Text], []),
    'setGameOver' : IDL.Func([], [IDL.Bool, IDL.Text], []),
    'ws_close' : IDL.Func(
        [CanisterWsCloseArguments],
        [CanisterWsCloseResult],
        [],
      ),
    'ws_get_messages' : IDL.Func(
        [CanisterWsGetMessagesArguments],
        [CanisterWsGetMessagesResult],
        ['query'],
      ),
    'ws_message' : IDL.Func(
        [CanisterWsMessageArguments],
        [CanisterWsMessageResult],
        [],
      ),
    'ws_open' : IDL.Func([CanisterWsOpenArguments], [CanisterWsOpenResult], []),
  });
  return PlayersCanister;
};
export const init = ({ IDL }) => { return []; };
