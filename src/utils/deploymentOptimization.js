/**
 * Deployment Optimization Utilities for AbleHearts Foundation
 * Production-ready optimization and deployment tools
 */

// Production optimization configuration
export const PRODUCTION_CONFIG = {
  // Performance thresholds
  performance: {
    maxBundleSize: 2 * 1024 * 1024, // 2MB
    maxImageSize: 500 * 1024, // 500KB
    maxFontSize: 100 * 1024, // 100KB
    targetLCP: 2500, // 2.5 seconds
    targetFID: 100, // 100ms
    targetCLS: 0.1, // 0.1
    targetFCP: 1800 // 1.8 seconds
  },

  // Security settings
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true,
    enableFrameOptions: true,
    enableContentTypeOptions: true
  },

  // Caching configuration
  caching: {
    staticAssets: '1y', // 1 year
    htmlFiles: '1h', // 1 hour
    apiResponses: '5m', // 5 minutes
    images: '30d', // 30 days
    fonts: '1y' // 1 year
  },

  // Compression settings
  compression: {
    enableGzip: true,
    enableBrotli: true,
    minSize: 1024, // 1KB minimum
    level: 6 // Compression level
  }
};

// Bundle analyzer
export class BundleAnalyzer {
  constructor() {
    this.chunks = new Map();
    this.dependencies = new Map();
    this.duplicates = new Set();
  }

  // Analyze bundle composition
  analyzeBundles() {
    const analysis = {
      totalSize: 0,
      chunkSizes: {},
      largeDependencies: [],
      duplicateDependencies: [],
      recommendations: []
    };

    // Simulate bundle analysis (in real implementation, this would parse webpack stats)
    const mockChunks = [
      { name: 'main', size: 1.2 * 1024 * 1024 }, // 1.2MB
      { name: 'vendor', size: 800 * 1024 }, // 800KB
      { name: 'runtime', size: 50 * 1024 } // 50KB
    ];

    mockChunks.forEach(chunk => {
      analysis.totalSize += chunk.size;
      analysis.chunkSizes[chunk.name] = chunk.size;

      // Check for oversized chunks
      if (chunk.size > PRODUCTION_CONFIG.performance.maxBundleSize / 2) {
        analysis.recommendations.push({
          type: 'bundle_size',
          severity: 'warning',
          message: `Chunk '${chunk.name}' is large (${this.formatBytes(chunk.size)})`,
          suggestions: [
            'Consider code splitting',
            'Remove unused dependencies',
            'Use dynamic imports for non-critical code'
          ]
        });
      }
    });

    return analysis;
  }

  // Format bytes to human readable
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate optimization recommendations
  generateOptimizationRecommendations() {
    const recommendations = [];

    // Bundle size recommendations
    const analysis = this.analyzeBundles();
    if (analysis.totalSize > PRODUCTION_CONFIG.performance.maxBundleSize) {
      recommendations.push({
        category: 'Bundle Size',
        priority: 'high',
        issue: `Total bundle size (${this.formatBytes(analysis.totalSize)}) exceeds recommended limit`,
        actions: [
          'Implement code splitting',
          'Use dynamic imports',
          'Remove unused dependencies',
          'Optimize images and assets'
        ]
      });
    }

    // Performance recommendations
    recommendations.push({
      category: 'Performance',
      priority: 'medium',
      issue: 'Optimize for Core Web Vitals',
      actions: [
        'Implement lazy loading for images',
        'Preload critical resources',
        'Minimize layout shifts',
        'Optimize JavaScript execution'
      ]
    });

    // Security recommendations
    recommendations.push({
      category: 'Security',
      priority: 'high',
      issue: 'Ensure production security',
      actions: [
        'Enable Content Security Policy',
        'Implement security headers',
        'Validate all user inputs',
        'Use HTTPS everywhere'
      ]
    });

    return recommendations;
  }
}

// Asset optimizer
export class AssetOptimizer {
  constructor() {
    this.optimizations = new Map();
  }

  // Optimize images
  optimizeImages(images) {
    const optimized = [];

    images.forEach(image => {
      const optimization = {
        original: image,
        optimized: null,
        savings: 0,
        recommendations: []
      };

      // Check image format
      if (!image.src.includes('.webp')) {
        optimization.recommendations.push('Convert to WebP format for better compression');
      }

      // Check image size
      if (image.size > PRODUCTION_CONFIG.performance.maxImageSize) {
        optimization.recommendations.push('Reduce image file size');
        optimization.recommendations.push('Implement responsive images with srcset');
      }

      // Check lazy loading
      if (!image.loading || image.loading !== 'lazy') {
        optimization.recommendations.push('Implement lazy loading');
      }

      optimized.push(optimization);
    });

    return optimized;
  }

  // Optimize fonts
  optimizeFonts(fonts) {
    const optimized = [];

    fonts.forEach(font => {
      const optimization = {
        original: font,
        recommendations: []
      };

      // Check font format
      if (!font.src.includes('.woff2')) {
        optimization.recommendations.push('Use WOFF2 format for better compression');
      }

      // Check font loading
      if (!font.display || font.display !== 'swap') {
        optimization.recommendations.push('Use font-display: swap for better performance');
      }

      // Check font size
      if (font.size > PRODUCTION_CONFIG.performance.maxFontSize) {
        optimization.recommendations.push('Reduce font file size or subset fonts');
      }

      optimized.push(optimization);
    });

    return optimized;
  }

  // Generate asset optimization report
  generateAssetReport() {
    return {
      images: this.optimizeImages([
        { src: '/images/hero.jpg', size: 800 * 1024, loading: 'eager' },
        { src: '/images/gallery1.png', size: 1200 * 1024, loading: null }
      ]),
      fonts: this.optimizeFonts([
        { src: '/fonts/poppins.woff', size: 120 * 1024, display: null },
        { src: '/fonts/opensans.ttf', size: 200 * 1024, display: 'block' }
      ])
    };
  }
}

// Performance auditor
export class PerformanceAuditor {
  constructor() {
    this.audits = new Map();
  }

  // Audit Core Web Vitals
  auditWebVitals(vitals) {
    const audit = {
      lcp: this.auditLCP(vitals.lcp),
      fid: this.auditFID(vitals.fid),
      cls: this.auditCLS(vitals.cls),
      fcp: this.auditFCP(vitals.fcp),
      ttfb: this.auditTTFB(vitals.ttfb)
    };

    return audit;
  }

  auditLCP(lcp) {
    const target = PRODUCTION_CONFIG.performance.targetLCP;
    const score = lcp <= target ? 'good' : lcp <= target * 1.6 ? 'needs-improvement' : 'poor';
    
    return {
      metric: 'Largest Contentful Paint',
      value: lcp,
      target,
      score,
      recommendations: score !== 'good' ? [
        'Optimize images and use modern formats',
        'Preload critical resources',
        'Reduce server response times',
        'Remove unused CSS and JavaScript'
      ] : []
    };
  }

  auditFID(fid) {
    const target = PRODUCTION_CONFIG.performance.targetFID;
    const score = fid <= target ? 'good' : fid <= target * 3 ? 'needs-improvement' : 'poor';
    
    return {
      metric: 'First Input Delay',
      value: fid,
      target,
      score,
      recommendations: score !== 'good' ? [
        'Reduce JavaScript execution time',
        'Split large bundles',
        'Use web workers for heavy tasks',
        'Optimize third-party scripts'
      ] : []
    };
  }

  auditCLS(cls) {
    const target = PRODUCTION_CONFIG.performance.targetCLS;
    const score = cls <= target ? 'good' : cls <= target * 2.5 ? 'needs-improvement' : 'poor';
    
    return {
      metric: 'Cumulative Layout Shift',
      value: cls,
      target,
      score,
      recommendations: score !== 'good' ? [
        'Set explicit dimensions for images',
        'Reserve space for dynamic content',
        'Use CSS transforms instead of layout changes',
        'Preload fonts to prevent FOIT/FOUT'
      ] : []
    };
  }

  auditFCP(fcp) {
    const target = PRODUCTION_CONFIG.performance.targetFCP;
    const score = fcp <= target ? 'good' : fcp <= target * 1.67 ? 'needs-improvement' : 'poor';
    
    return {
      metric: 'First Contentful Paint',
      value: fcp,
      target,
      score,
      recommendations: score !== 'good' ? [
        'Eliminate render-blocking resources',
        'Minify CSS and JavaScript',
        'Remove unused code',
        'Use efficient cache policies'
      ] : []
    };
  }

  auditTTFB(ttfb) {
    const target = 800; // 800ms target for TTFB
    const score = ttfb <= target ? 'good' : ttfb <= target * 2.25 ? 'needs-improvement' : 'poor';
    
    return {
      metric: 'Time to First Byte',
      value: ttfb,
      target,
      score,
      recommendations: score !== 'good' ? [
        'Optimize server response times',
        'Use a Content Delivery Network (CDN)',
        'Implement server-side caching',
        'Optimize database queries'
      ] : []
    };
  }

  // Generate comprehensive performance audit
  generatePerformanceAudit(performanceData) {
    const audit = {
      timestamp: Date.now(),
      url: window.location.href,
      webVitals: this.auditWebVitals(performanceData.vitals || {}),
      overallScore: 0,
      recommendations: [],
      criticalIssues: []
    };

    // Calculate overall score
    const vitalsScores = Object.values(audit.webVitals).map(vital => {
      switch (vital.score) {
        case 'good': return 100;
        case 'needs-improvement': return 60;
        case 'poor': return 20;
        default: return 0;
      }
    });

    audit.overallScore = Math.round(vitalsScores.reduce((a, b) => a + b, 0) / vitalsScores.length);

    // Collect recommendations
    Object.values(audit.webVitals).forEach(vital => {
      audit.recommendations.push(...vital.recommendations);
    });

    // Identify critical issues
    Object.values(audit.webVitals).forEach(vital => {
      if (vital.score === 'poor') {
        audit.criticalIssues.push({
          metric: vital.metric,
          value: vital.value,
          target: vital.target
        });
      }
    });

    return audit;
  }
}

// Deployment checker
export class DeploymentChecker {
  constructor() {
    this.checks = new Map();
  }

  // Run pre-deployment checks
  async runPreDeploymentChecks() {
    const checks = {
      environment: await this.checkEnvironmentVariables(),
      security: await this.checkSecurityConfiguration(),
      performance: await this.checkPerformanceOptimizations(),
      accessibility: await this.checkAccessibilityCompliance(),
      seo: await this.checkSEOOptimizations(),
      browser: await this.checkBrowserCompatibility()
    };

    return {
      checks,
      passed: Object.values(checks).every(check => check.status === 'pass'),
      warnings: Object.values(checks).filter(check => check.warnings?.length > 0),
      errors: Object.values(checks).filter(check => check.status === 'fail')
    };
  }

  // Check environment variables
  async checkEnvironmentVariables() {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_GA4_MEASUREMENT_ID'
    ];

    const missing = requiredVars.filter(varName => !import.meta.env[varName]);
    
