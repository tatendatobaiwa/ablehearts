import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { safeMap, isValidArray } from '../../utils/safeArrayOperations';
import { safeDocument } from '../../utils/safeDOMAccess';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose, navigationItems }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

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
          <h2 className="mobile-menu-title">Menu</h2>
          <button
            className="mobile-menu-close"
            onClick={onClose}
            aria-label="Close mobile menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mobile-menu-content">
          {safeMap(navigationItems, (item) => (
            <div key={item.id} className="mobile-menu-item">
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
                    {expandedItems[item.id] ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
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
                  to={item.path}
                  className={`mobile-menu-link ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mobile-menu-footer">
          <div className="mobile-menu-contact">
            <p>Contact Us</p>
            <a href="mailto:ableheartsfoundation@gmail.com">
              ableheartsfoundation@gmail.com
            </a>
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