/**
 * Deployment Readiness Checks for AbleHearts Foundation
 * Comprehensive pre-deployment validation and optimization
 */

// Environment validation
export const environmentChecks = {
  // Validate all required environment variables
  validateEnvironmentVariables: () => {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
      'VITE_GA4_MEASUREMENT_ID'
    ];

    const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
    const results = {
      passed: missingVars.length === 0,
      missingVariables: missingVars,
      message: missingVars.length === 0 
        ? 'All required environment variables are present'
        : `Missing required environment variables: ${missingVars.join(', ')}`
    };

    return results;
  },

  // Validate production environment settings
  validateProductionSettings: () => {
    const checks = [];

    // Check if in production mode
    if (!import.meta.env.PROD) {
      checks.push({
        check: 'Production Mode',
        passed: false,
        message: 'Application is not in production mode'
      });
    } else {
      checks.push({
        check: 'Production Mode',
        passed: true,
        message: 'Application is in production mode'
      });
    }

    // Check analytics configuration
    const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    checks.push({
      check: 'Analytics Configuration',
      passed: analyticsEnabled,
      message: analyticsEnabled ? 'Analytics is enabled' : 'Analytics is disabled'
    });

    // Check security headers
    const securityEnabled = import.meta.env.VITE_ENABLE_SECURITY_HEADERS === 'true';
    checks.push({
      check: 'Security Headers',
      passed: securityEnabled,
      message: securityEnabled ? 'Security headers enabled' : 'Security headers disabled'
    });

    return {
      passed: checks.every(check => check.passed),
      checks
    };
  }
};

// Security validation
export const securityChecks = {
  // Check for exposed secrets in build
  checkForExposedSecrets: () => {
    const checks = [];
    
    // Check if any sensitive data is exposed in window object
    const exposedKeys = Object.keys(window).filter(key => 
      key.toLowerCase().includes('secret') || 
      key.toLowerCase().includes('key') ||
      key.toLowerCase().includes('token')
    );

    checks.push({
      check: 'Exposed Secrets',
      passed: exposedKeys.length === 0,
      message: exposedKeys.length === 0 
        ? 'No exposed secrets detected'
        : `Potential exposed secrets: ${exposedKeys.join(', ')}`
    });

    // Check CSP headers
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    checks.push({
      check: 'Content Security Policy',
      passed: !!cspMeta,
      message: cspMeta ? 'CSP header is present' : 'CSP header is missing'
    });

    // Check for HTTPS
    checks.push({
      check: 'HTTPS Protocol',
      passed: window.location.protocol === 'https:',
      message: window.location.protocol === 'https:' 
        ? 'Site is served over HTTPS'
        : 'Site is not served over HTTPS'
    });

    return {
      passed: checks.every(check => check.passed),
      checks
    };
  },

  // Validate security headers
  validateSecurityHeaders: async () => {
    const checks = [];
    
    try {
      const response = await fetch(window.location.href, { method: 'HEAD' });
      const headers = response.headers;

      // Check for security headers
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
        'referrer-policy'
      ];

      securityHeaders.forEach(header => {
        const present = headers.has(header);
        checks.push({
          check: `${header} header`,
          passed: present,
          message: present ? `${header} header is present` : `${header} header is missing`
        });
      });

    } catch (error) {
      checks.push({
        check: 'Security Headers Check',
        passed: false,
        message: 'Failed to check security headers'
      });
    }

    return {
      passed: checks.every(check => check.passed),
      checks
    };
  }
};

