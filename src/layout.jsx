import React from "react";
import { SideBar } from "./components/SideBar";

export const Layout = ({ children }) => {
  return (
    <>
      <SideBar />
      {children}
    </>
  );
};
