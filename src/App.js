import React, { useState, useEffect, useContext } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

import { openWebsocket, closeWS } from "./utils/ws";

/// Game functions
import { AppContext } from "./context";
import { loginII, handleAuthenticated, loginStoic, loginPlug, loginInfinityWallet, getAID, getAIDpopup, getCanister, getPlayerAddress, getPlayerCanister, getScoreTokenCanister, getMatchmakingCanister, getStatisticsCanister } from "./functions/login";

/// CANISTERS
//import * as _principal             from "@vvv-interactive/nftanvil-tools/cjs/principal.js";
import { idlFactory as cosmicCan }      from "./declarations/cosmicrafts/cosmicrafts.did.js";
import { idlFactory as playerCan }      from "./declarations/players_canister/players_canister.did.js";
import { idlFactory as scoreTokenCan }  from "./declarations/score_token/score_token.did.js";
import { idlFactory as matchmakingCan } from "./declarations/matchmaking";
import { idlFactory as statisticsCan }  from "./declarations/statistics";
/// STATS
import { Usergeek } from "usergeek-ic-js"
/// CHAT
///////->import { ChatAppContext } from "./chatSDK/chatAppContext";
import { Principal } from "@dfinity/principal";
/// HELPERS
import { ShowError } from "./functions/helpers";
/// WEBSOCKETS
import { deserializeAppMessage, serializeAppMessage } from "./utils/idl";

const unityContext = new UnityContext({
  loaderUrl: "GameBuild/Build/GameBuild.loader.js",
  dataUrl: "GameBuild/Build/GameBuild.data",
  frameworkUrl: "GameBuild/Build/GameBuild.framework.js",
  codeUrl: "GameBuild/Build/GameBuild.wasm",
});

const canisterId            = "onhpa-giaaa-aaaak-qaafa-cai";
const playerCanisterId      = "7saxw-4aaaa-aaaak-qadmq-cai";
const scoreCanisterId       = "e3q2w-lqaaa-aaaai-aazva-cai";
const matchmakingCanisterId = "vqzll-jiaaa-aaaan-qegba-cai";
const statisticsCanisterId  = "jybso-3iaaa-aaaan-qeima-cai";

// let gameManagerActive = false;
// let playerIndex = 0;
// let winnerPlayer = 0;

