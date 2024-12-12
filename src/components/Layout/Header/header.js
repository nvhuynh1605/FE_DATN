import React from "react";
import { Link } from "react-router-dom";
import { ICLogo } from "../../../assets/icons/ICLogo";
import Search from "./Search/search";
import User from "./User/user";

function Header() {
  return (
    <div className="flex justify-center items-center h-[60px] w-full bg-gradient-to-b from-[#003FA4] to-[#002868] fixed z-30">
      <div className="flex justify-between items-center w-[1240px] mx-20">
        <Link to="/" className="flex flex-row">
          <ICLogo />
        </Link>
        <Search />
        <User />
      </div>
    </div>
  );
}

export default Header;
