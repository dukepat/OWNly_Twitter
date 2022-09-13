import React from "react";
import { SiDiscord } from "react-icons/si";
import { BsTwitter } from "react-icons/bs";
import logo from "../../images/logo.png";

const Navbar = () => {
  return (
    <nav>
      <div className="navbar">
        <img src={logo} alt="logo" width="150px" className="nav-logo" />
        <div className="navbar-social">
          <p>Join our</p>
          <div className="icon-1">
            <BsTwitter />
          </div>
          <div className="icon-2">
            <SiDiscord />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
