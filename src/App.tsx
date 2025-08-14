import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import Vision from './components/Vision';
import Features from './components/Features';
import GlobalScale from './components/GlobalScale';
import Traction from './components/Traction';
import Milestones from './components/Milestones';
import Team from './components/Team';
import Investment from './components/Investment';
import SelectInvestors from './components/SelectInvestors';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        {/* Primary Meta Tags */}
        <title>DayOne Media Group - Invest in TRADEFOOX European Super App</title>
        <meta name="title" content="DayOne Media Group - Invest in TRADEFOOX European Super App" />
        <meta name="description" content="Invest in TRADEFOOX, the European answer to super apps. Combining e-commerce, social media & communication in one privacy-first platform. European alternative to TikTok, Amazon, and Meta." />
        <meta name="keywords" content="TRADEFOOX, European super app, e-commerce, social media, communication, investment, startup, Europe, privacy, GDPR, marketplace, social networking, DayOne Media Group" />
        <meta name="author" content="DayOne Media Group" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dayone-mediagroup.com/" />
        <meta property="og:title" content="DayOne Media Group - Invest in TRADEFOOX European Super App" />
        <meta property="og:description" content="Invest in TRADEFOOX, the European answer to super apps. Combining e-commerce, social media & communication in one privacy-first platform." />
        <meta property="og:image" content="https://dayone-mediagroup.com/images/logo/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="DayOne Media Group" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://dayone-mediagroup.com/" />
        <meta property="twitter:title" content="DayOne Media Group - Invest in TRADEFOOX European Super App" />
        <meta property="twitter:description" content="Invest in TRADEFOOX, the European answer to super apps. Combining e-commerce, social media & communication in one privacy-first platform." />
        <meta property="twitter:image" content="https://dayone-mediagroup.com/images/logo/logo.png" />
        <meta property="twitter:site" content="@tradefoox" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DayOne Media Group" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://dayone-mediagroup.com/" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://tradefoox.com" />
        <link rel="preconnect" href="https://linkedin.com" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DayOne Media Group",
            "url": "https://dayone-mediagroup.com",
            "logo": "https://dayone-mediagroup.com/images/logo/logo.png",
            "description": "Invest in TRADEFOOX, the European answer to super apps. Combining e-commerce, social media & communication in one privacy-first platform.",
            "foundingDate": "2024",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "DE",
              "addressRegion": "Saxony"
            },
            "sameAs": [
              "https://tradefoox.com",
              "https://linkedin.com/company/tradefoox"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "invest@tradefoox.com"
            }
          })}
        </script>
      </Helmet>
      
      <Header />
      <Hero />
      <Vision />
      <Features />
      <GlobalScale />
      <Traction />
      <Milestones />
      <Team />
      <Investment />
      <SelectInvestors />
      <Contact />
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default App; 