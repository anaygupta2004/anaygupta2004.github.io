import React from "react";
import "../Footer/Footer.css";
import { FaGithub, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'


function WebMinerFooter() {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <h6>About</h6>
                        <p>CryptoChange is a radical decentralized crypto-based fundraising model built to support organizations promoting
                        equality and social justice.</p>
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <h6>Miners</h6>
                        <ul className="footer-links">
                            <li><a href={"/webMiner"}>Web Miner</a></li>
                            <li><a href={"/download"}>Desktop Miner</a></li>
                        </ul>
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <h6>Quick Links</h6>
                        <ul className="footer-links">
                            <li><a href={"/"}>Home</a></li>
                        </ul>
                    </div>
                </div>
                <hr />
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-sm-6 col-xs-12">
          <p>Built with ❤</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default WebMinerFooter;