import React from "react";
import Blur from "../../images/blur-background.svg";
import TiktokImage from "../../images/tiktok.svg";

const Tiktok = () => {
  return (
    <div>
      <div className="tiktok-heading">
        <br />
        <h1>Trending on Tiktok</h1>
        <div className="tiktok-box">
          <div className="tbH">
            <p>24H</p>
          </div>
          <div className="tbD">
            <p>7D</p>
          </div>
        </div>
      </div>

      <div className="row-dt">
        <br />
        <div className="column-dt parent">
          <img className="blur" src={Blur} alt="" />
          <div className="top">
            <img className="image" src={TiktokImage} alt="" />
            <button className="launch_app z-index">
              <b>Mint</b>
            </button>
          </div>
        </div>

        <div className="column-dt parent">
          <img className="blur" src={Blur} alt="" />
          <div className="top">
            <img className="image" src={TiktokImage} alt="" />
            <button className="launch_app z-index">
              <b>Mint</b>
            </button>
          </div>
        </div>
      </div>
      <div className="row-dt">
        <br />
        <div className="column-dt parent">
          <img className="blur" src={Blur} alt="" />
          <div className="top">
            <img className="image" src={TiktokImage} alt="" />
            <button className="launch_app z-index">
              <b>Mint</b>
            </button>
          </div>
        </div>

        <div className="column-dt parent">
          <img className="blur" src={Blur} alt="" />
          <div className="top">
            <img className="image" src={TiktokImage} alt="" />
            <button className="launch_app z-index">
              <b>Mint</b>
            </button>
          </div>
        </div>
      </div>
      <div className="row-dt">
        <br />
        <div className="column-dt parent">
          <img className="blur" src={Blur} alt="" />
          <div className="top">
            <img className="image" src={TiktokImage} alt="" />
            <button className="launch_app z-index">
              <b>Mint</b>
            </button>
          </div>
        </div>

        <div className="column-dt parent">
          <img className="blur" src={Blur} alt="" />
          <div className="top">
            <img className="image" src={TiktokImage} alt="" />
            <button className="launch_app z-index">
              <b>Mint</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiktok;
