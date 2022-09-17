import React from "react";
import logo from "../images/logo.png";

const Footer = () => {
  return (
    <div>
      <div className="row-f">
        <div className="column-f">
          <div className="row-l">
            <div className="column-l">
              <p>12.6K</p>
              <p>Discord Members</p>
              <br />
              <button className="launch_app">
                <b>Join Discord</b>
              </button>
            </div>
            <div className="column-l">
              <p>7.6K</p>
              <p>Twitter Followers</p>
              <br />
              <button className="launch_app">
                <b>Follow Us</b>
              </button>
            </div>
            <br />
          </div>

          <div className="row-l newsletter">
            <p>Signup to our newsletter</p>
            <input type="email" placeholder="Enter Email Address" />
          </div>
        </div>

        <div className="column-f">
          <div className="row">
            <div className="column-f-r">
              <h1>Explore</h1>
              <ul>
                <li>All Collections</li>
                <li>Launchpad</li>
                <li>Statistics</li>
                <li>Help Center</li>
              </ul>
            </div>
            <div className="column-f-r">
              <h1>Dashboard</h1>
              <ul>
                <li>Home</li>
                <li>My NFTs</li>
                <li>Favourites</li>
                <li>Dashboard</li>
              </ul>
            </div>

            <div className="column-f-r">
              <h1>Partners</h1>
              <ul>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>

          <div className="row-bottom">
            <img src={logo} alt="logo" width="150px" />
            <br />
            <p>
              Minting of tweets, social media posts and creating NFTs out of
              personal digital creations. Chat on chain with buyers/sellers,
              deploy a template of social NFT with our launchpad or just
              explore.
            </p>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
