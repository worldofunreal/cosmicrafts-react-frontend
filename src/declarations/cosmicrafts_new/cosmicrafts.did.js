export const idlFactory = ({ IDL }) => {
  const PlayerId = IDL.Principal;
  const PlayerName = IDL.Text;
  const Level = IDL.Nat;
  const Player = IDL.Record({
    'id' : PlayerId,
    'name' : PlayerName,
    'level' : Level,
  });
  const PlayerPreferences = IDL.Record({
    'language' : IDL.Nat,
    'playerChar' : IDL.Text,
  });
  const Cosmicrafts = IDL.Service({
    'createPlayer' : IDL.Func([IDL.Text], [IDL.Bool, IDL.Text], []),
    'getICPBalance' : IDL.Func([], [IDL.Record({ 'e8s' : IDL.Nat64 })], []),
    'getPlayer' : IDL.Func([], [IDL.Opt(Player)], []),
    'getPlayerPreferences' : IDL.Func([], [IDL.Opt(PlayerPreferences)], []),
    'savePlayerChar' : IDL.Func([IDL.Text], [IDL.Bool, IDL.Text], []),
    'savePlayerLanguage' : IDL.Func([IDL.Nat], [IDL.Bool, IDL.Text], []),
    'savePlayerName' : IDL.Func([IDL.Text], [IDL.Bool], []),
  });
  return Cosmicrafts;
};
export const init = ({ IDL }) => { return []; };
