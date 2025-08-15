import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Simple SEO component that doesn't require react-helmet-async
 * Uses vanilla JavaScript to update document head
 */
const SimpleSEO = ({
  title = 'AbleHearts Foundation',
  description = 'Able Hearts Foundation is dedicated to empowering individuals with disabilities and fostering inclusivity through various programs and initiatives in Botswana.',
  keywords = 'disability support, inclusivity, Botswana, foundation, empowerment, community, accessibility',
  image = '/src/assets/fixed/icons/ableheartslogo.webp',
  url = 'https://ableheartsfoundation.org',
  type = 'website',
  structuredData = null
}) => {
  useEffect(() => {
    const fullTitle = title === 'AbleHearts Foundation' ? title : `${title} | AbleHearts Foundation`;
    
    // Update document title
    document.title = fullTitle;
    
    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'AbleHearts Foundation');
    
    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image.startsWith('http') ? image : `${url}${image}`, true);
    updateMetaTag('og:url', `${url}${window.location.pathname}`, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'AbleHearts Foundation', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image.startsWith('http') ? image : `${url}${image}`);
    
    // Theme color
    updateMetaTag('theme-color', '#005BB5');
    
    // Structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      // Don't reset meta tags as they should persist for the current page
    };
  }, [title, description, keywords, image, url, type, structuredData]);

  return null; // This component doesn't render anything
};

SimpleSEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  structuredData: PropTypes.object,
};

export default SimpleSEO;