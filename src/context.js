import React, { createContext, useState } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  let _prevData = (localStorage.getItem("cosmic_user") !== null) ? 
      JSON.parse(localStorage.getItem("cosmic_user")) 
    : 
      {
        wallet: "", 
        walletState: "disconnected",
        walletConnected: "",
        userName: ""
      };
  const [walletData, setWalletData] = useState(_prevData);
  /// Player
  const [aID, setAID] = useState(null);
  const [identity, setIdentity] = useState(null);
  /// NFTs
  const [map, setMap] = useState(null);
  const [myNFTsIDs, setMyNFTsIDs] = useState([]);
  const [allMyNFTs, setAllMyNFTs] = useState([]);
  /// Game
  const [cosmicrafts, setCosmicrafts] = useState(null);
  const value = { walletData, setWalletData, 
                  map, setMap, 
                  aID, setAID, 
                  cosmicrafts, setCosmicrafts, 
                  myNFTsIDs, setMyNFTsIDs, 
                  allMyNFTs, setAllMyNFTs,
                  identity, setIdentity
                };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;