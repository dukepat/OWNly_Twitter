import React from "react";
import Profile from "../../images/profile.svg";

const Tweets = () => {
  return (
    <div className="tweet">
      <div className="tweet-c" style={{ textAlign: "center" }}>
        <h1>Tweets of The Week</h1>
        <div className="tweet-spacing">
          <input
            className="input-text"
            type="text"
            placeholder="Search Tweets"
          />
          <button className="link-tweet launch_app">
            <b>Link Twitter</b>
          </button>
        </div>
      </div>

      <div className="row-d2">
        <br />
        <div className="column-d2">
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
      <div className="row-d2">
        <br />
        <div className="column-d2">
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
      <div className="row-d2">
        <br />
        <div className="column-d2">
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
    </div>
  );
};

export default Tweets;
