import { memo } from "react";
import { Link } from "react-router-dom";
import mailIcon from "../../assets/fixed/icons/mail.webp";
import phoneIcon from "../../assets/fixed/icons/call.webp";
// import linkedinIcon from "../../assets/fixed/icons/linkedin.webp"; // Not used in the provided JSX
import facebookIcon from "../../assets/fixed/icons/facebook.webp";
import instagramIcon from "../../assets/fixed/icons/instagram.webp";
import ablehearts from "../../assets/fixed/icons/whiteablehearts.webp";
import locationlogo from "../../assets/fixed/icons/pin.webp";
import whatsapplogo from "../../assets/fixed/icons/whatsapp.webp";
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-wrapper">
            <div className="footer-column footer-logo-column">
              <ul className="ablehearts-logo-list">
                <li>
                  <Link to="/">
                    <img src={ablehearts} alt="AbleHearts Foundation Logo" className="ablehearts-footer-logo" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">AbleHearts Foundation</h4>
              <ul className="footer-links">
                <li className="offices-item">
                  <Link to="/programs-and-initiatives">
                    <span>Programs & Initiatives</span>
                  </Link>
                </li>
                <li className="offices-item">
                  <Link to="/get-involved">
                    <span>Get Involved</span>
                  </Link>
                </li>
                <li className="offices-item">
                  <Link to="/shop">
                    <span>Shop</span>
                  </Link>
                </li>
                <li className="offices-item">
                  <Link to="/about-us">
                    <span>About Us</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Contact Us</h4>
              <ul className="contact-info footer-links">
                <li className="contact-item">
                  <img src={mailIcon} alt="Mail Icon" className="icon" />
                  <span>ableheartsfoundation@gmail.com</span>
                </li>
                <li className="contact-item">
                  <img src={phoneIcon} alt="Phone Icon" className="icon" />
                  <span>+267 71 422 300</span>
                </li>
                <li className="contact-item">
                  <img src={locationlogo} alt="Location Pin Icon" className="icon" />
                  <span>Botswana</span>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Follow us</h4>
              <ul className="social-icons">
                <li>
                  <a
                    href="https://web.facebook.com/ableheartsfoundation/?_rdc=1&_rdr#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="AbleHearts on Facebook"
                  >
                    <img src={facebookIcon} alt="Facebook logo" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/ableheartsfoundation/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="AbleHearts on Instagram"
                  >
                    <img src={instagramIcon} alt="Instagram logo" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/26771422300"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="AbleHearts on WhatsApp"
                  >
                    <img src={whatsapplogo} alt="Whatsapp logo" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-quote">
            <p>“We are all equal in the fact that we are all different”</p>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} AbleHearts Foundation. All Rights Reserved | {" "}
              <Link to="/terms-of-use">Terms of Use</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);