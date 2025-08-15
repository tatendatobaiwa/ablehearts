import { useState, useEffect, useMemo } from 'react';
import './ProgramsAndInitiatives.css';

const SCROLL_THRESHOLD_TOP_BTN = 300;

const programData = [
  {
    id: 'garden',
    title: 'Able Hearts Garden',
    description: 'Launched in 2020 at the Lephoi Centre for the Visually Impaired, the "Able Hearts Garden" is a sustainable initiative that provides therapeutic activities, teaches self-sufficiency, and enhances the environment. It is a symbol of growth, confidence, and creativity for the children, encouraging them to nurture both their personal and environmental growth.',
    imageSrc: '/src/assets/fixed/lephoi/garden.webp',
    imageAlt: 'Children and adults in the Able Hearts Garden with plants.',
    imageOrder: 1,
  },
  {
    id: 'talentShow',
    title: 'Dynamic Talent Show',
    description: 'Since 2018, the annual Dynamic Talent Show has empowered children with disabilities to showcase their artistic talents. The event fosters confidence and self-expression, giving these children a platform to shine. Additionally, essential donations such as clothing and food are distributed during the show, addressing critical needs in the community.',
    imageSrc: '/src/assets/fixed/dynamictalent/talentshow.webp',
    imageAlt: 'Children performing on stage at the Dynamic Talent Show.',
    imageOrder: 2,
  },
  {
    id: 'mochudiVisits',
    title: 'Mochudi Resource Center Visits',
    description: 'Our visits to the Mochudi Resource Center in 2020 and 2021 included fun-filled days of games, empowering messages, and donations of essential items. These visits aimed to build lasting relationships and provide continued support to children with disabilities, fostering a sense of belonging and joy.',
    imageSrc: '/src/assets/fixed/mochudi/mochud.webp',
    imageAlt: 'Group photo during a visit to Mochudi Resource Center.',
    imageOrder: 1,
  },
  {
    id: 'tsogangSupport',
    title: 'Tsogang Trust Support',
    description: 'In 2022, the Able Hearts Foundation extended support to children impacted by HIV/AIDS through visits to Tsogang Trust. These efforts included the provision of food, clothing, toys, and school supplies, addressing both immediate material needs and long-term educational challenges.',
    imageSrc: '/src/assets/fixed/tsogangtrust/tsogangtrust.webp',
    imageAlt: 'Donated items and people at Tsogang Trust.',
    imageOrder: 2,
  },
  {
    id: 'covidHampers',
    title: 'COVID-19 Food Hampers',
    description: 'During the COVID-19 pandemic, Able Hearts distributed 40 food hampers to elderly residents of Gerald Estates. Partnering with MP Ignatius Moswaane, this initiative provided essential relief during a challenging and uncertain time, demonstrating a quick and compassionate response to community needs.',
    imageSrc: '/src/assets/fixed/covid/covid.webp',
    imageAlt: 'Food hampers prepared for distribution during COVID-19.',
    imageOrder: 1,
  },
  {
    id: 'lavenderTea',
    title: 'Lavender High Tea',
    description: 'Introduced in 2020, the Lavender High Tea event brought women together to foster empowerment and personal growth. Featuring a panel of accomplished women, the event provided opportunities for networking, mentorship, and inspiration, encouraging participants to pursue their goals with confidence.',
    imageSrc: '/src/assets/fixed/lavender/lavender.webp',
    imageAlt: 'Women gathered at the Lavender High Tea event.',
    imageOrder: 2,
  },
  {
    id: 'schoolDonations',
    title: 'School Donations',
    description: 'From Shakawe JSS in 2021 to Kedia Primary School in 2024, our school donation drives have provided uniforms, shoes, and toiletries to underprivileged students. These efforts aim to remove barriers to education, promote dignity, and empower students to focus on their learning journeys without material concerns.',
    imageSrc: '/src/assets/fixed/kedia/kedia.webp',
    imageAlt: 'Students receiving donations at Kedia Primary School.',
    imageOrder: 1,
  },
  {
    id: 'cheshireFoundation',
    title: 'Cheshire Foundation Partnership',
    description: 'Our collaboration with Cheshire Foundation represents a significant milestone in our mission to support individuals with disabilities. Through our BIUST branch, we have delivered essential resources to the Cheshire Foundation of Botswana, Palapye Regional Office. This partnership demonstrates our commitment to working with established organizations to maximize our impact and reach vulnerable communities. The initiative includes providing medical supplies, daily living aids, and educational materials to enhance the quality of life for residents and beneficiaries of the foundation.',
    imageSrc: '/src/assets/fixed/chesirefoundation/chescover.webp',
    imageAlt: 'Members of Ablehearts BIUST and Cheshire Foundation staff.',
    imageOrder: 2,
  },
  {
    id: 'familyDonations',
    title: 'Family Donations Program',
    description: 'Our Family Donations Program exemplifies our grassroots approach to community support. Through our UB branch, we have traveled to Tlokweng and other communities across Botswana to provide direct assistance to families in need. This program focuses on identifying and supporting families facing economic hardships, providing them with essential resources including food, clothing, household items, and educational materials. By working directly with families, we ensure that our support reaches those who need it most, creating lasting relationships and sustainable impact within local communities.',
    imageSrc: '/src/assets/fixed/tlokwengfamily/tlok2.webp',
    imageAlt: 'Ablehearts UB delivering donations in Tlokweng.',
    imageOrder: 1,
  },
];

const blobImagePaths = [
  '/src/assets/fixed/icons/blob1.webp',
  '/src/assets/fixed/icons/blob3.webp',
  '/src/assets/fixed/icons/blob4.webp',
  '/src/assets/fixed/icons/blob2.webp',
];

const ProgramsAndInitiatives = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'Programs & Initiatives | AbleHearts Foundation';
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > SCROLL_THRESHOLD_TOP_BTN);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll('.programs-page .pre-animate');
    if (elementsToAnimate.length === 0) return;

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

    elementsToAnimate.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const memoizedBlobImages = useMemo(() => blobImagePaths.map((blob, index) => (
    <img
      key={`blob-${index}`}
      src={blob}
      alt=""
      className={`programs-blobg blob-${index + 1}`}
      loading="lazy"
      width="600"
      height="600"
      aria-hidden="true"
    />
  )), []);

  return (
    <div className="page-wrapper programs-page">
      <div className="programs-background-blobs" aria-hidden="true">
        {memoizedBlobImages}
      </div>
      <div className="programs-container">
        <header className="programs-header-card pre-animate">
          <h1 className="programs-main-title">Programs & Initiatives</h1>
          <p className="programs-intro">
            At Able Hearts Foundation, we are dedicated to creating meaningful and lasting change.
            Explore our key programs and initiatives aimed at empowering marginalized communities.
          </p>
        </header>

        <div className="programs-list">
          {programData.map((program) => (
            <section key={program.id} id={program.id} className="program pre-animate">
              <div className={`program-card-container ${program.imageOrder === 2 ? 'text-first' : ''}`}>
                <div className="program-image-wrapper">
                  <img
                    className="program-image"
                    src={program.imageSrc}
                    alt={program.imageAlt}
                    loading="lazy"
                    width="500"
                    height="400"
                  />
                </div>
                <div className="program-text-wrapper">
                  <h2 className="program-title">{program.title}</h2>
                  <p className="program-description">{program.description}</p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {showScrollToTop && (
          <button type="button" className="scroll-to-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
            ↑
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgramsAndInitiatives;