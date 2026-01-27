import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: Record<string, any>;
}

const defaultSEO = {
  title: 'aqro for Students | Custom Project Development - Full Stack, ML, AI & Automation',
  description: 'Professional project development for students. Expert solutions in Full Stack Web Development, Mobile Apps, Machine Learning, NLP, Deep Learning, and Automation. Get custom-built projects for your academic needs with complete viva support.',
  keywords: 'student projects, full stack development, machine learning projects, NLP projects, deep learning, automation projects, academic projects, final year projects, capstone projects, viva preparation',
  image: 'https://aqro.vercel.app/og-image.png',
  url: 'https://aqro.vercel.app',
  type: 'website'
};

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  schema
}: SEOProps) {
  const location = useLocation();
  
  useEffect(() => {
    // Update document title
    const pageTitle = title || defaultSEO.title;
    document.title = pageTitle;
    
    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    // Standard meta tags
    updateMeta('description', description || defaultSEO.description);
    updateMeta('keywords', keywords || defaultSEO.keywords);
    
    // Open Graph tags
    const pageUrl = url || `${defaultSEO.url}${location.pathname}`;
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', description || defaultSEO.description, true);
    updateMeta('og:image', image || defaultSEO.image, true);
    updateMeta('og:url', pageUrl, true);
    updateMeta('og:type', type, true);
    
    // Twitter Card tags
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', description || defaultSEO.description);
    updateMeta('twitter:image', image || defaultSEO.image);
    updateMeta('twitter:card', 'summary_large_image');
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);
    
    // Add structured data if provided
    if (schema) {
      const scriptId = 'dynamic-schema';
      let schemaScript = document.getElementById(scriptId) as HTMLScriptElement;
      
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = scriptId;
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      
      schemaScript.textContent = JSON.stringify(schema);
    }
  }, [title, description, keywords, image, url, type, schema, location.pathname]);
  
  return null;
}

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'aqro for Students | Custom Project Development - Full Stack, ML, AI & Automation',
    description: 'Professional project development for students. Expert solutions in Full Stack Web Development, Mobile Apps, Machine Learning, NLP, Deep Learning, and Automation. Get custom-built projects for your academic needs with complete viva support.',
    keywords: 'student projects, full stack development, web development projects, mobile app development, machine learning projects, NLP projects, deep learning, automation projects, academic projects, final year projects, aqro students',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'aqro',
      description: 'Professional project development service for students',
      url: 'https://aqro.vercel.app/'
    }
  },
  
  services: {
    title: 'Our Services | Project Development for Students - aqro',
    description: 'Expert project development services for students. Full Stack Web Development, Mobile Apps, Machine Learning, NLP, Deep Learning, and Automation. Custom-built academic projects tailored to your requirements.',
    keywords: 'project development services, full stack development, mobile app projects, ML projects, NLP development, deep learning services, automation projects, student project help, custom projects',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Software Development Services',
      provider: {
        '@type': 'ProfessionalService',
        name: 'aqro'
      },
      areaServed: 'Worldwide',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock'
      }
    }
  },
  
  process: {
    title: 'Our Process | How We Build Your Projects - aqro',
    description: 'Discover our proven project development process. From requirements gathering to final delivery and viva preparation. Professional development workflow ensuring quality academic projects.',
    keywords: 'project development process, software development workflow, project methodology, development stages, academic project workflow, viva preparation',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Project Development Process',
      description: 'Our step-by-step process for developing custom student projects'
    }
  },
  
  pricing: {
    title: 'Pricing & Plans | Affordable Project Development - aqro',
    description: 'Flexible and transparent pricing for student projects. Choose from our range of project packages - Full Stack, ML, Deep Learning, Automation. Custom quotes for complex requirements.',
    keywords: 'project development pricing, student project costs, development pricing, affordable projects, project packages, full stack pricing, ML project costs, custom development rates',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'aqro Project Development Services',
      description: 'Custom project development services for students'
    }
  },
  
  contact: {
    title: 'Contact Us | Get Your Project Started - aqro',
    description: 'Ready to start your project? Get in touch with our development team. We\'re here to help build your Full Stack, ML, AI, or Automation project. Free consultation and project quotes.',
    keywords: 'contact aqro, project inquiry, development consultation, get project quote, student project help, development support, project consultation',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact aqro',
      description: 'Get in touch with aqro for project development services'
    }
  },
  
  showcase: {
    title: 'Project Showcase | Completed Student Projects - aqro',
    description: 'Explore our portfolio of completed student projects. Full Stack web apps, ML models, NLP systems, Deep Learning solutions, and Automation tools. See real projects delivered for students.',
    keywords: 'project portfolio, completed projects, student project examples, full stack projects, ML project showcase, deep learning examples, automation projects, project gallery',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Project Showcase',
      description: 'Portfolio of completed student projects'
    }
  },
  
  startProject: {
    title: 'Start Your Project | Get Custom Development - aqro',
    description: 'Ready to start your academic project? Get custom development for Full Stack, ML, AI, or Automation projects. Professional development with viva support. Request a quote today.',
    keywords: 'start project, request development, begin project, project inquiry, custom development, get project quote, academic project development',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Start Your Project',
      description: 'Begin your custom project development'
    }
  }
};

// Hook for easy SEO implementation in pages
export function usePageSEO(page: keyof typeof pageSEO) {
  return pageSEO[page];
}
