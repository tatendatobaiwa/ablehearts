import React, { useEffect, useState, useCallback } from 'react';
import { safeMap, safeLength, isValidArray } from '../../utils/safeArrayOperations';
import { safeDocument, safeWindow } from '../../utils/safeDOMAccess';
import './Home.css';
import NewsletterSignup from "../../components/NewsLetterSignup.jsx";
import SimpleSEO from "../../components/SEO/SimpleSEO.jsx";

import landingPageImage from '/src/assets/fixed/landingpageimage.webp';
import whiteLogo from '/src/assets/fixed/icons/whiteablehearts.webp';
import lephoi from '/src/assets/fixed/lephoi/carousel1lephoi.webp';
import kedia from '/src/assets/fixed/kedia/carousel2kedia.webp';
import tsogang from '/src/assets/fixed/tsogangtrust/carousel3tsogang.webp';
import mochudi from '/src/assets/fixed/mochudi/carousel4mochudi.webp';
import blob2 from '/src/assets/fixed/icons/blob2.webp';
import blob3 from '/src/assets/fixed/icons/blob3.webp';
import blob4 from '/src/assets/fixed/icons/blob4.webp';
import newsletterImageFile from '/src/assets/fixed/newspaper/newsletterimage.webp';
import scribble from '/src/assets/fixed/icons/scribblebackground.webp';
import india from '/src/assets/fixed/icons/india.webp';
import minjex from '/src/assets/fixed/icons/minjex.webp';
import nortex from '/src/assets/fixed/icons/nortex.webp';
import trans from '/src/assets/fixed/icons/trans.webp';
import tropicana from '/src/assets/fixed/icons/tropicana.webp';
import sennfoods from '/src/assets/fixed/icons/sennfoods.webp';
import francistownelectronics from '/src/assets/fixed/icons/francistownelectronics.webp';
import valentines from '/src/assets/fixed/icons/valentinessports.webp';
import bush from '/src/assets/fixed/icons/busht.webp';
import strub from '/src/assets/fixed/icons/strub.webp';
import bms from '/src/assets/fixed/icons/bms.webp';
import placeholder from '/src/assets/fixed/placeholder.webp';

const CAROUSEL_INTERVAL = 5000;
const TRANSITION_DURATION = 800;

const collaboratorLogosList = [
  'india', 'minjex', 'nortex', 'trans', 'tropicana', 'sennfoods',
  'francistownelectronics', 'valentines', 'bush', 'strub', 'bms',
];

// Mapping of logo keys to their respective website URLs
const collaboratorLinks = {
  'sennfoods': 'https://sennfoods.com/',
  'strub': 'https://www.strubbotswana.com/',
  'bms': 'https://www.bms.co.bw/',
  'tropicana': 'https://tropicana.co.bw/',
  'trans': 'https://trans.co.bw/',
  'nortex': 'https://www.nortex.co.za/',
  // Other logos without links remain as non-clickable
};

