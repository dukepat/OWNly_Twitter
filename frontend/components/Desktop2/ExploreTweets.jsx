import React from "react";
import Profile from "../../images/profile.svg";

function ExploreTweets(props) {
  return (
    <div>
      <div className="row-d">
        <br />
        <h1 className="coming">Explore Tweets</h1>
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
}

export default ExploreTweets;
