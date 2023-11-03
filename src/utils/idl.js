import { IDL } from "@dfinity/candid";

export const AppMessageIdl = IDL.Record({
  'message': IDL.Text,
  'data': IDL.Nat
});

export const serializeAppMessage = (message) => {
  return new Uint8Array(IDL.encode([AppMessageIdl], [message]));
};

export const deserializeAppMessage = (bytes) => {
  return IDL.decode([AppMessageIdl], bytes)[0];
};