import { useEffect, useState } from 'react';
import './PrivacyPolicy.css';
// import Footer from '../../components/Footer/Footer';

// Direct Blob Imports
import blob1 from '../../assets/fixed/icons/blob1.webp'; // Ensure these paths are correct
import blob2 from '../../assets/fixed/icons/blob2.webp';
import blob3 from '../../assets/fixed/icons/blob3.webp';
import blob4 from '../../assets/fixed/icons/blob4.webp';

const blobImageImports = [blob1, blob2, blob3, blob4];

const PrivacyPolicy = () => {
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    document.title = 'Privacy Policy | AbleHearts Foundation';
    setIsContentLoaded(true);
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);

  return (
    // The main page wrapper, could have a generic class like 'static-page-wrapper'
    <div className={`privacy-page-wrapper ${isContentLoaded ? 'content-loaded' : ''}`}>
      {/* Background blobs, aria-hidden as they are decorative */}
      <div className="privacy-background-blobs" aria-hidden="true">
        {blobImageImports.map((blobSrc, index) => (
          <img
            key={index}
            src={blobSrc} // Use the imported variable
            alt="" // Decorative images have empty alt
            className={`privacy-blobg blob-${index + 1}`}
            loading="lazy"
            width="600"
            height="600" // Or use CSS for aspect ratio if preferred for blobs
            aria-hidden="true"
          />
        ))}
      </div>

      {/* This is the main content card that gets the white background and shadow */}
      <div className={`privacy-content-container ${isContentLoaded ? 'fade-in-animate' : 'pre-animate'}`}>
        <header className="privacy-header">
          <h1 className="privacy-main-title">Privacy Policy</h1>
          <p className="privacy-intro">Last Updated: October 26, 2023</p>
        </header>

        <section className="privacy-section">
          <h2 className="privacy-section-title">1. Introduction</h2>
          <p className="privacy-text">
            Able Hearts Foundation (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy of our volunteers and website users. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you apply to our campus clubs at BIUST and UB or otherwise interact with our website.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">2. Information We Collect</h2>
          <p className="privacy-text">
            When you apply to become a volunteer, we collect personal information that you voluntarily provide to us. This may include:
          </p>
          <ul className="privacy-list">
            <li className="privacy-list-item">Your full name and contact information (email address, phone number).</li>
            <li className="privacy-list-item">Your university affiliation (BIUST or UB) and student ID number.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">3. How We Use Your Information</h2>
          <p className="privacy-text">Your information is used exclusively for internal purposes related to managing our volunteer programs. These purposes include:</p>
          <ul className="privacy-list">
            <li className="privacy-list-item">Processing your volunteer application.</li>
            <li className="privacy-list-item">Coordinating campus club activities and events.</li>
            <li className="privacy-list-item">Communicating with you about volunteer opportunities, program updates, and other relevant news.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">4. Data Protection and Security</h2>
          <p className="privacy-text">
            We implement a variety of security measures to maintain the safety of your personal information. Your data is stored in a secure database, and access is restricted to authorized personnel who need the information to perform their duties. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">5. Your Data Rights</h2>
          <p className="privacy-text">As a user, you have certain rights regarding your personal information:</p>
          <ul className="privacy-list">
            <li className="privacy-list-item"><strong>Right to Access:</strong> You can request a copy of the personal information we hold about you.</li>
            <li className="privacy-list-item"><strong>Right to Correction:</strong> You can request that we correct any inaccurate or incomplete information.</li>
            <li className="privacy-list-item"><strong>Right to Deletion:</strong> You can request that we delete your personal information from our records, particularly if you are no longer a volunteer.</li>
          </ul>
          <p className="privacy-text">To exercise these rights, please contact us using the information below.</p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">6. Changes to This Privacy Policy</h2>
          <p className="privacy-text">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section-title">7. Contact Information</h2>
          <p className="privacy-contact-text"> {/* Specific class for contact text */}
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
            <a href="mailto:ableheartsfoundation@gmail.com" className="privacy-link email-link"> ableheartsfoundation@gmail.com</a>
          </p>
        </section>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default PrivacyPolicy;