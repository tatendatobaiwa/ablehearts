import React, { useState, useEffect } from 'react';
import { useFadeInAnimation, usePageFadeIn } from '../../hooks/useFadeInAnimation';
import { useNavigate } from 'react-router-dom';
import './UBApp.css';
import countryCodes from '/src/data/countryCodes.json';
import Footer from '../../components/Footer/Footer';

const blobImages = [
  '/src/assets/fixed/icons/blob1.webp',
  '/src/assets/fixed/icons/blob3.webp',
  '/src/assets/fixed/icons/blob4.webp',
  '/src/assets/fixed/icons/blob2.webp',
];

const UBApp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', reason: '', message: '', countryCode: '+267' });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = 'AbleHearts UB | AbleHearts Foundation';
  }, []);

  usePageFadeIn();
  useFadeInAnimation('.page-wrapper');

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone || !/^\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!formData.reason) newErrors.reason = 'Reason is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setStatus('submitting');
      const submissionData = {
        ...formData,
        phone: `${formData.countryCode}${formData.phone}`,
      };
      try {
        const response = await fetch('https://formspree.io/f/myzzqyqg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });
        if (response.ok) {
          setStatus('success');
          setShowSuccess(true);
          setFormData({
            name: '',
            email: '',
            phone: '',
            reason: '',
            message: '',
            countryCode: '+267',
          });
        } else {
          setStatus('error');
          alert('Failed to send form. Please try again.');
        }
      } catch (err) {
        setStatus('error');
        alert('Failed to send form. Please try again.');
      }
    }
  };

  return (
  <div className="page-wrapper page-fade-in">
    <div className="ub-app-page-background">
      <div className="ub-background-blobs">
        {blobImages.map((blob, index) => (
          <img
            key={index}
            src={blob}
            alt={`Decorative blob ${index + 1}`}
            className={`ub-blobg blob-${index + 1}`}
          />
        ))}
      </div>
      <div className="ub-app-container">
        <div className="ub-app-logo-container pre-animate">
          <img src="/src/assets/fixed/icons/ub.webp" alt="UB Logo" className="ub-app-logo" 
          width="90"
          height="90"
          />
        </div>

        <h1 className="ub-app-title pre-animate">UB Branch Application</h1>
        <p className="ub-app-description pre-animate">
          Join the AbleHearts community at UB! Fill out the form below to apply for membership and start making a difference.
        </p>
        <form 
          className="ub-app-application-form pre-animate" 
          method="POST" 
          onSubmit={handleSubmit}
        >
          <fieldset className="ub-app-fieldset">
            <legend className="ub-app-legend">Personal Information</legend>
            <label className="ub-app-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              className="ub-app-input"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="ub-app-error">{errors.name}</p>}
          </fieldset>

          <fieldset className="ub-app-fieldset">
            <legend className="ub-app-legend">Contact Details</legend>
            <label className="ub-app-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              className="ub-app-input"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="ub-app-error">{errors.email}</p>}

            <label className="ub-app-label" htmlFor="phone">Phone Number</label>
            <div className="ub-app-phone-input-container">
              <select
                id="countryCode"
                value={formData.countryCode}
                className="ub-app-country-code-select"
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
              >
                {countryCodes.map((country) => (
                  <option key={country.name} value={country.code}>
                    {country.code} ({country.name})
                  </option>
                ))}
              </select>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                className="ub-app-input"
                placeholder="Enter phone number"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            {errors.phone && <p className="ub-app-error">{errors.phone}</p>}
          </fieldset>

          <fieldset className="ub-app-fieldset">
            <legend className="ub-app-legend">Your Motivation</legend>
            <label className="ub-app-label" htmlFor="reason">Why do you want to join AbleHearts UB?</label>
            <textarea
              id="reason"
              value={formData.reason}
              className="ub-app-textarea"
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            ></textarea>
            {errors.reason && <p className="ub-app-error">{errors.reason}</p>}

            <label className="ub-app-label" htmlFor="message">Additional Message (Optional)</label>
            <textarea
              id="message"
              value={formData.message}
              className="ub-app-textarea"
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
            {errors.message && <p className="ub-app-error">{errors.message}</p>}
          </fieldset>

          <div className="ub-app-button-group">
            <button 
              type="submit" 
              className="ub-app-submit-button"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              className="ub-app-back-button"
              onClick={() => navigate('/get-involved')}
            >
              Back to Get Involved
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="ub-app-success-overlay">
          <div className="ub-app-success-popup">
            <h3>Thank You!</h3>
            <p>Your application has been submitted successfully. We will be in touch soon!</p>
            <button
              className="ub-app-success-close-button"
              onClick={() => setShowSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default UBApp;