import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { safeMap, isValidArray } from '../../utils/safeArrayOperations';
import { safeDocument } from '../../utils/safeDOMAccess';
import facebookIcon from "../../assets/fixed/icons/facebook.webp";
import instagramIcon from "../../assets/fixed/icons/instagram.webp";
import whatsapplogo from "../../assets/fixed/icons/whatsapp.webp";
import logo from "../../assets/fixed/icons/whiteablehearts.webp";
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose, navigationItems }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();
  const initialPathRef = useRef(location.pathname);
  const hasOpenedRef = useRef(false);

  // Close menu when route changes (but not on initial mount)
  useEffect(() => {
    // Only close if the menu has been opened and the path has changed
    if (hasOpenedRef.current && location.pathname !== initialPathRef.current) {
      onClose();
    }
  }, [location.pathname, onClose]);

  // Track when menu opens and set initial path
  useEffect(() => {
    if (isOpen && !hasOpenedRef.current) {
      hasOpenedRef.current = true;
      initialPathRef.current = location.pathname;
    } else if (!isOpen) {
      hasOpenedRef.current = false;
    }
  }, [isOpen, location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    const body = safeDocument.getBody();
    if (!body) return;

    if (isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }

    return () => {
      if (body) {
        body.style.overflow = '';
      }
    };
  }, [isOpen]);

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <nav
        className="mobile-menu"
        onClick={(e) => e.stopPropagation()}
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        <div className="mobile-menu-header">
          <button
            className="mobile-menu-close mobile-menu-close-small"
            onClick={onClose}
            aria-label="Close mobile menu"
          >
            <X size={20} />
          </button>
          <img
            src={logo}
            alt="AbleHearts Foundation Logo"
            className="mobile-menu-logo"
            loading="lazy"
          />
        </div>

        <div className="mobile-menu-content">
          {/* Main Menu Section */}
          <div className="menu-section">
            <h3 className="menu-section-title">Menu</h3>
            {safeMap(navigationItems, (item) => (
              <div key={item.id || item.to} className="mobile-menu-item">
                {item.submenu ? (
                  <>
                    <button
                      className={`mobile-menu-button ${expandedItems[item.id] ? 'expanded' : ''}`}
                      onClick={() => toggleExpanded(item.id)}
                      onKeyDown={(e) => handleKeyDown(e, () => toggleExpanded(item.id))}
                      aria-expanded={expandedItems[item.id]}
                      aria-controls={`submenu-${item.id}`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={16}
                        className="chevron-icon"
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={`submenu-${item.id}`}
                      className={`mobile-submenu ${expandedItems[item.id] ? 'expanded' : ''}`}
                    >
                      {safeMap(item.submenu, (subItem) => (
                        <Link
                          key={subItem.id}
                          to={subItem.path}
                          className={`mobile-submenu-link ${
                            location.pathname === subItem.path ? 'active' : ''
                          }`}
                          onClick={onClose}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.to}
                    className={`mobile-menu-link ${
                      location.pathname === item.to ? 'active' : ''
                    }`}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mobile-menu-footer">
          {/* Social Media Section */}
          <div className="social-media-section">
            <h3 className="social-media-title">Social Media</h3>
            <ul className="social-icons">
              <li>
                <a
                  href="https://web.facebook.com/ableheartsfoundation/?_rdc=1&_rdr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AbleHearts on Facebook"
                >
                  <img src={facebookIcon} alt="Facebook" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/ableheartsfoundation/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AbleHearts on Instagram"
                >
                  <img src={instagramIcon} alt="Instagram" />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/26771422300"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AbleHearts on WhatsApp"
                >
                  <img src={whatsapplogo} alt="WhatsApp" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="social-media-section">
            <div className="mobile-menu-contact">
              <p>Contact</p>
              <a href="mailto:ableheartsfoundation@gmail.com">
                ableheartsfoundation@gmail.com
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  navigationItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string.isRequired,
    path: PropTypes.string,
    submenu: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    }))
  })).isRequired
};

export default MobileMenu;