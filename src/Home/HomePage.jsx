import React from "react";
import SetTitle from "../SetTitle.jsx";
import Nav from "../Nav.jsx";
import BigHeading from "./BigHeading";
import Typer from "./Typer";
import Footer from "../Footer/Footer.jsx";

function HomePage() {
    document.body.style.backgroundColor = "#EEEEEE";
    return (
        <>
        
            <SetTitle title="CryptoChange | Decentralized Activism" />
            <Nav activePage="home" />
            <BigHeading />
            <Typer />
            <Footer />
        </>
    )
}

export default HomePage