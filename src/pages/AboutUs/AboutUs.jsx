import { useEffect, useState } from 'react';
import './AboutUs.css';
import ubLogo from '/src/assets/fixed/icons/ub.webp';
import biustLogo from '/src/assets/fixed/icons/biust.webp';
import AnimatedNumber from '../../components/AnimatedNumber';


import blob1 from '../../assets/fixed/icons/blob1.webp';
import blob2 from '../../assets/fixed/icons/blob2.webp';
import blob3 from '../../assets/fixed/icons/blob3.webp';
import blob4 from '../../assets/fixed/icons/blob4.webp';



const blobImages = [
  blob1,
  blob3,
  blob4,
  blob2,
];

const ubPresident = {
  name: 'Banoziba Gombalume',
  role: 'President',
  image: '/src/assets/fixed/bano.jpg',
  linkedin: 'https://www.linkedin.com/in/banoziba-gombalume-b86018199/', // Placeholder link
};

const biustPresident = {
  name: 'Kgosi Moagi-Angaman',
  role: 'President',
  image: '/src/assets/fixed/kgosi.jpg',
};

const AboutUs = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'About Us | AbleHearts Foundation';
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.pre-animate');
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
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="about-container">
      {/* Background blobs */}
      <div className="about-background-blobs">
        {blobImages.map((blob, index) => (
          <img
            key={index}
            src={blob}
            alt={`Decorative blob ${index + 1}`}
            className={`about-blobg blob-${index + 1}`}
            loading="lazy"
            width="800" // Placeholder for actual width
            height="auto" // Placeholder for actual height
          />
        ))}
      </div>
      <header className="about-header pre-animate">
        <h1 className="about-main-title">About Able Hearts Foundation</h1>
        <p className="about-subtitle">
          Dedicated to creating a world where every individual has the opportunity to thrive.
        </p>
      </header>
      
      <section className="about-section pre-animate">
        <div className="vision-mission-grid">
          <div className="vision-card">
            <h2 className="section-title">Our Vision</h2>
            <p className="section-description">
              To build a world where every individual, regardless of their abilities or circumstances, has the opportunity to thrive and reach their full potential.
            </p>
          </div>
          <div className="mission-card">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-description">
              To bridge gaps in society by providing support, resources, and opportunities to underserved communities, fostering a more equitable world.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section founder-section pre-animate">
        <h2 className="section-title">Meet Our Founder</h2>
        <div className="founder-card">
          <div className="founder-image-wrapper">
            <img
              src="/src/assets/fixed/thefounderphoto.webp" 
              alt="Sakshi Bhargava, Founder of Able Hearts Foundation"
              className="founder-image"
            />
          </div>
          <div className="founder-details">
            <h3 className="founder-name">Sakshi Bhargava</h3>
            <p className="founder-bio">
            Sakshi Bhargava is a passionate philanthropist and advocate for equity, diversity, and inclusion. She holds an Honours BA in Political Science from the University of Western Ontario and was a delegate to the UN&apos;s 69th Commission on the Status of Women (CSW69). Through Able Hearts, she works to create opportunities for children and youth in underserved communities, grounded in the belief that lasting change begins with compassion, dignity, and access for all.            </p>
            <div className="founder-achievements">
              <h4 className="achievements-title">Key Roles & Achievements</h4>
              <ul>
                <li>Founder of Able Hearts Foundation</li>
                <li>Miss Global Botswana 2021</li>
                <li>Junior Miss Botswana 2nd Princess '16</li>
                <li>Brand Ambassador for multiple local brands</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section impact-section pre-animate">
        <h2 className="section-title">Our Impact</h2>
        <div className="impact-grid">
          <AnimatedNumber
            endValue={1000}
            suffix="+"
            label="Lives Touched"
            duration={2.5}
            className="primary"
          />
          <AnimatedNumber
            endValue={9}
            suffix=""
            label="Initiated Programs"
            duration={2.0}
            className="success"
          />
          <AnimatedNumber
            endValue={8}
            suffix="+"
            label="Years of Service"
            duration={1.8}
            className="warning"
          />
        </div>
      </section>

      <section className="about-section values-section pre-animate">
        <h2 className="section-title">Our Core Values</h2>
        <div className="values-grid">
          {[
            { title: 'Empowerment', description: 'Enabling individuals to become self-sufficient and confident.' },
            { title: 'Inclusivity', description: 'Celebrating diversity and creating spaces where everyone belongs.' },
            { title: 'Innovation', description: 'Seeking creative solutions to community challenges.' },
            { title: 'Sustainability', description: 'Developing programs that create lasting positive change.' }
          ].map((value) => (
            <div className="value-card" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="about-section team-section pre-animate">
        <h2 className="section-title">Meet Our Branch Presidents</h2>
        <div className="team-branch">
          <img src={ubLogo} alt="UB Logo" className="branch-logo" width="60" height="60"/>
          <h3 className="branch-title">University of Botswana Branch</h3>
          <div className="team-grid">
            <div className="team-member-card" key={ubPresident.name}>
              <a href={ubPresident.linkedin} target="_blank" rel="noopener noreferrer">
                <img src={ubPresident.image} alt={ubPresident.name} className="team-member-image" width="150" height="150"/>
              </a>
              <h4 className="team-member-name">{ubPresident.name}</h4>
              <p className="team-member-role">{ubPresident.role}</p>
            </div>
          </div>
        </div>
        <div className="team-branch">
          <img src={biustLogo} alt="BIUST Logo" className="branch-logo" width="60" height="60"/>
          <h3 className="branch-title">BIUST Branch</h3>
          <div className="team-grid">
            <div className="team-member-card" key={biustPresident.name}>
              <a href={biustPresident.linkedin} target="_blank" rel="noopener noreferrer">
                <img src={biustPresident.image} alt={biustPresident.name} className="team-member-image" width="150" height="150"/>
              </a>
              <h4 className="team-member-name">{biustPresident.name}</h4>
              <p className="team-member-role">{biustPresident.role}</p>
            </div>
          </div>
        </div>
      </section>

      {isScrolled && (
        <button className="scroll-to-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default AboutUs;