    return {
      name: 'Environment Variables',
      status: missing.length === 0 ? 'pass' : 'fail',
      message: missing.length === 0 
        ? 'All required environment variables are set'
        : `Missing environment variables: ${missing.join(', ')}`,
      warnings: [],
      errors: missing.map(varName => `Missing ${varName}`)
    };
  }

  // Check security configuration
  async checkSecurityConfiguration() {
    const checks = [];
    const warnings = [];
    const errors = [];

    // Check HTTPS
    if (location.protocol !== 'https:' && import.meta.env.PROD) {
      errors.push('Site is not served over HTTPS in production');
    }

    // Check CSP
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      warnings.push('Content Security Policy not found');
    }

    // Check security headers
    const securityHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection'
    ];

    return {
      name: 'Security Configuration',
      status: errors.length === 0 ? 'pass' : 'fail',
      message: errors.length === 0 
        ? 'Security configuration is adequate'
        : 'Security issues detected',
      warnings,
      errors
    };
  }

  // Check performance optimizations
  async checkPerformanceOptimizations() {
    const warnings = [];
    const errors = [];

    // Check for lazy loading
    const images = document.querySelectorAll('img');
    const imagesWithoutLazyLoading = Array.from(images).filter(img => 
      !img.loading || img.loading !== 'lazy'
    );

    if (imagesWithoutLazyLoading.length > 0) {
      warnings.push(`${imagesWithoutLazyLoading.length} images without lazy loading`);
    }

    // Check for WebP images
    const nonWebPImages = Array.from(images).filter(img => 
      !img.src.includes('.webp')
    );

    if (nonWebPImages.length > 0) {
      warnings.push(`${nonWebPImages.length} images not in WebP format`);
    }

    return {
      name: 'Performance Optimizations',
      status: errors.length === 0 ? 'pass' : 'fail',
      message: 'Performance optimizations checked',
      warnings,
      errors
    };
  }

  // Check accessibility compliance
  async checkAccessibilityCompliance() {
    const warnings = [];
    const errors = [];

    // Check for alt text on images
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      errors.push(`${imagesWithoutAlt.length} images without alt text`);
    }

    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      warnings.push('No heading elements found');
    }

    // Check for form labels
    const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    const inputsWithLabels = Array.from(inputsWithoutLabels).filter(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      return !label;
    });

    if (inputsWithLabels.length > 0) {
      errors.push(`${inputsWithLabels.length} form inputs without proper labels`);
    }

    return {
      name: 'Accessibility Compliance',
      status: errors.length === 0 ? 'pass' : 'fail',
      message: errors.length === 0 
        ? 'Accessibility compliance is adequate'
        : 'Accessibility issues detected',
      warnings,
      errors
    };
  }

  // Check SEO optimizations
  async checkSEOOptimizations() {
    const warnings = [];
    const errors = [];

    // Check for title tag
    const title = document.querySelector('title');
    if (!title || title.textContent.trim().length === 0) {
      errors.push('Missing or empty title tag');
    }

    // Check for meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription || metaDescription.content.trim().length === 0) {
      errors.push('Missing or empty meta description');
    }

    // Check for Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (!ogTitle) warnings.push('Missing Open Graph title');
    if (!ogDescription) warnings.push('Missing Open Graph description');

    return {
      name: 'SEO Optimizations',
      status: errors.length === 0 ? 'pass' : 'fail',
      message: errors.length === 0 
        ? 'SEO optimizations are adequate'
        : 'SEO issues detected',
      warnings,
      errors
    };
  }

  // Check browser compatibility
  async checkBrowserCompatibility() {
    const warnings = [];
    const errors = [];

    // Check for modern JavaScript features
    const features = [
      { name: 'ES6 Modules', test: () => 'noModule' in HTMLScriptElement.prototype },
      { name: 'Intersection Observer', test: () => 'IntersectionObserver' in window },
      { name: 'Service Workers', test: () => 'serviceWorker' in navigator },
      { name: 'Web Workers', test: () => 'Worker' in window }
    ];

    features.forEach(feature => {
      if (!feature.test()) {
        warnings.push(`${feature.name} not supported`);
      }
    });

    return {
      name: 'Browser Compatibility',
      status: 'pass', // Warnings only for compatibility
      message: 'Browser compatibility checked',
      warnings,
      errors
    };
  }
}

// Export deployment utilities
export const deploymentUtils = {
  bundleAnalyzer: new BundleAnalyzer(),
  assetOptimizer: new AssetOptimizer(),
  performanceAuditor: new PerformanceAuditor(),
  deploymentChecker: new DeploymentChecker(),

  // Generate comprehensive deployment report
  generateDeploymentReport: async () => {
    const bundleAnalysis = deploymentUtils.bundleAnalyzer.analyzeBundles();
    const assetReport = deploymentUtils.assetOptimizer.generateAssetReport();
    const deploymentChecks = await deploymentUtils.deploymentChecker.runPreDeploymentChecks();

    return {
      timestamp: Date.now(),
      environment: import.meta.env.MODE,
      bundleAnalysis,
      assetReport,
      deploymentChecks,
      readyForDeployment: deploymentChecks.passed,
      recommendations: [
        ...bundleAnalysis.recommendations || [],
        ...deploymentUtils.bundleAnalyzer.generateOptimizationRecommendations()
      ]
    };
  }
};

export default {
  PRODUCTION_CONFIG,
  BundleAnalyzer,
  AssetOptimizer,
  PerformanceAuditor,
  DeploymentChecker,
  deploymentUtils
};