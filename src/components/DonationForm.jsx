import { useState, useEffect, useRef } from 'react';

import './DonationForm.css';

const DonationForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [donationType, setDonationType] = useState('monetary'); // 'monetary' or 'non-monetary'
  
  // State for form fields and validation errors
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    paymentMethod: '',
    itemDescription: '',
    estimatedValue: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const formRef = useRef(null);

  // Effect to handle scrolling when submission state changes
  useEffect(() => {
    if (submitted && formRef.current) {
      const formTop = formRef.current.offsetTop;
      window.scrollTo({
        top: formTop - 20, // Slight offset for visual comfort
        behavior: 'smooth'
      });
    }
  }, [submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    setFormErrors(prev => ({ ...prev, [name]: null })); 
  };

  const validateForm = () => {
    const errors = {};
    // Basic validation for name and email
    if (!formData.name.trim()) {
      errors.name = 'Full Name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      errors.email = 'Invalid email format.';
    }

    if (donationType === 'monetary') {
      if (!formData.amount) {
        errors.amount = 'Donation Amount is required.';
      } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        errors.amount = 'Please enter a valid positive number for amount.';
      }
      if (!formData.paymentMethod) {
        errors.paymentMethod = 'Preferred Payment Method is required.';
      }
    } else { // non-monetary
      if (!formData.itemDescription.trim()) {
        errors.itemDescription = 'Item/Service Description is required.';
      }
      if (formData.estimatedValue && (isNaN(formData.estimatedValue) || parseFloat(formData.estimatedValue) < 0)) {
        errors.estimatedValue = 'Please enter a valid non-negative number for estimated value.';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError('Please correct the errors in the form.');
      return;
    }

    setIsLoading(true);
    const form = e.target; // Still use e.target for Formspree submission
    const data = new FormData(form);
    
    // Append form data from state for dynamic fields
    Object.keys(formData).forEach(key => {
      if (!data.has(key)) { // Only append if not already in FormData (e.g., from radio buttons)
        data.set(key, formData[key]);
      }
    });

    data.set('donationType', donationType); // Ensure donationType is set correctly

    try {
      const response = await fetch('https://formspree.io/f/xvggjvgv', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const result = await response.json();
        throw new Error(result.errors ? result.errors.map(err => err.message).join(', ') : 'Form submission failed');
      }
    } catch (err) {
      setError('There was a problem submitting your donation request: ' + err.message);
      if (import.meta.env.DEV) {
        console.error('Submission error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError(null); // Clear errors on reset
    setDonationType('monetary'); // Reset donation type
    setFormData({
      name: '',
      email: '',
      amount: '',
      paymentMethod: '',
      itemDescription: '',
      estimatedValue: '',
    });
    setFormErrors({}); // Clear validation errors on reset
    if (formRef.current) {
      formRef.current.reset(); // Reset the form fields - might be redundant with formData reset
      const formTop = formRef.current.offsetTop;
      window.scrollTo({
        top: formTop - 20,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="donation-form-card" ref={formRef}>
      {submitted ? (
        <div className="form-success">
          <div className="form-header">
            <h2 className="form-title">Thank You for Your {donationType === 'monetary' ? 'Monetary' : 'Non-Monetary'} Donation!</h2>
            <p className="form-subtitle">We&apos;ll be in touch soon with details.</p>
            <button 
              onClick={handleReset} 
              className="submit-button"
              style={{ marginTop: '1rem' }}
            >
              Submit Another Donation
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="form-header">
            <h2 className="form-title">Make a Donation</h2>
            <p className="form-subtitle">Support our mission to create positive change</p>
          </div>
          <div className="form-content">
            <form 
              onSubmit={handleSubmit}
              className="donation-form"
            >
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-field">
                <label htmlFor="donationType" className="form-label">Donation Type</label>
                <div className="radio-group">
                  <label>
                    <input 
                      type="radio"
                      name="donationType"
                      value="monetary"
                      checked={donationType === 'monetary'}
                      onChange={(e) => { setDonationType(e.target.value); handleChange(e); }}
                      disabled={isLoading}
                    />
                    Monetary
                  </label>
                  <label>
                    <input 
                      type="radio"
                      name="donationType"
                      value="non-monetary"
                      checked={donationType === 'non-monetary'}
                      onChange={(e) => { setDonationType(e.target.value); handleChange(e); }}
                      disabled={isLoading}
                    />
                    Non-Monetary
                  </label>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isLoading}
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>
              
              <div className="form-field">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isLoading}
                />
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>
              
              {donationType === 'monetary' ? (
                <>
                  <div className="form-field">
                    <label htmlFor="amount" className="form-label">Donation Amount (BWP)</label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      value={formData.amount}
                      onChange={handleChange}
                      className="form-input"
                      disabled={isLoading}
                    />
                    {formErrors.amount && <div className="error-message">{formErrors.amount}</div>}
                  </div>
                  
                  <div className="form-field">
                    <label htmlFor="paymentMethod" className="form-label">Preferred Payment Method</label>
                    <select 
                      id="paymentMethod"
                      name="paymentMethod" 
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="form-select"
                      disabled={isLoading}
                    >
                      <option value="">Select payment method</option>
                      <option value="bank-transfer">Bank Transfer</option>
                      <option value="mobile-money">Mobile Money</option>
                      <option value="cash">Cash</option>
                    </select>
                    {formErrors.paymentMethod && <div className="error-message">{formErrors.paymentMethod}</div>}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-field">
                    <label htmlFor="itemDescription" className="form-label">Item/Service Description</label>
                    <textarea
                      id="itemDescription"
                      name="itemDescription"
                      value={formData.itemDescription}
                      onChange={handleChange}
                      className="donation-textarea"
                      disabled={isLoading}
                    />
                    {formErrors.itemDescription && <div className="error-message">{formErrors.itemDescription}</div>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="estimatedValue" className="form-label">Estimated Value (BWP, Optional)</label>
                    <input
                      id="estimatedValue"
                      name="estimatedValue"
                      type="number"
                      min="0"
                      value={formData.estimatedValue}
                      onChange={handleChange}
                      className="form-input"
                      disabled={isLoading}
                    />
                    {formErrors.estimatedValue && <div className="error-message">{formErrors.estimatedValue}</div>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="pickupMethod" className="form-label">Pickup/Delivery Method (Optional)</label>
                    <input
                      id="pickupMethod"
                      name="pickupMethod"
                      value={formData.pickupMethod}
                      onChange={handleChange}
                      className="form-input"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="availability" className="form-label">Availability/Preferred Time (Optional)</label>
                    <textarea
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="donation-textarea"
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading || Object.keys(formErrors).some(key => formErrors[key])}
              >
                {isLoading ? 'Submitting...' : 'Submit Donation'}
              </button>
              
              <p className="form-note">
                Your donation is important to us. Thank you for your support!
              </p>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default DonationForm;