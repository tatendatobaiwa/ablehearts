/**
 * Animated CountUp Number Component
 * Displays numbers with smooth counting animation when they come into view
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { useCountUpOnView } from '../hooks/useCountUp';
import './CountUpNumber.css';

/**
 * CountUp Number Component with animation
 * @param {Object} props - Component props
 * @param {number} props.end - Target number to count to
 * @param {number} props.duration - Animation duration in milliseconds
 * @param {string} props.prefix - Text before the number (e.g., "$")
 * @param {string} props.suffix - Text after the number (e.g., "+", "K", "M")
 * @param {string} props.label - Label text below the number
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.formatter - Custom number formatting function
 * @param {boolean} props.useCommas - Whether to add comma separators
 */
const CountUpNumber = memo(({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  label = '',
  className = '',
  formatter = null,
  useCommas = true
}) => {
  const [ref, count] = useCountUpOnView(end, duration);

  // Format the number
  const formatNumber = (num) => {
    if (formatter) {
      return formatter(num);
    }
    
    if (useCommas) {
      return num.toLocaleString();
    }
    
    return num.toString();
  };

  return (
    <div 
      ref={ref} 
      className={`count-up-container ${className}`}
      role="img"
      aria-label={`${prefix}${formatNumber(end)}${suffix} ${label}`}
    >
      <div className="count-up-number">
        <span className="count-up-prefix">{prefix}</span>
        <span className="count-up-value" aria-hidden="true">
          {formatNumber(count)}
        </span>
        <span className="count-up-suffix">{suffix}</span>
      </div>
      {label && (
        <div className="count-up-label">
          {label}
        </div>
      )}
    </div>
  );
});

CountUpNumber.displayName = 'CountUpNumber';

CountUpNumber.propTypes = {
  end: PropTypes.number.isRequired,
  duration: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  formatter: PropTypes.func,
  useCommas: PropTypes.bool,
};

export default CountUpNumber;