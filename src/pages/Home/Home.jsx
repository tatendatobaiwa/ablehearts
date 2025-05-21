import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import NewsletterSignup from '/src/components/NewsLetterSignup.jsx';  

const landingPageImage = new URL('/src/assets/fixed/landingpageimage.webp', import.meta.url).href;
const whiteLogo = new URL('/src/assets/fixed/icons/whiteablehearts.webp', import.meta.url).href;

const Home = () => {
const [currentSlide, setCurrentSlide] = useState(0);
const [isTransitioning, setIsTransitioning] = useState(false);
const navigate = useNavigate();
const [loadedImages, setLoadedImages] = useState({});
  
const imageLoaders = {
      landingPageImage: () => import('/src/assets/fixed/landingpageimage.webp').then(m => m.default),
      lephoi: () => import('/src/assets/fixed/lephoi/carousel1lephoi.webp').then(m => m.default),
      kedia: () => import('/src/assets/fixed/kedia/carousel2kedia.webp').then(m => m.default),
      tsogang: () => import('/src/assets/fixed/tsogangtrust/carousel3tsogang.webp').then(m => m.default),
      mochudi: () => import('/src/assets/fixed/mochudi/carousel4mochudi.webp').then(m => m.default),
      blob2: () => import('/src/assets/fixed/icons/blob2.webp').then(m => m.default),
      blob3: () => import('/src/assets/fixed/icons/blob3.webp').then(m => m.default),
      blob4: () => import('/src/assets/fixed/icons/blob4.webp').then(m => m.default),
      newsletter: () => import('/src/assets/fixed/newspaper/newsletterimage.webp').then(m => m.default),
      scribble: () => import('/src/assets/fixed/icons/scribblebackground.webp').then(m => m.default),
      india: () => import('/src/assets/fixed/icons/india.webp').then(m => m.default),
      minjex: () => import('/src/assets/fixed/icons/minjex.webp').then(m => m.default),
      nortex: () => import('/src/assets/fixed/icons/nortex.webp').then(m => m.default),
      trans: () => import('/src/assets/fixed/icons/trans.webp').then(m => m.default),
      tropicana: () => import('/src/assets/fixed/icons/tropicana.webp').then(m => m.default),
      sennfoods: () => import('/src/assets/fixed/icons/sennfoods.webp').then(m => m.default),
      francistownelectronics: () => import('/src/assets/fixed/icons/francistownelectronics.webp').then(m => m.default),
      valentines: () => import('/src/assets/fixed/icons/valentinessports.webp').then(m => m.default),
      bush: () => import('/src/assets/fixed/icons/busht.webp').then(m => m.default),
      strub: () => import('/src/assets/fixed/icons/strub.webp').then(m => m.default),
      bms: () => import('/src/assets/fixed/icons/bms.webp').then(m => m.default),
    };

    const slides = [
      {
        image: 'landingPageImage',
        logo: whiteLogo,
        title: 'Dynamic Talent Show',
        date: 'August 20, 2023',
      },
      {
        image: 'lephoi',
        logo: whiteLogo,
        title: 'Lephoi Centre for the Visually Impaired',
        date: 'August 15, 2020',
      },
      {
        image: 'kedia',
        logo: whiteLogo,
        title: 'Kedia Primary School',
        date: 'July 6, 2024',
      },
      {
        image: 'tsogang',
        logo: whiteLogo,
        title: 'Tsogang Trust',
        date: 'October 27, 2022',
      },
      {
        image: 'mochudi',
        logo: whiteLogo,
        title: 'Mochudi Resource Center',
        date: 'April 22, 2021',
      },
    ];

    const loadImage = async (key) => {
      if (!loadedImages[key] && imageLoaders[key]) {
        try {
          const imageUrl = await imageLoaders[key]();
          setLoadedImages(prev => ({ ...prev, [key]: imageUrl }));
        } catch (error) {
          console.error(`Error loading image: ${key}`, error);
        }
      }
    };

    useEffect(() => {
      // Initial load of first few images
      const initialImages = ['landingPageImage','lephoi', 'kedia', 'blob2', 'blob3', 'blob4'];
      initialImages.forEach(loadImage);
  
      // Setup carousel interval
      const slideInterval = setInterval(() => {
        handleNextSlide();
      }, 5000);
  
      return () => clearInterval(slideInterval);
    }, []);
  
    useEffect(() => {
      // Preload next slide image
      const nextSlideIndex = (currentSlide + 1) % slides.length;
      const nextSlideImage = slides[nextSlideIndex].image;
      if (typeof nextSlideImage === 'string') {
        loadImage(nextSlideImage);
      }
    }, [currentSlide]);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('fade-in');
              
              // Load images for visible sections
              const section = entry.target;
              if (section.classList.contains('newsletter-container')) {
                loadImage('newsletter');
                loadImage('scribble');
              } else if (section.classList.contains('collaborators-container')) {
                ['india', 'minjex', 'nortex', 'trans', 'tropicana', 'sennfoods', 
                 'francistownelectronics', 'valentines', 'bush', 'strub', 'bms']
                  .forEach(loadImage);
              }
              
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
  
      document.querySelectorAll('.pre-animate').forEach(element => observer.observe(element));
      return () => observer.disconnect();
    }, []);
  
    const handleNextSlide = () => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsTransitioning(false), 800);
    };
  
    const handlePrevSlide = () => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 800);
    };
  
    const handleIndicatorClick = (index) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 800);
    };
  
    const getImageUrl = (key) => {
      if (typeof key === 'string') {
        return loadedImages[key] || '';
      }
      return key;
    };  
  
    return (
      <div className="home-container">
      <div className="carousel-container pre-animate">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${getImageUrl(slide.image)})` }}
          >
            <div className="slide-content">
              <div className="event-details">
                <div className="event-details-row">
                  <img 
                    src={slide.logo} 
                    alt="Event Logo" 
                    className="event-logo"
                    loading="lazy" 
 width={200}
 height="auto"
                  />
                  <div className="event-text">
                    <h2>{slide.title}</h2>
                    <p>{slide.date}</p>
                  </div>
                </div>
              </div>
              <div className="carousel-indicators">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`indicator ${currentSlide === idx ? 'active' : ''}`}
                    onClick={() => handleIndicatorClick(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
        <button className="prev-button" onClick={handlePrevSlide} aria-label="Previous Slide">
          &#8249;
        </button>
        <button className="next-button" onClick={handleNextSlide} aria-label="Next Slide">
          &#8250;
        </button>
      </div>
      <div className="mission-container pre-animate">
        {['blob2', 'blob3', 'blob4'].map((blob) => (
          <div
            key={blob}
            className={`blob ${blob}`}
            style={{
              backgroundImage: `url(${getImageUrl(blob)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <h2>Our Mission</h2>
        <p>
          At Able Hearts, our mission is to break barriers, challenge stigma, and
          empower individuals with disabilities to embrace their full potential.
          Guided by our belief that{' '}
          <span className="highlight">
            "We are all equal in the fact that we are all different,"
          </span>{' '}
          we are committed to fostering inclusivity, celebrating diversity, and
          driving meaningful change in communities. Together, we strive to create
          a future where compassion and equality thrive.
        </p>
      </div>
      <div className="newsletter-container pre-animate">
        <div className="contour-overlay">
          <img 
            src={getImageUrl('scribble')} 
            alt="Scribblebackground"
            loading="lazy"
          />
        </div>
        <NewsletterSignup />
        <div className="newsletter-image">
          <img 
            src={getImageUrl('newsletter')} 
            alt="Newsletter"
 width="100%"
 height="auto"
            loading="lazy"
          />
        </div>
      </div>
      <div className="collaborators-container pre-animate">
        <h3>Our Valued Collaborators</h3>
        <div className="logo-bar">
          <div className="logo-slider">
            {Array(5) // Repeat the entire set 5 times
              .fill([
                'india', 'minjex', 'nortex', 'trans', 'tropicana', 'sennfoods',
                'francistownelectronics', 'valentines', 'bush', 'strub', 'bms',
              ])
              .flat()
              .map((logo, index) => (
                <img
                  key={`${logo}-${index}`}
                  src={getImageUrl(logo)}
                  alt={`Collaborator ${index + 1}`}
 height={100}
 width="auto"
                  loading="lazy"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
