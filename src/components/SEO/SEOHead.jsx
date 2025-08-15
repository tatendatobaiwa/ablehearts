import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = 'AbleHearts Foundation',
  description = 'Able Hearts Foundation is dedicated to empowering individuals with disabilities and fostering inclusivity through various programs and initiatives in Botswana.',
  keywords = 'disability support, inclusivity, Botswana, foundation, empowerment, community, accessibility',
  image = '/src/assets/fixed/icons/ableheartslogo.webp',
  url = 'https://ableheartsfoundation.org',
  type = 'website',
  author = 'AbleHearts Foundation',
  siteName = 'AbleHearts Foundation',
  locale = 'en_US',
  twitterHandle = '@ablehearts',
  structuredData = null,
  canonical = null,
  noindex = false,
  nofollow = false
}) => {
  const fullTitle = title === 'AbleHearts Foundation' ? title : `${title} | AbleHearts Foundation`;
  const fullUrl = canonical || `${url}${window.location.pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${url}${image}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AbleHearts Foundation",
    "description": description,
    "url": url,
    "logo": imageUrl,
    "foundingDate": "2017",
    "foundingLocation": {
      "@type": "Place",
      "name": "Botswana"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Botswana"
    },
    "knowsAbout": [
      "Disability Support",
      "Community Empowerment",
      "Inclusivity",
      "Accessibility",
      "Social Impact"
    ],
    "sameAs": [
      "https://facebook.com/ableheartsfoundation",
      "https://instagram.com/ableheartsfoundation"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "ableheartsfoundation@gmail.com",
      "contactType": "General Inquiries"
    }
  };

  const robotsContent = `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#005BB5" />
      <meta name="msapplication-TileColor" content="#005BB5" />
      <meta name="application-name" content="AbleHearts Foundation" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

SEOHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.string,
  siteName: PropTypes.string,
  locale: PropTypes.string,
  twitterHandle: PropTypes.string,
  structuredData: PropTypes.object,
  canonical: PropTypes.string,
  noindex: PropTypes.bool,
  nofollow: PropTypes.bool,
};

export default SEOHead;