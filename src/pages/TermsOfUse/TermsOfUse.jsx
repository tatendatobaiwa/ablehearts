import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TermsOfUse.css';
import Footer from '../../components/Footer/Footer';
import { useFadeInAnimation, usePageFadeIn } from '../../hooks/useFadeInAnimation';

const blobImages = [
  '/src/assets/fixed/icons/blob1.webp',
  '/src/assets/fixed/icons/blob3.webp',
  '/src/assets/fixed/icons/blob4.webp',
  '/src/assets/fixed/icons/blob2.webp',
];

const TermsOfUse = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Terms of Use | AbleHearts Foundation';
  }, []);

  usePageFadeIn();
  useFadeInAnimation('.terms-page-wrapper');

  return (
    <div className="terms-page-wrapper page-fade-in">
      <div className="terms-background-blobs">
        {blobImages.map((blob, index) => (
          <img
            key={index}
            src={blob}
            alt={`Decorative blob ${index + 1}`}
            className={`terms-blobg blob-${index + 1}`}
            loading="lazy"
            width="600" /* Adjusted width for better fit */
            height="auto" /* Maintain aspect ratio */
          />
        ))}
      </div>
      <div className="terms-of-use-container">
        <header className="terms-of-use-header pre-animate">
          <h1 className="terms-of-use-title">Terms of Use</h1>
          <p className="terms-of-use-intro">Last Updated: October 26, 2023</p>
        </header>

        <section className="terms-of-use-section pre-animate">
          <h2 className="terms-of-use-section-title">1. Acceptance of Terms</h2>
          <p className="terms-of-use-text">
            Welcome to Able Hearts Foundation ("we," "us," or "our"). By accessing or using our website, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not use our website.
          </p>
        </section>

        <section className="terms-of-use-section pre-animate">
          <h2 className="terms-of-use-section-title">2. Use of Website Content</h2>
          <p className="terms-of-use-text">
            All content on this website, including text, graphics, logos, images, and software, is the property of Able Hearts Foundation or its content suppliers and is protected by international copyright laws. You may use the content for personal, non-commercial purposes only.
          </p>
        </section>

        <section className="terms-of-use-section pre-animate">
          <h2 className="terms-of-use-section-title">3. User Conduct</h2>
          <p className="terms-of-use-text">You agree not to use the website for any unlawful purpose or in any way that could damage, disable, or impair the website. Prohibited activities include, but are not limited to:</p>
          <ul className="terms-of-use-list">
            <li className="terms-of-use-item">Harassing or harming another person.</li>
            <li className="terms-of-use-item">Uploading or transmitting viruses or other malicious code.</li>
            <li className="terms-of-use-item">Attempting to gain unauthorized access to our computer systems.</li>
          </ul>
        </section>

        <section className="terms-of-use-section pre-animate">
          <h2 className="terms-of-use-section-title">4. Disclaimers and Limitation of Liability</h2>
          <p className="terms-of-use-text">
            The information on our website is provided "as is" without any warranties, express or implied. We do not guarantee the accuracy, completeness, or usefulness of any information. To the fullest extent permitted by law, Able Hearts Foundation disclaims all liability for any damages arising out of your use of, or inability to use, the website.
          </p>
        </section>

        <section className="terms-of-use-section pre-animate">
          <h2 className="terms-of-use-section-title">5. Links to Third-Party Websites</h2>
          <p className="terms-of-use-text">
            Our website may contain links to third-party websites. These links are provided for your convenience only. We do not endorse or assume any responsibility for the content or practices of these third-party sites.
          </p>
        </section>

        <section className="terms-of-use-section pre-animate">
          <h2 className="terms-of-use-section-title">6. Privacy Policy</h2>
          <p className="terms-of-use-text">
            Your privacy is important to us. Our <Link to="/privacy-policy" className="terms-of-use-link">Privacy Policy</Link> explains how we collect, use, and protect your personal information. Please review it to understand our practices.
          </p>
        </section>

        <section className="terms-of-use-section pre-animate">
          <h2 className="terms-of-use-section-title">7. Changes to These Terms</h2>
          <p className="terms-of-use-text">
            We reserve the right to modify these Terms of Use at any time. We will notify you of any changes by posting the new terms on this page and updating the "Last Updated" date. Your continued use of the website after any such changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section className="terms-of-use-section pre-animate">
          <h2 className="terms-of-use-section-title">8. Contact Information</h2>
          <p className="terms-of-use-contact">
            If you have any questions about these Terms of Use, please contact us at:
            <a href="mailto:ableheartsfoundation@gmail.com" className="terms-of-use-email"> ableheartsfoundation@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  )
};

export default TermsOfUse;
