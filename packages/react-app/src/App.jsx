import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Alert, Layout } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "./hooks";
import { Header, Account, Contract, GasGauge } from "./components";
import { Transactor } from "./helpers";
import { formatEther } from "@ethersproject/units";
import { Checkout } from "./views"
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";

const { Content } = Layout;

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS['kovan'];

// 😬 Sorry for all the console logging
const DEBUG = false;


// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const scaffoldEthProvider = new JsonRpcProvider("https://rpc.scaffoldeth.io:48544")
const mainnetInfura = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

function App(props) {

  const mainnetProvider = (scaffoldEthProvider && scaffoldEthProvider._network) ? scaffoldEthProvider : mainnetInfura
  if(DEBUG) console.log("🌎 mainnetProvider",mainnetProvider)

  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork,mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork,"fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider);
  const address = useUserAddress(userProvider);
  if(DEBUG) console.log("👩‍💼 selected address:",address)

  let selectedChainId = userProvider && userProvider._network && userProvider._network.chainId
  if(DEBUG) console.log("🕵🏻‍♂️ selectedChainId:",selectedChainId)

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if(DEBUG) console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(userProvider)
  if(DEBUG) console.log("📝 readContracts",readContracts)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  if(DEBUG) console.log("🔐 writeContracts",writeContracts)

  const networkDisplay = (
    <div style={{zIndex:-1, position:'absolute', right:154,top:28,padding:16,color:targetNetwork.color}}>
      {targetNetwork.name}
    </div>
  );

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute]);

  return (
    <div className="App">
      <Header />
      {networkDisplay}
      <Content style={{ padding: '100px 150px' }}>
        <BrowserRouter>
          <Switch>
            <Route path="/">
              <Checkout
                provider={userProvider}
                address={address}
                tx={tx}
                writeContracts={writeContracts}
                readContracts={readContracts}
              />
            </Route>
            <Route exact path="/explore">
              <Contract
                name="ERC1400"
                signer={userProvider.getSigner()}
                provider={userProvider}
                address={address}
                blockExplorer={blockExplorer}
              />
            </Route>
          </Switch>
        </BrowserRouter>
      </Content>

      <div
        style={{
          position: "fixed",
          textAlign: "right",
          right: 0,
          top: 0,
          padding: 10
        }}>
         <Account
           address={address}
           userProvider={userProvider}
           mainnetProvider={mainnetProvider}
           price={price}
           web3Modal={web3Modal}
           loadWeb3Modal={loadWeb3Modal}
           logoutOfWeb3Modal={logoutOfWeb3Modal}
           blockExplorer={blockExplorer}
         />
      </div>

    </div>
  );
}


/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

 window.ethereum && window.ethereum.on('chainChanged', chainId => {
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

export default App;