// Performance validation
export const performanceChecks = {
  // Check bundle size and performance
  checkBundlePerformance: () => {
    const checks = [];
    
    // Check for large resources
    const resources = performance.getEntriesByType('resource');
    const largeResources = resources.filter(resource => 
      resource.transferSize > 1024 * 1024 // > 1MB
    );

    checks.push({
      check: 'Large Resources',
      passed: largeResources.length === 0,
      message: largeResources.length === 0 
        ? 'No large resources detected'
        : `${largeResources.length} resources larger than 1MB detected`
    });

    // Check for unused CSS/JS (approximation)
    const stylesheets = resources.filter(r => r.name.includes('.css'));
    const scripts = resources.filter(r => r.name.includes('.js'));

    checks.push({
      check: 'Resource Count',
      passed: stylesheets.length < 10 && scripts.length < 20,
      message: `${stylesheets.length} CSS files, ${scripts.length} JS files`
    });

    // Check for image optimization
    const images = resources.filter(r => 
      r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    );
    const unoptimizedImages = images.filter(img => 
      !img.name.includes('.webp') && img.transferSize > 500 * 1024 // > 500KB
    );

    checks.push({
      check: 'Image Optimization',
      passed: unoptimizedImages.length === 0,
      message: unoptimizedImages.length === 0 
        ? 'All images appear optimized'
        : `${unoptimizedImages.length} large non-WebP images detected`
    });

    return {
      passed: checks.every(check => check.passed),
      checks
    };
  },

  // Check Core Web Vitals
  checkWebVitals: () => {
    return new Promise((resolve) => {
      const checks = [];
      let vitalsCollected = 0;
      const totalVitals = 3; // LCP, FID, CLS

      const resolveIfComplete = () => {
        vitalsCollected++;
        if (vitalsCollected >= totalVitals) {
          resolve({
            passed: checks.every(check => check.passed),
            checks
          });
        }
      };

      // LCP Check
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        
        checks.push({
          check: 'Largest Contentful Paint',
          passed: lcp <= 2500,
          message: `LCP: ${lcp.toFixed(0)}ms (${lcp <= 2500 ? 'Good' : lcp <= 4000 ? 'Needs Improvement' : 'Poor'})`
        });
        
        resolveIfComplete();
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID Check
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstInput = entries[0];
        const fid = firstInput.processingStart - firstInput.startTime;
        
        checks.push({
          check: 'First Input Delay',
          passed: fid <= 100,
          message: `FID: ${fid.toFixed(0)}ms (${fid <= 100 ? 'Good' : fid <= 300 ? 'Needs Improvement' : 'Poor'})`
        });
        
        resolveIfComplete();
      }).observe({ entryTypes: ['first-input'] });

      // CLS Check
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        
        checks.push({
          check: 'Cumulative Layout Shift',
          passed: clsValue <= 0.1,
          message: `CLS: ${clsValue.toFixed(3)} (${clsValue <= 0.1 ? 'Good' : clsValue <= 0.25 ? 'Needs Improvement' : 'Poor'})`
        });
        
        resolveIfComplete();
      }).observe({ entryTypes: ['layout-shift'] });

      // Timeout fallback
      setTimeout(() => {
        if (vitalsCollected < totalVitals) {
          checks.push({
            check: 'Web Vitals Collection',
            passed: false,
            message: 'Timeout waiting for Web Vitals data'
          });
          resolve({
            passed: false,
            checks
          });
        }
      }, 10000);
    });
  }
};

// Accessibility validation
export const accessibilityChecks = {
  // Check basic accessibility requirements
  checkAccessibilityFeatures: () => {
    const checks = [];

    // Check for alt text on images
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => 
      !img.alt && !img.getAttribute('aria-label')
    );

    checks.push({
      check: 'Image Alt Text',
      passed: imagesWithoutAlt.length === 0,
      message: imagesWithoutAlt.length === 0 
        ? 'All images have alt text'
        : `${imagesWithoutAlt.length} images missing alt text`
    });

    // Check for proper heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const hasH1 = document.querySelector('h1') !== null;

    checks.push({
      check: 'Heading Structure',
      passed: hasH1 && headings.length > 0,
      message: hasH1 ? `${headings.length} headings found with proper H1` : 'Missing H1 or no headings found'
    });

    // Check for form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    const inputsWithoutLabels = Array.from(inputs).filter(input => {
      const id = input.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      return !label && !ariaLabel;
    });

    checks.push({
      check: 'Form Labels',
      passed: inputsWithoutLabels.length === 0,
      message: inputsWithoutLabels.length === 0 
        ? 'All form inputs have labels'
        : `${inputsWithoutLabels.length} form inputs missing labels`
    });

    // Check for focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    checks.push({
      check: 'Focusable Elements',
      passed: focusableElements.length > 0,
      message: `${focusableElements.length} focusable elements found`
    });

    return {
      passed: checks.every(check => check.passed),
      checks
    };
  },

  // Check color contrast (basic check)
  checkColorContrast: () => {
    const checks = [];
    
    // This is a simplified check - in production, you'd use a proper contrast checking library
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
    let lowContrastElements = 0;

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simple check for very light text on light backgrounds
      if (color.includes('rgb(255') && backgroundColor.includes('rgb(255')) {
        lowContrastElements++;
      }
    });

    checks.push({
      check: 'Color Contrast',
      passed: lowContrastElements === 0,
      message: lowContrastElements === 0 
        ? 'No obvious contrast issues detected'
        : `${lowContrastElements} potential contrast issues detected`
    });

    return {
      passed: checks.every(check => check.passed),
      checks
    };
  }
};

