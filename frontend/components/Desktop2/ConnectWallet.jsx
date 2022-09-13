import React from "react";
import Profile from "../../images/profile.svg";
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

      <div className="row-d">
        <br />
        <div className="column-d2">
          <p>Sold to @Arexavier_ for $5 ( 0.0098)</p>
          <div className="box">
            <div className="box-profile">
              <img src={Profile} alt="profile-icon" />
              <p>Yash Gupta</p>
              <br />
            </div>
            <div className="box-message">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo eaque unde quod?
              </p>
              <hr className="line" />
            </div>
          </div>
        </div>
        <div className="column-d2">
          <p>Sold to @Arexavier_ for $5 ( 0.0098)</p>
          <div className="box">
            <div className="box-profile">
              <img src={Profile} alt="profile-icon" />
              <p>Yash Gupta</p>
              <br />
            </div>
            <div className="box-message">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo eaque unde quod?
              </p>
              <hr className="line" />
            </div>
          </div>
        </div>
      </div>
      <button className="launch_app">
        <b>Discover More</b>
      </button>
    </div>
  );
};

export default ConnectWallet;
