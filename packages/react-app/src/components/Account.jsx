import React from "react";
import { Button } from "antd";
import Address from "./Address";
import Balance from "./Balance";

export default function Account({
  address,
  userProvider,
  mainnetProvider,
  price,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          déconnexion
        </Button>
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={loadWeb3Modal}
        >
          connexion
        </Button>
      );
    }
  }

  return (
    <div>
      <span>
        {address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />}
        <Balance address={address} provider={userProvider} price={price} />
      </span>
      {modalButtons}
    </div>
  );
}