// SEO validation
export const seoChecks = {
  // Check basic SEO requirements
  checkSEOBasics: () => {
    const checks = [];

    // Check for title tag
    const title = document.querySelector('title');
    checks.push({
      check: 'Page Title',
      passed: !!title && title.textContent.length > 0,
      message: title ? `Title: "${title.textContent}"` : 'Missing page title'
    });

    // Check for meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    checks.push({
      check: 'Meta Description',
      passed: !!metaDescription && metaDescription.content.length > 0,
      message: metaDescription ? `Description length: ${metaDescription.content.length} chars` : 'Missing meta description'
    });

    // Check for viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    checks.push({
      check: 'Viewport Meta Tag',
      passed: !!viewport,
      message: viewport ? 'Viewport meta tag present' : 'Missing viewport meta tag'
    });

    // Check for canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    checks.push({
      check: 'Canonical URL',
      passed: !!canonical,
      message: canonical ? `Canonical: ${canonical.href}` : 'Missing canonical URL'
    });

    // Check for Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    checks.push({
      check: 'Open Graph Tags',
      passed: !!(ogTitle && ogDescription && ogImage),
      message: `OG tags present: ${[ogTitle, ogDescription, ogImage].filter(Boolean).length}/3`
    });

    return {
      passed: checks.every(check => check.passed),
      checks
    };
  },

  // Check structured data
  checkStructuredData: () => {
    const checks = [];

    // Check for JSON-LD structured data
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    checks.push({
      check: 'Structured Data',
      passed: jsonLdScripts.length > 0,
      message: `${jsonLdScripts.length} JSON-LD scripts found`
    });

    // Validate JSON-LD syntax
    let validJsonLd = 0;
    jsonLdScripts.forEach(script => {
      try {
        JSON.parse(script.textContent);
        validJsonLd++;
      } catch (e) {
        // Invalid JSON-LD
      }
    });

    checks.push({
      check: 'JSON-LD Validity',
      passed: validJsonLd === jsonLdScripts.length,
      message: `${validJsonLd}/${jsonLdScripts.length} valid JSON-LD scripts`
    });

    return {
      passed: checks.every(check => check.passed),
      checks
    };
  }
};

// Comprehensive deployment readiness check
export const runDeploymentChecks = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    overall: { passed: true, score: 0, totalChecks: 0 },
    categories: {}
  };

  try {
    // Environment checks
    results.categories.environment = environmentChecks.validateEnvironmentVariables();
    results.categories.production = environmentChecks.validateProductionSettings();

    // Security checks
    results.categories.security = securityChecks.checkForExposedSecrets();
    results.categories.securityHeaders = await securityChecks.validateSecurityHeaders();

    // Performance checks
    results.categories.performance = performanceChecks.checkBundlePerformance();
    results.categories.webVitals = await performanceChecks.checkWebVitals();

    // Accessibility checks
    results.categories.accessibility = accessibilityChecks.checkAccessibilityFeatures();
    results.categories.colorContrast = accessibilityChecks.checkColorContrast();

    // SEO checks
    results.categories.seo = seoChecks.checkSEOBasics();
    results.categories.structuredData = seoChecks.checkStructuredData();

    // Calculate overall score
    const categories = Object.values(results.categories);
    const passedCategories = categories.filter(cat => cat.passed).length;
    results.overall.totalChecks = categories.length;
    results.overall.score = Math.round((passedCategories / categories.length) * 100);
    results.overall.passed = results.overall.score >= 80; // 80% threshold

  } catch (error) {
    results.error = error.message;
    results.overall.passed = false;
  }

  return results;
};

export default {
  environmentChecks,
  securityChecks,
  performanceChecks,
  accessibilityChecks,
  seoChecks,
  runDeploymentChecks
};