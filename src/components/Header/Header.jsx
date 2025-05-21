import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ableheartslogo from '/src/assets/fixed/icons/ableheartslogo.webp';
import './Header.css';

const Header = () => {
  const [isMenuActive, setMenuActive] = useState(false);
  const [isDropdownActive, setDropdownActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('');
  };

  const toggleMenu = () => {
    setMenuActive(!isMenuActive);
  };

  const toggleDropdown = () => {
    setDropdownActive(!isDropdownActive);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={isScrolled ? 'transparent-header' : ''}>
      <nav>
        <div className="container">
        {/* Scroll event listener */}
      {useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 50) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, [])}
          <div className="nav-content">
            <div>
              <button
                onClick={handleLogoClick}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <img src={ableheartslogo} alt="ScheduleMaster Logo" className="logo" />
              </button>
            </div>
            <button
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <ul className={`nav-links ${isMenuActive ? 'active' : ''}`}>
              <li className={`nav-item ${isMenuActive ? 'visible' : ''}`}>
                <a href="/" className={isActive('/') ? 'active' : ''}>
                  <span>Home</span>
                </a>
              </li>
              <li className={`nav-item ${isMenuActive ? 'visible' : ''}`}>
                <a href="/programs-and-initiatives" className={isActive('/programs-and-initiatives') ? 'active' : ''}>
                  <span>Programs & Initiatives</span>
                </a>
              </li>
              <li
                className={`nav-item dropdown ${isDropdownActive ? 'active' : ''}`}
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown}
              >
                <a href="/get-involved" className={isActive('/get-involved') ? 'active' : ''}>
                  <span>Get Involved</span>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="/ablehearts-ub">AbleHearts UB</a>
                  </li>
                  <li>
                    <a href="/ablehearts-biust">AbleHearts BIUST</a>
                  </li>
                  <li>
                    <a href="/get-involved">Partner with Us</a>
                  </li>
                </ul>
              </li>
              <li className={`nav-item ${isMenuActive ? 'visible' : ''}`}>
                <a href="/gallery" className={isActive('/gallery') ? 'active' : ''}>
                  <span>Gallery</span>
                </a>
              </li>
              <li className={`nav-item ${isMenuActive ? 'visible' : ''}`}>
                <a href="/shop" className={isActive('/shop') ? 'active' : ''}>
                  <span>Shop</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