const duplicatedCollaboratorLogos = [...collaboratorLogosList, ...collaboratorLogosList];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const imageMap = React.useMemo(() => ({
    landingPageImage, lephoi, kedia, tsogang, mochudi,
    blob2, blob3, blob4, newsletter: newsletterImageFile, scribble,
    india, minjex, nortex, trans, tropicana, sennfoods,
    francistownelectronics, valentines, bush, strub, bms,
  }), []);

  const slides = React.useMemo(() => [
    { image: 'landingPageImage', logo: whiteLogo, title: 'Dynamic Talent Show', date: 'August 20, 2023' },
    { image: 'lephoi', logo: whiteLogo, title: 'Lephoi Centre for the Visually Impaired', date: 'August 15, 2020' },
    { image: 'kedia', logo: whiteLogo, title: 'Kedia Primary School', date: 'July 6, 2024' },
    { image: 'tsogang', logo: whiteLogo, title: 'Tsogang Trust', date: 'October 27, 2022' },
    { image: 'mochudi', logo: whiteLogo, title: 'Mochudi Resource Center', date: 'April 22, 2021' },
  ], []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Lowered threshold slightly for earlier animation trigger
    );

    document.querySelectorAll('.pre-animate').forEach(element => observer.observe(element));

    Object.values(imageMap).forEach(imgSrc => {
      if (typeof imgSrc === 'string') {
        const img = new Image();
        img.src = imgSrc;
      }
    });

    return () => observer.disconnect();
  }, [imageMap]);

  useEffect(() => {
    if (!isValidArray(slides)) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % safeLength(slides));
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(interval);
  }, [safeLength(slides)]);

  const changeSlide = useCallback((newIndexOrUpdater) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(newIndexOrUpdater);
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  }, [isTransitioning]);

  const handleNextSlide = useCallback(() => {
    changeSlide(prev => (prev + 1) % safeLength(slides));
  }, [changeSlide, slides.length]);

  const handlePrevSlide = useCallback(() => {
    changeSlide(prev => (prev === 0 ? safeLength(slides) - 1 : prev - 1));
  }, [changeSlide, slides.length]);

  const handleIndicatorClick = useCallback((index) => {
    if (index === currentSlide) return;
    changeSlide(index);
  }, [changeSlide, currentSlide]);

  const getImageUrl = useCallback((key) => imageMap[key] || placeholder, [imageMap]);

  const handleImageError = (e) => {
    e.target.src = placeholder;
    e.target.classList.add('image-error-placeholder'); // Optional: for styling broken images
  };

  return (
    <>
      <SimpleSEO 
        title="Home"
        description="Welcome to AbleHearts Foundation - Empowering individuals with disabilities and fostering inclusivity through various programs and initiatives in Botswana."
        keywords="disability support, inclusivity, Botswana, foundation, empowerment, community, accessibility, able hearts"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AbleHearts Foundation",
          "description": "Empowering individuals with disabilities and fostering inclusivity through various programs and initiatives in Botswana.",
          "url": "https://ableheartsfoundation.org",
          "foundingDate": "2017",
          "areaServed": "Botswana",
          "knowsAbout": ["Disability Support", "Community Empowerment", "Inclusivity"],
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "ableheartsfoundation@gmail.com"
          }
        }}
      />
      <div className="page-wrapper home-page-wrapper">
      <div className="home-container">
        {isValidArray(slides) && (
          <div
            className="carousel-container pre-animate"
            role="region"
            aria-label="Image Carousel"
            aria-roledescription="carousel"
            aria-live="polite"
          >
            {safeMap(slides, (slide, index) => (
              <div
                key={slide.title + index} // More robust key
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${safeLength(slides)}: ${slide.title}`}
                style={{ backgroundImage: `url(${getImageUrl(slide.image)})` }}
              >
                <div className="slide-content">
                  <div className="event-details">
                    <div className="event-details-row">
                      <img
                        src={slide.logo}
                        alt="" // Decorative, as title is present
                        className="event-logo event-logo-slide"
                        loading="lazy"
                        onError={handleImageError}
                        width={100}
                        height={100}
                      />
                      <div className="event-text">
                        <h2>{slide.title}</h2>
                        <p>{slide.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-indicators">
                    {safeMap(slides, (_, idx) => (
                      <button
                        key={idx}
                        className={`indicator ${currentSlide === idx ? 'active' : ''}`}
                        onClick={() => handleIndicatorClick(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        aria-current={currentSlide === idx ? 'true' : 'false'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <button className="prev-button" onClick={handlePrevSlide} aria-label="Previous Slide">
              ‹
            </button>
            <button className="next-button" onClick={handleNextSlide} aria-label="Next Slide">
              ›
            </button>
          </div>
        )}

        <div className="mission-container pre-animate">
          <div className="home-background-blobs" aria-hidden="true">
            <img src={getImageUrl('blob2')} alt="" className="home-blobg blob-1" loading="lazy" width={480} height={556} onError={handleImageError} />
            <img src={getImageUrl('blob3')} alt="" className="home-blobg blob-2" loading="lazy" width={516} height={556} onError={handleImageError} />
            <img src={getImageUrl('blob4')} alt="" className="home-blobg blob-3" loading="lazy" width={516} height={596} onError={handleImageError} />
          </div>
          <h2>Our Mission</h2>
          <p>
            At Able Hearts, our mission is to break barriers, challenge stigma, and
            empower individuals with disabilities to embrace their full potential.
            Guided by our belief that{' '}
            <span className="highlight">
              &quot;We are all equal in the fact that we are all different,&quot;
            </span>{' '}
            we are committed to fostering inclusivity, celebrating diversity, and
            driving meaningful change in communities. Together, we strive to create
            a future where compassion and equality thrive.
          </p>
        </div>

        <div className="newsletter-section-wrapper pre-animate">
          <div className="contour-overlay" aria-hidden="true">
            <img
              src={getImageUrl('scribble')}
              alt=""
              onError={handleImageError}
              loading="lazy"
              className="lazy-image"
            />
          </div>
          <div className="newsletter-content-area">
            <NewsletterSignup />
            <div className="newsletter-image-container">
              <img
                src={getImageUrl('newsletter')}
                alt="Visual representation for newsletter" // More descriptive alt
                onError={handleImageError}
                loading="lazy"
                className="lazy-image newsletter-image-actual"
              />
            </div>
          </div>
        </div>

        <div className="collaborators-container pre-animate">
          <h3>Our Valued Collaborators</h3>
          <div className="logo-bar">
            <div className="logo-slider">
              {safeMap(duplicatedCollaboratorLogos, (logoKey, index) => {
                const logoUrl = collaboratorLinks[logoKey];
                const logoContent = (
                  <img
                    src={getImageUrl(logoKey)}
                    className="collaborator-logo"
                    alt={`${logoKey} logo`}
                    onError={handleImageError}
                    loading="lazy"
                  />
                );

                return (
                  <div className="collaborator-logo-item" key={`${logoKey}-${index}`}>
                    {logoUrl ? (
                      <a
                        href={logoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="collaborator-logo-link"
                        aria-label={`Visit ${logoKey} website`}
                      >
                        {logoContent}
                      </a>
                    ) : (
                      logoContent
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;