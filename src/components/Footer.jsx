import React from "react";
import "./Footer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../assets/logo.png"; // <-- Assurez-vous que le chemin est correct

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container-fluid px-5">
        <div className="footer-top">
          {/* Left Section - Logo & Description */}
          <div className="footer-left">
            <p className="footer-text">
              Our vision is to provide convenience and help increase your sales business.
            </p>
            {/* Social Icons */}
            <div className="social-icons">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer-links-container">
            <div className="footer-section">
              <h5>About</h5>
              <ul className="footer-links">
                <li><a href="#">How it works</a></li>
                <li><a href="#">Featured</a></li>
                <li><a href="#">Partnership</a></li>
                <li><a href="#">Business Relation</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h5>Community</h5>
              <ul className="footer-links">
                <li><a href="#">Events</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Podcast</a></li>
                <li><a href="#">Invite a friend</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h5>Socials</h5>
              <ul className="footer-links">
                <li><a href="#">Discord</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>©2022 Company Name. All rights reserved</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-policy">Privacy & Policy</a>
            <span>|</span>
            <a href="#" className="footer-policy">Terms & Condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
