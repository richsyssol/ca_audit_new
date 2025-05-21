import React from "react";
import { NavLink } from "react-router-dom";
import { logo } from "../../../assets/index";

function Logo() {
  return (
    <NavLink to={"/"} className="mx-6 w-[96px] h-[26px] shrink-0">
      <img
        src={logo}
        alt="Logo"
        className="flex justify-center  items-center scale-125 h-full object-center"
      />
    </NavLink>
  );
}

export default Logo;
