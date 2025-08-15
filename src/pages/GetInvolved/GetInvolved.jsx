import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import scribble from '/src/assets/fixed/icons/scribblebackground.webp';
import DonationForm from '/src/components/DonationForm.jsx';
import './GetInvolved.css';

const blobImages = [
  '/src/assets/fixed/icons/blob1.webp',
  '/src/assets/fixed/icons/blob3.webp',
  '/src/assets/fixed/icons/blob4.webp',
  '/src/assets/fixed/icons/blob2.webp',
];

const GetInvolved = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = 'Get Involved | AbleHearts Foundation';
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.get-involved-container .pre-animate');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => {
        if (element) {
            observer.unobserve(element);
        }
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div className="page-wrapper get-involved-page-wrapper">
      <div className="get-involved-background-blobs" aria-hidden="true">
        {blobImages.map((blob, index) => (
          <img
            key={`blob-${index}`}
            src={blob}
            alt=""
            className={`get-involved-blobg blob-${index + 1}`}
            loading="lazy"
            width="800"
            height="800"
          />
        ))}
      </div>
      <div className="get-involved-container">
        <header className="get-involved-page-header pre-animate">
          <h1>Get Involved</h1>
          <p>
            Join us in making a difference. Volunteer, donate, or partner with us to create meaningful change.
          </p>
        </header>

        <section className="donation-form-section pre-animate" aria-labelledby="donation-heading">
          {/* Assuming DonationForm has an h2 or similar for "donation-heading" */}
          <DonationForm />
        </section>

        <div className="additional-sections-wrapper">
          <section className="content-container pre-animate" aria-labelledby="ablehearts-ub-heading">
            <div className="left-content card">
              <h2 id="ablehearts-ub-heading">AbleHearts UB</h2>
              <p>
                Our AbleHearts chapter at UB fosters a vibrant community of students working together to make a difference
                in the lives of people with disabilities. Get involved to create a more inclusive world.
              </p>
              <button
                className="find-out-more-button"
                onClick={() => navigate('/ablehearts-ub')}
              >
                Become a Member
              </button>
            </div>
            <div className="right-content">
              <img
                src="/src/assets/fixed/ubvolunteers.webp"
                alt="AbleHearts University of Botswana student volunteers group photo."
                className="placeholder-image"
                loading="lazy"
                width="500"
                height="300"
              />
            </div>
          </section>

          <section className="content-container pre-animate" aria-labelledby="ablehearts-biust-heading">
            <div className="left-content card">
              <h2 id="ablehearts-biust-heading">AbleHearts BIUST</h2>
              <p>
                At BIUST, our AbleHearts chapter champions inclusion and innovation to support individuals with
                disabilities. Join us in transforming campus life through collaboration and compassion.
              </p>
              <button
                className="find-out-more-button"
                onClick={() => navigate('/ablehearts-biust')}
              >
                Become a Member
              </button>
            </div>
            <div className="right-content">
              <img
                src="/src/assets/fixed/chesirefoundation/chescover.webp"
                alt="AbleHearts BIUST student volunteers."
                className="placeholder-image"
                loading="lazy"
                width="500"
                height="300"
              />
            </div>
          </section>

          <section className="content-container1 pre-animate" aria-labelledby="partnerships-heading" style={{ backgroundColor: '#0066cc', marginBottom: '0' }}>
            <div className="contour-overlay" aria-hidden="true">
              <img src={scribble} alt=""
                loading="lazy" width="1000"
                height="1280"
              />
            </div>
            <div className="partnership-left-content">
              <h2 id="partnerships-heading" style={{ color: 'white' }}>Partnerships</h2>
              <p style={{ color: 'white' }}>
                Partner with us to amplify our efforts. Together, we can create impactful initiatives that empower
                individuals with disabilities and drive community change.
              </p>
              <button
                className="email-button"
                onClick={() =>
                  (window.location.href = 'mailto:ableheartsfoundation@gmail.com?subject=Partnership Inquiry')
                }
              >
                Send Us an Email
              </button>
            </div>
            <div className="right-content partnership-image-container" style={{ padding: '0' }}>
              <img
                src="/src/assets/fixed/partner.webp"
                alt="Hands shaking, symbolizing partnership."
                className="placeholder-image"
                style={{ borderRadius: '0' }}
                loading="lazy"
                width="500"
                height="300"
              />
            </div>
          </section>
        </div>
        {isScrolled && (
          <button type="button" className="scroll-to-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
            ↑
          </button>
        )}
      </div>
    </div>
  );
};

export default GetInvolved;