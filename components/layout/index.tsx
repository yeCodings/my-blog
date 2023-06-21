import Footer from "components/Footer";
import Navbar from "components/Navbar";
// import type { NextPage } from "next";
import React, { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout;