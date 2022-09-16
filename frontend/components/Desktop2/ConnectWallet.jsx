import React from "react";
import { useMoralis } from "react-moralis";

const ConnectWallet = () => {
  const { authenticate } = useMoralis();
  return (
    <div>
      <br />
      <br />
      <nav className="connectWallet">
        <ul>
          <li>Total Volume: 4,597,543</li>
          <li>Tweets Minted: 501,327</li>
          <li>Social Posts Minted: 3,458,909</li>
        </ul>

        <button className="launch_app" onClick={authenticate}>
          <b>Connect Wallet</b>
        </button>
      </nav>
    </div>
  );
};

export default ConnectWallet;