function App() {
  //const [user, setUser] = useState(null); /// For game
  /// User data
  let { aID, setAID, 
        cosmicrafts, setCosmicrafts,
        identity, setIdentity
      } = useContext(AppContext);
  // const [playerAddress, setPlayerAddress] = useState(null);
  const [player, setPlayer] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerConfigData, setPlayerConfigData] = useState(null);
  const [playerCharSelected, setPlayerCharSelected] = useState(null);
  const [walletService, setWalletService] = useState("");
  const [unityPlayerData, setUnityPlayerData] = useState(null);
  const [aII, setAII] = useState(null);
  const [plugID, setPlugID] = useState(null);
  const [iwID, setIWID] = useState(null);
  const [pop, setPop] = useState(null); /// Pop-up from InfinityWallet and Plug Wallet

  /// In game data
  const [playerCanister,      setPlayerCanister]      = useState(null);
  const [scoreCanister,       setScoreCanister]       = useState(null);
  // const [multiplayerCanister, setMultiplayerCanister] = useState(null);
  const [matchmakingCanister, setMatchmakingCanister] = useState(null);
  const [statisticsCanister,  setStatisticsCanister]  = useState(null);
  const [isLoading,           setIsLoading]           = useState(true);
  const [prog,                setProg]                = useState(0);
  const [playerPrincipal,     setPlayerPrincipal]     = useState(null);
  const [dashboardSet,        setDashboardSet]        = useState(false);
  






  /// Web Sockets
  const [matchmakingWS, setMatchmakingWs] = useState(null);
  const [connecting,    setConnecting]    = useState(true);
  const [isClosed,      setIsClosed]      = useState(false);
  const [isConnected,   setIsConnected]   = useState(false);

  const displayErrorMessage = (error) => {
    if (isClosed) {
      return;
    }
    console.error("ERROR WEBSOCKETS", error);
  };

  // const sendMessageWS = () => {
  //   if (isClosed) {
  //     return;
  //   }

  //   const message = {
  //     message: "pong",
  //     // timestamp: Date.now(),
  //   };

  //   try {
  //     const messageToSend = serializeAppMessage(message);
  //     console.log("Sending message:", messageToSend);
  //     matchmakingWS.send(messageToSend);
  //   } catch (error) {
  //     if (isClosed) {
  //       return;
  //     }
  //     console.log("ERROR WHILE SENDING", error);
  //     displayErrorMessage(JSON.stringify(error));
  //   }
  // };

  useEffect(() => {
    if(matchmakingWS !== null && matchmakingCanister !== null){
      const processGameAccepted = async (message) => {
        try{
          let matchData = await matchmakingCanister.getMatchData(message.data);
          matchData = matchData[0];
          console.log("MATCH DATA", matchData, matchData.player1.id.toString(), matchData.player2[0].id.toString());
          console.log("-------------");
          let _opponent = (matchData.player1.id === identity.getPrincipal()) ? matchData.player2[0].id : matchData.player1.id;
          console.log("Opponent", _opponent);
          let _opponentData = await playerCanister.getPlayer(_opponent);
          _opponentData = _opponentData;
          console.log("Opponent data", _opponentData);
          let _dataToUnity = {
            walletID    : _opponentData.id.toString(),
            nikename    : _opponentData.playerName,
            level       : _opponentData.level,
            characterId : matchData.characterSelected,
          };
          console.log("DATA TO UNITY", _dataToUnity);
          unityContext.send("MatchMulti", "GL_MatchStarting", JSON.stringify(_dataToUnity));
        } catch(e){
          console.log("ERROR ON PROCESS GAME ACCEPTED", e);
        };
      };

      matchmakingWS.onopen = () => {
        setIsConnected(true);
        setIsClosed(false);
        setConnecting(false);
        try{
          console.log("WebSocket state:", matchmakingWS.readyState, "is open:", matchmakingWS.readyState === matchmakingWS.OPEN);
        }catch(e){
          console.log("WebSocket error state:", e);
        }
      };
    
      matchmakingWS.onclose = () => {
        setIsClosed(true);
        setIsConnected(false);
        setConnecting(false);
        console.log("WEBSOCKET CLOSED", matchmakingWS.OPEN);
      };
    
      matchmakingWS.onerror = (event) => {
        console.log("ONERROR WebSocket", event);
        if (isClosed) {
          return;
        }
        displayErrorMessage(event.error.message);
      };

      matchmakingWS.onmessage = (event) => {
        console.log("Received message");
        try{
          console.log("Is closed", isClosed);
        }catch(err){
          console.log("ERROR ON RECEIVE MESSAGE", err);
        }
        if (isClosed) {
          return;
        }
        try{
          const message = deserializeAppMessage(event.data);
        
          console.log("Received message:", message);
          console.log(message, 'backend');
          switch(message.message){
            case "Game accepted":
              console.log("Game accepted");
              processGameAccepted(message);
              break;
            case "Returning to search":
              console.log("Returning to search");
              unityContext.send("MatchMulti", "GL_UserAcceptedButNotCouple", "");
              break;
              case "Game found":
                console.log("Game found");
                unityContext.send("MatchMulti", "GL_MatchFound", "");
                // setTimeout(() => {
                //   unityContext.send("MatchMulti", "GL_FinishMatch", "");
                // }, 5000);
              break;
          }
        }catch(err){
          console.log("ERROR ON RECEIVE MESSAGE", err);
        }
      };
    }
  }, [matchmakingWS, matchmakingCanister]);



  


  




  /// Useful info
  /** Unity
   * LoginCanvas, onNameData
   * 0 = Ask for player's name
   * 1 = Send to main menu
   * 2 = Send to claim NFTs screen
   * 3 = User not registered or approved
   */
  
  useEffect(() => { 
    if(cosmicrafts !== null && player === null && playerCanister !== null && scoreCanister !== null) {
      getOrSetPlayer();
    } 
  }, [cosmicrafts, playerCanister, scoreCanister]);

  //useEffect(() => { if(betaNFTsCanister !== null) { } }, [betaNFTsCanister]);
  
  useEffect(() => { 
    if(identity !== null && identity !== undefined) { 
      console.log("IDENTITY", identity, aII, aII._identity);
      generateMap(false); 
      /// Web Sockets
      // setMatchmakingWs(openWebsocket(matchmakingCanisterId, aII._identity)); 
      setMatchmakingWs(openWebsocket(matchmakingCanisterId, identity._inner)); 
      if(pop === false && aID === null) { 
        generateAID(); 
      } 
    } 
  }, [identity]);

  useEffect(() => { if(aII !== null) { iiLogin(); } }, [aII]);

  useEffect(() => {}, [playerPrincipal, aID]);

  useEffect(() => { if(plugID !== null) { generatePlugCan(); } }, [plugID]);

  useEffect(() => { if(iwID !== null) { generateIWCan(); } }, [iwID]);

  useEffect(() => {}, [playerName, walletService]);

  useEffect(() => { if(player !== null) { initializeGame(); } }, [player]);

  useEffect(() => { if(unityPlayerData !== null) { sendDataToUnity(); } }, [unityPlayerData]);

  useEffect(() => { if(pop !== null) { generateAID(); } }, [pop]);


  /// Level
  const xp_table = [
                    0,
                    2500,
                    3750,
                    5625,
                    8438,
                    12656,
                    18984,
                    28477,
                    42715,
                    64072,
                    96108,
                    144163,
                    216244,
                    324366,
                    486549,
                    729823,
                    1094735,
                    1642102,
                    2463153,
                    3694730,
                    5542095,
                    8313142,
                    12469713,
                    18704569,
                    28056854,
                    42085280,
                    63127921,
                    94691881,
                    142037822,
                    213056732,
                    319585099,
                    479377648,
                    719066472,
                    1078599708,
                    1617899562,
                    2426849343,
                    3640274015,
                    5460411023,
                    8190616534,
                    12285924801,
                    18428887202,
                    27643330802,
                    41464996204,
                    62197494305,
                    93296241458,
                    139944362187,
                    209916543280,
                    314874814921,
                    472312222381,
                    708468333571,
                    1062702500357,
                    1594053750535,
                    2391080625803,
                    3586620938704,
                    5379931408056,
                    8069897112084,
                    12104845668126,
                    18157268502189,
                    27235902753284,
                    40853854129926,
                    61280781194888,
                    91921171792333,
                    137881757688499,
                    206822636532748,
                    310233954799122
  ];

  const getLevel = (xp) => {
    for(let i = 0; i < xp_table.length; i++){
      if(xp < xp_table[i]){
        return i;
      }
    }
    return 1;
  };

  useEffect(() => {
    ///////->setUnityApp(unityContext);
    initUsergeek();
  }, []);

  // let lastCheck = 0;
  // let enemyLastAlive = 0;
  // let timeoutWait = 30;
  // let inGame = false;

  const initUsergeek = () => {
    try{
      Usergeek.init({
        apiKey: "0175019CC7D93DC047C139592BCFB7F0",
        host: "https://ic0.app"
      });
      console.log("Usergeek initialized");
    } catch (err){
      ShowError("Error on Usergeek init", err);
    }
  };


  ////////// START //////////

  /* PLAYER ENTERS THE FIRST SCREEN OF THE GAME TO SELECT WALLET*/
  /// Login
  /// Receive player's wallet chosen
  unityContext.on("JSWalletsLogin", (walletSelected) => {
    login(walletSelected);
  });
  /// Proceed depending on wallet service
  const login = async (walletSelected) => {
    let _now = new Date();
    console.log("START LOADING", _now);
    switch(walletSelected){
      case "identityWallet": /// Internet Identity
        setWalletService("II");
        await loginII(setAII);
        setPop(false);
        break;
      case "stoicWallet": /// Stoic Identity
      let _stoicIdentity = await loginStoic();
        setIdentity(_stoicIdentity);
        setWalletService("Stoic");
        setPlayerPrincipal(_stoicIdentity.getPrincipal());
        setPop(false);
        break;
      case "plugWallet": /// Plug wallet
        let _id = await loginPlug();
        setPlayerPrincipal(_id);
        setPlugID(_id);
        setWalletService("Plug");
        setPop(true);
        break;
      case "infinityWallet": /// Infinity Swap
        let _idIW = await loginInfinityWallet();
        setPlayerPrincipal(_idIW);
        setIWID(_idIW);
        setWalletService("InfinityWallet");
        setPop(true);
        break;
      default: /// Other
        ShowError("Error on wallet selected", "WALLET OPTION NOT VALID");
        alert("Error on wallet selected");
        window.location.reload(false);
        break;
    }
  };

  /// Generate Account Identifier
  /// This is set with a useEffect[pop] to check if we have an identity or a principal
  const generateAID = async () => {
    if(pop === false){ // II && Stoic
      if(identity !== null){
        setAID(await getAID(identity));
      }
      return true;
    } 
    if(pop === true){ // IW && Plug
      setAID(await getAIDpopup(playerPrincipal));
      return true;
    }
    /// pop === null
    return false;
  };

  /// Internet Identity (II)
  const iiLogin = async () => {
    setIdentity(await handleAuthenticated(aII));
  };

  /// II & Stoic
  const generateMap = async (_pop) => {
    //generatePlayerAddress();
    if(_pop === false){
      generateCanister();
    }
  };
  // const generatePlayerAddress = () => {
  //   setPlayerAddress(getPlayerAddress());
  // };
  const generateCanister = async () => {
    setCosmicrafts(await getCanister(identity));
    // setMultiplayerCanister(await getCanister(null));
    setPlayerCanister(await getPlayerCanister(identity));
    setScoreCanister(await getScoreTokenCanister(identity));
    setMatchmakingCanister(await getMatchmakingCanister(identity));
    setStatisticsCanister(await getStatisticsCanister(identity));
  };

  ///Plug wallet
  const generatePlugCan = async () => {
    (async () => {
      setWalletService("Plug");
      const _cosmicraftsCanister = await window.ic.plug.createActor({
        canisterId: canisterId,
        interfaceFactory: cosmicCan,
      });
      const _playerCanister = await window.ic.plug.createActor({
        canisterId: playerCanisterId,
        interfaceFactory: playerCan,
      });
      const _scoreCanister = await window.ic.plug.createActor({
        canisterId: scoreCanisterId,
        interfaceFactory: scoreTokenCan,
      });
      const _matchmakingCanister = await window.ic.plug.createActor({
        canisterId: matchmakingCanisterId,
        interfaceFactory: matchmakingCan,
      });
      const _statisticsCanister = await window.ic.plug.createActor({
        canisterId: statisticsCanisterId,
        interfaceFactory: statisticsCan,
      });
      setCosmicrafts(_cosmicraftsCanister);
      setPlayerCanister(_playerCanister);
      setScoreCanister(_scoreCanister);
      setMatchmakingCanister(_matchmakingCanister);
      setStatisticsCanister(_statisticsCanister);
      // setMultiplayerCanister(await getCanister(null));
    })()
  };

  const generateIWCan = async () => {
    try{
      (async () => {
        setWalletService("InfinitySwap");
        const _cosmicraftsCanister = await window.ic.infinityWallet.createActor({
          canisterId: canisterId,
          interfaceFactory: cosmicCan,
        });
        const _playerCanister = await window.ic.infinityWallet.createActor({
          canisterId: playerCanisterId,
          interfaceFactory: playerCan,
        });
        const _scoreCanister = await window.ic.infinityWallet.createActor({
          canisterId: scoreCanisterId,
          interfaceFactory: scoreTokenCan,
        });
        const _matchmakingCanister = await window.ic.infinityWallet.createActor({
          canisterId: matchmakingCanisterId,
          interfaceFactory: matchmakingCan,
        });
        const _statisticsCanister = await window.ic.plug.createActor({
          canisterId: statisticsCanisterId,
          interfaceFactory: statisticsCan,
        });
        setCosmicrafts(_cosmicraftsCanister);
        setPlayerCanister(_playerCanister);
        setScoreCanister(_scoreCanister);
        setMatchmakingCanister(_matchmakingCanister);
        setStatisticsCanister(_statisticsCanister);
        // setMultiplayerCanister(await getCanister(null));
      })()
    } catch(e){
      ShowError("IW E", e);
      alert("Your Wallet session has expired. Please login again in their app and then reload this page");
    }
  };

  unityContext.on("JSGoToMenu", () => {
    /// After claiming all NFTs, load player's data and send user to main menu
    sendDataToUnity();
  });

  const getOrSetPlayer = async () => {
    try{
      let _myPrincipal = (playerPrincipal !== null) ? playerPrincipal : await identity.getPrincipal();
      Usergeek.setPrincipal(_myPrincipal);
      Usergeek.trackSession();
      console.log("USERGEEK SET", _myPrincipal);
      let _player = await playerCanister.getMyPlayer();
      if(_player === null || _player.length === 0){
        unityContext.send("LoginCanvas", "OnNameData", 0);
      } else {
        setPlayer(_player[0]);
      }
    } catch(e){
      alert("Your Wallet session has expired. Please login again in their app and then reload this page");
      ShowError("Get or set player error", e);
    }
  };

  /// New Player
  unityContext.on("JSLoginPanel", (newPlayerName) => {
    setPlayerName(newPlayerName);
  });
  useEffect(() => {
    if(playerName !== ""){
      createPlayer();
    }
  }, [playerName]);
  const createPlayer = async () => {
    if(playerName !== ""){
      let _newPlayer = await cosmicrafts.createPlayer(aID, playerName, walletService);
      if(_newPlayer){
        let _player = await playerCanister.getMyPlayer();
        setPlayer(_player[0]);
      } else {
        ShowError("No player created", "ERROR WHILE CREATING PLAYER ON CANISTER");
        alert("Error creating player, please try agan");
      }
    } else {
      alert("Invalid name");
    }
  };

  /// Set Player for Unity
  const initializeGame = async () => {
    if(player !== null){
      localStorage.removeItem("cosmic_user");
      let _unityPlayerData = {
        "WalletId": player.id.toString(),
        "NikeName": player.playerName
      };
      setUnityPlayerData(_unityPlayerData);
    }
  };

  /// Initial data to Unity
  const sendDataToUnity = async () => {
    unityContext.send("LoginCanvas", "OnNameData", 1);
  };

  unityContext.on("DashboardStarts", () => {
    if(dashboardSet === false){
      waitForDashboardToLoad();
    }
  });

  const waitForDashboardToLoad = async () => {
    Usergeek.trackEvent("Load Player's data");
    let _pref = await playerCanister.getMyPreferences();
    let _principal = (pop === true) ? Principal.fromText(playerPrincipal) : playerPrincipal;
    let score;
    try{
      score = await scoreCanister.balance({ user : {principal : _principal}, token : "" });
    } catch(err){
      console.log("SCORE NOT RETRIEVED", err);
      score = 0;
    }
    score = (score.ok !== undefined) ? parseInt(score.ok) : 0;
    //// TO DO: GET REAL LEVEL, XP AND BattlePoints
    let _prog = JSON.stringify({"Xp": score, "Level": getLevel(score), "BattlePoints": score});
    let _lang = (_pref.length > 0 && _pref[0].gamePlayerData !== "") ? _pref[0].gamePlayerData : JSON.stringify({"language": 0});
    let _char = (_pref.length > 0 && parseInt(_pref[0].playerCharID) !== 0 ) ? parseInt(_pref[0].playerCharID) : 1;
    unityContext.send("Dashboard", "GL_SetPlayerData", JSON.stringify(unityPlayerData));
    //unityContext.send("Dashboard", "GL_SetCharacterSelected", _char);
    unityContext.send("Dashboard", "GL_SetCharacterSelected", 1);
    unityContext.send("Dashboard", "GL_SetConfigData", _lang);
    unityContext.send("Dashboard", "GL_SetProgressData", _prog);
    setPlayerConfigData(_lang);
    setPlayerCharSelected(_char);
    //setIsLoading(false);
    setDashboardSet(true);
    ///////->setCoreCanisterExternal(identity);
  };


  //////////////////////// Communication with Unity ////////////////////////////////////
    ///// Unity default functions
    unityContext.on("loaded", () => {
      // When game has loaded all files
      setIsLoading(false);
    });
    unityContext.on("progress", (progression) => {
      /// Game's loading progression
      setProg(progression);
    });

    
    /// Game functions

    /// Save Player Data
      /// Get User's preferences to save
      unityContext.on("SavePlayerConfig", (json) => {
        saveUserPreferences(json);
      });
      /// Save User's preferences on IC
      const saveUserPreferences = async (json) => {
          //let _c = await cosmicrafts.savePlayerPreferences(json);
      };

      /// Get User's character to save
      unityContext.on("SavePlayerCharacter", (json) => {
          saveUserCharacter(json);
      });
      /// Save User's character on IC
      const saveUserCharacter = async (idNFT) => {
        let _c = await cosmicrafts.savePlayerCharacter(idNFT);
      };
    //// Save Player Data ////

    unityContext.on("error", function (message) { ShowError("ERROR FROM UNITY:", message); });

    unityContext.on("GameStarts", () => {
      // setGameManagerActive(true);
    });


    //////////////////////////////////////
    /////////////// Client ///////////////
    //////////////////////////////////////
      

      /// Receive score from game end
      unityContext.on("SaveScore", (score) => {
        saveScore(score);
        // inGame = false;
        // gameManagerActive = false;
      });

      /// Save the score
      const saveScore = async (score) => {
        Usergeek.trackEvent("Game finished");
        //let _isWinner = await cosmicrafts.isPlayerWinner(parseInt(gameId));
        //sendXPEarnedToUnity(score, won);
        //let saved = await cosmicrafts.savePlayerScore(score);
        // playerIndex = 0;
        //updateCXP();
      };

      const getUserIcpBalance = async () => {
        let _icpBalance = await cosmicrafts.getICPBalance();
      };

      //// Go to Main Menu after game
      unityContext.on("ExitGame", (json) => {
        //setGameWinner(winnerPlayer);
        // inGame = false;
        // gameManagerActive = false;
        // setGame({});
        // setGameId(0);
        // playerIndex = 0;
        // winnerPlayer = 0;
        updateCXP();
      });

      const updateCXP = async () => {
        const getScore = new Promise((resolve, reject) => {
          resolve(cosmicrafts.getPlayerScore());
        });
        getScore.then((_score) => {
          let score = (_score.ok !== undefined) ? parseInt(_score.ok) : 0;
          let _prog = JSON.stringify({"Xp": score, "Level": getLevel(score), "BattlePoints": score});
          unityContext.send("Dashboard", "GL_SetProgressData", _prog);
          unityContext.send("Dashboard", "GL_SetPlayerData", JSON.stringify(unityPlayerData));
          unityContext.send("Dashboard", "GL_SetCharacterSelected", playerCharSelected);
          unityContext.send("Dashboard", "GL_SetConfigData", playerConfigData);
        });
      };




  /** NEW MULTIPLAYER MATCHMAKING **/
  /// Receive score from game end
  unityContext.on("JS_SearchGame", () => {
    matchmakingStartSearch();
  });

  const matchmakingStartSearch = async () => {
    let _searchMatch = await matchmakingCanister.getMatchSearching();
    console.log("_searchMatch", _searchMatch);
    if(parseInt(_searchMatch[1]) === 0){
      /// No match was found, create one
      //let _addMatch = await matchmakingCanister.addPlayerSearching();
      matchmakingWS.send(serializeAppMessage({ message: "addPlayerSearching", data: 0 }));
      console.log("Added player to matchmaking");
    } else {
      console.log("_searchMatch[0].Available", _searchMatch[0].Available);
      if(_searchMatch[0].Available !== undefined){
        /// There's a match Available, try to join
        //let _tryToJoin = await matchmakingCanister.assignPlayer2(_searchMatch[1]);
        matchmakingWS.send(serializeAppMessage({ message: "assignPlayer2", data: _searchMatch[1] }));
        console.log("Adding player as P2");
        // if(_tryToJoin[0] === true){
        //   /// Matched, ask to accept
        //   unityContext.send("MatchMulti", "GL_MatchFound", "");
        // } else {
        //   /// Could not match, wait and start again
        //   setTimeout(() => {
        //     matchmakingStartSearch();
        //   }, 500);
        // }
      } else {
        /// The user was already matched
      }
    }
  };

  unityContext.on("JS_AcceptMatch", (_idCharacter) => {
    console.log("WILL ACCEPT MATCH WITH DATA", _idCharacter);
    matchmakingAcceptMatch(_idCharacter);
  });

  const matchmakingAcceptMatch = async (_idCharacter) => {
    // let _acceptMatch = await matchmakingCanister.acceptMatch();
    // //// REPLACE WITH IC WEBHOOKS
    // if(_acceptMatch[0] === true && _acceptMatch[1] === "Accepted and In Progress"){
    //   let _opponentData = {
    //     /// TO-DO: Get opponent's data.
    //   };
    //   unityContext.send("MatchMulti", "GL_MatchStarting", _opponentData);
    // }
    matchmakingWS.send(serializeAppMessage({ message: "acceptMatch", data: _idCharacter }));
  };

  unityContext.on("JS_CancelSearchGame", () => {
    matchmakingCancelSearch();
  });

  const matchmakingCancelSearch = async () => {
    let _cancel = await matchmakingCanister.cancelMatchmaking();
    console.log("CANCEL SEARCH", _cancel)
  };

  unityContext.on("JS_RejectMatch", () => {
    console.log("Will reject match from Unity");
    //matchmakingRejectMatch();
  });

  const matchmakingRejectMatch = async () => {
    // let _reject = await matchmakingCanister.rejectMatch();
    // console.log("REJECTED", _reject);
    matchmakingWS.send(serializeAppMessage({ message: "rejectMatch", data: 0 }));
  };


  /// Statistics
  unityContext.on("JS_SendStats", (json) => {
    console.clear();
    console.log("STATS", json);
    saveEndgameStats(JSON.parse(json));
  });

  const saveEndgameStats = async (_data) => {
    /// TEST USERGEEK, MAYBE NOT WORKING?
    // Usergeek.trackEvent(`GAME FINISHED`);
    Usergeek.trackEvent(`GAME MODE ${_data.gameMode}`);
    Usergeek.trackEvent(`CHARACTER PLAYED ${_data.characterID}`);
    console.log("USERGEEK NEW STATS SENT");

    let _stats = {
      energyUsed       : _data.energyUsed,  
      energyGenerated  : _data.energyGenerated,
      energyWasted     : _data.energyWasted,
      energyChargeRate : _data.energyChargeRate,
      xpEarned         : _data.xpEarned,
      damageDealt      : _data.damage,
      damageTaken      : _data.damageReceived,
      damageCritic     : _data.damageCritic,
      damageEvaded     : _data.damageEvaded,
      kills            : _data.kills,
      deploys          : _data.deploys,
      secRemaining     : _data.secRemaining,
      wonGame          : (_data.teamWinner === 1) ? true : false,
      faction          : _data.faction,
      characterID      : _data.characterID,
      gameMode         : _data.gameMode,
      botMode          : _data.botMode,
      botDifficulty    : _data.botDificult,
    }
    try{
      let _savedStats = await statisticsCanister.saveFinishedGame(1 /* CHANGE FOR REAL ID */, _stats);
      console.log("SAVED STATS", _savedStats);
    } catch(err){
      console.log("ERR STATS", err);
    }
  };

  return (
    <>
    {
      isLoading !== false ?
      <>
        <video autoPlay muted loop id="loadingVideo">
          <source src="Loader.webm" type="video/webm" />
        </video>
      </>
      :
      <>
      </>
    }
      <Unity 
        unityContext={unityContext} 
        style={{
          height: "100%",
          width: "100%",
        }} 
      />
      {isConnected && (
        <h3 className="text-lg font-semibold">Websocket open</h3>
      )}
      {isClosed && (
        <h3 className="text-lg font-semibold">Websocket closed</h3>
      )}
      {connecting && (
        <h3 className="text-lg font-semibold">Websocket connecting</h3>
      )}
      {matchmakingWS && isConnected && (
        <button onClick={() => { closeWS(matchmakingWS); } }>Close Websocket</button>
      )}
    </>
  );
}

export default App;
