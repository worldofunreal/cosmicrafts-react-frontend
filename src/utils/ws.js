import IcWebSocket, { generateRandomIdentity } from "ic-websocket-js";

// Production
const gatewayUrl = "wss://gateway.icws.io";
const icUrl = "https://icp0.io";
const canisterId = "vqzll-jiaaa-aaaan-qegba-cai";

// Local test
// const gatewayUrl = "ws://127.0.0.1:8080";
// const icUrl = "http://127.0.0.1:4943";
// const canisterId = "bd3sg-teaaa-aaaaa-qaaba-cai";


export const openWebsocket = (canID, identity) => { 
    try{
        return new IcWebSocket(gatewayUrl, undefined, {
            canisterId: canID,
            identity: identity, //generateRandomIdentity(),
            networkUrl: icUrl,
        });
    }catch(e){
        console.log("ERROR OPENING WebSocket", e);
        return null;
    }
};

export const closeWS = (ws) => {
    console.log("FORCE CLOSE WebSocket");
    ws.close();
}