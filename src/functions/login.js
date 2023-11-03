import { router }         from "@vvv-interactive/nftanvil-canisters/cjs/router.js";
// import { ledgerCanister } from "@vvv-interactive/nftanvil-canisters/cjs/ledger.js";

import * as AccountIdentifier from "@vvv-interactive/nftanvil-tools/cjs/accountidentifier.js";
import { principalToAccountIdentifier, getSubAccountArray } from "@vvv-interactive/nftanvil-tools/cjs/token.js";

import { BigIntToString }     from "@vvv-interactive/nftanvil-tools/cjs/data.js";

import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { StoicIdentity } from "ic-stoic-identity";

import { idlFactory } from "../declarations/cosmicrafts";
//import { createActor as betaNFTsActor } from "../declarations/nfts_beta_test";
import { createActor as playerActor } from "../declarations/players_canister";
import { createActor as scoreActor } from "../declarations/score_token";
import { createActor as matchActor } from "../declarations/matchmaking";
import { createActor as statsActor } from "../declarations/statistics";

const canisterId            = "onhpa-giaaa-aaaak-qaafa-cai";
const betaCanisterId        = "k7h5q-jyaaa-aaaan-qaaaq-cai";
const playerCanisterId      = "7saxw-4aaaa-aaaak-qadmq-cai";
const scoreCanisterId       = "e3q2w-lqaaa-aaaai-aazva-cai";
const matchmakingCanisterId = "vqzll-jiaaa-aaaan-qegba-cai";
const statisticsCanisterId  = "jybso-3iaaa-aaaan-qeima-cai";
const whitelist             = [canisterId, betaCanisterId, playerCanisterId, "fo275-uiaaa-aaaai-qe3lq-cai", matchmakingCanisterId, statisticsCanisterId];
const host                  = 'https://raw.ic0.app/';
//const host ='https://mainnet.dfinity.network';

// INTERNET IDENTITY
export const loginII = async (setAII) => {
  console.log("Loggin in II");
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      setAII(authClient);
    } else {
      console.log("Not authenticated");
      return await authClient.login({
        onSuccess: async () => {
          setAII(authClient);
        },
      });
    }
};

export const handleAuthenticated = async (authClient) => {
  const identity = await authClient.getIdentity();
  return identity;
}

// STOIC IDENTITY
export const loginStoic = async () => {
    let _stoicIdentity = await StoicIdentity.load().then(async identity => {
      if (identity !== false) {
        //ID is a already connected wallet!
      } else {
        //No existing connection, lets make one!
        identity = await StoicIdentity.connect();
      }
      return identity;
      
      // let ledger = ledgerCanister({
      //     agentOptions: {
      //         host: 'https://mainnet.dfinity.network',
      //         identity 
      //       },
      //   });
        //setLedgerCan(ledger);
        
        /*await ledger.account_balance({
            account: AccountIdentifier.TextToArray(c),
        }).then((icp) => {
            let e8s = icp.e8s;
            setIcp(e8s);
            console.log("e8s", e8s);
            
            if (e8s >= 30000n) {
                // automatically wrap ICP
                //dispatch(user_pwr_buy({ amount: e8s - 10000n }));
            }
        });*/
        
        //Disconnect after
        //StoicIdentity.disconnect();
    });
    return _stoicIdentity;
  };

// PLUG WALLET
export const loginPlug = async () => {
    let connection = await window.ic.plug.requestConnect({ whitelist });
    console.log("Plug connection:", connection);
    const principalId = await window.ic.plug.agent.getPrincipal();
    var principal = principalId.toString();
    console.log(principal);
    return principal;
    
    ////setUserW(principal);
    /*let address, subaccount;

    if (principal !== "") {
      for (let i = 0; i < 100000; i++) {
        let c = principalToAccountIdentifier(principal, i);
        //console.log("SUBACCOUNT_ARRAY", getSubAccountArray(i));

        if (c.substring(0, 3) === "a00") {
          address = c;
          subaccount = AccountIdentifier.ArrayToText(getSubAccountArray(i));

          break;
        }
      }
    }*/
    //dispatch(user_login(false, principal));
    //console.log("USER PLUG", user);
    //console.log("ADDRESS ", address);
    //console.log("SUBACCOUNT", subaccount);
    //saveLoggedData(principal, "Plug");
};

/// INFINITY WALLET
export const loginInfinityWallet = async () => {
  try {
    await window.ic.infinityWallet.requestConnect({whitelist, host});
    const principalId = await window.ic.infinityWallet.agent.getPrincipal();
    var principal = principalId.toString();
    console.log(principal);
    return principal;
  } catch (e) {
    console.log("e", e);
    alert("Your Wallet session has expired. Please check your login in their app and then reload this page");
  }
};

export const getMap = async () => {
    let _map = await router.config_get();
    console.log("Map config get", _map);
    _map.router = _map.router.toString();
    _map = BigIntToString(_map);
    return _map;
};

export const getAID = async (identity) => {
    return principalToAccountIdentifier(identity.getPrincipal().toString(), 0);
};

export const getAIDpopup = async (principal) => {
  console.log("AID FROM", principal);
  let _aid = principalToAccountIdentifier(principal, 0);
  console.log(_aid);
  return _aid;
};

export const getCanister = async (identity) => {
    const _cosmicrafts = Actor.createActor(idlFactory, {
        agent: new HttpAgent({
          host: host,
          identity,
        }),
        canisterId,
    });
    console.log("Canister of cosmicrafts", _cosmicrafts);
    return _cosmicrafts;
};
export const getPlayerAddress = async () => {
   return AccountIdentifier.ArrayToText(getSubAccountArray(0));
};
// export const getBetaNFTsCanister = async (identity) => {
//   console.log("IDENTITY FOR BETA CANISTER", identity);
//   const _betaNFTsCanister = betaNFTsActor(betaCanisterId, {agentOptions: {
//     host: host,
//     identity,
//   }});
//   console.log("BETA CANISTER", _betaNFTsCanister);
//   return _betaNFTsCanister;
// };

export const getPlayerCanister = async (identity) => {
  const _playerCanister = playerActor(playerCanisterId, {agentOptions: {
    host: host,
    identity,
  }});
  return _playerCanister;
};

export const getScoreTokenCanister = async (identity) => {
  const _scoreCanister = scoreActor(scoreCanisterId, {agentOptions: {
    host: host,
    identity,
  }});
  return _scoreCanister;
};

export const getMatchmakingCanister = async (identity) => {
  const _matchmakingCanister = matchActor(matchmakingCanisterId, {agentOptions: {
    host: host,
    identity,
  }});
  return _matchmakingCanister;
};

export const getStatisticsCanister = async (identity) => {
  const _statisticsCanister = statsActor(statisticsCanisterId, {agentOptions: {
    host: host,
    identity,
  }});
  return _statisticsCanister;
};