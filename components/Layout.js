import Footer from "./Footer";
import HeaderComponent from "./Header";
import MDBNavbar from "./MDBNavbar";
import { AppShell } from "@mantine/core";
import { Navbar } from "@mantine/core";
import { Text } from "@mantine/core";
import { useState } from "react";

const Layout = ({ children }) => {
    return (
        <div className="container-fluid">
            <HeaderComponent />
            <div className="content" style={{ height: 'calc(100% - 60px - 35px)', width: '100%', display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout;