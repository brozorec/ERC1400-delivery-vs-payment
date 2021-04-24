import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "antd/dist/antd.css";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Alert, Layout, Button } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader } from "./hooks";
import { Header, Account, Contract } from "./components";
import { Transactor } from "./helpers";
import { Checkout } from "./views"
import { NETWORK, NETWORKS } from "./constants";

const { Content } = Layout;

const targetNetwork = NETWORKS['kovan'];

const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + process.env.REACT_APP_INFURA_ID)

const blockExplorer = targetNetwork.blockExplorer;

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  const gasPrice = useGasPrice(targetNetwork, "fast");
  const userProvider = useUserProvider(injectedProvider);
  const address = useUserAddress(userProvider);

  let selectedChainId = userProvider && userProvider._network && userProvider._network.chainId

  const tx = Transactor(userProvider, gasPrice)

  const readContracts = useContractLoader(userProvider)

  const writeContracts = useContractLoader(userProvider)

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    <div className="App">
      <Header />
      {selectedChainId && selectedChainId !== 42 ? (
        <div style={{ zIndex:2, position:'absolute', right:0, top:60, padding:16 }}>
          <Alert
            message={"⚠️ Wrong Network"}
            description={(
              <div>
                Vous avez sélectionné <b>{NETWORK(selectedChainId).name}</b> et vous devez changer pour <b>kovan</b>.
              </div>
            )}
            type="error"
            closable={false}
          />
        </div>
      ) : (
        <div style={{ zIndex:-1, position:'absolute', right:154, top:28, padding:16, color: targetNetwork.color }}>
          {targetNetwork.name}
        </div>
      )}
      <Content style={{ padding: '100px 150px' }}>{
        userProvider ? (
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
                  signer={userProvider ? userProvider.getSigner() : null}
                  provider={userProvider}
                  address={address}
                  blockExplorer={blockExplorer}
                />
              </Route>
            </Switch>
          </BrowserRouter>
        ) : (
          <div>
            <Alert
              message={"⚠️ Vous n'êtes pas connecté"}
              description={(
                <div>
                  Pour utiliser cette dApp, veuillez-vous connecter avec votre portefeuille !
                </div>
              )}
              type="error"
              closable={false}
            />
              <Button
                style={{ marginTop: 50 }}
                shape="round"
                size="large"
                onClick={loadWeb3Modal}
              >
                connexion
              </Button>
          </div>
        )}
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
        infuraId: process.env.REACT_APP_INFURA_ID,
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
