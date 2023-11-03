export const idlFactory = ({ IDL }) => {
  const ScoreCC__1 = IDL.Nat;
  const GameStatus = IDL.Record({
    'status' : IDL.Text,
    'masterAvatar' : IDL.Nat,
    'clientXp' : IDL.Nat,
    'masterXp' : IDL.Nat,
    'clientDeck' : IDL.Vec(IDL.Nat),
    'clientIcon' : IDL.Nat,
    'gameId' : IDL.Nat,
    'clientScore' : ScoreCC__1,
    'gameStartTime' : IDL.Text,
    'masterScore' : ScoreCC__1,
    'player2Name' : IDL.Text,
    'clientAvatar' : IDL.Nat,
    'masterDeck' : IDL.Vec(IDL.Nat),
    'player1' : IDL.Text,
    'player2' : IDL.Text,
    'masterIcon' : IDL.Nat,
    'gameWinner' : IDL.Nat,
    'gameStep' : IDL.Nat,
    'clientLvl' : IDL.Nat,
    'masterLastAlive' : IDL.Nat64,
    'clientLastAlive' : IDL.Nat64,
    'player1Name' : IDL.Text,
    'gameLastUpdate' : IDL.Text,
    'userStatus' : IDL.Text,
    'masterLvl' : IDL.Nat,
  });
  const PlayerId = IDL.Principal;
  const Wallet = IDL.Record({
    'principal' : IDL.Principal,
    'accountID' : IDL.Text,
    'walletName' : IDL.Text,
  });
  const LinkedWallets = IDL.Vec(Wallet);
  const Level = IDL.Nat;
  const PlayerName = IDL.Text;
  const Player = IDL.Record({
    'id' : PlayerId,
    'aid' : IDL.Text,
    'linkedWallets' : LinkedWallets,
    'level' : Level,
    'playerName' : PlayerName,
  });
  const PlayerPreferences = IDL.Record({
    'gamePlayerData' : IDL.Text,
    'language' : IDL.Nat,
    'playerChar' : IDL.Text,
    'playerCharID' : IDL.Nat,
  });
  const Balance = IDL.Nat;
  const TokenIdentifier = IDL.Text;
  const CommonError = IDL.Variant({
    'InvalidToken' : TokenIdentifier,
    'Other' : IDL.Text,
  });
  const BalanceResponse = IDL.Variant({ 'ok' : Balance, 'err' : CommonError });
  const P2Status = IDL.Record({
    'status' : IDL.Text,
    'clientScore' : ScoreCC__1,
    'lastAlive' : IDL.Nat64,
    'gameLastUpdate' : IDL.Text,
  });
  const ScoreCC = IDL.Nat;
  const Cosmicrafts = IDL.Service({
    'cancelGame' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'createGame' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          IDL.Vec(IDL.Nat),
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Text,
          IDL.Nat64,
          IDL.Text,
          IDL.Text,
        ],
        [GameStatus],
        [],
      ),
    'createPlayer' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    'findGame' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          IDL.Vec(IDL.Nat),
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Text,
          IDL.Nat64,
        ],
        [GameStatus],
        [],
      ),
    'getClientLastAlive' : IDL.Func([IDL.Nat], [IDL.Nat64], ['query']),
    'getGameInProgressData' : IDL.Func([IDL.Nat], [GameStatus], ['query']),
    'getGameMatchStatus' : IDL.Func([IDL.Nat], [GameStatus], ['query']),
    'getMasterLastAlive' : IDL.Func([IDL.Nat], [IDL.Nat64], ['query']),
    'getPlayer' : IDL.Func([], [IDL.Opt(Player)], []),
    'getPlayerPreferences' : IDL.Func([], [IDL.Opt(PlayerPreferences)], []),
    'getPlayerScore' : IDL.Func([], [BalanceResponse], []),
    'getUserMatchData' : IDL.Func([IDL.Nat], [P2Status], ['query']),
    'principalToString' : IDL.Func([], [IDL.Principal], ['query']),
    'saveMatchLastAlive' : IDL.Func([IDL.Nat, IDL.Nat64], [IDL.Bool], []),
    'savePlayerCharacter' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'savePlayerLanguage' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'savePlayerPreferences' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'savePlayerScore' : IDL.Func([IDL.Nat], [IDL.Bool, IDL.Text], []),
    'setGameInProgressData' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat64, IDL.Text, IDL.Nat, ScoreCC],
        [IDL.Bool],
        [],
      ),
    'setGameWinner' : IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat], [IDL.Bool], []),
    'setPlayerAlive' : IDL.Func([IDL.Nat, IDL.Nat64], [IDL.Bool], []),
    'setUserInProgressData' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat64, IDL.Text, ScoreCC],
        [P2Status],
        [],
      ),
  });
  return Cosmicrafts;
};
export const init = ({ IDL }) => { return []; };
